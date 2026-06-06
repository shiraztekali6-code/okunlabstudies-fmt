const TARGET_SPREADSHEET_ID = "1x8IQ0RzC-Hrl2gvBB5zKyc6JXZkOdaqcFmCMdujatHc";
const TARGET_SHEET_NAME = "Registrations";
const EXPECTED_EXECUTION_ACCOUNT = "shiraztekali6@gmail.com";
const TEAM_NOTIFICATION_EMAIL = "okun.lab@gmail.com";

// Set this in Apps Script Project Settings -> Script Properties.
// Do not commit or publish the shared secret in source control.
const SHARED_SECRET_PROPERTY_NAME = "REGISTRATION_SHARED_SECRET";

const REQUIRED_COLUMNS = [
  "Timestamp",
  "Full Name",
  "Email",
  "Phone Number",
  "City",
  "Age Range",
  "Child Age Range",
  "Preferred Contact Method",
  "Additional Comments"
];

const TEAM_NOTIFICATION_SUBJECT = "New Study Registration";
const PARTICIPANT_CONFIRMATION_SUBJECT =
  "Thank You for Your Interest in Our Research Study";
const DUPLICATE_WINDOW_MINUTES = 10;

function doPost(e) {
  const requestId = "REQ-" + Utilities.getUuid().slice(0, 8);
  Logger.log("[%s] Registration request started.", requestId);

  try {
    const executionAccount = getExecutionAccount_();
    Logger.log("[%s] Effective execution account: %s", requestId, executionAccount);
    assertExpectedExecutionAccount_(executionAccount);

    const payload = parseRequestPayload_(e);
    const expectedSecret = getSharedSecret_();

    if (payload.secret !== expectedSecret) {
      Logger.log("[%s] Unauthorized request: shared secret mismatch.", requestId);
      return createJsonResponse_({
        ok: false,
        code: "unauthorized",
        error: "Unauthorized request."
      });
    }

    const submission = normalizeSubmission_(payload.submission || {});
    const validationError = validateSubmission_(submission);
    if (validationError) {
      Logger.log("[%s] Validation error: %s", requestId, validationError);
      return createJsonResponse_({
        ok: false,
        code: "validation_error",
        error: validationError
      });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(15000);

    const referenceId = buildReferenceId_(new Date());
    let writeResult;

    try {
      writeResult = writeSubmissionToSheet_(submission, requestId);
    } catch (error) {
      const writeError = safeErrorMessage_(error);
      Logger.log("[%s] Sheet write failed: %s", requestId, writeError);
      return createJsonResponse_({
        ok: false,
        code: "sheet_write_failed",
        error: writeError
      });
    } finally {
      lock.releaseLock();
    }

    if (!writeResult.duplicate) {
      try {
        sendTeamNotificationEmail_(submission, referenceId);
        sendParticipantConfirmationEmail_(submission, referenceId);
      } catch (error) {
        const emailError = safeErrorMessage_(error);
        Logger.log("[%s] Email send failed: %s", requestId, emailError);
        return createJsonResponse_({
          ok: false,
          code: "email_failed",
          error: emailError
        });
      }
    } else {
      Logger.log("[%s] Duplicate submission detected; row not appended.", requestId);
    }

    Logger.log("[%s] Registration completed successfully.", requestId);
    return createJsonResponse_({
      ok: true,
      duplicate: writeResult.duplicate,
      referenceId: referenceId
    });
  } catch (error) {
    const err = safeErrorMessage_(error);
    Logger.log("[%s] Internal error: %s", requestId, err);
    return createJsonResponse_({
      ok: false,
      code: "internal_error",
      error: err
    });
  }
}

function getExecutionAccount_() {
  try {
    return Session.getEffectiveUser().getEmail() || "(unavailable)";
  } catch (error) {
    Logger.log("Could not read effective user: %s", safeErrorMessage_(error));
    return "(unavailable)";
  }
}

function assertExpectedExecutionAccount_(executionAccount) {
  if (!EXPECTED_EXECUTION_ACCOUNT) {
    return;
  }

  if (executionAccount === "(unavailable)") {
    throw new Error(
      "Could not verify execution account. Ensure web app is deployed as 'Execute as me'."
    );
  }

  if (
    executionAccount.toLowerCase() !== EXPECTED_EXECUTION_ACCOUNT.toLowerCase()
  ) {
    throw new Error(
      "Execution account mismatch. Expected " +
        EXPECTED_EXECUTION_ACCOUNT +
        " but got " +
        executionAccount +
        "."
    );
  }
}

function getSharedSecret_() {
  const fromProperty = PropertiesService.getScriptProperties().getProperty(
    SHARED_SECRET_PROPERTY_NAME
  );
  if (!fromProperty) {
    throw new Error(
      "Missing Apps Script property " +
        SHARED_SECRET_PROPERTY_NAME +
        ". Add it in Project Settings before deploying the web app."
    );
  }

  return fromProperty;
}

function parseRequestPayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Missing request payload.");
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    throw new Error("Invalid JSON payload: " + safeErrorMessage_(error));
  }
}

function normalizeSubmission_(raw) {
  return {
    fullName: toCleanString_(raw.fullName, 120),
    email: toCleanString_(raw.email, 120).toLowerCase(),
    phone: toCleanString_(raw.phone, 40),
    city: toCleanString_(raw.city, 100),
    ageRange: toCleanString_(raw.ageRange, 20),
    childAgeRange: toCleanString_(raw.childAgeRange, 20),
    preferredContact: toCleanString_(raw.preferredContact, 20),
    comments: toCleanString_(raw.comments, 2000)
  };
}

function validateSubmission_(submission) {
  if (!submission.fullName) {
    return "Full name is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) {
    return "A valid email address is required.";
  }

  const phoneDigits = (submission.phone.match(/\d/g) || []).length;
  if (phoneDigits < 7) {
    return "A valid phone number is required.";
  }

  if (!submission.city) {
    return "City is required.";
  }

  if (
    ["18-24", "25-34", "35-44", "45-54", "55+"].indexOf(submission.ageRange) === -1
  ) {
    return "Age range is invalid.";
  }

  if (
    ["0-4", "5-9", "10-14", "15-18", "19+"].indexOf(submission.childAgeRange) === -1
  ) {
    return "Child age range is invalid.";
  }

  if (["Email", "Phone", "Either"].indexOf(submission.preferredContact) === -1) {
    return "Preferred contact method is invalid.";
  }

  return "";
}

function writeSubmissionToSheet_(submission, requestId) {
  Logger.log(
    "[%s] SpreadsheetApp.openById('%s') - start",
    requestId,
    TARGET_SPREADSHEET_ID
  );

  let spreadsheet;
  try {
    spreadsheet = SpreadsheetApp.openById(TARGET_SPREADSHEET_ID);
  } catch (error) {
    throw new Error(
      "SpreadsheetApp.openById failed for ID " +
        TARGET_SPREADSHEET_ID +
        ": " +
        safeErrorMessage_(error)
    );
  }

  Logger.log(
    "[%s] SpreadsheetApp.openById success. Spreadsheet name: %s",
    requestId,
    spreadsheet.getName()
  );
  Logger.log("[%s] Spreadsheet opened ID: %s", requestId, spreadsheet.getId());
  Logger.log("[%s] Spreadsheet opened URL: %s", requestId, spreadsheet.getUrl());

  if (spreadsheet.getId() !== TARGET_SPREADSHEET_ID) {
    throw new Error(
      "Spreadsheet ID mismatch after openById. Expected " +
        TARGET_SPREADSHEET_ID +
        " but got " +
        spreadsheet.getId() +
        "."
    );
  }

  Logger.log("[%s] getSheetByName('%s') - start", requestId, TARGET_SHEET_NAME);
  const sheet = spreadsheet.getSheetByName(TARGET_SHEET_NAME);
  if (!sheet) {
    throw new Error(
      "getSheetByName failed: tab '" + TARGET_SHEET_NAME + "' was not found."
    );
  }

  Logger.log("[%s] getSheetByName success. Sheet name: %s", requestId, sheet.getName());

  const headerMap = ensureHeaders_(sheet);
  const duplicate = isRecentDuplicate_(
    sheet,
    headerMap,
    submission,
    DUPLICATE_WINDOW_MINUTES
  );

  if (duplicate) {
    return { duplicate: true };
  }

  Logger.log("[%s] appendRow - start", requestId);
  try {
    appendSubmissionRow_(sheet, headerMap, submission);
  } catch (error) {
    throw new Error("appendRow failed: " + safeErrorMessage_(error));
  }
  Logger.log("[%s] appendRow - success", requestId);

  return { duplicate: false };
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, REQUIRED_COLUMNS.length).setValues([REQUIRED_COLUMNS]);
    return buildHeaderMap_(REQUIRED_COLUMNS);
  }

  const existingHeaderRow = sheet
    .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), REQUIRED_COLUMNS.length))
    .getValues()[0]
    .map(function (cell) {
      return toCleanString_(String(cell || ""), 120);
    });

  const mergedHeaders = existingHeaderRow.slice();
  REQUIRED_COLUMNS.forEach(function (requiredHeader) {
    if (mergedHeaders.indexOf(requiredHeader) === -1) {
      mergedHeaders.push(requiredHeader);
    }
  });

  if (mergedHeaders.length !== existingHeaderRow.length) {
    sheet.getRange(1, 1, 1, mergedHeaders.length).setValues([mergedHeaders]);
  }

  return buildHeaderMap_(mergedHeaders);
}

function buildHeaderMap_(headers) {
  const map = {};
  headers.forEach(function (header, index) {
    if (header) {
      map[header] = index + 1;
    }
  });
  return map;
}

function appendSubmissionRow_(sheet, headerMap, submission) {
  const beforeLastRow = sheet.getLastRow();
  Logger.log("[sheet-write] lastRow before appendRow: %s", beforeLastRow);

  const rowValues = new Array(sheet.getLastColumn()).fill("");
  const now = new Date();
  const timestampValue = Utilities.formatDate(
    now,
    Session.getScriptTimeZone(),
    "yyyy-MM-dd HH:mm:ss"
  );

  rowValues[headerMap["Timestamp"] - 1] = timestampValue;
  rowValues[headerMap["Full Name"] - 1] = submission.fullName;
  rowValues[headerMap["Email"] - 1] = submission.email;
  rowValues[headerMap["Phone Number"] - 1] = submission.phone;
  rowValues[headerMap["City"] - 1] = submission.city;
  rowValues[headerMap["Age Range"] - 1] = submission.ageRange;
  rowValues[headerMap["Child Age Range"] - 1] = submission.childAgeRange;
  rowValues[headerMap["Preferred Contact Method"] - 1] = submission.preferredContact;
  rowValues[headerMap["Additional Comments"] - 1] = submission.comments;

  sheet.appendRow(rowValues);
  SpreadsheetApp.flush();

  const afterLastRow = sheet.getLastRow();
  Logger.log("[sheet-write] lastRow after appendRow: %s", afterLastRow);

  if (afterLastRow <= beforeLastRow) {
    throw new Error(
      "appendRow did not increase row count. before=" +
        beforeLastRow +
        ", after=" +
        afterLastRow +
        "."
    );
  }
}

function isRecentDuplicate_(sheet, headerMap, submission, duplicateWindowMinutes) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return false;
  }

  const firstDataRow = Math.max(2, lastRow - 49);
  const rowCount = lastRow - firstDataRow + 1;
  const allRows = sheet.getRange(firstDataRow, 1, rowCount, sheet.getLastColumn()).getValues();
  const cutoffMs = duplicateWindowMinutes * 60 * 1000;

  for (let index = allRows.length - 1; index >= 0; index -= 1) {
    const row = allRows[index];
    const rowSubmission = {
      fullName: toCleanString_(row[headerMap["Full Name"] - 1], 120),
      email: toCleanString_(row[headerMap["Email"] - 1], 120).toLowerCase(),
      phone: toCleanString_(row[headerMap["Phone Number"] - 1], 40),
      city: toCleanString_(row[headerMap["City"] - 1], 100),
      ageRange: toCleanString_(row[headerMap["Age Range"] - 1], 20),
      childAgeRange: toCleanString_(row[headerMap["Child Age Range"] - 1], 20),
      preferredContact: toCleanString_(row[headerMap["Preferred Contact Method"] - 1], 20),
      comments: toCleanString_(row[headerMap["Additional Comments"] - 1], 2000)
    };

    if (!isSameSubmission_(submission, rowSubmission)) {
      continue;
    }

    const timestampCell = row[headerMap["Timestamp"] - 1];
    const timestampMs = toMillis_(timestampCell);
    if (!timestampMs) {
      return true;
    }

    if (Date.now() - timestampMs <= cutoffMs) {
      return true;
    }
  }

  return false;
}

function isSameSubmission_(left, right) {
  return (
    left.fullName === right.fullName &&
    left.email === right.email &&
    left.phone === right.phone &&
    left.city === right.city &&
    left.ageRange === right.ageRange &&
    left.childAgeRange === right.childAgeRange &&
    left.preferredContact === right.preferredContact &&
    left.comments === right.comments
  );
}

function toMillis_(value) {
  if (!value) {
    return 0;
  }

  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value)) {
    return value.getTime();
  }

  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) {
    return 0;
  }

  return parsed.getTime();
}

function buildReferenceId_(dateValue) {
  const timestampChunk = Utilities.formatDate(dateValue, "UTC", "yyyyMMddHHmmss");
  const randomChunk = Math.floor(Math.random() * 9000 + 1000);
  return "FMR-" + timestampChunk + "-" + randomChunk;
}

function sendTeamNotificationEmail_(submission, referenceId) {
  const emailBody = [
    "A new participant has registered for the study.",
    "",
    "Reference ID: " + referenceId,
    "Timestamp: " +
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
    "",
    "Full Name: " + submission.fullName,
    "Email: " + submission.email,
    "Phone Number: " + submission.phone,
    "City: " + submission.city,
    "Age Range: " + submission.ageRange,
    "Child Age Range: " + submission.childAgeRange,
    "Preferred Contact Method: " + submission.preferredContact,
    "Additional Comments: " + (submission.comments || "(none)")
  ].join("\n");

  GmailApp.sendEmail(TEAM_NOTIFICATION_EMAIL, TEAM_NOTIFICATION_SUBJECT, emailBody, {
    name: "Fetomaternal Research Study Registration"
  });
}

function sendParticipantConfirmationEmail_(submission, referenceId) {
  const emailBody = [
    "Dear " + submission.fullName + ",",
    "",
    "Thank you for your interest in our research study.",
    "We have received your registration form successfully.",
    "",
    "Reference ID: " + referenceId,
    "",
    "Please note:",
    "- Registration does not guarantee eligibility.",
    "- A member of the research team may contact you for additional information and screening.",
    "- Participation is entirely voluntary.",
    "- Please do not send sensitive medical information by email.",
    "",
    "We appreciate your willingness to support research.",
    "",
    "Sincerely,",
    "The Research Team"
  ].join("\n");

  GmailApp.sendEmail(
    submission.email,
    PARTICIPANT_CONFIRMATION_SUBJECT,
    emailBody,
    {
      name: "Fetomaternal Research Study Team",
      replyTo: TEAM_NOTIFICATION_EMAIL
    }
  );
}

function toCleanString_(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function safeErrorMessage_(error) {
  if (!error) {
    return "Unknown error.";
  }

  if (typeof error.message === "string") {
    return error.message;
  }

  return String(error);
}

function createJsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

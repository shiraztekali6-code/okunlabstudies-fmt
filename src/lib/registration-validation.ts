import {
  AGE_RANGES,
  CHILD_AGE_RANGES,
  CONTACT_METHODS,
  type RegistrationPayload
} from "@/lib/registration";
import { DEFAULT_LANGUAGE, type Language, translations } from "@/lib/i18n";

type ValidationSuccess = {
  ok: true;
  data: RegistrationPayload;
};

type ValidationFailure = {
  ok: false;
  error: string;
};

type ValidationResult = ValidationSuccess | ValidationFailure;

function cleanString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hasMinPhoneDigits(phone: string): boolean {
  const digitCount = (phone.match(/\d/g) || []).length;
  return digitCount >= 7;
}

function ensureOption<T extends readonly string[]>(
  value: string,
  allowedValues: T,
  errorMessage: string
): string | null {
  if (allowedValues.includes(value)) {
    return null;
  }
  return errorMessage;
}

export function validateRegistrationPayload(
  raw: unknown,
  language: Language = DEFAULT_LANGUAGE
): ValidationResult {
  const messages = translations[language].validation;

  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: messages.invalidPayload };
  }

  const candidate = raw as Record<string, unknown>;

  const data: RegistrationPayload = {
    fullName: cleanString(candidate.fullName, 120),
    email: cleanString(candidate.email, 120).toLowerCase(),
    phone: cleanString(candidate.phone, 40),
    city: cleanString(candidate.city, 100),
    ageRange: cleanString(candidate.ageRange, 20),
    childAgeRange: cleanString(candidate.childAgeRange, 20),
    preferredContact: cleanString(
      candidate.preferredContact,
      20
    ) as RegistrationPayload["preferredContact"],
    comments: cleanString(candidate.comments, 2000),
    consentToContact: candidate.consentToContact === true
  };

  if (!data.fullName) {
    return { ok: false, error: messages.fullName };
  }

  if (!isValidEmail(data.email)) {
    return { ok: false, error: messages.email };
  }

  if (!hasMinPhoneDigits(data.phone)) {
    return { ok: false, error: messages.phone };
  }

  if (!data.city) {
    return { ok: false, error: messages.city };
  }

  const ageRangeError = ensureOption(data.ageRange, AGE_RANGES, messages.ageRange);
  if (ageRangeError) {
    return { ok: false, error: ageRangeError };
  }

  const childAgeRangeError = ensureOption(
    data.childAgeRange,
    CHILD_AGE_RANGES,
    messages.childAgeRange
  );
  if (childAgeRangeError) {
    return { ok: false, error: childAgeRangeError };
  }

  const contactMethodError = ensureOption(
    data.preferredContact,
    CONTACT_METHODS,
    messages.preferredContact
  );
  if (contactMethodError) {
    return { ok: false, error: contactMethodError };
  }

  if (!data.consentToContact) {
    return {
      ok: false,
      error: messages.consent
    };
  }

  return {
    ok: true,
    data
  };
}

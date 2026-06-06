import { NextResponse } from "next/server";
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  translations,
  type Language
} from "@/lib/i18n";
import { validateRegistrationPayload } from "@/lib/registration-validation";

export const runtime = "nodejs";

type AppsScriptResponse = {
  ok?: boolean;
  code?: string;
  error?: string;
  referenceId?: string;
  duplicate?: boolean;
};

function getRequestLanguage(rawBody: unknown): Language {
  if (typeof rawBody !== "object" || rawBody === null) {
    return DEFAULT_LANGUAGE;
  }

  const candidate = rawBody as Record<string, unknown>;
  return isLanguage(candidate.language) ? candidate.language : DEFAULT_LANGUAGE;
}

function mapUpstreamError(
  language: Language,
  code?: string,
  detail?: string
): string {
  const messages = translations[language].api.errors;
  const baseMessage =
    code && code in messages
      ? messages[code as keyof typeof messages]
      : messages.default;
  const detailSuffix = detail
    ? language === "he"
      ? ` פרטים: ${detail}`
      : ` Details: ${detail}`
    : "";

  return `${baseMessage}${detailSuffix}`;
}

function normalizeErrorDetail(detail: string): string {
  return detail.replace(/\s+/g, " ").trim().slice(0, 500);
}

export async function POST(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: translations[DEFAULT_LANGUAGE].api.invalidBody },
      { status: 400 }
    );
  }

  const language = getRequestLanguage(rawBody);
  const validationResult = validateRegistrationPayload(rawBody, language);
  if (!validationResult.ok) {
    return NextResponse.json({ error: validationResult.error }, { status: 400 });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SHARED_SECRET;

  if (!scriptUrl || !sharedSecret) {
    console.error("[register-api] Missing required environment variables.", {
      hasScriptUrl: Boolean(scriptUrl),
      hasSharedSecret: Boolean(sharedSecret)
    });

    return NextResponse.json(
      {
        error: translations[language].api.missingConfig
      },
      { status: 500 }
    );
  }

  const upstreamPayload = {
    secret: sharedSecret,
    submission: validationResult.data,
    metadata: {
      clientSubmissionId: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      source: "fetomaternal-donation-site",
      language
    }
  };

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(upstreamPayload),
      cache: "no-store"
    });
  } catch {
    console.error("[register-api] Failed to reach Apps Script endpoint.", {
      scriptUrl
    });

    return NextResponse.json(
      {
        error: translations[language].api.unreachable
      },
      { status: 503 }
    );
  }

  const upstreamStatus = upstreamResponse.status;
  const upstreamText = await upstreamResponse.text();

  let upstreamData: AppsScriptResponse = {};
  try {
    upstreamData = JSON.parse(upstreamText) as AppsScriptResponse;
  } catch {
    upstreamData = {};
  }

  if (!upstreamData.ok) {
    const detail =
      typeof upstreamData.error === "string" && upstreamData.error
        ? upstreamData.error
        : upstreamText
          ? normalizeErrorDetail(upstreamText)
          : undefined;

    console.error("[register-api] Apps Script returned non-ok response.", {
      status: upstreamStatus,
      payload: upstreamData,
      text: detail
    });

    const statusCode = upstreamData.code === "validation_error" ? 400 : 502;
    return NextResponse.json(
      { error: mapUpstreamError(language, upstreamData.code, detail) },
      { status: statusCode }
    );
  }

  return NextResponse.json(
    {
      referenceId: upstreamData.referenceId ?? `FMR-${Date.now()}`,
      duplicate: Boolean(upstreamData.duplicate),
      message: translations[language].api.defaultSuccess
    },
    { status: 200 }
  );
}

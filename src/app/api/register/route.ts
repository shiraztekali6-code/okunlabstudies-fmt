import { NextResponse } from "next/server";
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  translations,
  type Language
} from "@/lib/i18n";
import { validateRegistrationPayload } from "@/lib/registration-validation";

export const runtime = "nodejs";

const DEFAULT_APPS_SCRIPT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbzGGALIttQlo4fRnLOdeF-iFLWLAy9gyAd47F4NmiKMffP6QQPyoo3l1J20vryL3motdQ/exec";

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

function getAppsScriptUrl(): string {
  return (
    process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL?.trim() ||
    DEFAULT_APPS_SCRIPT_WEB_APP_URL
  );
}

function isHtmlResponse(text: string): boolean {
  return /^<!doctype html>|^<html[\s>]/i.test(text.trim());
}

function getUpstreamErrorCode(
  status: number,
  data: AppsScriptResponse,
  text: string
): string | undefined {
  if (data.code) {
    return data.code;
  }

  if ((status === 401 || status === 403) && isHtmlResponse(text)) {
    return "apps_script_access_denied";
  }

  return undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("check") !== "1") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const configuredScriptUrl = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL?.trim();
  const scriptUrl = getAppsScriptUrl();
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SHARED_SECRET;

  return NextResponse.json(
    {
      ok: Boolean(scriptUrl && sharedSecret),
      requiredVariables: {
        GOOGLE_APPS_SCRIPT_WEB_APP_URL: Boolean(configuredScriptUrl),
        GOOGLE_APPS_SCRIPT_SHARED_SECRET: Boolean(sharedSecret)
      },
      usingFallbackAppsScriptUrl: !configuredScriptUrl,
      scriptUrlLooksLikeAppsScript: Boolean(
        scriptUrl?.startsWith("https://script.google.com/macros/s/")
      ),
      sharedSecretLength: sharedSecret?.length ?? 0,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
      commit:
        process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
        process.env.NEXT_PUBLIC_BUILD_COMMIT ??
        "local"
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    }
  );
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

  const configuredScriptUrl = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL?.trim();
  const scriptUrl = getAppsScriptUrl();
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SHARED_SECRET;

  if (!scriptUrl || !sharedSecret) {
    console.error("[register-api] Missing required environment variables.", {
      hasScriptUrl: Boolean(configuredScriptUrl),
      usingFallbackAppsScriptUrl: !configuredScriptUrl,
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
    const upstreamCode = getUpstreamErrorCode(
      upstreamStatus,
      upstreamData,
      upstreamText
    );
    const rawDetail =
      typeof upstreamData.error === "string" && upstreamData.error
        ? upstreamData.error
        : upstreamText
          ? normalizeErrorDetail(upstreamText)
          : undefined;
    const participantDetail = isHtmlResponse(upstreamText) ? undefined : rawDetail;

    console.error("[register-api] Apps Script returned non-ok response.", {
      status: upstreamStatus,
      payload: upstreamData,
      code: upstreamCode,
      text: rawDetail
    });

    const statusCode = upstreamCode === "validation_error" ? 400 : 502;
    return NextResponse.json(
      { error: mapUpstreamError(language, upstreamCode, participantDetail) },
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

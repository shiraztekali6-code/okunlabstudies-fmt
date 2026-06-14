import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SHARED_SECRET;

  return NextResponse.json(
    {
      ok: Boolean(scriptUrl && sharedSecret),
      requiredVariables: {
        GOOGLE_APPS_SCRIPT_WEB_APP_URL: Boolean(scriptUrl),
        GOOGLE_APPS_SCRIPT_SHARED_SECRET: Boolean(sharedSecret)
      },
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

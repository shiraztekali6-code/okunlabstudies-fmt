# Production Registration Workflow Setup

This setup connects the website form to Google Sheets and sends both:
- Team notification email to `okun.lab@gmail.com`
- Confirmation email to the participant

## 1. Website Architecture

Flow:
1. User submits form on the site.
2. Next.js API route `POST /api/register` validates data server-side.
3. API route forwards data to Google Apps Script Web App.
4. Apps Script writes to Google Sheet and sends both emails.
5. API returns success response shown in the form UI.

## 2. Google Sheet Requirements

Sheet URL:
`https://docs.google.com/spreadsheets/d/1OworEWK_gNCiCkdgPisr6xeq00xYZESE4Y0h1XgTjD8/edit?gid=0#gid=0`

Expected columns:
- `Timestamp`
- `Full Name`
- `Email`
- `Phone Number`
- `City`
- `Age Range`
- `Child Age Range`
- `Preferred Contact Method`
- `Additional Comments`

If these columns do not exist:
1. Open the target sheet tab.
2. Put these exact headers in row 1.
3. Save.

Note: the Apps Script in this repo also auto-creates missing required headers in row 1 when possible.

## 3. Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/).
2. Create a new project.
3. Replace `Code.gs` with:
   - `/integrations/google-apps-script/Code.gs`
4. Open Project Settings and enable "Show appsscript.json manifest file in editor".
5. Replace `appsscript.json` with:
   - `/integrations/google-apps-script/appsscript.json`

## 4. Configure Script Properties

In Apps Script:
1. Open `Project Settings` -> `Script Properties` -> `Add script property`.
2. Add:

- `TARGET_SPREADSHEET_ID` = `1OworEWK_gNCiCkdgPisr6xeq00xYZESE4Y0h1XgTjD8`
- `TARGET_SHEET_NAME` = `Registrations` (or your chosen tab name)
- `TEAM_NOTIFICATION_EMAIL` = `okun.lab@gmail.com`
- `REGISTRATION_SHARED_SECRET` = a long random secret string (32+ chars)

## 5. Deploy Apps Script Web App

1. Click `Deploy` -> `New deployment`.
2. Select type `Web app`.
3. Description: `Registration endpoint`.
4. Execute as: `Me`.
5. Who has access: `Anyone`.
6. Deploy and copy the Web App URL (ends with `/exec`).

Important:
- Each time you change script code, create a new deployment version or update deployment.
- Use the latest `/exec` URL in your website env vars.

## 6. Configure Next.js Environment Variables

In your website project, create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Set:
- `GOOGLE_APPS_SCRIPT_WEB_APP_URL` = your deployed Apps Script `/exec` URL
- `GOOGLE_APPS_SCRIPT_SHARED_SECRET` = same value as `REGISTRATION_SHARED_SECRET`

Restart your Next.js server after env changes.

## 7. Gmail Sending Permissions

On first Apps Script run, Google will require authorization:
1. In Apps Script editor, run `doPost` manually with temporary test wrapper if needed, or submit once from the website.
2. Approve permissions for:
   - Google Sheets access
   - Gmail send access
   - Script properties access

If Google shows "unverified app" warnings in personal accounts, proceed via `Advanced` only if this is your trusted project.

## 8. Local Testing Checklist

1. Run website:
   ```bash
   npm run dev
   ```
2. Submit form with a test participant email you can access.
3. Verify:
   - New row appears in Google Sheet.
   - `okun.lab@gmail.com` receives "New Study Registration".
   - Participant receives "Thank You for Your Interest in Our Research Study".
   - UI success message confirms confirmation email and follow-up contact possibility.
4. Double-click test:
   - Rapid duplicate submit should be prevented client-side.
   - Server-side duplicate check in Apps Script avoids duplicate row/email within short window.

## 9. Production Deployment Checklist

1. Set the same environment variables in your hosting provider (Vercel/Netlify/etc.).
2. Confirm production domain has HTTPS.
3. Deploy site.
4. Submit one real end-to-end test from production.
5. Verify:
   - Sheet row append works
   - Team notification email arrives
   - Participant confirmation email arrives
   - Errors are handled gracefully in UI if service is unavailable

## 10. Operational Notes

- The API route is `src/app/api/register/route.ts`.
- Server-side validation lives in `src/lib/registration-validation.ts`.
- Apps Script handles:
  - Sheet header enforcement
  - Row append
  - Notification + confirmation emails
  - Duplicate detection window (default 10 minutes)
- Do not expose `GOOGLE_APPS_SCRIPT_SHARED_SECRET` in client-side variables.

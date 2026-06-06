# Fetomaternal Donation Study Recruitment Website

Standalone Next.js + TypeScript website for recruiting mothers of children with Down syndrome for an academic blood donation research study.

The site is bilingual Hebrew/English, opens in Hebrew by default, supports RTL/LTR language switching, and includes a registration form wired through the Next.js API route to a Google Apps Script workflow.

## Run locally

```bash
npm install
npm run dev -- --port 4180
```

Then open `http://localhost:4180`.

## Notes

- Production registration backend is implemented via:
  - `src/app/api/register/route.ts`
  - Google Apps Script integration in `integrations/google-apps-script/`
- Full deployment guide:
  - `docs/registration-workflow-setup.md`

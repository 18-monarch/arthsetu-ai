ARTHSETU — FINAL VERCEL-READY MERGED PROJECT
================================================

BASE USED
- ArthSetu-main.zip (team version)
- Preserves questionnaire, dataset, training scripts, and newer ML artifacts.

VERCEL FIXES APPLIED
1. lib/db/index.ts now uses:
   drizzle(databaseUrl)

2. package.json uses:
   "engines": { "node": "24.x" }

3. package-lock.json root engine was updated to Node 24.x.

4. Generated tsconfig.tsbuildinfo was removed and ignored.

NOT OVERWRITTEN
- Team questionnaire flow
- Team credit_dataset.csv
- Dataset generator
- Model training script
- Team model.joblib
- Model metadata and model card
- Existing UI and styling

HOW TO USE
1. Back up your current project folder.
2. Extract this ZIP.
3. Replace the contents of the GitHub repository with this merged project.
4. Do not copy .env.local to GitHub.
5. Run:
   git add .
   git commit -m "Merge team ML work and fix Vercel deployment"
   git push origin main

6. Confirm the new Vercel build shows a NEW commit hash.
7. Do not use Redeploy on the old failed commit.

VERCEL ENVIRONMENT VARIABLES
- DATABASE_URL
- NEON_AUTH_BASE_URL
- NEON_AUTH_COOKIE_SECRET
- ML_SERVICE_URL
- ML_SERVICE_API_KEY
- ALLOW_DEMO_FALLBACK=true

After Vercel gives the final domain, add:
- NEXT_PUBLIC_SITE_URL=https://YOUR-PROJECT.vercel.app

SECURITY
The secret values previously pasted into chat should be rotated before production use.

VALIDATION
- Both uploaded ZIPs were compared file by file.
- Team version had 20 additional files, including questionnaire and ML dataset/training work.
- Python ML source compiled successfully.
- The exact TypeScript error shown by Vercel was removed.
- Node 24 was applied to both package metadata files.
- A complete npm/Next build could not be executed in this workspace because
  the package registry returned HTTP 503. Vercel had already demonstrated that
  dependency installation and Next compilation work; the blocking Drizzle type
  error has been corrected here.

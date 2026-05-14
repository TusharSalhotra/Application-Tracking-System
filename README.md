# Applicant Tracking System

This project is a Next.js conversion focused on the Applicant Tracking System module.

## Run Locally

```bash
npm install
npm run dev
```

The app runs on the default Next.js development URL:

```bash
http://localhost:3000
```

## Routes

The Next app delegates ATS screens through the catch-all app route and preserves the existing ATS URLs, including:

- `/admin/ats/dashboard`
- `/admin/ats/settings`
- `/admin/ats/job-posting`
- `/admin/ats/candidates`
- `/chs-jobs/:id`
- `/apply-job/:jobId/:id`
- `/offer-link/:offerid/:candidateid`

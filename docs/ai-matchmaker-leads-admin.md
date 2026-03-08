# AI Matchmaker Leads Pipeline

## What is captured
When a user generates AI University Matchmaker results, we now create a lead document in Firestore:

- Collection: `ai_matchmaker_leads`
- Key fields:
  - `leadStatus`: `new | contacted | qualified | closed`
  - `createdAt`, `updatedAt` (Firestore server timestamps)
  - `user` (uid/email/displayName if logged in)
  - `profile` (form inputs like student name, degree, program, countries, budget, score)
  - `aiResult` (summary, top recommended universities, next steps)
  - `hasProfilePdf`

## Admin route
- Route: `/admin/leads`
- Access: logged-in Firebase user whose email is in `NEXT_PUBLIC_ADMIN_EMAILS`

### Env setup
Add this in `.env`:

```bash
NEXT_PUBLIC_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

## Admin capabilities
- Live lead list from Firestore
- Search by student/program/country/email
- Filter by status
- Update lead status inline

## Crawl safety
`/admin` and `/admin/*` are disallowed in `robots` and marked `noindex` in SEO routes.

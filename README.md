# JobFoundAI

AI-powered hiring platform for both job seekers and employers.

JobFoundAI combines job discovery, application tracking, employer-side listing management, AI-assisted matching, and automated notifications in one Next.js application.

## Why This Project

Most job boards focus only on posting and applying. JobFoundAI adds workflow and intelligence:

- Job seekers can discover jobs, apply, track application stages, and get AI-powered matching.
- Employers can publish and manage listings, review applicants with AI-assisted scoring, and configure notification preferences.
- Background automation handles resume processing, matching, and daily emails.

## Core Features

### Job Seeker Experience

- Browse published listings with filters (title, city/state, experience, type, location requirement).
- Apply to jobs with optional cover letter.
- Track application status through stages: `applied`, `interested`, `interviewed`, `hired`, `denied`.
- Upload resume (PDF) and generate AI resume summary.
- Use AI Search to find relevant job listings from natural language prompts.
- Configure personal job notification settings and AI prompt preferences.

### Employer Experience

- Create and edit job listings.
- Control listing lifecycle: `draft` -> `published` -> `de-listed`.
- Mark listings as featured (plan-limited).
- Enforce role/organization permissions through Clerk.
- Review applicants and workflow states.
- Get daily new-application notification emails (with optional minimum rating filtering).

### AI + Automation

- AI job matching (Gemini via Inngest agent-kit).
- AI applicant ranking using resume summary + cover letter + job details.
- Resume summary generation from uploaded PDF (Claude via Inngest AI inference).
- Scheduled daily emails for:
	- New job alerts to users.
	- New applicant alerts to employer/org members.

## Tech Stack

- Framework: Next.js 16 (App Router), React 19, TypeScript
- Auth + organizations + plans: Clerk
- Database: PostgreSQL
- ORM + migrations: Drizzle ORM + drizzle-kit
- Async workflows and cron jobs: Inngest
- File uploads: UploadThing
- Email: Resend + React Email
- Validation: Zod
- UI: Tailwind CSS v4,shadcn/ui

## Project Structure

High-level layout:

```text
src/
	app/
		(job-seeker)/         # seeker routes, AI search, applications, settings
		employer/             # employer dashboard, listings, pricing, settings
		api/
			inngest/            # Inngest function handler
			uploadthing/        # upload route handler
	drizzle/
		schema/               # database tables and enums
		migrations/           # SQL migrations
	features/
		jobListings/          # listing actions, filters, db access
		jobApplications/      # applications, status workflow, rating
	services/
		clerk/                # auth/org helpers, plan feature checks
		inngest/              # background functions + AI agents
		resend/               # transactional/scheduled email templates
		uploadthing/          # file router and upload integration
	data/
		env/                  # typed client/server env validation
```

## Getting Started

### Clone The Repo
git clone https://github.com/abhayv290/jobfoundai

### 1. Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL
- Clerk account and app
- UploadThing account
- Resend account
- Gemini API key
- Anthropic API key


### 2. Install dependencies

```bash
pnpm install
```

### 3. Create environment variables
Rename .env.example  file and fill the request variables mentioned

### 4. Database setup

```bash
pnpm db:generate
pnpm db:migrate
```

Optional:

```bash
pnpm db:studio  
```

### 5. Run local services

Main app:

```bash
pnpm dev
```

Inngest dev server (in another terminal):

```bash
pnpm ingest
```

Email preview server (optional, in another terminal):

```bash
pnpm resend
```

## Scripts
- `pnpm dev` - Start Next.js dev server
- `pnpm build` - Build production bundle
- `pnpm start` - Run production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Drizzle migration files
- `pnpm db:migrate` - Apply migrations
- `pnpm db:push` - Push schema directly (development only)
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm ingest` - Start local Inngest dev process
- `pnpm resend` - Start React Email preview server

## Data Model Highlights

- `job_listings`: listing details, status, featured flag, posting metadata
- `job_applications`: join table for user applications + stage + AI rating
- `user_settings`: user notification preferences + optional AI prompt
- `orgs_user_settings`: org-member notification preferences and rating threshold
- `user_resume`: uploaded resume reference + generated AI summary

## Notes

- Protected routes are enforced via Clerk middleware.
- AI and background jobs are routed through `/api/inngest`.
- Resume uploads are routed through `/api/uploadthing`.
- Plan limits (e.g., post count, featured listings) are checked through Clerk feature flags.

## License

Add your preferred license here (for example, MIT).
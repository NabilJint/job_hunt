# JobPilot

![JobPilot Logo](/logo.png)

AI-powered job hunting assistant that discovers relevant tech jobs, scores them against your profile, researches each company, and tracks everything on a dashboard.

## Features

- **Smart Job Discovery** — searches Adzuna for tech roles matching your criteria
- **AI Match Scoring** — Gemini 3.5 Flash scores each job 0–100 against your actual skills and experience
- **Company Research** — automatically browses company websites via Jina Reader and builds a structured dossier (tech stack, culture, interview prep, talking points)
- **Profile Management** — upload your resume, auto-fill profile fields via AI extraction, or generate a polished PDF resume from your profile
- **Dashboard** — stats, recent activity, and analytics charts powered by PostHog
- **OAuth Authentication** — sign in with Google or GitHub via InsForge

## Tech Stack

| Layer            | Tool                             |
| ---------------- | -------------------------------- |
| Framework        | Next.js 16 (App Router)          |
| Backend          | InsForge (DB, Auth, Storage)     |
| AI               | Gemini 3.5 Flash                 |
| Job Discovery    | Adzuna API                       |
| Analytics        | PostHog                          |
| PDF Generation   | @react-pdf/renderer              |
| Styling          | Tailwind CSS v4 + shadcn/ui      |
| Language         | TypeScript (strict)              |

## Prerequisites

- Node.js 20+
- An InsForge project with the schema imported
- Adzuna API credentials (free tier available)
- Google AI API key for Gemini 3.5 Flash
- PostHog project (optional — charts work without it)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

| Variable                        | Required | Description                    |
| ------------------------------- | -------- | ------------------------------ |
| `NEXT_PUBLIC_INSFORGE_URL`      | Yes      | Your InsForge backend URL      |
| `NEXT_PUBLIC_INSFORGE_ANON_KEY` | Yes      | InsForge anon key              |
| `INSFORGE_ADMIN_KEY`            | Yes      | InsForge admin key             |
| `ADZUNA_APP_ID`                 | Yes      | Adzuna API application ID      |
| `ADZUNA_APP_KEY`                | Yes      | Adzuna API key                 |
| `GOOGLE_API_KEY`                | Yes      | Google AI API key for Gemini   |
| `NEXT_PUBLIC_POSTHOG_KEY`       | No       | PostHog project API key        |
| `NEXT_PUBLIC_POSTHOG_HOST`      | No       | PostHog ingestion endpoint     |

## Getting Started

```bash
# Clone the repo
git clone <repo-url>
cd jobpilot

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command          | Description                  |
| ---------------- | ---------------------------- |
| `npm run dev`    | Start development server     |
| `npm run build`  | Build for production         |
| `npm run start`  | Start production server      |
| `npm run lint`   | Run ESLint                   |

## Project Structure

```
app/               Pages and API routes
  (auth)/          Login and OAuth callback
  dashboard/       Main dashboard page
  profile/         Profile form and resume management
  find-jobs/       Job search, list, and details
  api/             Route handlers (agent, resume)
agent/             Agent logic (Adzuna discovery, company research, matching, extraction)
actions/           Server Actions (profile save, job updates)
components/        UI components (dashboard, profile, find-jobs, job-details, layout)
lib/               Third-party clients (InsForge, PostHog, Adzuna) and utilities
types/             Shared TypeScript types
context/           Project documentation (architecture, standards, build plan)
```

## Architecture

- **Pages** (`app/`) handle routing and data fetching — no business logic
- **Agents** (`agent/`) contain all AI and API orchestration — no React
- **Server Actions** (`actions/`) handle UI-triggered mutations
- **Components** (`components/`) are pure UI — no data fetching, no direct DB calls
- **API routes** (`app/api/`) bridge the UI to agent operations

Data flows: User interaction → Server Action or API route → InsForge DB → page revalidation.

## Deployment

The frontend deploys to any Node.js platform (Vercel, Railway, etc.). The backend runs on InsForge.

```bash
npm run build
```

Set all environment variables from `.env.local` in your deployment platform.

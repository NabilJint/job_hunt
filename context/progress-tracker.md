# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** 5 — Dashboard
**Last completed:** 17 Analytics Charts — PostHog Data
**Next:** —

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [x] 07 AI Profile Extraction from Resume
- [x] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [x] 09 Find Jobs Page — Full UI
- [x] 10 Adzuna Job Discovery
- [x] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [x] 12 Job Details Page — Full UI
- [x] 13 Company Research Agent — Jina Reader + Gemini 3.5 Flash (no Browserbase/Stagehand)

### Phase 5 — Dashboard

- [x] 14 Dashboard Page — Full UI
- [x] 15 Stats Bar — Real Data
- [x] 16 Recent Activity — Real Data
- [x] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- Used `Inter` font from next/font/google as specified in ui-rules.md.
- Implemented the homepage using a modular component structure in `components/homepage/`.
- Followed Tailwind v4 `@theme` tokens for all colors and spacing.
- Installed `@insforge/sdk@1.4.0` — SSR client in `@insforge/sdk/ssr`.
- Updated context files: swapped `@insforge/ssr` references to `@insforge/sdk/ssr`.
- Used `proxy.ts` instead of `middleware.ts` (Next.js 16 deprecation).
- Created `lib/posthog-client.ts` — re-exports posthog-js singleton for browser usage.
- PostHog instrumentation already wired in `instrumentation-client.ts` with reverse proxy via `next.config.ts`.
- `posthog.identify()` already in callback page; `posthog.reset()` now in both dashboard and navbar sign-out.
- PostHog events (`job_search_started`, `job_found`, `profile_completed`, `company_researched`) will be added when their features are built (Phases 2-4).
- Database schema (`profiles`, `agent_runs`, `jobs`, `agent_logs`) created via InsForge CLI `db import` with full RLS policies.
- Added `login` PostHog event — fires on successful OAuth callback.
- `resumes` storage bucket created as private with per-user folder RLS (`resumes/{user_id}/`).
- **Feature 07 uses Gemini 3.5 Flash** (not GPT-4o) via `@google/generative-ai` SDK.
- Server-side storage fetch uses `INSFORGE_ADMIN_KEY` (admin key, no `NEXT_PUBLIC_` prefix), not anon key — anon key fails RLS on private bucket.
- InsForge storage URL pattern: `/api/storage/buckets/{bucket}/objects/{key}`.
- `pdfjs-dist` and `pdf-parse` added to `serverExternalPackages` in `next.config.ts` to fix webpack worker resolution.
- **Feature 08 uses Gemini 3.5 Flash** for resume content generation (same model as Feature 07 extractor).
- `@react-pdf/renderer` added to `serverExternalPackages` in `next.config.ts` — server-side only rendering.
- InsForge SDK `storage.upload()` only accepts 2 args (path, file) — no options object. Use `storage.remove()` before upload for upsert behavior.
- InsForge SDK `storage.getPublicUrl()` returns a string directly, not `{ data: { publicUrl } }`.
- `renderToBuffer()` returns Node.js Buffer — convert to `Uint8Array` before passing to `Blob` constructor.
- **Feature 09 uses mock data** — UI built first with hardcoded jobs, logic will be wired in Feature 10 (Adzuna) and Feature 11 (Filter/Sort/Pagination).
- **Feature 10 uses Gemini 3.5 Flash** for job scoring (same model as Features 07 and 08).
- InsForge server client uses `insforge.database.from()` for queries, not `insforge.from()`.
- Adzuna API client in `lib/adzuna.ts` with country detection from location input.
- Batch scoring: all jobs scored in one Gemini call (faster, cheaper).
- Partial failure: save scored jobs even if some fail, log failures to agent_logs.
- GET `/api/agent/jobs` endpoint returns user's jobs for the Find Jobs page.
- Feature 11: Moved filter, sort, text search, and pagination to server-side PostgREST queries. API accepts `matchFilter`, `sortBy`, `q`, `page`, `pageSize` params. Uses `.gte()`, `.lt()`, `.or()`, `.ilike()`, `.order()`, `.range()` on the InsForge SDK with `{ count: 'exact' }` for total count. PAGE_SIZE set to 20 per build plan.
- Filter/sort/text changes reset to page 1 automatically via wrapped change handlers.
- Feature 13: Replaced Browserbase + Stagehand with Jina Reader (HTTP fetch → clean markdown). No browser automation at all. Gemini 3.5 Flash handles content analysis + dossier synthesis. Zero new dependencies — uses native fetch() and @google/generative-ai (already installed). Compatible with Vercel Hobby 10s timeout (~3-5s expected response time).
- Feature 14: Dashboard UI built with mock data. Installed `recharts` for chart components (BarChart, AreaChart). Dashboard layout uses 3-row grid: stats cards (4-col), activity + research chart (2-col), jobs over time + match score (3:2 ratio). All components use `"use client"` for recharts.
- Feature 15: StatsBar now accepts real data props (`totalJobs`, `avgMatchRate`, `companiesResearched`, `jobsThisWeek`). Dashboard page is a server component that queries InsForge DB in parallel: COUNT jobs, AVG match_score (computed in JS), COUNT jobs with non-empty company_research jsonb, COUNT jobs in last 7 days. Redirects to /login if no user session.
- Feature 16: RecentActivity now accepts `activities` prop — queries agent_runs (completed, last 10) and jobs with non-empty company_research (last 20), merges by date desc, takes top 10. Added `formatRelativeTime` utility to lib/utils.ts. Activity dots: green for job searches, blue for company research.
- Feature 17: Three chart components accept `data` props instead of mock data. Dashboard page computes chart data from the same DB query that powers the stats — one `SELECT match_score, company_research, found_at` call, then derives three chart datasets in JS: jobs-over-time (last 30 days bucketed by date), company-research-activity (last 7 days bucketed by date), match-score-distribution (5 bins). Empty states ("No data yet") shown when no data exists. No new env vars or dependencies.

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._

# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** 1 — Foundation
**Last completed:** 04 Database Schema
**Next:** 05 Profile Page — Full UI

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [ ] 05 Profile Page — Full UI
- [ ] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 0 la Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

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

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._

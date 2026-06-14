# Memory — Feature 17: Analytics Charts

Last updated: 2026-06-14

## What was built

### Feature 17 — Analytics Charts — Real Data

- **`app/dashboard/page.tsx`** — `getDashboardData()` fetches all jobs in one query and computes stats + three chart datasets: jobs-over-time (grouped by day), company-research-activity (grouped by day, filtered to non-empty research), match-score-distribution (5 bins). Single DB query powers everything.
- **`components/dashboard/CompanyResearchChart.tsx`** — Accepts `data` prop instead of mock data. Shows "No data yet" empty state.
- **`components/dashboard/JobsOverTimeChart.tsx`** — Accepts `data` prop instead of mock data. Shows "No data yet" empty state.
- **`components/dashboard/MatchScoreChart.tsx`** — Accepts `data` prop instead of mock data. Shows "No data yet" empty state.

### Context files updated

- `context/progress-tracker.md` — Feature 17 marked complete. All phases done.
- `context/code-standards.md` — No new env vars needed (charts use DB, not PostHog API).

### Deleted

- `lib/posthog-query.ts` — Created and then removed after switching to DB-based approach.

## Decisions made

- **Charts use DB, not PostHog Query API** — `jobs` table already has `found_at`, `match_score`, `company_research`. No new env vars or API surface needed. Consistent with Features 15-16.
- **Chart components accept `data` props** — same pattern as StatsBar and RecentActivity. Server component computes data, passes down to client-side recharts.
- **Raw data display** — no zero-filling, no fixed date windows, no account creation tracking. Just group jobs by date and display.
- **Single query for all dashboard data** — one `SELECT match_score, company_research, found_at` for stats + charts. Avoids N+1.

## Problems solved

- **InsForge SDK Promise.all destructuring** — `const [result] = await Promise.all([...])` returns the full SDK response object `{ data, error }`, not the array. Must use `result.data` or destructure individually.
- **Date bucketing for AreaChart** — non-contiguous dates cause invisible line in recharts. Tried zero-filling approaches but settled on raw data display (user preference).

## Current state

- Features 1-17 complete. All phases done.
- Dashboard shows real data: StatsBar, RecentActivity, JobsOverTimeChart, CompanyResearchChart, MatchScoreChart.
- Zero TypeScript errors.

## Next session starts with

- No pending features — all 17 features complete. Consider what's next: production deployment, testing, or new features.

## Open questions

- None.

# Memory — Database Schema + PostHog login event

Last updated: 2026-06-13

## What was built

- `app/(auth)/callback/page.tsx` — added `posthog.capture("login", { userId })` after identify
- `context/code-standards.md` — added `login` event to the approved events list (now 5 total)
- `db/schema.sql` — idempotent SQL script with `profiles`, `agent_runs`, `jobs`, `agent_logs` tables, `updated_at` trigger on profiles, and 16 RLS policies (SELECT/INSERT/UPDATE/DELETE per table) scoped to `auth.uid()`
- InsForge CLI: executed schema via `insforge db import db/schema.sql`
- InsForge CLI: created `resumes` storage bucket (`--private`) and applied RLS policies on `storage.objects` restricting access to `resumes/{auth.uid()}/`
- `context/progress-tracker.md` — Feature 04 marked complete, added build notes

## Decisions made

- Storage RLS uses `storage.foldername(key)` to extract user_id from `resumes/{user_id}/` paths
- Used `insforge db import` (file-based) rather than `insforge db query` for the full schema — enables version control of `db/schema.sql`
- `ON DELETE CASCADE` on all foreign keys to prevent orphaned data when profiles are deleted
- `login` event approved and added to the canonical list — will fire on every successful OAuth callback

## Current state

- Feature 04 (Database Schema) complete — all 4 tables with RLS exist in InsForge
- `resumes` bucket is private with per-user folder RLS
- `login` PostHog event fires on OAuth callback
- Build compiles cleanly
- `progress-tracker.md` updated

## Next session starts with

- Feature 05: Profile Page — Full UI. Build the profile form page, resume upload component, and extraction/generation API routes.

## Open questions

- None

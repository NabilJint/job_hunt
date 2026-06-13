# PostHog post-wizard report

The wizard has completed the PostHog integration for JobPilot. Here is a summary of every change made.

**Infrastructure created:**
- `instrumentation-client.ts` — client-side PostHog initialization using the `instrumentation-client` pattern (correct for Next.js 15.3+). Initialises with a reverse proxy at `/ingest`, EU UI host, defaults `2026-01-30`, and exception capture enabled.
- `lib/posthog-server.ts` — singleton server-side PostHog client (`posthog-node`) with `flushAt: 1` and `flushInterval: 0` for synchronous server-side event flushing.
- `next.config.ts` — reverse proxy rewrites added: `/ingest/static/*` and `/ingest/array/*` route to `eu-assets.i.posthog.com`; `/ingest/*` routes to `eu.i.posthog.com`. `skipTrailingSlashRedirect: true` added as required.
- `.env.local` — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` populated.

**User identification added:**
- `app/(auth)/callback/page.tsx` — `posthog.identify(user.id, { email })` called after successful OAuth callback, linking anonymous pre-login events to the user's account.
- `app/dashboard/page.tsx` — `posthog.reset()` called before sign-out, ensuring future events on the same device are not attributed to the signed-out user.

**Events planned (files not yet built — add capture calls when each file is created):**

| Event | Description | File |
|---|---|---|
| `job_search_started` | Fired when the user clicks Find Jobs, before the Adzuna API call | `app/api/agent/find/route.ts` |
| `job_found` | Fired once per job discovered and saved; includes match score. Powers Jobs Found Over Time and Match Score Distribution charts | `app/api/agent/find/route.ts` |
| `profile_completed` | Fired once when the user saves a fully complete profile for the first time | `actions/profile.ts` |
| `company_researched` | Fired when the company research dossier is generated and saved. Powers Company Research Activity chart | `app/api/agent/research/route.ts` |

Properties for each event are defined in `context/code-standards.md`.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/201370/dashboard/746348)
- [Jobs Found Over Time](https://eu.posthog.com/project/201370/insights/4gEas2Uq) — daily `job_found` events (line chart)
- [Job Searches Over Time](https://eu.posthog.com/project/201370/insights/wlfBvivk) — daily `job_search_started` events (line chart)
- [Company Research Activity](https://eu.posthog.com/project/201370/insights/Jb1N5pLJ) — daily `company_researched` events (bar chart)
- [Profile Completions Total](https://eu.posthog.com/project/201370/insights/BnhDXtNA) — total `profile_completed` events (bold number)
- [Search-to-Research Conversion](https://eu.posthog.com/project/201370/insights/oP4T1rtH) — unique users who searched vs researched (line chart)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

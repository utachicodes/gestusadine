# Deployment

GëstuSaDine is deployed as a single instance. Contributors push to the repository; only maintainers deploy to production.

## Architecture

| Component | Platform | Purpose |
|-----------|----------|---------|
| **Backend** | Convex | Database, auth, functions, cron jobs, webhooks |
| **Frontend** | Vercel | React SPA (auto-deploys on push to `main`) |

## Production commands

```bash
# Deploy backend (schema, functions, crons, webhooks)
npx convex deploy

# Set/update a secret
npx convex env set FANAR_API_KEY "new-key"

# Rollback if something breaks
npx convex rollback
```

Frontend deploys automatically via Vercel on every push to `main`. Preview deploys happen on PRs.

## Environment variables

Set on Convex via `npx convex env set <NAME> <VALUE>`:

| Variable | Required | Purpose |
|----------|----------|---------|
| `AUTH_SECRET` | Yes | JWT signing secret |
| `ADMIN_EMAILS` | Yes | Comma-separated admin emails |
| `FANAR_API_KEY` | Yes | Fanar API key for the AI chat |

Set on Vercel:

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_CONVEX_URL` | Yes | Convex deployment URL |

## Cron jobs

Defined in `convex/crons.ts`, deployed automatically with `npx convex deploy`:

| Job | Schedule | Purpose |
|-----|----------|---------|
| Daily quiz | 00:00 UTC | Generate Islamic quiz question |
| Daily content | 00:05 UTC | Generate ayah, hadith, dua, fact, action |
| Prayer notifications | 00:10 UTC | Schedule push notifications for prayer times |
| Reminder notifications | 00:15 UTC | Schedule Quran + daily content reminders |

## Webhooks

- **Health check**: `GET /health` — returns `{"status": "ok"}`

## Monitoring

- **Convex Dashboard**: [dashboard.convex.dev](https://dashboard.convex.dev) — function logs, DB usage, cron history
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard) — build logs, analytics

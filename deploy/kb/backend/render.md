# Render Deployment Runbook

> **Scope:** Nest/Node (or other Docker) APIs on Render via Dockerfile or Blueprint  
> **Active when:** `stack.config.yaml` → `deploy.api: render`  
> **Companion stubs:** root `render.yaml`, `deploy/render.yaml`, `deploy/Dockerfile.api`  
> **Last reviewed:** 2026-07-21

---

## 1. Purpose

Configure, deploy, verify, and roll back a backend web service on Render without inventing credentials or auto-promoting production.

---

## 2. Prerequisites

- Render account and team access
- Git repository connected (or Docker image workflow)
- Root `pnpm-workspace.yaml` + package `@app/api` when using Nest stub Dockerfile
- `deploy/Dockerfile.api` valid for Nest/Node (`backend.framework: nestjs`)
- Laravel / Django: use adapter Dockerfile notes — **not** `Dockerfile.api`
- Database URL available (e.g. Neon) — set as `DATABASE_URL` in Render
- Env var values set in Render dashboard (`sync: false` keys in blueprint)

---

## 3. Env inventory (names only)

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | From `database.provider` (Neon / Supabase / …) |
| `JWT_ACCESS_SECRET` | yes | Never commit; rotate if leaked |
| `WEB_ORIGIN` | yes | Frontend origin (Vercel URL) for CORS + cookies |
| `PORT` | yes | Render may inject; Nest binds `0.0.0.0` |
| `NODE_ENV` | yes | `production` on hosted |
| `REFRESH_DAYS` | recommended | Refresh cookie TTL |

Do not print secret values in agent reports.

---

## 4. Blueprint / Docker

Preferred MVP path:

1. Confirm `deploy.api: render` in `stack.config.yaml`.
2. Use root [`render.yaml`](../../../render.yaml) (keep in sync with `deploy/render.yaml`).
3. `dockerfilePath: ./deploy/Dockerfile.api`, `dockerContext: .`, `healthCheckPath: /health`.
4. Create/update Web Service from Blueprint or dashboard.
5. Fill `DATABASE_URL`, `JWT_ACCESS_SECRET`, `WEB_ORIGIN` in dashboard.
6. Deploy preview/staging first.

Local image check:

```bash
docker build -f deploy/Dockerfile.api -t api:local .
```

---

## 5. Health and smoke

- `GET /health` — process up
- `GET /ready` — DB reachable
- Confirm CORS with `WEB_ORIGIN`
- Confirm FE `VITE_API_URL` points at this service `/api/v1`

---

## 6. Preview vs production

| Target | Rule |
|---|---|
| Preview / staging | Default for agents |
| Production | Human confirm only |

Separate Render services (or env groups) per environment. Do not share production DB with preview.

---

## 7. Rollback

1. Redeploy previous successful Render deploy from dashboard history.
2. Or pin previous Docker image tag if using image deploys.
3. Confirm `/health` + `/ready` after rollback.
4. DB migrations are **not** rolled back by app rollback — see `kb/database/migration.md`.

---

## 8. Forbidden

- Invent Render API keys, service IDs, or secrets
- Auto-deploy production without human confirmation
- Commit `.env` with real values
- Use Node `Dockerfile.api` for Laravel/Django

---

## 9. Official docs

- https://docs.render.com/
- https://docs.render.com/blueprint-spec

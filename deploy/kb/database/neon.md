# Neon PostgreSQL Runbook

> **Scope:** Serverless Postgres for MVP backends (Prisma / Laravel / Django)  
> **Active when:** `stack.config.yaml` → `database.provider: neon`  
> **Companion:** [`migration.md`](./migration.md), API env `DATABASE_URL`  
> **Last reviewed:** 2026-07-21

---

## 1. Purpose

Provision Neon databases for staging/production, wire connection strings into the API host (`deploy.api`), and run versioned migrations safely.

---

## 2. Prerequisites

- Neon account and project
- Separate branches/projects for staging vs production
- ORM migrations in app repo (Nest: `apps/api/prisma`)
- API host ready to receive `DATABASE_URL` (Render, Railway, …)

---

## 3. Setup

1. Create a Neon project (region close to API).
2. Create a **staging** branch (or separate project) and a **production** branch/project.
3. Copy the connection string from Neon console.
4. Append or confirm `sslmode=require` when required by the client.
5. Set `DATABASE_URL` on the API provider dashboard only — never commit the value.

### Pooled vs direct

| Use | Prefer |
|---|---|
| App runtime (serverless / many short connections) | Neon **pooled** connection string |
| `prisma migrate deploy` / long migrations | Neon **direct** (non-pooler) host if migrate fails through pooler |

Document which string is used for migrate vs runtime in the deploy report (names/roles only, not passwords).

---

## 4. Env inventory

| Variable | Consumer | Notes |
|---|---|---|
| `DATABASE_URL` | API runtime + migrate CI | From Neon; env-specific |

Local Day 0 may still use `database.provider: local-docker` + root `docker-compose.yml`. Switch to Neon for hosted staging/prod.

---

## 5. Migrations

Always follow [`migration.md`](./migration.md).

Nest / Prisma example (from `apps/api` or filter `@app/api`):

```bash
# With DATABASE_URL pointing at the target Neon DB (direct URL if needed)
pnpm exec prisma migrate deploy
```

Rules:

- Migrate against the hosted `DATABASE_URL` the API will use — not only local ([`../deploy-invariants.md`](../deploy-invariants.md) §4)
- Staging migrate before production
- Never invent connection strings
- Expand/contract for risky changes
- App rollback ≠ schema rollback

---

## 6. Backup / restore

- Prefer Neon branching + point-in-time recovery features for the plan in use
- Test restore on a non-production branch before relying on it
- See also [`backup-restore.md`](./backup-restore.md)

---

## 7. Forbidden

- Share production Neon credentials with preview
- Commit Neon passwords or full URLs with secrets
- Run unreviewed migrations against production
- Assume free-tier limits are enough for production load

---

## 8. Official docs

- https://neon.tech/docs/introduction
- https://neon.tech/docs/connect/connection-pooling

# NestJS adapter — bootstrap

## Prerequisites

- `backend.framework: nestjs`, `language: typescript`
- Pins from `packages.example.yaml` → `backend.packages`
- Validate + apply stack config

## Scaffold checklist

1. Create `backend.appDir` (default `apps/api`) Nest layout.
2. `package.json` **name** must be `@app/api` (FIXED filter for deploy stubs — not `{slug}-api`).
3. When `project.monorepo: true`, ensure root `pnpm-workspace.yaml` includes `apps/*`; install from repo root with `pnpm`.
4. Prisma schema with soft-delete timestamps; generator `binaryTargets` must include the **container** target (see schema comment + Alpine notes in stub Dockerfile).
5. Global prefix `api/v1`; exclude `health` / `ready`.
6. Cookie-parser + CORS + ValidationPipe per product auth contract and [`deploy/kb/deploy-invariants.md`](../../deploy/kb/deploy-invariants.md) §3 when web ≠ API host.
7. `.env.example` (names only): `DATABASE_URL`, `JWT_ACCESS_SECRET`, `REFRESH_DAYS`, `PORT`, `WEB_ORIGIN`, `NODE_ENV`.
8. Package manager: `pnpm`.

## Runtime / Docker

- Bind `0.0.0.0` + `PORT`; `GET /health`, `GET /ready`
- Default stub: `deploy/Dockerfile.api` — preserves monorepo install layout in the runner (invariant §1)
- Providers from `stack.config.yaml` → `deploy.api` + `deploy/PLATFORM-GUIDE.md`
- Hosted DB: migrate against hosted `DATABASE_URL` before auth smoke (invariant §4)

## Do not

- Full features before Day 1 — skeleton + install first
- Packages outside `stack.config.yaml`

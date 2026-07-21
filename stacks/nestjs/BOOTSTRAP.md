# NestJS adapter — bootstrap

## Prerequisites

- `backend.framework: nestjs`, `language: typescript`
- Pins from `packages.example.yaml` → `backend.packages`
- Validate + apply stack config

## Scaffold checklist

1. Create `backend.appDir` (default `apps/api`) Nest layout.
2. `package.json` **name** must be `@app/api` (FIXED filter for deploy stubs — not `{slug}-api`).
3. When `project.monorepo: true`, ensure root `pnpm-workspace.yaml` includes `apps/*`; install from repo root with `pnpm`.
4. Prisma schema with soft-delete timestamps.
5. Global prefix `api/v1`; exclude `health` / `ready`.
6. Cookie-parser + CORS + ValidationPipe.
7. `.env.example` (names only): `DATABASE_URL`, `JWT_ACCESS_SECRET`, `REFRESH_DAYS`, `PORT`, `WEB_ORIGIN`, `NODE_ENV`.
8. Package manager: `pnpm`.

## Runtime / Docker

- Bind `0.0.0.0` + `PORT`; `GET /health`, `GET /ready`
- Default stub: `deploy/Dockerfile.api` (Node multi-stage; filter `@app/api`, path `apps/api` unless `backend.appDir` differs)
- Providers from `stack.config.yaml` → `deploy.api` (e.g. railway | render) + `deploy/PLATFORM-GUIDE.md`

## Do not

- Full features before Day 1 — skeleton + install first
- Packages outside `stack.config.yaml`

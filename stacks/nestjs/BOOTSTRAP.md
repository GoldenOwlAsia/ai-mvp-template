# NestJS adapter — bootstrap

## Prerequisites

- `backend.framework: nestjs`, `language: typescript`
- Pins from `packages.example.yaml` → `backend.packages`
- Validate + apply stack config

## Scaffold checklist

1. Create `backend.appDir` (default `apps/api`) Nest layout.
2. Prisma schema with soft-delete timestamps.
3. Global prefix `api/v1`; exclude `health` / `ready`.
4. Cookie-parser + CORS + ValidationPipe.
5. `.env.example`: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `PORT`, `WEB_ORIGIN`.
6. Package manager: `pnpm`.

## Runtime / Docker

- Bind `0.0.0.0` + `PORT`; `GET /health`, `GET /ready`
- Default stub: `deploy/Dockerfile.api` (Node multi-stage)
- See `deploy/PLATFORM-GUIDE.md`

## Do not

- Full features before Day 1 — skeleton + install first
- Packages outside `stack.config.yaml`

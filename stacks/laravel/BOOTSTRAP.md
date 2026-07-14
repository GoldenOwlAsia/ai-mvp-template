# Laravel adapter — bootstrap

## Prerequisites

- `backend.framework: laravel`, `language: php`
- Pins from `packages.example.yaml`
- `composer` (+ `pnpm` if FE is `react-vite`)

## Scaffold checklist

1. Laravel project in `backend.appDir`.
2. PostgreSQL `.env.example`.
3. API under `/api/v1`; CORS for SPA.
4. SoftDeletes + UUID PKs; `GET /health`.

## Runtime / Docker

- PHP-FPM + nginx
- **Do not** use Node `deploy/Dockerfile.api` — generate PHP Dockerfile from this adapter
- `deploy/PLATFORM-GUIDE.md` for provider choice

## Do not

- Nest module patterns; Composer packages outside config

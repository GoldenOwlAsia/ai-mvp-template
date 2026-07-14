# Django adapter — bootstrap

## Prerequisites

- `backend.framework: django`, `language: python`
- Pins from `packages.example.yaml`; manager: `poetry`

## Scaffold checklist

1. Poetry + Django + DRF in `backend.appDir`.
2. PostgreSQL via env; `/api/v1/` + `/health`.
3. Soft-delete base model; UUID PKs; CORS for SPA.

## Runtime / Docker

- Gunicorn on `0.0.0.0:$PORT`
- Python Dockerfile — **not** Node `deploy/Dockerfile.api`
- `deploy/PLATFORM-GUIDE.md`

## Do not

- Nest naming; PyPI packages outside config

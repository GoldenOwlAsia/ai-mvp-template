# React + Vite — bootstrap

1. Vite React TS in `frontend.appDir` (default `apps/web`).
2. `package.json` **name** must be `@app/web` (FIXED filter for deploy stubs — not `{slug}-web`).
3. When `project.monorepo: true`, ensure root `pnpm-workspace.yaml` includes `apps/*`; install from repo root with `pnpm`.
4. Pins from `packages.example.yaml`; Tailwind.
5. Dev proxy `/api` → backend.
6. `.env.example`: `VITE_API_URL` (local may use `/api/v1`; hosted preview/prod needs absolute API origin + `/api/v1`).
7. Install with `pnpm`.
8. Deploy: `stack.config.yaml` → `deploy.web` (default Vercel) + root/`deploy/vercel.json` filter `@app/web`.

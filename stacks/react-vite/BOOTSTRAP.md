# React + Vite — bootstrap

1. Vite React TS in `frontend.appDir` (default `apps/web`).
2. `package.json` **name** must be `@app/web` (FIXED filter for deploy stubs — not `{slug}-web`).
3. When `project.monorepo: true`, ensure root `pnpm-workspace.yaml` includes `apps/*`; install from repo root with `pnpm`.
4. Pins from `packages.example.yaml`; Tailwind.
5. Dev proxy `/api` → backend (local same-origin convenience).
6. `.env.example`: `VITE_API_URL` — local may use relative path; **hosted** must use absolute API base when web and API are on different hosts ([`deploy/kb/deploy-invariants.md`](../../deploy/kb/deploy-invariants.md) §3). Redeploy web after changing build-time env.
7. Install with `pnpm`.
8. Deploy: `stack.config.yaml` → `deploy.web` + root/`deploy/vercel.json` filter `@app/web`.

# Deploy checklist (slim)

Derived from environment + secrets concepts — keep values out of git.

Providers come from `stack.config.yaml` (`deploy.*`, `database.provider`) — do not assume Railway.

## Environments

| Env | Purpose | Deploy |
|---|---|---|
| Development | Local docker Postgres (or local Neon branch) | laptop |
| Preview | PR optional | e.g. Vercel preview |
| Staging | Prod-like smoke | API host (Railway/Render/…) + web + DB |
| Production | Live | human-approved only |

## Pre-deploy

- [ ] Scope reviewed; unrelated changes excluded
- [ ] Lint / typecheck / tests green in CI
- [ ] `stack.config.yaml` pins unchanged unless intentional
- [ ] Package names `@app/web` / `@app/api` + root `pnpm-workspace.yaml` when monorepo
- [ ] Target branch and URLs correct
- [ ] Env vars present in provider (see `.env.example` keys + PLATFORM-GUIDE inventory)
- [ ] No secrets in repo or workflow logs
- [ ] Migration reviewed; staging migrate succeeds
- [ ] Rollback target (previous image / deployment) known

## Secrets

- Never commit `.env`
- Separate credentials per environment
- JWT secrets ≠ DB passwords; rotate when leaked
- CI uses repository secrets — do not `echo` values

## Smoke after deploy

- [ ] `GET /health` → ok
- [ ] `GET /ready` → ready (DB)
- [ ] Web loads; login works; CORS/`WEB_ORIGIN` correct
- [ ] Create + soft-delete a domain entity

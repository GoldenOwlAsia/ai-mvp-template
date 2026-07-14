# Deploy checklist (slim)

Derived from environment + secrets concepts — keep values out of git.

## Environments

| Env | Purpose | Deploy |
|---|---|---|
| Development | Local docker Postgres | laptop |
| Preview | PR optional | Vercel preview |
| Staging | Prod-like smoke | Railway + Vercel staging |
| Production | Live | human-approved only |

## Pre-deploy

- [ ] Scope reviewed; unrelated changes excluded
- [ ] Lint / typecheck / tests green in CI
- [ ] `stack.config.yaml` pins unchanged unless intentional
- [ ] Target branch and URLs correct
- [ ] Env vars present in provider (see `.env.example` keys)
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
- [ ] Create + soft-delete project

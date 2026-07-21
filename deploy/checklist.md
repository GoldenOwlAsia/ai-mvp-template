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
- [ ] Package names + workspace layout match deploy stubs when monorepo
- [ ] Lockfile discipline: one package manager; manifest ↔ lock in sync
- [ ] Container/native targets match adapter BOOTSTRAP (invariants §1–2)
- [ ] Env vars on the **correct** provider layer (web build vs API runtime)
- [ ] Hosted DB migrate planned against hosted `DATABASE_URL` (invariant §4)
- [ ] No secrets in repo or workflow logs
- [ ] Rollback target (previous image / deployment) known

## Secrets

- Never commit `.env`
- Separate credentials per environment
- JWT secrets ≠ DB passwords; rotate when leaked
- CI uses repository secrets — do not `echo` values

## Smoke after deploy

- [ ] `GET /health` → ok
- [ ] `GET /ready` → ready (DB)
- [ ] Cross-origin checks pass when web ≠ API ([`kb/deploy-invariants.md`](./kb/deploy-invariants.md) §3, §8)
- [ ] Register/login or one domain write path works

See also: [`kb/deploy-invariants.md`](./kb/deploy-invariants.md).

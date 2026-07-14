# Day 4 — Multi-platform deploy

## Goals

Preview/staging: FE + API + DB on the **platforms chosen** in `stack.config.yaml`. Do not auto-deploy production.

## Read first

1. `deploy/PLATFORM-GUIDE.md` ← **Claude chooses/uses multiple platforms**
2. `deploy/kb/platform-matrix.md` if providers are not locked yet
3. Matching layer runbooks under `deploy/kb/web|backend|database/`
4. `deploy/kb/environment.md` + `secrets.md`

## Default golden path

| | |
|---|---|
| Web | Vercel — `deploy/kb/web/vercel.md` + `vercel.json` |
| API | Railway + Docker — `docker.md` + `railway.md` + `Dockerfile.api` |
| DB | migrate — `kb/database/migration.md` |

## Changing platforms

1. Edit `stack.config.yaml` → `deploy.web` / `deploy.api` / `database.provider`
2. Follow PLATFORM-GUIDE map → read alternatives + runbook
3. No runbook → **ask a human**, do not invent

## Gate

- [ ] Preview/staging green; `/health` OK
- [ ] No secrets in git / logs
- [ ] Report per PLATFORM-GUIDE §6
- [ ] Prod only after human confirm

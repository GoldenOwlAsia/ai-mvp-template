# Deploy — Claude

## Important docs

1. **[PLATFORM-GUIDE.md](./PLATFORM-GUIDE.md)** — resolve providers from `stack.config.yaml`, then multi-platform kb.
2. **[kb/](./kb/)** — Full knowledge base.
3. This file — safety + stubs index.
4. **[../prompts/deploy-from-config.md](../prompts/deploy-from-config.md)** — interactive Day-4 deploy agent (ask → act).
5. **Skill** `.claude/skills/deploy` — preflight gaps, ask human, then preview.
6. **Preflight** `pnpm preflight:deploy` / `node scripts/deploy-preflight.mjs --json`.

## Claude safety (FIXED)

```
✅ Read PLATFORM-GUIDE + platform-matrix when choosing/changing provider
✅ Staging/preview first; smoke /health and login
✅ Ask human when preflight status is needs_input (never invent answers)
✅ Secrets only in provider/CI — do not invent IDs
✅ Reports must not print secret values
✅ Package names @app/web / @app/api when Node monorepo

❌ No production deploy without human confirm
❌ Do not invent steps for a platform with no runbook under kb/
❌ Mobile/store release outside MVP unless human asks (advanced/ + kb/mobile)
```

## Stubs (active = whatever `stack.config` says)

| Layer | Config key | Common stubs | Runbook |
|---|---|---|---|
| Web | `deploy.web` | root + `deploy/vercel.json` | `kb/web/vercel.md` |
| API | `deploy.api` | `Dockerfile.api`; `railway.toml` **or** root/`deploy/render.yaml` | `kb/backend/railway.md` / `render.md` + `docker.md` |
| DB | `database.provider` | root `docker-compose.yml` (local) | `kb/database/neon.md` / `supabase.md` / … |

**Stack runtime:** Nest → Node Dockerfile stub · Laravel / Django → Docker notes in `stacks/<framework>/BOOTSTRAP.md` (see PLATFORM-GUIDE §1.1).

Change platform: edit `stack.config.yaml` → `deploy.*` / `database.provider` then follow PLATFORM-GUIDE §3–4.

Short checklist: `checklist.md` · Full checklist: `kb/deployment-checklist.md`

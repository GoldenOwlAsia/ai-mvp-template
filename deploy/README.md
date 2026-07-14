# Deploy — Claude

## Important docs

1. **[PLATFORM-GUIDE.md](./PLATFORM-GUIDE.md)** — Claude chooses / deploys **many platforms** (Vercel, Railway, Render, Fly, Cloudflare, Supabase, Neon…).
2. **[kb/](./kb/)** — Full knowledge base (copied from the `deployment/` repo).
3. This file — safety + short golden-path stubs.

## Claude safety (FIXED)

```
✅ Read PLATFORM-GUIDE + platform-matrix when choosing/changing provider
✅ Staging/preview first; smoke /health and login
✅ Secrets only in provider/CI — do not invent IDs
✅ Reports must not print secret values

❌ No production deploy without human confirm
❌ Do not invent steps for a platform with no runbook under kb/
❌ Mobile/store release outside MVP unless human asks (advanced/ + kb/mobile)
```

## Golden path MVP (default stubs)

| Layer | Default | Stub in this folder | Runbook |
|---|---|---|---|
| Web | Vercel | `vercel.json` | `kb/web/vercel.md` |
| API | Railway + Docker | `Dockerfile.api` (**Nest/Node only**), `railway.toml` | `kb/backend/docker.md` + adapter `BOOTSTRAP` |
| DB | local-docker / Supabase / Neon | root `docker-compose.yml` | `kb/database/*` |

**Stack runtime:** Nest → Node Dockerfile stub · Laravel / Django → Docker notes in `stacks/<framework>/BOOTSTRAP.md` (see PLATFORM-GUIDE §1.1).

Change platform: edit `stack.config.yaml` → `deploy.*` then follow PLATFORM-GUIDE §3–4.

Short checklist: `checklist.md` · Full checklist: `kb/deployment-checklist.md`

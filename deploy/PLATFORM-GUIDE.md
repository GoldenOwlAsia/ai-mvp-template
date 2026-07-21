# Claude + Multi-platform Deploy

> This doc connects the MVP **boilerplate** to knowledge under `deploy/kb/`.
> **Providers are not assumed:** read `stack.config.yaml` → `deploy.*` + `database.provider`, then open the matching runbook.
> Common MVP combos: Vercel + Railway|Render + Docker API + Postgres (local-docker | Supabase | Neon).
> **Multi-platform:** no guessing, no inventing credentials.

---

## 0. Boilerplate monorepo conventions (FIXED)

When `project.monorepo: true` and Node FE/BE (Nest + React Vite):

| Item | Convention |
|---|---|
| Workspace | Root `pnpm-workspace.yaml` → `packages: ["apps/*"]` |
| FE package name | `@app/web` |
| API package name | `@app/api` |
| App dirs | `frontend.appDir` / `backend.appDir` (defaults `apps/web`, `apps/api`) |
| Install | `pnpm install` at **repo root** after bootstrap |

Stubs (`vercel.json`, `Dockerfile.api`, `render.yaml`) filter these package names — do **not** rename to `{slug}-web`.

Root `vercel.json` / `render.yaml` are what providers read; keep them in sync with copies under `deploy/`.

---

## 1. What Claude must do on deploy

```text
1. Read stack.config.yaml → deploy block + database.provider + backend.framework + appDir
2. Read this doc + deploy/README.md (safety)
3. Read stacks/<backend.framework>/BOOTSTRAP.md → Runtime / Docker section
4. If CHANGING platform / choosing for the first time → deploy/kb/platform-matrix.md
5. Read the layer runbook for the chosen platform (web|backend|database)
6. Fill inputs (env names, project IDs) — do not invent secrets
7. Staging/preview first → smoke → report
8. Production only when human confirms clearly
```

**Forbidden:** auto-deploy prod · invent Railway/Vercel/Render/DB IDs · skip secrets.md · pick K8s for MVP without a reason · use Node `Dockerfile.api` for Laravel/Django.

## 1.1 Runtime by stack adapter

| `backend.framework` | Runtime | Dockerfile guidance |
|---|---|---|
| `nestjs` | Node | Default stub [`Dockerfile.api`](./Dockerfile.api) |
| `laravel` | PHP-FPM + nginx | Generate from `stacks/laravel/BOOTSTRAP.md` — **not** Node stub |
| `django` | Gunicorn / ASGI | Generate from `stacks/django/BOOTSTRAP.md` — **not** Node stub |

Frontend `react-vite` still follows web platform matrix (Vercel default). `frontend.framework: none` → skip SPA deploy.

---

## 2. Platform map (summary)

Full source: [`kb/platform-matrix.md`](./kb/platform-matrix.md).

### Web

| Platform | When | Runbook |
|---|---|---|
| **Vercel** | Default SPA/Vite/Next MVP | [`kb/web/vercel.md`](./kb/web/vercel.md) + root/`deploy/vercel.json` |
| Cloudflare Pages | Static/SPA edge | [`kb/web/alternatives.md`](./kb/web/alternatives.md) |
| Netlify | Small Jamstack | alternatives |
| Firebase Hosting | Firebase-centric FE | alternatives |
| Amplify / S3+CloudFront | Already on AWS | alternatives |

### Backend

| Platform | When | Runbook |
|---|---|---|
| **Railway** | Common MVP API | [`kb/backend/railway.md`](./kb/backend/railway.md) + `railway.toml` |
| **Render** | Simple web service + Docker | [`kb/backend/render.md`](./kb/backend/render.md) + root/`deploy/render.yaml` |
| Docker (anywhere) | Portable boundary | [`kb/backend/docker.md`](./kb/backend/docker.md) + `Dockerfile.api` |
| Fly.io | Multi-region container | [`kb/backend/alternatives.md`](./kb/backend/alternatives.md) |
| Cloud Run | GCP serverless container | alternatives |
| ECS / EC2 / K8s | AWS / large scale | alternatives — **not default MVP** |

### Database

| Platform | When | Runbook |
|---|---|---|
| local-docker | Dev Day 0–1 | root `docker-compose.yml` |
| **Supabase** | PG + optional auth/storage | [`kb/database/supabase.md`](./kb/database/supabase.md) |
| **Neon** | Serverless PG / branching | [`kb/database/neon.md`](./kb/database/neon.md) + [`migration.md`](./kb/database/migration.md) |
| RDS | AWS-governed | matrix |

Always read [`kb/database/migration.md`](./kb/database/migration.md) before migrating prod.

### Mobile

| | |
|---|---|
| Scope | **Outside MVP 3–4 days** |
| Entry | [`kb/mobile/README.md`](./kb/mobile/README.md) + [`../advanced/README.md`](../advanced/README.md) |
| Full Fastlane tree | Keep in root `deployment/` repo — load only when human asks for mobile |

---

## 3. Align with `stack.config.yaml`

```yaml
deploy:
  web: vercel      # vercel | cloudflare-pages | netlify | ...
  api: railway     # railway | render | fly | cloud-run | ...
  container: docker

database:
  provider: local-docker  # local-docker | supabase | neon
```

| When changing `deploy.*` | Claude does |
|---|---|
| Still in the table above | Change config → read the matching runbook under `kb/` → update stubs (`vercel.json` / `render.yaml` / Railway / Dockerfile) |
| Outside the table / no runbook | **Stop and ask a human** — do not invent deploy steps |
| Mobile | Confirm with human — do not open Fastlane on your own |

### Env inventory (cross-provider names)

| Variable | Layer | Typical host |
|---|---|---|
| `VITE_API_URL` | Web build | Absolute API base when web and API hosts differ (invariant §3) |
| `DATABASE_URL` | API | From `database.provider` |
| `JWT_ACCESS_SECRET` | API | API host |
| `WEB_ORIGIN` | API | Browser origin(s) — API host, not web host |
| `PORT` / `NODE_ENV` / `REFRESH_DAYS` | API | Provider + adapter bootstrap |

Deploy invariants (split-host, container, migrate): [`kb/deploy-invariants.md`](./kb/deploy-invariants.md).

---

## 4. Read order by situation

### A. Day 4 MVP (resolve from config)

```text
deploy/README.md
→ PLATFORM-GUIDE.md (this doc) §0 conventions + §3 config
→ kb/environment.md + kb/secrets.md
→ kb for deploy.web (e.g. kb/web/vercel.md)
→ kb/backend/docker.md + kb for deploy.api (railway.md | render.md | …)
→ kb for database.provider (supabase.md | neon.md | local compose)
→ kb/database/migration.md
→ checklist.md / kb/deployment-checklist.md
→ optional: prompts/deploy-from-config.md + skill deploy (ask→act)
→ pnpm preflight:deploy (-- --json)
```

### B. Choose / change platform

```text
kb/platform-matrix.md
→ kb/web/alternatives.md or kb/backend/alternatives.md
→ specific runbook (if any)
→ update stack.config deploy.* / database.provider
→ sync root stubs (vercel.json / render.yaml / railway.toml)
```

### C. Incidents / rollback

```text
kb/troubleshooting.md → kb/rollback.md → release-checklist if prod
```

### D. CI/CD

```text
kb/ci-cd.md → copy workflows from deploy/.github/ into root `.github/` when ready
```

---

## 5. Stubs in `deploy/` vs knowledge in `deploy/kb/`

| Path | Role | Edit? |
|---|---|---|
| `README.md` | Safety + short golden path | FIXED safety |
| `PLATFORM-GUIDE.md` | **Claude multi-platform doc (this file)** | REF / TUNE when adding platforms |
| `Dockerfile.api`, `railway.toml`, `vercel.json`, `render.yaml` | Provider stubs (also root `vercel.json` / `render.yaml`) | TUNE Day 4 |
| `checklist.md` | Short MVP checklist | TUNE |
| `.github/workflows/*` | CI skeleton | TUNE |
| `kb/**` | Multi-platform runbook library | **REF** — prefer upstream updates; avoid casual forks |

---

## 6. Required Claude output after every deploy task

Per the original contract in `kb/00-README-SOURCE.md`:

- Platform chosen + reason (+ alternatives rejected) — must match `stack.config.yaml`
- Env/secrets: present / missing (do not print values)
- Commands run / to run
- Smoke result
- One-line rollback plan
- What still needs human confirm

---

## 7. Quick links

| Need | File |
|---|---|
| Choose platform | [`kb/platform-matrix.md`](./kb/platform-matrix.md) |
| Env 4 tiers | [`kb/environment.md`](./kb/environment.md) |
| Secrets | [`kb/secrets.md`](./kb/secrets.md) |
| CI | [`kb/ci-cd.md`](./kb/ci-cd.md) |
| Web Vercel | [`kb/web/vercel.md`](./kb/web/vercel.md) |
| Other web | [`kb/web/alternatives.md`](./kb/web/alternatives.md) |
| BE Railway | [`kb/backend/railway.md`](./kb/backend/railway.md) |
| BE Render | [`kb/backend/render.md`](./kb/backend/render.md) |
| BE Docker | [`kb/backend/docker.md`](./kb/backend/docker.md) |
| Other BE | [`kb/backend/alternatives.md`](./kb/backend/alternatives.md) |
| DB Neon | [`kb/database/neon.md`](./kb/database/neon.md) |
| DB / migrate | [`kb/database/`](./kb/database/) |
| MVP invariants | [`kb/deploy-invariants.md`](./kb/deploy-invariants.md) |
| Mobile | [`kb/mobile/README.md`](./kb/mobile/README.md) |
| Agent prompt | [`../prompts/deploy-from-config.md`](../prompts/deploy-from-config.md) |

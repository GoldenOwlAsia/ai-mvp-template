# Deploy invariants

> Cross-cutting rules for MVP preview deploys when **web, API, and database may run on different hosts**.  
> Resolve paths and stubs from `stack.config.yaml` + active stack adapters — not from a fixed provider combo.

---

## 1. Layout parity (build → container → runtime)

- Runtime must resolve dependencies the **same way** as local build (workspace layout, hoisting, symlinks).
- Do not copy a subset of install output into the image unless the package-manager graph is preserved.
- Docker/stubs follow `backend.appDir`, `frontend.appDir`, and `project.monorepo` from config — adjust paths when layout differs.

**Adapter:** `stacks/<backend>/BOOTSTRAP.md` → Runtime / Docker.

---

## 2. Native / OS parity

- ORM engines and native addons in the image must match the **container** OS, libc, and TLS stack — not only the dev machine.
- After changing base image or generator settings, rebuild and smoke before promoting preview.

**Adapter:** Prisma / other ORM notes in backend BOOTSTRAP + schema generator block.

---

## 3. Split-host web + API

When `deploy.web` and `deploy.api` are different origins (typical hosted MVP):

| Concern | Invariant |
|---|---|
| SPA → API URL | Build-time web env must use an **absolute** API base when hosts differ |
| CORS | Configure on the **API** host; values must match the browser’s actual origin(s) |
| Refresh cookie | Cross-origin auth requires hosted cookie flags appropriate for cross-site (`Secure` + `SameSite` per adapter) |
| Env placement | Web build vars on web provider; API runtime vars on API provider |

Relative API paths are valid only with same-origin routing or a dev proxy — not when SPA and API are on separate hosts.

**Product contract:** access token in memory + refresh httpOnly cookie (see immutable rules).

---

## 4. Database environment parity

- Run migrations against the **same** `DATABASE_URL` the hosted API will use.
- Local-only migrate does not prepare hosted preview or production.
- Staging migrate before production; application rollback does not revert schema.

**Runbook:** `kb/database/migration.md` + provider runbook for `database.provider`.

---

## 5. Package manager / lockfile discipline

- One package manager per repo (`stack.config` → `project.packageManager`).
- Do not add deploy CLIs as workspace dependencies or mix lockfile formats.
- Hosted CI install uses frozen lockfile — keep manifest and lock in sync.

---

## 6. Provider mode vs stubs

- Use the deployment mode in config (container vs native) and the matching stub/runbook.
- Container deploy: prefer image `CMD` + health path from adapter; provider build/start commands often stay empty.
- If config points to a provider with **no** runbook under `kb/` → stop and ask a human.

---

## 7. Preview URL stability

- Ephemeral preview URLs break cross-service env if set once and never updated.
- Prefer a stable alias or custom domain for values consumed by other hosts (e.g. API `WEB_ORIGIN`).

---

## 8. Minimal smoke (after preview deploy)

- API: `/health`, `/ready` (when applicable)
- CORS preflight from the web origin in use
- Browser network: API traffic targets the **API** host, not the SPA host
- One auth or domain write path after hosted DB migrate

---

## Related

- [`../PLATFORM-GUIDE.md`](../PLATFORM-GUIDE.md)
- [`../checklist.md`](../checklist.md)
- `stacks/<backend>/BOOTSTRAP.md`, `stacks/<frontend>/BOOTSTRAP.md`
- `.claude/skills/deploy/SKILL.md`

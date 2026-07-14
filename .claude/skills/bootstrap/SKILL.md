---
name: bootstrap
description: Scaffold apps from stack.config using stacks/* adapters
---

# Bootstrap

1. Read `stack.config.yaml` + `CLAUDE.md`.
2. `node scripts/validate-stack-config.mjs` then `apply-stack-config.mjs`.
3. Open `stack.manifest.json` → `adapters.backend` (and frontend if not null).
4. Follow that adapter's `BOOTSTRAP.md` exactly (nestjs | laravel | django | react-vite).
5. Create `backend.appDir` / `frontend.appDir`; pin packages from config only.
6. Install via `adapters.packageManagers`.
7. Report checklist. Never assume NestJS. No deploy.

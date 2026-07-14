# Day 1 — Bootstrap apps + Auth foundation

## Goals

Create `apps/` using the **active stack adapters**, then auth + sample CRUD.

## 1. Bootstrap

Use `prompts/bootstrap-from-config.md` / skill `bootstrap`:

1. Read `stack.manifest.json` → `adapters.backend` / `adapters.frontend`
2. Follow that folder’s `BOOTSTRAP.md` (not a hardcoded Nest checklist)
3. Install with catalog package managers (`pnpm` / `composer` / `poetry` as listed)
4. `docker compose up -d` if local-docker

## 2. Auth + domain feature

1. Confirm `docs/features/auth.md` then first domain feature
2. One prompt per layer using adapter order (`generate-input-layer` → service → HTTP)
3. FE only if `frontend.framework` ≠ `none`

## Gate

- [ ] App dirs exist and health works
- [ ] Auth flows; soft-delete; no password leakage
- [ ] Code matches chosen framework adapter
- [ ] Deps ⊆ stack.config

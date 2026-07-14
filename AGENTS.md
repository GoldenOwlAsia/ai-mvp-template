# Agents

Follow `CLAUDE.md`, `stack.config.yaml`, and `stacks/catalog.json`.

## Hard rules

1. Resolve stack via `backend.framework` / `frontend.framework` → load adapter CONVENTION + BOOTSTRAP.
2. Install packages only from `stack.config.yaml` after validate/apply.
3. Soft delete only. Auth: access memory + refresh httpOnly cookie.
4. One task per prompt. Confirm features before coding.
5. Never invent secrets. Never production-deploy without confirmation.
6. No `apps/` in the base — create via bootstrap using the **active** adapters (not Nest by default).

## Layout

- `stacks/` — nestjs | laravel | django | react-vite adapters
- `docs/` — product blank / example / features
- `prompts/` — init-product, bootstrap, generate-*
- `deploy/` — multi-platform guide + kb

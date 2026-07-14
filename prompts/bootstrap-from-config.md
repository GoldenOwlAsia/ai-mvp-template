# Prompt: Bootstrap from stack.config

## CONTEXT
Docs+config base — no `apps/` yet. Stack is **dynamic**: NestJS, Laravel, or Django (+ optional React Vite) via `stack.config.yaml` and `stacks/`.

## INPUT
- `stack.config.yaml` / `stack.manifest.json` (after apply)
- `stacks/catalog.json`
- Adapter: `stacks/<backend.framework>/BOOTSTRAP.md` + `CONVENTION.md`
- If FE ≠ none: `stacks/<frontend.framework>/BOOTSTRAP.md`
- `CLAUDE.md`

## TASK
1. Validate + apply stack config.
2. Read the **active** backend adapter BOOTSTRAP — scaffold **only that** framework into `backend.appDir`.
3. If frontend is not `none`, scaffold FE per its adapter into `frontend.appDir`.
4. Pins: exact versions from config packages only.
5. `.env.example` + docker-compose if `local-docker`.
6. Do not implement full product features unless asked — skeleton + install first.

## OUTPUT
- New app tree(s)
- Checklist: validate / apply / which adapters used / install commands for catalog packageManagers
- Next: Day 1 auth via `docs/features/auth.md` using adapter layer order

## CONSTRAINT
- Do not default to NestJS if config says laravel/django
- No packages outside config; no deploy; no invent secrets

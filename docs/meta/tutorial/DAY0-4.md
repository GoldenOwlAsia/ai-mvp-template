# Tutorial Day 0–4

## Day 0 — Config + Docs

1. Copy `stack.config.example.yaml` → `stack.config.yaml`, edit name / locale / versions / `features.*`.
2. Run one bootstrap prompt (or validate + apply + `pnpm i`).
3. Fill or fork docs: PRD → Architecture → Database → API → `features/*.md`.
4. Checkpoint: AI summarizes requirements → you confirm.

## Day 1 — Foundation

1. Prisma schema + migrate + seed.
2. Auth module (register/login/refresh/logout).
3. FE axios client + token memory + refresh cookie.
4. Gate: auth e2e green; `prisma validate`.

## Day 2–3 — Feature loop

For each feature file:

1. Confirm the spec.
2. Generate DTO → Service → Controller → Module (separate prompts).
3. FE: types → service → hooks → components → page.
4. Tests from AC (GIVEN/WHEN/THEN).
5. Checkpoint build + AC before the next feature.

## Day 4 — Deploy

1. Fill `.env.example` per `deploy:` in config.
2. Docker API + Railway; FE Vercel preview.
3. Migrate once; smoke `/` and `/health`.
4. No production deploy without human confirm.
5. Report per deployment checklist (secrets never logged as values).

# Deploy from stack.config (interactive agent)

Reusable Day-4 / ops prompt for **any** product from this boilerplate.

Trigger examples: “deploy”, “deploy preview”, “continue deploy”, “preflight deploy”.

## Goal

Drive deploy as **ask → act**: discover gaps, **ask the human one question at a time**, then build/migrate/preview/smoke. Never invent secrets. Never auto-deploy production.

## Agent steps

### A. Preflight first

```bash
pnpm preflight:deploy -- --json
# equivalent: node scripts/deploy-preflight.mjs --json
```

Follow `.claude/skills/deploy/SKILL.md` (sequential ask mode).

### B. Branch on `status`

| status | Action |
|---|---|
| `blocked` | List hard gaps; stop |
| `needs_input` | Ask **only** `nextQuestion` (or first unanswered in `questions[]`); **end turn** |
| `ready` | Act (or ask `scope` once if not yet set) |

### C. Sequential question gate (REQUIRED)

- **One question per assistant message** — never batch.
- After each human answer: store it → ask the next unanswered required question → stop.
- Skip `optional: true` until Act needs that value.
- Example single reply from human: `preview` or `scope=preview` or `login_cli`.

When the required queue is empty:

1. Re-run preflight
2. If still `needs_input`, ask the new next question
3. Else go to **D. Act**

### D. Act (preview / local)

1. Read matching `deploy/kb` runbooks for `deploy.web` / `deploy.api` / `database.provider`
2. Local builds: `@app/web`, Nest `Dockerfile.api` when applicable
3. DB migrate when URL present (Nest: `prisma migrate deploy`)
4. Deploy API → note URL (do not invent)
5. If URLs now known and env still missing → ask **one** follow-up (`WEB_ORIGIN` / `VITE_API_URL`), then continue
6. Deploy web; smoke `/health` `/ready` + web load

### E. Production

Only if `scope=production` **and** human sends an explicit production confirm in a later message. Otherwise refuse and offer preview.

### F. Report

- Config providers + stub files
- Preflight status / gaps (names only)
- Answers applied (no secrets)
- URLs, smoke, rollback one-liner
- Remaining human actions

## Forbidden

- Asking multiple questions in one turn
- Skipping the question gate when `needs_input`
- Inventing credentials or project IDs
- Committing `.env` secrets
- Using Node `Dockerfile.api` for Laravel/Django
- Production without explicit confirm

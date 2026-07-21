---
name: deploy
description: >-
  Interactive deploy agent — preflight gaps, ask ONE question at a time,
  then preview-deploy from stack.config. Never invent credentials; never
  auto-deploy production.
---

# Deploy agent (ask → act)

Use this skill when the human wants to deploy, preflight deploy, or continue a deploy after answering questions.

## Hard rules

```
✅ Read stack.config.yaml for providers (never assume Railway)
✅ Run node scripts/deploy-preflight.mjs --json first
✅ STOP and ASK when status is needs_input or blocked
✅ Ask exactly ONE unanswered question per turn — never batch
✅ Preview/staging by default; production only after explicit typed confirm
✅ Secrets: prefer env/provider dashboard; never commit; never invent; never echo values in reports
✅ Nest Docker only via deploy/Dockerfile.api; Laravel/Django → adapter BOOTSTRAP

❌ Do not invent Vercel/Render/Railway/Neon IDs or tokens
❌ Do not skip questions and “guess” answers
❌ Do not list multiple questions in one message
❌ Do not deploy production without human typing a clear confirm (e.g. "deploy production")
```

## Loop

```text
1. Intake
2. Preflight
3. Pick next unanswered question (order in JSON `questions`)
4. Ask THAT one question only → end turn
5. On reply → save answer → re-preflight if useful → next question
6. When no required questions left → Act
7. Report
```

### 1. Intake

Read:

- `stack.config.yaml` → `deploy.*`, `database.provider`, frameworks, `appDir`
- `deploy/PLATFORM-GUIDE.md` §0–4
- Matching `deploy/kb/**` runbooks for configured providers only
- If provider has **no** runbook → stop and ask human (do not invent steps)

### 2. Preflight

```bash
node scripts/deploy-preflight.mjs --json
# or: pnpm preflight:deploy -- --json
```

Parse JSON:

| `status` | Agent behavior |
|---|---|
| `blocked` | Show hard gaps; tell human how to fix; **do not deploy** |
| `needs_input` | Ask **one** question (see §3); **wait** |
| `ready` | If `scope` not answered this session, ask scope once; else Act |

Keep a session answer map: `{ questionId: value }`. Re-run preflight after secrets/env may have changed.

Use `nextQuestion` from preflight JSON when present (first still-relevant unanswered id).

### 3. One question per turn (REQUIRED)

**Never** dump the full questionnaire. Each assistant turn that needs input must contain **exactly one** question.

Order: follow `questions[]` array order from preflight. Skip ids already answered in this session. Skip `optional: true` until Act needs them (e.g. ask `web_origin` only after a web URL exists).

Format:

```markdown
## Deploy — question 2/6

Providers: web=`vercel` · api=`render` · database=`neon`  
Answered so far: `scope=preview`

**vercel_auth** — How will you authenticate Vercel?
- `login_cli` — run `npx vercel login`, then say continue
- `token` — set `VERCEL_TOKEN` in shell / Cursor env
- `dashboard` — you deploy in Vercel UI; agent prepares checklist only

Reply with one value (e.g. `login_cli`).
```

Progress `N/M` = current index among **remaining required** questions (or total required in queue).

Question `type` handling:

| type | Behavior |
|---|---|
| `choice` | Show options; accept option `value` only |
| `secret` | Ask to set env/dashboard; if pasted, use once — do not echo/commit |
| `text` | Accept string; optional → defer |
| `confirm` | yes/no |

Default `scope` = `preview` only after asking (or if human already said “preview” / “deploy preview”).

### 4. Wait

After asking one question → **end the turn**. Do not start builds/cloud deploy until that answer arrives.

On human reply:

1. Record the answer
2. Briefly acknowledge (one line, no secret values)
3. Either ask the **next** single question, or proceed to Act if queue empty

### 5. Act (after required answers)

Order:

1. Local verify (Node monorepo defaults):
   - `pnpm install` (respect lockfile discipline — invariant §5)
   - `pnpm --filter @app/web build` (if FE ≠ none)
   - `docker build -f deploy/Dockerfile.api -t api:local .` (Nest only)
2. Database:
   - `local-docker` → `docker compose up -d`
   - hosted provider → `DATABASE_URL` present; migrate against **hosted** URL before auth smoke (invariant §4)
3. API host per `deploy.api` runbook + container/native mode from config (invariant §6)
4. If cross-host env still needed → ask **one** question (`WEB_ORIGIN` / web API base URL), then continue (invariant §3)
5. Web host per `deploy.web` runbook; redeploy after build-time env changes
6. Smoke per `deploy/kb/deploy-invariants.md` §8
7. If `scope=production` → **stop** until human types explicit production confirm

Read [`deploy/kb/deploy-invariants.md`](../../deploy/kb/deploy-invariants.md) when split-host or container issues appear.

### 6. Report (every turn that acts)

- Platforms (from config) + stubs used
- Preflight status + remaining gaps (**names only**)
- Answers applied (no secret values)
- URLs (preview)
- Smoke results
- One-line rollback
- What still needs human action

## References

- Prompt: `prompts/deploy-from-config.md`
- Preflight: `scripts/deploy-preflight.mjs`
- Guide: `deploy/PLATFORM-GUIDE.md`
- Invariants: `deploy/kb/deploy-invariants.md`
- Question catalog: `.claude/skills/deploy/reference.md`

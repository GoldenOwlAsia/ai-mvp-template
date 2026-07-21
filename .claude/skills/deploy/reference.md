# Deploy agent — question catalog

Generated/extended by `scripts/deploy-preflight.mjs`. Agents should prefer the live JSON `questions` + `nextQuestion` over this static list.

## Ask mode (FIXED)

**Sequential only:** ask one unanswered question per turn, in array order. Do not batch.

## Core questions (typical order)

| id | When | Intent |
|---|---|---|
| `scope` | Always first | `preview` \| `local` \| `production` |
| `vercel_auth` | `deploy.web=vercel` and no CLI/token | How to auth Vercel |
| `render_auth` | `deploy.api=render` and no CLI/key | How to auth Render |
| `railway_auth` | `deploy.api=railway` and no CLI/token | How to auth Railway |
| `database_url` | `database.provider=neon` and no `DATABASE_URL` | Staging connection string or switch local-docker |
| `jwt_secret` | `JWT_ACCESS_SECRET` missing in shell | Provide / already on provider / generate local-only |
| `web_origin` | Optional — after FE URL exists | CORS cookie origin |
| `vite_api_url` | Optional — after API URL exists | Absolute FE API base |
| `continue_after_answers` | Last required before Act | Confirm agent may proceed |

## Production gate

If `scope=production`, require an additional human message that clearly confirms production (e.g. contains `deploy production` or `confirm production`). Do not treat a casual “go” as enough.

## Secret handling

- Prefer: human sets env in shell / provider UI; agent re-runs preflight.
- If pasted in chat: use for the session action only; never write into git-tracked files; never reprint in full in the final report.
- Report only: `DATABASE_URL=present|missing`, never the value.

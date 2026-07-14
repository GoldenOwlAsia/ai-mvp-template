# Best Practices — Claude MVP Combine

Distilled from `mvp_claude/best-practice.md`, `prompt-strategy.md`, `workflow.md`, and `deployment/README.md`.

---

## 1. Docs

- One file per feature (`docs/features/auth.md`, …) — AI loads only the right context.
- Prefer concrete numbers over vague wording (password ≥8 chars + upper + digit; upload ≤10MB jpeg/png).
- Edge Cases include HTTP status + clear error `code`.
- Show one sample artifact (1 Prisma model / 1 endpoint / 1 module) then say “follow this pattern”.
- Docs >500 lines → split; Architecture must not hardcode versions (point to `stack.config.yaml`).

## 2. Prompt

Five parts: **CONTEXT / INPUT / TASK / OUTPUT / CONSTRAINT**.

- Confirm-first: summarize requirements → wait for confirm → then code.
- One prompt, one task (do not combine DTO+Service+Controller+Test).
- Negative constraints: “no new deps”, “no files outside the list”, “no hard delete”.
- Do not assume memory across sessions — always `@` the needed files.

## 3. Workflow (Phase 0→4)

| Phase | Work | Gate |
|---|---|---|
| 0 | `stack.config` + docs | Config validate; docs confirm |
| 1 | Schema + Auth + FE client | `prisma validate`, auth e2e |
| 2 | Feature loop BE→FE→Test | Build + feature AC pass |
| 3 | Review / security / AC matrix | DoD checklist |
| 4 | Deploy preview | `/health` smoke; no auto prod |

## 4. Immutable contracts

- JWT access (memory) + Refresh httpOnly cookie
- PK `cuid()`; soft delete `deletedAt`
- Error: `statusCode, code, message, timestamp, path`
- Module: DTO → Service → Controller → Module
- Upload: presigned URL
- API: no PUT; PATCH only; soft DELETE
- Dependency: only from `stack.config.yaml`

## 5. Deploy safety

- Do not invent secrets / credential IDs
- Commit only `.env.example`
- Docker: `0.0.0.0` + `PORT` + `/health`
- Migrate once; build-once-promote
- Golden path: Vercel (FE) + Railway (BE) + Supabase/Neon (DB) + GitHub Actions
- Mobile/Fastlane = advanced, outside Day 1–4

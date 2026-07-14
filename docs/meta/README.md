# Claude MVP Combine — Summary

> This folder combines best practices from `mvp_claude/` (AI coding OS) + `deployment/` (ops/deploy OS) into a blueprint so Claude can build a basic CRUD SaaS (Trello / Todoist) in **3–4 days**.

**Origins**

| Path | Role |
|---|---|
| `/Users/mac/Downloads/mvp_claude` | Docs, workflow, prompt strategy, CLAUDE.md |
| `/Users/mac/Downloads/deployment` | Platform matrix, env/secrets, Vercel/Railway/Docker/Supabase |

**Status:** Summary + blueprint (markdown). Starter code / scripts / rules are implemented when the full plan is approved.

---

## Read in this order

1. [BEST-PRACTICES.md](./BEST-PRACTICES.md) — principles for stable AI coding
2. [BLUEPRINT.md](./BLUEPRINT.md) — target template structure
3. [STACK-CONFIG.md](./STACK-CONFIG.md) — fill language / framework / version → one install prompt
4. [MCP-AND-PACKAGES.md](./MCP-AND-PACKAGES.md) — recommended MCP + packages
5. [tutorial/DAY0-4.md](./tutorial/DAY0-4.md) — 3–4 day path
6. [references/SOURCE-MAP.md](./references/SOURCE-MAP.md) — map to source files

---

## Core ideas (1 minute)

```
Docs = source of truth
stack.config.yaml = versions + deps (AI must not guess)
CLAUDE.md = pointer + immutable rules
1 prompt = 1 task + checkpoint
Deploy = Vercel + Railway + Postgres (no auto-deploy prod)
```

**AI may:** follow docs + feature files; install exact versions from config; soft-delete, cuid, JWT+cookie, DTO→Service→Controller→Module.

**AI may not:** add features/deps outside config; hard delete; expose password/token; deploy prod without confirm.

---

## MVP Slim Profile

**In:** Auth, 1 domain CRUD, soft-delete, list/filter/pagination, loading/empty/error, deploy preview.

**Out:** BullMQ, full R2, full Sentry, billing, realtime, mobile/Fastlane, complex multi-tenant orgs.

---

## Next step

Approve the plan → Agent mode scaffolds the real repo per BLUEPRINT.md, starting from `stack.config` + bootstrap.

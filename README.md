# ai-mvp-template — Base (docs + config + stack adapters)

Generate any CRUD-style MVP with an AI coding assistant (Claude / Cursor). **Product workflow is the same**; **NestJS / Laravel / Django** (and React Vite FE) are chosen in config and implemented via `stacks/` adapters.

This repo (`ai-mvp-template`) is a **docs + config OS**. It does **not** ship ready `apps/` code — apps are generated at bootstrap from the active stack adapter.

## Quick start

```bash
cp stack.config.examples/nestjs-react.yaml stack.config.yaml   # or laravel-react / django-react
node scripts/validate-stack-config.mjs
node scripts/apply-stack-config.mjs
pnpm install   # root tooling; backend may also need composer / poetry per catalog
```

Then either:

- Generic: `prompts/init-product.md` → confirm docs → `prompts/bootstrap-from-config.md`
- Trello sample pack: follow [`tutorial/prompts-trello/`](./tutorial/prompts-trello/) (`P00` → `P23`)

## Folder structure and meaning

```text
ai-mvp-template/
├── CLAUDE.md / AGENTS.md     # AI entry: read order + hard rules
├── stack.config.yaml         # ★ Chosen stack, pins, features, deploy
├── stack.config.examples/    # Ready Nest / Laravel / Django + React configs
├── stacks/                   # Per-framework adapters (convention + bootstrap)
├── scripts/                  # validate / apply config
├── prompts/                  # Reusable generation prompts (stack-agnostic)
├── docs/                     # Product docs (blank + example + features)
├── deploy/                   # Multi-platform deploy guide + kb
├── tutorial/                 # Day 0–4 + sample prompt packs
├── .cursor/rules/            # Cursor always-on contracts
├── .claude/skills/           # Agent skills (bootstrap, deploy, …)
└── (apps/ — NOT in base; created by bootstrap)
```

| Path | Meaning | You usually… |
|---|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | First file for the AI agent: what to read, product contracts | Leave as-is; fill project name via config |
| [`AGENTS.md`](./AGENTS.md) | Short mirror for Cursor/agents | Leave as-is |
| [`stack.config.yaml`](./stack.config.yaml) | Source of truth: `backend.framework`, FE, package pins, feature flags, deploy targets | **Edit** every new app / stack switch |
| [`stack.config.examples/`](./stack.config.examples/) | Copy-paste configs for Nest, Laravel, Django (+ React) | Copy → `stack.config.yaml` |
| [`stacks/`](./stacks/) | Adapters: `CONVENTION.md`, `BOOTSTRAP.md`, `packages.example.yaml` + [`catalog.json`](./stacks/catalog.json) allow-list | **Use**; add a folder only for a *new* framework |
| [`scripts/`](./scripts/) | `validate-stack-config.mjs` (fail-fast) · `apply-stack-config.mjs` (manifest + root tooling) | Run after editing config |
| [`prompts/`](./prompts/) | Generic prompts: init-product, bootstrap, input/service/HTTP/FE, tests, security | Reference from chat / sample packs |
| [`docs/`](./docs/) | Product specs | **Edit** features for your app |
| `docs/_blank/` | Empty PRD / Architecture / API / … templates | Fill for a new product |
| `docs/features/` | Per-feature specs for **your** app | **Edit** ★ before coding (empty in base) |
| `docs/_example-taskflow/` | Filled Kanban tutorial example (+ `features/`) | Copy for tutorial only — see `EXAMPLE.md` |
| [`docs/FOLDER-GUIDE.md`](./docs/FOLDER-GUIDE.md) | Full EDIT / FIXED / GEN / REF map | Read when unsure what to touch |
| [`deploy/`](./deploy/) | Platform guide, checklists, Docker/Railway/Vercel stubs, `kb/` runbooks | Day 4; change providers via guide + config |
| [`tutorial/`](./tutorial/) | Day 0–4 walkthrough | Follow in order |
| [`tutorial/prompts-trello/`](./tutorial/prompts-trello/) | Copy-paste P00–P23 for a Trello-like build | Run one file per chat step |
| `.cursor/rules/` | Immutable product rules + stack resolution | Do not weaken contracts |
| `.claude/skills/` | `/bootstrap`, generate-feature, review, deploy | Use when available |
| `stack.manifest.json` | Generated snapshot of resolved adapters | Re-run `apply:stack` — don’t hand-edit |
| `apps/` | Generated API/web (or FE none) | **Missing on purpose** until bootstrap |

### How the pieces fit

```text
stack.config.yaml  →  stacks/<framework>/  →  bootstrap apps/
docs/features/*    →  prompts/generate-*   →  feature code
deploy/PLATFORM-GUIDE + stacks/*/BOOTSTRAP runtime  →  staging deploy
```

Switching Nest ↔ Laravel ↔ Django **does not** change the product workflow — only which adapter folder the agent loads. New languages/frameworks need a new `stacks/<name>/` + catalog entry.

## Intentionally missing

- Ready `apps/` source — generated at bootstrap per adapter
- Infinite free-typed stacks without an adapter — validate will fail by design

## Docs

- Folder map (detail): [`docs/FOLDER-GUIDE.md`](./docs/FOLDER-GUIDE.md)
- Deploy: [`deploy/PLATFORM-GUIDE.md`](./deploy/PLATFORM-GUIDE.md)
- AI rules: [`CLAUDE.md`](./CLAUDE.md)
- Trello/TaskFlow sample prompts: [`tutorial/prompts-trello/`](./tutorial/prompts-trello/)

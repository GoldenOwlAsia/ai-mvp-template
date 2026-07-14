# Sample prompts — TaskFlow (Trello-like MVP)

Copy-paste prompts for building a Kanban/Trello-style app with this template.
**One prompt = one job.** Confirm docs before bootstrap; do not switch stack mid-loop.

## Prerequisites

```bash
cp stack.config.examples/nestjs-react.yaml stack.config.yaml   # or laravel-react / django-react
node scripts/validate-stack-config.mjs
node scripts/apply-stack-config.mjs
```

Use Context7 when generating framework code. Adapters: `stacks/<backend.framework>/`.

## Order

| Day | Prompts |
|---|---|
| 0 | `P00` → `P01` → confirm → |
| 1 | `P03` → `P04`–`P08` |
| 2 | `P09`–`P12` |
| 3 | `P13`–`P21` |
| 4 | `P22`–`P23` |

DnD / realtime / notifications: keep **Out of Scope** unless you extend `docs/features/`.

Generic prompt templates live in repo `prompts/`; these files are product-specific runners that reference them.

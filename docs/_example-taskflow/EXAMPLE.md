# TaskFlow example (tutorial only)

Filled Kanban/Trello-style product docs for the **tutorial track** — not the default boilerplate.

## Use for tutorial

```bash
cp stack.config.examples/taskflow-kanban.yaml stack.config.yaml
cp docs/_example-taskflow/*.md docs/
cp -r docs/_example-taskflow/features docs/
node scripts/validate-stack-config.mjs
node scripts/apply-stack-config.mjs
```

Then follow [`tutorial/prompts-trello/`](../../tutorial/prompts-trello/) (`P00` → `P23`).

## Do not copy into a new generic app

For a greenfield product, use `docs/_blank/` + `prompts/init-product.md` and keep `docs/features/` empty until you define your own features.

# Day 0 — Stack config and docs

## Goals

Choose **framework** (Nest / Laravel / Django) + fill product docs. No `apps/` yet.

## Steps

1. Copy an example:

```bash
cp stack.config.examples/nestjs-react.yaml stack.config.yaml
# or laravel-react.yaml / django-react.yaml
```

2. Edit `project.name`, packages if needed, `features.*`.

```bash
node scripts/validate-stack-config.mjs
node scripts/apply-stack-config.mjs
```

3. Optional: `prompts/init-product.md` with a one-sentence idea.
4. Or use `_example-taskflow/` / fill `_blank/` + `docs/features/`.
5. Checkpoint: confirm requirements. Note which adapters `stack.manifest.json` resolved.

## Done when

- Validate OK for the chosen `backend.framework`
- Docs ready; still no requirement to invent Nest if you picked Laravel/Django

## Sample prompt pack

Trello/TaskFlow copy-paste prompts: [`prompts-trello/`](./prompts-trello/).

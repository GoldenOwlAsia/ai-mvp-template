# Docs

**Repo map:** [FOLDER-GUIDE.md](./FOLDER-GUIDE.md)

| Path | When | Edit? |
|---|---|---|
| `_blank/` | New app — copy or fill via `prompts/init-product.md` | **EDIT** |
| `_example-taskflow/` | Filled Kanban tutorial example (+ `features/`) | **REF** |
| `features/` | Your product's feature specs (empty in base) | **EDIT** ★ |
| `meta/` | Workflow / prompt strategy | **REF** |

There is **no** filled `docs/PRD.md` at repo root in the base — that would pre-bake one product. After init, active docs live at `docs/PRD.md`, `docs/API.md`, … (copied from `_blank/` or the example).

Stack choice: `../stack.config.yaml` + `../stacks/` — not duplicated in Architecture prose.

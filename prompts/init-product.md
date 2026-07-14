# Prompt: Init product (domain)

## CONTEXT
Stack is already chosen in `stack.config.yaml`. This prompt fills **product docs only** — same workflow for any backend adapter.

## INPUT
- One-sentence product idea from the user
- `docs/_blank/` templates
- `docs/_blank/feature-template.md`

## TASK
1. Summarize the product (persona, goals, P0 features) — wait for confirm if unclear.
2. Fill `docs/_blank/PRD.md` (or copy to active docs path) from the idea.
3. Draft `docs/features/<name>.md` for each P0 feature (auth if `features.auth`, plus domain CRUD).
4. List Architecture touches that are **domain-only** (entities, APIs) — point stack details to `stack.config` + adapter.
5. Do **not** scaffold apps or install packages here.

## OUTPUT
- Updated docs paths
- Feature file list
- Suggested next prompt: bootstrap OR generate first feature layer

## CONSTRAINT
- No stack lock-in language in PRD (say "API" not "Nest controller")
- Out of scope must be explicit

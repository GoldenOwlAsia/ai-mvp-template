# Prompt: Generate input layer

## CONTEXT
Active backend adapter: read `stacks/<backend.framework>/CONVENTION.md` (FormRequest / DTO / Serializer).

## INPUT
- `docs/features/[feature].md` API + entities
- `stack.manifest.json` → adapters.backend

## TASK
Create only the input-validation layer for this feature (one module).

## OUTPUT
Files for that layer only + short summary.

## CONSTRAINT
One layer only. No service/controller yet. No new deps. Soft-delete aware filters.

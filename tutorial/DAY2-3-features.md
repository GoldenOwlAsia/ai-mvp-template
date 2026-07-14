# Day 2–3 — Feature loop

## Rule

One feature file → one vertical slice. One prompt, one artifact (DTO, then service, then controller, …).

## Loop (per `docs/features/[name].md`)

1. Agent summarizes the feature → **you confirm**
2. Backend: DTO → Service → Controller → Module (wire into `AppModule`)
3. Frontend: types → API calls → TanStack Query hooks → UI → page route
4. Tests mapped to Acceptance Criteria (GIVEN / WHEN / THEN)
5. Soft delete + cuid ids; never invent packages outside `stack.config.yaml`

## Suggested order (Taskflow)

1. Auth (Day 1 baseline)
2. Project
3. Task
4. Comment

Stop after each feature’s AC is green before starting the next.

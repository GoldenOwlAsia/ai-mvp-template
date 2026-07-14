---
name: generate-feature
description: Generate one feature using active stack adapter layer order
---

# Generate feature

1. Read `docs/features/[name].md` — summarize — WAIT for confirm.
2. Read `stacks/<backend.framework>/CONVENTION.md` for layer names.
3. Backend layers separately via prompts (input → service → HTTP).
4. Frontend if configured: `stacks/<frontend.framework>/CONVENTION.md`.
5. Tests from AC. No deps outside stack.config.

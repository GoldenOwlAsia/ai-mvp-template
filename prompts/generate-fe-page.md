# Prompt: Generate FE page

## CONTEXT
Only if `frontend.framework` ≠ `none`. Follow `stacks/<frontend.framework>/CONVENTION.md`.

## INPUT
Feature UI + API types.

## TASK
Adapter generation order (react-vite: types → service → hooks → components → page).

## OUTPUT
Listed FE files only.

## CONSTRAINT
Packages ⊆ stack.config. Loading/empty/error required.

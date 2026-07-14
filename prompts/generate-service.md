# Prompt: Generate service

## CONTEXT
Follow `stacks/<backend.framework>/CONVENTION.md` service pattern. Product contracts: soft-delete, no password leakage.

## INPUT
Feature file + existing input layer.

## TASK
Business logic methods with permission checks and error `code`s from docs.

## OUTPUT
Service file(s) only.

## CONSTRAINT
No HTTP layer. No hard delete. No new deps.

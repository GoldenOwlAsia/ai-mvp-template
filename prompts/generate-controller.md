# Prompt: Generate HTTP layer

## CONTEXT
Adapter HTTP idiom: Nest controller / Laravel controller / Django viewset — from CONVENTION.md.

## INPUT
Feature API table + existing service.

## TASK
Wire routes: PATCH not PUT; DELETE = soft delete; auth guards per docs.

## OUTPUT
HTTP layer + route registration notes only.

## CONSTRAINT
Thin HTTP layer. No new deps.

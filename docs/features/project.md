# Feature: Project

## Overview
CRUD projects owned by the authenticated user. Soft delete only.

## API
| Method | Path | Auth |
|---|---|---|
| GET | /api/v1/projects | Bearer | list mine (deletedAt null) |
| POST | /api/v1/projects | Bearer | create |
| GET | /api/v1/projects/:id | Bearer | owner only |
| PATCH | /api/v1/projects/:id | Bearer | owner only |
| DELETE | /api/v1/projects/:id | Bearer | soft delete |

## Entities
Project: id, name, description?, ownerId, createdAt, updatedAt, deletedAt

## Business Rules
- Owner = creator
- List excludes soft-deleted
- Name 1–100 chars

## Edge Cases
- Not found / not owner → 404 PROJECT_NOT_FOUND
- Empty name → 400 VALIDATION_ERROR

## Out of Scope
Members, invites, roles beyond owner (extend later).

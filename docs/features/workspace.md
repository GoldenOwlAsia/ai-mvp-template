# Feature: Workspace

## Overview
CRUD workspaces. Creator becomes Workspace OWNER. Soft delete cascades to boards (soft).

## API
| Method | Path | Auth |
|---|---|---|
| GET | /api/v1/workspaces | Bearer | list mine |
| POST | /api/v1/workspaces | Bearer | create |
| GET | /api/v1/workspaces/:id | Workspace member |
| PATCH | /api/v1/workspaces/:id | Owner |
| DELETE | /api/v1/workspaces/:id | Owner | soft + cascade |

## Entities
Workspace, WorkspaceMember

## Business Rules
- Name 1–100 chars
- List excludes soft-deleted
- Soft-delete workspace → soft-delete all boards in workspace (and their lists/cards)

## Edge Cases
- Not member → 404 WORKSPACE_NOT_FOUND
- Empty name → 400 VALIDATION_ERROR

## Out of Scope
Workspace invites (board invites only in v1)

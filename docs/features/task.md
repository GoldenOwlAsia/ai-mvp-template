# Feature: Task

## Overview
Tasks belong to a project. Status TODO | IN_PROGRESS | DONE. Soft delete.

## API
| Method | Path | Auth |
|---|---|---|
| GET | /api/v1/projects/:projectId/tasks | Bearer |
| POST | /api/v1/projects/:projectId/tasks | Bearer |
| GET | /api/v1/tasks/:id | Bearer |
| PATCH | /api/v1/tasks/:id | Bearer |
| DELETE | /api/v1/tasks/:id | Bearer | soft delete |

## Entities
Task: id, title, description?, status, projectId, assigneeId?, createdAt, updatedAt, deletedAt

## Business Rules
- Must own parent project
- Status transitions: TODO→IN_PROGRESS→DONE; DONE→IN_PROGRESS; any→TODO only via explicit PATCH status
- Title 1–200 chars

## Edge Cases
- Project missing → 404 PROJECT_NOT_FOUND
- Task missing → 404 TASK_NOT_FOUND
- Invalid status → 400 VALIDATION_ERROR

## Out of Scope
Kanban DnD optimistic sync, labels, attachments, comments (see comment.md).

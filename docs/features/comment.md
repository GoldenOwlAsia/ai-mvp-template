# Feature: Comment

## Overview
Comments on tasks. Soft delete. Author can edit/delete own comments.

## API
| Method | Path | Auth |
|---|---|---|
| GET | /api/v1/tasks/:taskId/comments | Bearer |
| POST | /api/v1/tasks/:taskId/comments | Bearer |
| PATCH | /api/v1/comments/:id | Bearer | author |
| DELETE | /api/v1/comments/:id | Bearer | author soft delete |

## Entities
Comment: id, body, taskId, authorId, createdAt, updatedAt, deletedAt

## Business Rules
- Body 1–2000 chars
- Author = current user on create

## Edge Cases
- Task missing → 404 TASK_NOT_FOUND
- Not author → 403 FORBIDDEN

## Out of Scope
Mentions, reactions, rich text.

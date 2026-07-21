# Feature: Comment

## Overview
Comments on cards. Soft delete. Author can edit/delete own comments.

## API
| Method | Path | Auth |
|---|---|---|
| GET | /api/v1/cards/:cardId/comments | Board member |
| POST | /api/v1/cards/:cardId/comments | Member+ |
| PATCH | /api/v1/comments/:id | Author |
| DELETE | /api/v1/comments/:id | Author | soft delete |

## Entities
Comment: id, body, cardId, authorId, createdAt, updatedAt, deletedAt

## Business Rules
- Body 1–2000 chars
- Author = current user on create
- Viewer cannot create

## Edge Cases
- Card missing → 404 CARD_NOT_FOUND
- Not author → 403 FORBIDDEN

## Out of Scope
Mentions, reactions, rich text

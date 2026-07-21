# TaskFlow — API

**Base:** `/api/v1`  
**Auth:** `Authorization: Bearer <access>` unless noted  
**Errors:** `{ statusCode, code, message, timestamp, path }`  
**Verbs:** GET, POST, PATCH, DELETE (soft). No PUT.

## Permission matrix (Board)

| Action | Owner | Admin | Member | Viewer |
|---|---|---|---|---|
| View board | ✓ | ✓ | ✓ | ✓ |
| Update/delete board | ✓ | — | — | — |
| Manage members/invites | ✓ | ✓* | — | — |
| CRUD lists/cards/labels | ✓ | ✓ | ✓ | — |
| Move/reorder | ✓ | ✓ | ✓ | — |
| Checklist/comment write | ✓ | ✓ | ✓ | — |
| Comment edit/delete own | ✓ | ✓ | ✓ | — |

\*Admin cannot change Owner role or remove Owner.

## Auth

| Method | Path | Auth |
|---|---|---|
| POST | /auth/register | Public |
| POST | /auth/login | Public |
| POST | /auth/refresh | Cookie |
| POST | /auth/logout | Cookie |
| GET | /auth/me | Bearer |

## Workspaces

| Method | Path | Auth |
|---|---|---|
| GET | /workspaces | Bearer |
| POST | /workspaces | Bearer |
| GET | /workspaces/:id | Member |
| PATCH | /workspaces/:id | Owner |
| DELETE | /workspaces/:id | Owner | soft + cascade |

## Boards

| Method | Path | Auth |
|---|---|---|
| GET | /workspaces/:workspaceId/boards | Workspace member |
| POST | /workspaces/:workspaceId/boards | Workspace member |
| GET | /boards/:id | Board member | nested lists + cards (labels, assignees); soft-deleted excluded; ordered by position |
| PATCH | /boards/:id | Owner |
| DELETE | /boards/:id | Owner | soft + cascade |
| GET | /boards/:id/members | Board member |
| PATCH | /boards/:id/members/:userId | Owner/Admin |
| DELETE | /boards/:id/members/:userId | Owner/Admin | soft |
| POST | /boards/:id/invites | Owner/Admin |
| GET | /boards/:id/invites | Owner/Admin |
| POST | /invites/:token/accept | Bearer |
| DELETE | /boards/:id/invites/:inviteId | Owner/Admin | revoke |

## Lists

| Method | Path | Auth |
|---|---|---|
| GET | /boards/:boardId/lists | Board member |
| POST | /boards/:boardId/lists | Member+ |
| PATCH | /lists/:id | Member+ |
| DELETE | /lists/:id | Member+ | soft + cascade cards |

## Cards

| Method | Path | Auth |
|---|---|---|
| GET | /lists/:listId/cards | Board member |
| POST | /lists/:listId/cards | Member+ |
| GET | /cards/:id | Board member |
| PATCH | /cards/:id | Member+ | includes move `{ listId?, position }` |
| DELETE | /cards/:id | Member+ | soft |
| POST | /cards/:id/labels/:labelId | Member+ |
| DELETE | /cards/:id/labels/:labelId | Member+ |
| POST | /cards/:id/assignees/:userId | Member+ |
| DELETE | /cards/:id/assignees/:userId | Member+ |

## Labels

| Method | Path | Auth |
|---|---|---|
| GET | /boards/:boardId/labels | Board member |
| POST | /boards/:boardId/labels | Member+ |
| PATCH | /labels/:id | Member+ |
| DELETE | /labels/:id | Member+ | soft |

## Checklists

| Method | Path | Auth |
|---|---|---|
| GET | /cards/:cardId/checklists | Board member |
| POST | /cards/:cardId/checklists | Member+ |
| PATCH | /checklists/:id | Member+ |
| DELETE | /checklists/:id | Member+ | soft |
| POST | /checklists/:id/items | Member+ |
| PATCH | /checklist-items/:id | Member+ |
| DELETE | /checklist-items/:id | Member+ | soft |

## Comments

| Method | Path | Auth |
|---|---|---|
| GET | /cards/:cardId/comments | Board member |
| POST | /cards/:cardId/comments | Member+ |
| PATCH | /comments/:id | Author |
| DELETE | /comments/:id | Author | soft |

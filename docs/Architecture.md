# TaskFlow — Architecture

## Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind + shadcn + TanStack Query + Zustand + axios + @dnd-kit |
| Backend | NestJS 10 + Prisma 5 |
| Database | PostgreSQL |
| Auth | JWT access (memory) + refresh httpOnly cookie (DB-backed) |
| Cache / jobs | None (redis/jobs false) |

Config source of truth: `stack.config.yaml` + `stacks/nestjs` + `stacks/react-vite`.

## App layout

```text
apps/api/          NestJS API (prefix api/v1)
apps/web/          React Vite SPA
docs/              Product + feature specs
```

## Auth flow

1. Login/register → set refresh cookie; return access token  
2. FE stores access in memory; axios Authorization Bearer  
3. 401 → POST /auth/refresh with cookie → retry  
4. Logout revokes refresh in DB

## Error envelope

```json
{ "statusCode": 400, "code": "VALIDATION_ERROR", "message": "...", "timestamp": "...", "path": "/api/v1/..." }
```

## Permissions

Board-scoped guards resolve `BoardMember.role` for the current user. Soft-deleted memberships/resources are treated as not found.

## Soft delete

Domain entities use `deletedAt`. Soft-deleting Workspace → soft-delete Boards → Lists → Cards (and related card children). Soft-deleting List → soft-delete Cards. No hard delete of domain rows.

## Realtime

None. After mutations, FE invalidates React Query board queries.

## Board detail payload

`GET /api/v1/boards/:id` returns nested lists (position ASC) with cards (labels, assignees) for Kanban — soft-deleted rows excluded.

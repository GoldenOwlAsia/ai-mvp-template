# TaskFlow — Coding Convention

Follow active adapters: `stacks/nestjs/CONVENTION.md` and `stacks/react-vite/CONVENTION.md`.

## Product contracts (fixed)

- String PKs (`cuid`) — no auto-increment domain IDs  
- Soft delete via `deletedAt` — never hard-delete domain rows  
- Access token in memory; refresh httpOnly cookie  
- Error envelope `{ statusCode, code, message, timestamp, path }`  
- No PUT; PATCH updates; DELETE = soft delete  
- Never expose password / refresh tokens  
- TypeScript: no `any`  

## Backend layers (Nest)

DTO → Service → Controller → Module (one layer per prompt when generating).

## Frontend

Feature folders under `src/features/*`; pages under `src/pages`; shared UI under `src/components/ui`.

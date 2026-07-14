# MCP and packages

Moved from meta notes for Day 0–4 use. Prefer `stack.config.yaml` pins over “latest”.

## Packages baseline

| Layer | Package | Why |
|---|---|---|
| Validation | class-validator, class-transformer | Nest DTOs |
| Auth | @nestjs/jwt, passport-jwt, cookie-parser, bcrypt | JWT + httpOnly cookie |
| ORM | prisma, @prisma/client | Schema-as-docs |
| FE data | @tanstack/react-query | Cache / loading |
| FE form | react-hook-form, zod, @hookform/resolvers | Form convention |
| FE UI | Tailwind (+ shadcn later) | Reuse, less invent |
| HTTP | axios | Refresh interceptor |
| Test | vitest / jest | Map AC |

**Do not add on Day 1:** BullMQ, object-storage SDK, full Sentry, Nest microservices, Next App Router (unless preset changes).

## MCP

### Tier 1

| MCP | Use |
|---|---|
| Context7 | Current Nest/Prisma/React/TanStack docs |
| GitHub / `gh` | PR + CI on Day 4 |

### Tier 2

| MCP | Use |
|---|---|
| Prisma / Postgres | Read schema / migrate status (prefer read-only) |
| Chrome DevTools | Smoke navigate / console / network |
| Figma | Only when designs exist |

### Tier 3

| MCP | Use |
|---|---|
| Vercel / Railway / Supabase | Inspect status; mutate prod only with approval |

**Rule:** MCP verifies; it does not change immutable contracts or `stack.config.yaml`.

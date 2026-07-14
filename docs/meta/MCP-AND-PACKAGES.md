# MCP & recommended packages

## Baseline packages (pin in stack.config)

| Layer | Package | Why |
|---|---|---|
| Validation | class-validator, class-transformer | Nest DTOs |
| Auth | @nestjs/jwt, passport-jwt, cookie-parser, bcrypt | JWT + httpOnly cookie |
| ORM | prisma, @prisma/client | Schema-as-docs |
| FE data | @tanstack/react-query | Cache / loading |
| FE form | react-hook-form, zod, @hookform/resolvers | Matches UI convention |
| FE UI | shadcn/ui + tailwindcss | Reuse, less invent |
| HTTP | axios | Refresh interceptor |
| Test | vitest / jest + supertest | Map AC GIVEN/WHEN/THEN |

**Do not add on Day 1:** BullMQ, R2 SDK, full Sentry, Nest microservices, Next App Router (unless the preset changes).

---

## MCP

### Tier 1 — enable by default

| MCP | Use for |
|---|---|
| Context7 | Current Nest/Prisma/React/TanStack docs — fewer hallucinated APIs |
| GitHub / `gh` | PRs, CI on Day 4 |

### Tier 2

| MCP | Use for |
|---|---|
| Prisma / Postgres MCP | Read schema, check migrate status (read-only) |
| Chrome DevTools MCP | UI smoke: navigate, console, network |
| Figma MCP | Only when designs exist |

### Tier 3

| MCP | Use for |
|---|---|
| Vercel / Railway / Supabase MCP | Inspect status — prefer read; mutate prod needs approval |

### Avoid early

- Too many DB MCPs at once
- Web search instead of Context7 for library docs
- Browser automation instead of starter e2e

**Rule:** MCP only reads/verifies; it does not change immutable contracts or `stack.config`.

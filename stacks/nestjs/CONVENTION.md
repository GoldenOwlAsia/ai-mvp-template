# NestJS adapter — conventions

Maps **product contracts** → NestJS + Prisma idioms.

## Package identity

- `package.json` name: **`@app/api`** (boilerplate FIXED — used by `deploy/Dockerfile.api` and pnpm filters).

## Layout

```text
apps/api/
  package.json          # name: @app/api
  prisma/schema.prisma
  src/
    main.ts
    app.module.ts
    common/
    prisma/
    auth/
    <feature>/
      dto/
      <feature>.service.ts
      <feature>.controller.ts
      <feature>.module.ts
```

## Layer order (one prompt per layer)

1. DTO (`class-validator`) → 2. Service → 3. Controller → 4. Module → register in `AppModule`

## Product contracts

| Contract | Nest idiom |
|---|---|
| Soft delete | `deletedAt DateTime?`; `where: { deletedAt: null }` |
| String PK | `@default(cuid())` |
| Error envelope | global filter → `{ statusCode, code, message, timestamp, path }` |
| Auth | JWT Bearer + refresh httpOnly cookie |
| Cross-origin (hosted) | CORS + cookie flags when web and API differ — see deploy invariants §3 |
| PATCH / soft DELETE | `@Patch` / `@Delete` soft-delete in service |
| Secrets | Prisma `select` omit `password` |

## Typing

TypeScript `strict`; no `any`.

# React + Vite adapter — conventions

## Package identity

- `package.json` name: **`@app/web`** (boilerplate FIXED — used by `vercel.json` and pnpm filters).

## Layout

```text
apps/web/
  package.json          # name: @app/web
  src/{lib,pages,components}
```

## Generation order

types → API service → TanStack Query hooks → components → page

## Contracts

- Access token in memory
- Refresh via httpOnly cookie + credentials
- RHF + Zod; loading / empty / error states

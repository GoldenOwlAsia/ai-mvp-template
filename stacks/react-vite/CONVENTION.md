# React + Vite adapter — conventions

## Layout

```text
apps/web/src/{lib,pages,components}
```

## Generation order

types → API service → TanStack Query hooks → components → page

## Contracts

- Access token in memory
- Refresh via httpOnly cookie + credentials
- RHF + Zod; loading / empty / error states

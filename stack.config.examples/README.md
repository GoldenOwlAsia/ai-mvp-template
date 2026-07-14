# Stack config examples

Copy one file to repo root as `stack.config.yaml`:

| File | Backend | Frontend |
|---|---|---|
| `nestjs-react.yaml` | NestJS + Prisma | React Vite |
| `laravel-react.yaml` | Laravel + Eloquent | React Vite |
| `django-react.yaml` | Django + DRF | React Vite |

Then:

```bash
node scripts/validate-stack-config.mjs
node scripts/apply-stack-config.mjs
```

Adapters: `stacks/<framework>/` (CONVENTION + BOOTSTRAP + packages.example).

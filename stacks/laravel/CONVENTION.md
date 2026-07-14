# Laravel adapter — conventions

Maps **product contracts** → Laravel + Eloquent idioms.

## Layout

```text
apps/api/
  app/Http/Controllers/
  app/Http/Requests/
  app/Services/
  app/Models/
  routes/api.php
  database/migrations/
```

## Layer order

1. FormRequest → 2. Service → 3. Controller → 4. routes → 5. migration/model

## Product contracts

| Contract | Laravel idiom |
|---|---|
| Soft delete | `SoftDeletes` + `deleted_at` |
| String PK | UUID / ULID strings |
| Error envelope | Handler → `{ statusCode, code, message, timestamp, path }` |
| Auth | Access in memory + refresh httpOnly cookie |
| PATCH / soft DELETE | `patch` / destroy soft-deletes |
| Secrets | `$hidden`; API Resources |

## Typing

PHP 8.2+; typed properties + FormRequest rules.

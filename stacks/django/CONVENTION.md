# Django adapter — conventions

Maps **product contracts** → Django + DRF idioms.

## Layout

```text
apps/api/
  config/
  apps/core/
  apps/accounts/
  apps/<feature>/
    models.py
    serializers.py
    services.py
    views.py
    urls.py
```

## Layer order

1. Serializer → 2. Service → 3. View/ViewSet → 4. urls → 5. model/migration

## Product contracts

| Contract | Django idiom |
|---|---|
| Soft delete | manager filters `deleted_at`; never hard delete |
| String PK | UUIDField / string cuid |
| Error envelope | custom handler → `{ statusCode, code, message, timestamp, path }` |
| Auth | JWT access + refresh httpOnly cookie |
| PATCH / soft DELETE | `partial_update` / soft destroy |
| Secrets | exclude from serializers |

## Typing

Type hints on services; explicit serializer fields.

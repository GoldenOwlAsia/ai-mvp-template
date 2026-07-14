# P05 — Auth service

```
Use prompts/generate-service.md.
Feature: docs/features/auth.md
Implement register / login / refresh / logout / me.
Rules: soft-deleted users cannot login; password hashed; never return password;
access token for memory client; refresh in httpOnly cookie (DB-backed revoke if adapter supports).
No HTTP layer yet.
```

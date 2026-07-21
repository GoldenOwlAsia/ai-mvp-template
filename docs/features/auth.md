# Feature: Auth

## Overview
Register, login, refresh, logout, me. JWT access (15m, memory) + refresh (7d, httpOnly cookie, DB-backed).

## API
| Method | Path | Auth |
|---|---|---|
| POST | /api/v1/auth/register | Public |
| POST | /api/v1/auth/login | Public |
| POST | /api/v1/auth/refresh | Cookie |
| POST | /api/v1/auth/logout | Cookie |
| GET | /api/v1/auth/me | Bearer |

## Entities
User, RefreshToken

## Business Rules
- Password ≥8 chars, 1 upper, 1 digit
- Email unique (case-insensitive)
- Soft-delete users cannot login
- Never return password hash

## Edge Cases
- Duplicate email → 409 EMAIL_EXISTS
- Invalid credentials → 401 INVALID_CREDENTIALS
- Missing/expired refresh → 401 REFRESH_INVALID
- Soft-deleted user → 401 USER_INACTIVE

## Out of Scope
Email verification, OAuth, 2FA, password reset

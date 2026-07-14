# [Product Name] — API Specification

> **How to use this template:**
> - Remove all `>` blockquote (notes) sections before actual use
> - Write the Convention section first — Claude applies it to the entire API
> - Every endpoint must include: Request, Response, Errors, Permission
> - Inline comments in the JSON example help Claude generate the correct DTO right away

---

## Convention

> Claude reads this section first and applies it to the entire API — no need to repeat it for each endpoint.

**Base URL:** `/api/v1`
**Format:** JSON
**Authentication:** Bearer Token (JWT)
**Charset:** UTF-8

### URL Naming

```
✅ Correct
/api/v1/users
/api/v1/task-items
/api/v1/projects/:id/members

❌ Wrong
/api/v1/getUser
/api/v1/User
/api/v1/create_task
```

### HTTP Methods

| Method | Used for | Has a body |
|---|---|---|
| GET | Read, no side effects | No |
| POST | Create | Yes |
| PATCH | Partial update | Yes |
| DELETE | Soft delete | No |

> Do not use PUT. Only use PATCH for updates.

### HTTP Status Codes

| Code | Meaning | Used when |
|---|---|---|
| 200 | OK | GET, PATCH succeeded |
| 201 | Created | POST succeeded |
| 204 | No Content | DELETE succeeded |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Not authenticated or token expired |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate resource |
| 429 | Too Many Requests | Rate limited |
| 500 | Internal Server Error | Server error |

### Success Response Format

```json
// Single resource
{
  "data": { ... },
  "message": "Success"
}

// Paginated list
{
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}

// Delete / action with no data returned
{
  "message": "Deleted successfully"
}
```

### Error Response Format

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Title is required",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/tasks"
}
```

### Pagination Query Parameters

```
GET /api/v1/[resource]?page=1&limit=20&sortBy=createdAt&sortOrder=desc

page      number   optional   default: 1
limit     number   optional   default: 20, max: 100
sortBy    string   optional   default: createdAt
sortOrder string   optional   default: desc — [asc | desc]
```

### Date Format

```
All datetimes use ISO 8601: 2024-01-01T00:00:00.000Z
Timezone: UTC
```

---

## Permission Matrix

> Claude reads this section to generate the correct Guard + Decorator for each endpoint.

| Endpoint | Public | Member | Admin | Notes |
|---|---|---|---|---|
| POST /auth/register | ✅ | ✅ | ✅ | — |
| POST /auth/login | ✅ | ✅ | ✅ | Rate limit: 5/min |
| POST /auth/refresh | ✅ | ✅ | ✅ | Uses httpOnly cookie |
| POST /auth/logout | ❌ | ✅ | ✅ | — |
| GET /users | ❌ | ❌ | ✅ | — |
| GET /users/:id | ❌ | Own only | ✅ | Member can only view their own profile |
| PATCH /users/:id | ❌ | Own only | ✅ | — |
| GET /projects | ❌ | Joined only | ✅ | Member only sees projects they belong to |
| POST /projects | ❌ | ✅ | ✅ | — |
| GET /projects/:id | ❌ | Member of project | ✅ | — |
| PATCH /projects/:id | ❌ | Owner only | ✅ | — |
| DELETE /projects/:id | ❌ | Owner only | ✅ | — |
| GET /tasks | ❌ | In project | ✅ | Must belong to the project |
| POST /tasks | ❌ | In project | ✅ | — |
| PATCH /tasks/:id | ❌ | Assignee/Owner | ✅ | — |
| DELETE /tasks/:id | ❌ | Owner only | ✅ | — |

> Add a new row for each new endpoint. Never leave a column blank — write ❌ explicitly if not allowed.

---

## Authentication Endpoints

### POST /api/v1/auth/register

**Description:** Create a new account
**Auth:** Public
**Rate limit:** 10 requests/min per IP

#### Request Body

```json
{
  "email": "user@example.com",   // required | string | email format
  "password": "Password@123",    // required | string | min 8 chars, 1 uppercase, 1 number
  "name": "John Doe"             // required | string | max 100 chars
}
```

#### Response 201

```json
{
  "data": {
    "id": "clx123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "MEMBER",
    "isVerified": false
  },
  "message": "Registration successful. Please verify your email."
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | VALIDATION_ERROR | Email has the wrong format, password is not strong enough |
| 409 | CONFLICT | Email already exists |
| 429 | RATE_LIMITED | Exceeded 10 requests/min |

---

### POST /api/v1/auth/login

**Description:** Log in and receive a JWT token
**Auth:** Public
**Rate limit:** 5 requests/min per IP

#### Request Body

```json
{
  "email": "user@example.com",   // required | string | email format
  "password": "Password@123"     // required | string
}
```

#### Response 200

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "clx123abc",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "MEMBER",
      "avatarUrl": null
    }
  },
  "message": "Login successful"
}
```

> refreshToken is set in an httpOnly cookie, not returned in the body.

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | VALIDATION_ERROR | Email has the wrong format |
| 401 | INVALID_CREDENTIALS | Wrong email or password |
| 403 | EMAIL_NOT_VERIFIED | Email not verified |
| 429 | RATE_LIMITED | Exceeded 5 attempts within 1 minute |

---

### POST /api/v1/auth/refresh

**Description:** Get a new accessToken using the refreshToken
**Auth:** Public (uses httpOnly cookie)
**Rate limit:** 30 requests/min per user

#### Request

No body. The refreshToken is read automatically from the httpOnly cookie.

#### Response 200

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Token refreshed"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 401 | TOKEN_EXPIRED | refreshToken has expired |
| 401 | INVALID_TOKEN | refreshToken is invalid |

---

### POST /api/v1/auth/logout

**Description:** Log out and remove the refreshToken
**Auth:** JwtAuthGuard

#### Request

No body.

#### Response 200

```json
{
  "message": "Logged out successfully"
}
```

---

## [Resource] Endpoints

> Copy this section for each new resource. Replace [Resource] with the actual resource name.

### GET /api/v1/[resource]

**Description:** [Get the list of resources]
**Auth:** JwtAuthGuard
**Permission:** [Allowed roles]
**Rate limit:** 60 requests/min

#### Query Parameters

| Param | Type | Required | Default | Description |
|---|---|---|---|---|
| [filterId] | string | Yes/No | — | [Filter by what] |
| [status] | [Enum] | No | — | [Filter by status] |
| page | number | No | 1 | Current page |
| limit | number | No | 20 | Items per page, max 100 |
| sortBy | string | No | createdAt | Field to sort by |
| sortOrder | asc/desc | No | desc | Sort direction |

#### Response 200

```json
{
  "data": [
    {
      "id": "clx123abc",
      "[field1]": "[value]",
      "[field2]": "[value]",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 401 | UNAUTHORIZED | Not logged in |
| 403 | FORBIDDEN | No permission |

---

### POST /api/v1/[resource]

**Description:** [Create a new resource]
**Auth:** JwtAuthGuard
**Permission:** [Allowed roles]

#### Request Body

```json
{
  "[field1]": "[value]",   // required | string | [validation rules]
  "[field2]": "[value]",   // optional | string | [validation rules]
  "[field3]": "[value]"    // required | enum [EnumName] | [values]
}
```

#### Response 201

```json
{
  "data": {
    "id": "clx123abc",
    "[field1]": "[value]",
    "[field2]": "[value]",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "[Resource] created successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | VALIDATION_ERROR | [Which field, which rule] |
| 401 | UNAUTHORIZED | Not logged in |
| 403 | FORBIDDEN | No permission |
| 409 | CONFLICT | [Resource already exists — if there is a unique constraint] |

---

### GET /api/v1/[resource]/:id

**Description:** [Get one resource's details]
**Auth:** JwtAuthGuard
**Permission:** [Allowed roles]

#### Path Parameters

| Param | Type | Description |
|---|---|---|
| id | string (cuid) | Resource ID |

#### Response 200

```json
{
  "data": {
    "id": "clx123abc",
    "[field1]": "[value]",
    "[field2]": "[value]",
    "[relation]": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 401 | UNAUTHORIZED | Not logged in |
| 403 | FORBIDDEN | No permission to view this resource |
| 404 | NOT_FOUND | Resource does not exist |

---

### PATCH /api/v1/[resource]/:id

**Description:** [Update a resource]
**Auth:** JwtAuthGuard
**Permission:** [Allowed roles]

#### Request Body

> All fields are optional — only the fields sent are updated.

```json
{
  "[field1]": "[value]",   // optional | string | [validation rules]
  "[field2]": "[value]"    // optional | enum [EnumName]
}
```

#### Response 200

```json
{
  "data": {
    "id": "clx123abc",
    "[field1]": "[updated value]",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "[Resource] updated successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | VALIDATION_ERROR | Field has the wrong format |
| 401 | UNAUTHORIZED | Not logged in |
| 403 | FORBIDDEN | No permission to update |
| 404 | NOT_FOUND | Resource does not exist |

---

### DELETE /api/v1/[resource]/:id

**Description:** [Delete a resource (soft delete)]
**Auth:** JwtAuthGuard
**Permission:** [Allowed roles]

#### Response 200

```json
{
  "message": "[Resource] deleted successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 401 | UNAUTHORIZED | Not logged in |
| 403 | FORBIDDEN | No permission to delete |
| 404 | NOT_FOUND | Resource does not exist |

---

## DTO Reference

> Claude follows this pattern for every DTO — do not change the decorators or convention on your own.

### Required Pattern

```typescript
// create-[resource].dto.ts
import {
  IsString, IsNotEmpty, IsOptional, IsEnum,
  IsDateString, MaxLength, IsCuid
} from 'class-validator'

export class Create[Resource]Dto {
  @IsString()
  @IsNotEmpty({ message: '[Field] is required' })
  @MaxLength(200, { message: '[Field] must be at most 200 characters' })
  [requiredStringField]: string

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  [optionalStringField]?: string

  @IsEnum([EnumName], { message: '[Field] must be one of: VALUE1, VALUE2' })
  @IsOptional()
  [enumField]?: [EnumName] = [EnumName].DEFAULT_VALUE

  @IsString()
  @IsCuid({ message: '[Field] must be a valid ID' })
  [requiredIdField]: string

  @IsDateString({}, { message: '[Field] must be a valid ISO date' })
  @IsOptional()
  [dateField]?: string
}

// update-[resource].dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { Create[Resource]Dto } from './create-[resource].dto'

// All fields of CreateDto become optional
export class Update[Resource]Dto extends PartialType(Create[Resource]Dto) {}
```

### Commonly Used Custom Validators

```typescript
// Check that the date must be in the future
@IsFutureDate()

// Check that the ID must exist in the DB
@Exists(User)

// Check that the user must be a member of the project
@IsMemberOfProject()
```

---

## References

- PRD: `docs/PRD.md`
- Architecture: `docs/Architecture.md`
- Database: `docs/Database.md`
- Coding Convention: `docs/CodingConvention.md`

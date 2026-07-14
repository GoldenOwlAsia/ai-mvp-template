# [Product Name] — API Specification

> **How to use this file:**
> - Delete every `>` (note) block before using this for real
> - Claude reads this file when: generating a controller, service, DTO, guard, or API client
> - When you change an endpoint → update this file immediately in the same PR
> - Inline comments in JSON examples help Claude generate the correct DTO on the first try

---

## Convention

> Claude reads this section first and applies it across the entire API.
> These rules are not repeated for each endpoint.

**Base URL:** `/api/v1`
**Format:** JSON — `Content-Type: application/json`
**Auth:** `Authorization: Bearer [accessToken]`
**Charset:** UTF-8
**Date format:** ISO 8601 — `2024-01-01T00:00:00.000Z` (UTC)

### URL Naming

```
✅ /api/v1/users
✅ /api/v1/task-items
✅ /api/v1/projects/:id/members

❌ /api/v1/getUser
❌ /api/v1/CreateTask
❌ /api/v1/user_list
```

### HTTP Methods

| Method | Used for | Body | Idempotent |
|---|---|---|---|
| GET | Read, no side effects | No | Yes |
| POST | Create | Yes | No |
| PATCH | Partial update | Yes | Yes |
| DELETE | Soft delete | No | Yes |

> Don't use PUT. Use PATCH for every update.

### HTTP Status Codes

| Code | Used when |
|---|---|
| 200 OK | GET, PATCH successful |
| 201 Created | POST successful |
| 204 No Content | DELETE successful (no body) |
| 400 Bad Request | Validation error |
| 401 Unauthorized | Not authenticated or token expired |
| 403 Forbidden | Authenticated but no permission |
| 404 Not Found | Resource does not exist |
| 409 Conflict | Duplicate resource |
| 429 Too Many Requests | Rate limited |
| 500 Internal Server Error | Server error |

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

// Action with no returned data (delete, logout)
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
?page=1&limit=20&sortBy=createdAt&sortOrder=desc

page      number   optional   default: 1
limit     number   optional   default: 20, max: 100
sortBy    string   optional   default: createdAt
sortOrder string   optional   asc | desc, default: desc
```

---

## Permission Matrix

> Claude reads this section to generate the correct Guard + Decorator for each endpoint.
> Don't leave any cell blank — mark ❌ if not allowed.

| Endpoint | Public | Member | Admin | Note |
|---|---|---|---|---|
| POST /auth/register | ✅ | ✅ | ✅ | Rate limit: 10/min |
| POST /auth/login | ✅ | ✅ | ✅ | Rate limit: 5/min |
| POST /auth/refresh | ✅ | ✅ | ✅ | Uses httpOnly cookie |
| POST /auth/logout | ❌ | ✅ | ✅ | — |
| GET /users/me | ❌ | ✅ | ✅ | Own profile |
| PATCH /users/me | ❌ | ✅ | ✅ | Only name, avatar update |
| PATCH /users/me/password | ❌ | ✅ | ✅ | Requires old password |
| GET /users | ❌ | ❌ | ✅ | List all users |
| GET /projects | ❌ | Joined only | ✅ | Member sees only their own projects |
| POST /projects | ❌ | ✅ | ✅ | Creator = OWNER |
| GET /projects/:id | ❌ | Member of | ✅ | — |
| PATCH /projects/:id | ❌ | OWNER only | ✅ | — |
| DELETE /projects/:id | ❌ | OWNER only | ✅ | Soft delete |
| GET /projects/:id/members | ❌ | Member of | ✅ | — |
| POST /projects/:id/members | ❌ | OWNER only | ✅ | Invite by email |
| DELETE /projects/:id/members/:userId | ❌ | OWNER only | ✅ | Remove member |
| GET /tasks | ❌ | In project | ✅ | Requires ?projectId |
| POST /tasks | ❌ | In project | ✅ | — |
| GET /tasks/:id | ❌ | In project | ✅ | — |
| PATCH /tasks/:id | ❌ | In project | ✅ | Any member in the project |
| DELETE /tasks/:id | ❌ | OWNER/Creator | ✅ | Project owner or task creator |
| GET /tasks/:id/comments | ❌ | In project | ✅ | — |
| POST /tasks/:id/comments | ❌ | In project | ✅ | — |
| PATCH /comments/:id | ❌ | Author only | ✅ | Only the author can edit their comment |
| DELETE /comments/:id | ❌ | Author only | ✅ | Only the author can delete |

---

## Auth Endpoints

---

### POST /api/v1/auth/register

**Description:** Create a new account, send a verification email
**Auth:** Public
**Rate limit:** 10 requests/min per IP

#### Request Body

```json
{
  "email": "user@example.com",    // required | string | email format | lowercase
  "password": "Password@123",     // required | string | min 8 | 1 uppercase | 1 number
  "name": "John Doe"              // required | string | max 100 | trim
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
  "message": "Registration successful. Please check your email to verify your account."
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid email format, weak password, empty name |
| 409 | `CONFLICT` | Email already exists |
| 429 | `RATE_LIMITED` | More than 10 requests/min |

---

### POST /api/v1/auth/login

**Description:** Log in, receive an accessToken
**Auth:** Public
**Rate limit:** 5 requests/min per IP

#### Request Body

```json
{
  "email": "user@example.com",    // required | string | email format
  "password": "Password@123"      // required | string
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
      "avatarUrl": null,
      "isVerified": true
    }
  },
  "message": "Login successful"
}
```

> The refreshToken is automatically set in an httpOnly cookie — it is not returned in the body.

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid email format |
| 401 | `INVALID_CREDENTIALS` | Wrong email or password (doesn't reveal which one) |
| 403 | `EMAIL_NOT_VERIFIED` | Email not yet verified |
| 429 | `RATE_LIMITED` | More than 5 attempts within 1 minute |

---

### POST /api/v1/auth/refresh

**Description:** Get a new accessToken using the refreshToken in the cookie
**Auth:** Public — uses the httpOnly cookie automatically

#### Request

No body. The refreshToken is retrieved automatically from the httpOnly cookie.

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
| 401 | `TOKEN_EXPIRED` | refreshToken has expired |
| 401 | `INVALID_TOKEN` | refreshToken is invalid or has been revoked |

---

### POST /api/v1/auth/logout

**Description:** Log out, delete the refreshToken, clear the cookie
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

## User Endpoints

---

### GET /api/v1/users/me

**Description:** Get the profile of the currently logged-in user
**Auth:** JwtAuthGuard

#### Response 200

```json
{
  "data": {
    "id": "clx123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "MEMBER",
    "avatarUrl": "https://pub-xxx.r2.dev/avatars/clx123abc/avatar.jpg",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /api/v1/users/me

**Description:** Update the profile — name and/or avatar
**Auth:** JwtAuthGuard

#### Request Body

> All fields are optional — only the fields provided are updated.

```json
{
  "name": "John Updated",         // optional | string | max 100 | trim
  "avatarUrl": "https://..."      // optional | string | url format | from R2 storage
}
```

#### Response 200

```json
{
  "data": {
    "id": "clx123abc",
    "name": "John Updated",
    "avatarUrl": "https://pub-xxx.r2.dev/avatars/clx123abc/avatar.jpg"
  },
  "message": "Profile updated successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Name is empty after trimming, avatarUrl is not a valid URL |

---

### PATCH /api/v1/users/me/password

**Description:** Change password — requires the old password
**Auth:** JwtAuthGuard

#### Request Body

```json
{
  "currentPassword": "OldPass@123",  // required | string
  "newPassword": "NewPass@456"       // required | string | min 8 | 1 uppercase | 1 number
  // newPassword must not match currentPassword
}
```

#### Response 200

```json
{
  "message": "Password changed successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | newPassword is not strong enough |
| 400 | `SAME_PASSWORD` | newPassword matches currentPassword |
| 401 | `INVALID_CREDENTIALS` | currentPassword is incorrect |

---

## Project Endpoints

---

### GET /api/v1/projects

**Description:** Get the list of projects the user belongs to
**Auth:** JwtAuthGuard
**Permission:** Only returns projects the user is a member of — Admin sees everything

#### Query Parameters

| Param | Type | Required | Default | Description |
|---|---|---|---|---|
| page | number | No | 1 | — |
| limit | number | No | 20 | max 100 |
| sortBy | string | No | createdAt | — |
| sortOrder | asc/desc | No | desc | — |

#### Response 200

```json
{
  "data": [
    {
      "id": "clx123abc",
      "name": "Project Alpha",
      "description": "Main product project",
      "color": "#6366f1",
      "memberCount": 5,
      "taskCount": 23,
      "myRole": "OWNER",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### POST /api/v1/projects

**Description:** Create a new project — the creator automatically becomes OWNER
**Auth:** JwtAuthGuard

#### Request Body

```json
{
  "name": "Project Alpha",            // required | string | max 100 | trim
  "description": "Main product",     // optional | string | max 500
  "color": "#6366f1"                 // optional | string | hex color | default: '#6366f1'
}
```

#### Response 201

```json
{
  "data": {
    "id": "clx123abc",
    "name": "Project Alpha",
    "description": "Main product",
    "color": "#6366f1",
    "ownerId": "clx456def",
    "myRole": "OWNER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Project created successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Name is empty, color is not a valid hex |

---

### GET /api/v1/projects/:id

**Description:** Get project details
**Auth:** JwtAuthGuard
**Permission:** Must be a member of the project

#### Response 200

```json
{
  "data": {
    "id": "clx123abc",
    "name": "Project Alpha",
    "description": "Main product",
    "color": "#6366f1",
    "ownerId": "clx456def",
    "myRole": "OWNER",
    "memberCount": 5,
    "taskCount": 23,
    "members": [
      {
        "id": "clx456def",
        "name": "John Doe",
        "email": "john@example.com",
        "avatarUrl": null,
        "role": "OWNER",
        "joinedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 403 | `FORBIDDEN` | Not a member of the project |
| 404 | `NOT_FOUND` | Project does not exist or has been deleted |

---

### PATCH /api/v1/projects/:id

**Description:** Update a project
**Auth:** JwtAuthGuard
**Permission:** Project OWNER or Admin

#### Request Body

```json
{
  "name": "Project Alpha v2",        // optional | string | max 100
  "description": "Updated desc",    // optional | string | max 500
  "color": "#10b981"                 // optional | string | hex color
}
```

#### Response 200

```json
{
  "data": {
    "id": "clx123abc",
    "name": "Project Alpha v2",
    "description": "Updated desc",
    "color": "#10b981",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "message": "Project updated successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Name is empty, color is invalid |
| 403 | `FORBIDDEN` | Not the OWNER |
| 404 | `NOT_FOUND` | Project does not exist |

---

### DELETE /api/v1/projects/:id

**Description:** Delete a project (soft delete) — cascades to delete all tasks
**Auth:** JwtAuthGuard
**Permission:** Project OWNER or Admin

#### Response 200

```json
{
  "message": "Project deleted successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 403 | `FORBIDDEN` | Not the OWNER |
| 404 | `NOT_FOUND` | Project does not exist |

---

### POST /api/v1/projects/:id/members

**Description:** Invite a member into the project by email
**Auth:** JwtAuthGuard
**Permission:** Project OWNER or Admin

#### Request Body

```json
{
  "email": "newmember@example.com",  // required | string | email format
  "role": "MEMBER"                   // optional | enum ProjectMemberRole | default: MEMBER
}
```

#### Response 201

```json
{
  "data": {
    "userId": "clx789ghi",
    "projectId": "clx123abc",
    "role": "MEMBER",
    "user": {
      "id": "clx789ghi",
      "name": "New Member",
      "email": "newmember@example.com",
      "avatarUrl": null
    },
    "joinedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Member added successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid email format |
| 403 | `FORBIDDEN` | Not the OWNER |
| 404 | `NOT_FOUND` | Email does not exist in the system |
| 409 | `CONFLICT` | User is already a member of the project |

---

### DELETE /api/v1/projects/:id/members/:userId

**Description:** Remove a member from the project
**Auth:** JwtAuthGuard
**Permission:** Project OWNER or Admin

#### Response 200

```json
{
  "message": "Member removed successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `CANNOT_REMOVE_OWNER` | Cannot remove the only OWNER |
| 403 | `FORBIDDEN` | Not the OWNER |
| 404 | `NOT_FOUND` | User is not a member |

---

## Task Endpoints

---

### GET /api/v1/tasks

**Description:** Get the list of tasks in a project
**Auth:** JwtAuthGuard
**Permission:** Must be a member of the project

#### Query Parameters

| Param | Type | Required | Default | Description |
|---|---|---|---|---|
| projectId | string | **Yes** | — | Required — the project's ID |
| status | TaskStatus | No | — | Filter by status |
| priority | TaskPriority | No | — | Filter by priority |
| assigneeId | string | No | — | Filter by assignee (use "me" for yourself) |
| page | number | No | 1 | — |
| limit | number | No | 20 | max 100 |
| sortBy | string | No | position | createdAt, deadline, priority, position |
| sortOrder | asc/desc | No | asc | — |

#### Response 200

```json
{
  "data": [
    {
      "id": "clx123abc",
      "title": "Implement login feature",
      "description": "Using JWT strategy...",
      "status": "TODO",
      "priority": "HIGH",
      "deadline": "2024-12-31T00:00:00.000Z",
      "position": 1024,
      "assignee": {
        "id": "clx456def",
        "name": "John Doe",
        "avatarUrl": null
      },
      "createdBy": {
        "id": "clx789ghi",
        "name": "Jane Smith"
      },
      "commentCount": 3,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 23,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Missing projectId |
| 403 | `FORBIDDEN` | Not a member of the project |
| 404 | `NOT_FOUND` | Project does not exist |

---

### POST /api/v1/tasks

**Description:** Create a new task in a project
**Auth:** JwtAuthGuard
**Permission:** Must be a member of the project

#### Request Body

```json
{
  "title": "Implement login",          // required | string | max 200 | trim
  "description": "Using JWT...",       // optional | string | max 2000 | markdown
  "projectId": "clx123abc",           // required | string | cuid
  "assigneeId": "clx456def",          // optional | string | cuid | must be a member
  "priority": "HIGH",                  // optional | enum TaskPriority | default: MEDIUM
  "deadline": "2024-12-31T00:00:00Z"  // optional | ISO 8601 | must be in the future
}
```

#### Response 201

```json
{
  "data": {
    "id": "clxtask01",
    "title": "Implement login",
    "description": "Using JWT...",
    "status": "TODO",
    "priority": "HIGH",
    "deadline": "2024-12-31T00:00:00.000Z",
    "position": 1024,
    "projectId": "clx123abc",
    "assignee": {
      "id": "clx456def",
      "name": "John Doe",
      "avatarUrl": null
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Task created successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Title is empty, deadline is in the past |
| 403 | `FORBIDDEN` | Not a member of the project |
| 403 | `INVALID_ASSIGNEE` | assigneeId is not a member of the project |
| 404 | `NOT_FOUND` | projectId does not exist |

---

### PATCH /api/v1/tasks/:id

**Description:** Update a task — title, description, status, priority, deadline, assignee, position
**Auth:** JwtAuthGuard
**Permission:** Any member of the project can update it

#### Request Body

> All fields are optional — only the fields provided are updated.

```json
{
  "title": "Updated title",            // optional | string | max 200
  "description": "New desc",          // optional | string | max 2000
  "status": "IN_PROGRESS",            // optional | enum TaskStatus | must follow transition rules
  "priority": "URGENT",               // optional | enum TaskPriority
  "deadline": "2024-12-31T00:00:00Z", // optional | ISO 8601 | future or null
  "assigneeId": "clx456def",          // optional | string | cuid | null to unassign
  "position": 2048                    // optional | number | used when dragging on the Kanban board
}
```

#### Response 200

```json
{
  "data": {
    "id": "clxtask01",
    "title": "Updated title",
    "status": "IN_PROGRESS",
    "priority": "URGENT",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "message": "Task updated successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Deadline is in the past, title is empty |
| 400 | `INVALID_STATUS_TRANSITION` | Invalid status transition |
| 403 | `FORBIDDEN` | Not a member of the project |
| 403 | `INVALID_ASSIGNEE` | assigneeId is not a member |
| 404 | `NOT_FOUND` | Task does not exist |

---

### DELETE /api/v1/tasks/:id

**Description:** Delete a task (soft delete)
**Auth:** JwtAuthGuard
**Permission:** Project OWNER or task creator

#### Response 200

```json
{
  "message": "Task deleted successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 403 | `FORBIDDEN` | Not the OWNER or creator |
| 404 | `NOT_FOUND` | Task does not exist |

---

## Comment Endpoints

---

### GET /api/v1/tasks/:id/comments

**Description:** Get the list of comments for a task
**Auth:** JwtAuthGuard
**Permission:** Must be a member of the project that contains the task

#### Query Parameters

| Param | Type | Required | Default | Description |
|---|---|---|---|---|
| page | number | No | 1 | — |
| limit | number | No | 50 | max 100 |

#### Response 200

```json
{
  "data": [
    {
      "id": "clxcomment1",
      "content": "This is blocked by #task-123",
      "author": {
        "id": "clx456def",
        "name": "John Doe",
        "avatarUrl": null
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  }
}
```

---

### POST /api/v1/tasks/:id/comments

**Description:** Add a comment to a task
**Auth:** JwtAuthGuard
**Permission:** Must be a member of the project

#### Request Body

```json
{
  "content": "This is blocked by..."  // required | string | max 2000 | markdown | trim
}
```

#### Response 201

```json
{
  "data": {
    "id": "clxcomment1",
    "content": "This is blocked by...",
    "author": {
      "id": "clx456def",
      "name": "John Doe",
      "avatarUrl": null
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Comment added successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Content is empty after trimming |
| 403 | `FORBIDDEN` | Not a member of the project |
| 404 | `NOT_FOUND` | Task does not exist |

---

### PATCH /api/v1/comments/:id

**Description:** Edit a comment — only the author can edit it
**Auth:** JwtAuthGuard
**Permission:** Comment author

#### Request Body

```json
{
  "content": "Updated comment"   // required | string | max 2000 | markdown | trim
}
```

#### Response 200

```json
{
  "data": {
    "id": "clxcomment1",
    "content": "Updated comment",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "message": "Comment updated successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Content is empty |
| 403 | `FORBIDDEN` | Not the author |
| 404 | `NOT_FOUND` | Comment does not exist |

---

### DELETE /api/v1/comments/:id

**Description:** Delete a comment (soft delete) — only the author can delete it
**Auth:** JwtAuthGuard
**Permission:** Comment author

#### Response 200

```json
{
  "message": "Comment deleted successfully"
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 403 | `FORBIDDEN` | Not the author |
| 404 | `NOT_FOUND` | Comment does not exist |

---

## Storage Endpoints

---

### GET /api/v1/storage/presigned-url

**Description:** Get a presigned URL to upload a file directly to R2
**Auth:** JwtAuthGuard

#### Query Parameters

| Param | Type | Required | Description |
|---|---|---|---|
| filename | string | Yes | Original filename — used to get the extension |
| type | string | Yes | MIME type — image/jpeg, image/png, image/webp, application/pdf |
| folder | string | Yes | avatars | attachments |

#### Response 200

```json
{
  "data": {
    "uploadUrl": "https://r2.cloudflare.com/bucket/avatars/clx123abc/...",
    "fileUrl": "https://pub-xxx.r2.dev/avatars/clx123abc/timestamp-filename.jpg",
    "expiresIn": 300
  }
}
```

#### Errors

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Unsupported MIME type |
| 400 | `FILE_TOO_LARGE` | Filename suggests a file > 10MB (checked on the client) |

---

## DTO Reference

> Claude follows this pattern for the entire DTO layer — don't change the decorators or convention on your own.

```typescript
// create-task.dto.ts — sample pattern
import {
  IsString, IsNotEmpty, IsOptional, IsEnum,
  IsDateString, MaxLength, IsCuid
} from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200, { message: 'Title must be at most 200 characters' })
  @Transform(({ value }) => value?.trim())
  title: string

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string

  @IsString()
  @IsNotEmpty()
  projectId: string

  @IsString()
  @IsOptional()
  assigneeId?: string

  @IsEnum(TaskPriority, { message: 'Invalid priority value' })
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM

  @IsDateString({}, { message: 'Deadline must be a valid ISO date' })
  @IsOptional()
  deadline?: string
  // Validating deadline > now() is moved to the service layer
}

// update-task.dto.ts — always use PartialType
import { PartialType } from '@nestjs/mapped-types'
import { CreateTaskDto } from './create-task.dto'

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
```

---

## References

- PRD: `docs/PRD.md`
- Architecture: `docs/Architecture.md`
- Database: `docs/Database.md`
- Coding Convention: `docs/CodingConvention.md`

> **Versions & packages:** see `stack.config.yaml` at the repo root — this is the source of truth. This doc only describes patterns.

# [Product Name] — Architecture

> **How to use this file:**
> - This file is the technical source of truth — Claude reads it before generating any code
> - Delete every `>` (note) block before using this for real
> - When you change the stack or a pattern → update this file immediately in the same PR
> - Claude reads this file to understand "How" — how the system works

---

## System Overview

> Text diagram — Claude can read it, no image needed.
> Clearly state the deploy platform for each service — Claude generates the correct config.

**Pattern:** [Monolith / Modular Monolith / Microservices]
**Communication:** [REST / GraphQL / gRPC]
**Auth:** [JWT / Session / OAuth]
**Realtime:** [Polling / WebSocket / SSE / None]

### System Diagram

```
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│   React 18 App   │──────▶ │   NestJS API     │──────▶ │   PostgreSQL     │
│   (Vercel)       │        │   (Railway)      │        │   (Neon)         │
└──────────────────┘        └──────────────────┘        └──────────────────┘
                                     │
                        ┌────────────┴────────────┐
                        │                         │
               ┌────────┴────────┐      ┌─────────┴────────┐
               │     Redis       │      │   Cloudflare R2  │
               │   (Upstash)     │      │   (File Storage) │
               └─────────────────┘      └──────────────────┘
```

### Data Flow

```
Client Request
      ↓
Vercel CDN (static assets)
      ↓
NestJS API (Railway)
      ↓
  ┌───┴───┐
  │       │
Neon   Upstash Redis
(DB)   (Cache / Queue)
```

---

## Frontend

> Concrete folder structure → Claude knows where to put files right the first time.
> No need for further explanation once the folder structure is clear.

**Framework:** React 18 + TypeScript
**Build tool:** Vite
**Styling:** Tailwind CSS + shadcn/ui
**State:** Zustand (global) + TanStack Query v5 (server state)
**Routing:** React Router v6
**Form:** React Hook Form + Zod
**HTTP:** Axios

### Folder Structure

```
src/
├── components/           ← Shared, reusable UI components
│   ├── ui/               ← shadcn/ui components (do not modify)
│   └── common/           ← Custom shared components
├── features/             ← Feature modules (one folder per feature)
│   └── [feature]/
│       ├── components/   ← UI used only within this feature
│       ├── hooks/        ← Custom hooks for the feature
│       ├── services/     ← API calls for the feature
│       ├── stores/       ← Zustand store for the feature (if needed)
│       └── types/        ← TypeScript types for the feature
├── hooks/                ← Shared hooks
├── layouts/              ← Layout components (AppLayout, AuthLayout)
├── pages/                ← Route-level components
├── services/             ← Shared: axios instance + auth service
├── stores/               ← Shared Zustand stores
├── types/                ← Shared TypeScript types
├── utils/                ← Helper functions
└── constants/            ← App-wide constants and enums
```

### Routing Convention

```
/                    → Redirect to /dashboard if logged in, /login if not
/login               → AuthLayout — public
/register            → AuthLayout — public
/dashboard           → AppLayout — protected
/projects            → AppLayout — protected
/projects/:id        → AppLayout — protected
/projects/:id/tasks  → AppLayout — protected
/profile             → AppLayout — protected
```

### API Client Convention

```typescript
// All API calls go through this axios instance
// File: src/services/axios.ts

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // Automatically sends the httpOnly cookie
})

// Interceptor: automatically attach accessToken
// Interceptor: automatically refresh on receiving 401 TOKEN_EXPIRED
// Interceptor: redirect to /login on receiving 401 SESSION_EXPIRED
```

### Environment Variables (Frontend)

```bash
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=[App Name]
VITE_APP_ENV=development        # development | staging | production
```

---

## Backend

> The Module Pattern matters most — Claude must follow this exact order
> for every feature, without skipping any file.

**Framework:** NestJS + TypeScript (strict mode)
**ORM:** Prisma
**Validation:** class-validator + class-transformer
**Testing:** Jest (unit) + Supertest (e2e)
**Docs:** Swagger / OpenAPI

### Folder Structure

```
src/
├── modules/
│   └── [feature]/
│       ├── [feature].module.ts
│       ├── [feature].controller.ts
│       ├── [feature].service.ts
│       ├── [feature].spec.ts
│       └── dto/
│           ├── create-[feature].dto.ts
│           ├── update-[feature].dto.ts
│           └── query-[feature].dto.ts
├── common/
│   ├── decorators/       ← @CurrentUser(), @Roles(), @Public()
│   ├── filters/          ← GlobalExceptionFilter
│   ├── guards/           ← JwtAuthGuard, RolesGuard
│   ├── interceptors/     ← ResponseInterceptor, LoggingInterceptor
│   └── pipes/            ← ValidationPipe config
├── config/               ← App configuration (env, jwt, database)
├── prisma/               ← Schema + migrations + seed
└── main.ts
```

### Module Pattern — Claude always follows this order

```
When creating a new feature, create files in this exact order:

1. dto/create-[feature].dto.ts       ← Validation rules
2. dto/update-[feature].dto.ts       ← Extend PartialType from Create
3. dto/query-[feature].dto.ts        ← Filter + pagination (if needed)
4. [feature].service.ts              ← Business logic + Prisma calls
5. [feature].controller.ts           ← Routes + Guards + Decorators
6. [feature].module.ts               ← Register providers + imports
7. Register in AppModule             ← Import the new module into the app
```

### Response Format Convention

```typescript
// Single resource — 200 OK
{
  "data": { ... },
  "message": "Success"
}

// Created — 201 Created
{
  "data": { ... },
  "message": "[Resource] created successfully"
}

// Paginated list — 200 OK
{
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}

// Delete / action — 200 OK
{
  "message": "[Resource] deleted successfully"
}
```

### Environment Variables (Backend)

```bash
# App
PORT=3000
NODE_ENV=development          # development | staging | production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=public

# JWT
JWT_SECRET=YOUR_JWT_SECRET_HERE
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=YOUR_REFRESH_SECRET_HERE
REFRESH_TOKEN_EXPIRES_IN=7d

# Redis (Upstash)
REDIS_URL=redis://default:pass@host:6379

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=YOUR_ACCOUNT_ID
R2_ACCESS_KEY_ID=YOUR_ACCESS_KEY
R2_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
R2_BUCKET_NAME=YOUR_BUCKET_NAME
R2_PUBLIC_URL=https://pub-xxx.r2.dev

# Email (Resend)
RESEND_API_KEY=YOUR_RESEND_KEY
EMAIL_FROM=noreply@yourdomain.com
```

---

## Database

> See detailed schema, relationships, and indexes at: docs/Database.md
> This section only covers convention and connection.

**Database:** PostgreSQL 15
**ORM:** Prisma
**Hosting:** Neon (dev + staging) / RDS (production)
**Migration:** Prisma Migrate

### Naming Convention

| Component | Convention | Example |
|---|---|---|
| Table | snake_case, plural | `users`, `task_items` |
| Column | snake_case | `created_at`, `user_id` |
| Primary Key | String, cuid() | `id String @id @default(cuid())` |
| Foreign Key | [singular]_id | `user_id`, `project_id` |
| Enum | PascalCase | `TaskStatus`, `UserRole` |
| Index | idx_[table]_[column] | `idx_tasks_user_id` |

### Timestamp Convention

```prisma
// Every model must have these 3 fields
createdAt  DateTime  @default(now())
updatedAt  DateTime  @updatedAt
deletedAt  DateTime?             // Soft delete — never hard delete
```

### Connection

```bash
DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"
```

---

## Authentication

> Step-by-step flow + Guards + Decorators → Claude implements the correct pattern right away.
> This strategy must not be changed without an explicit requirement.

**Strategy:** JWT — Access Token + Refresh Token
**Library:** @nestjs/jwt + passport-jwt
**Password:** bcrypt, salt rounds = 12

### Token Flow

```
1. POST /api/v1/auth/login
   → Server verifies email + password
   → Creates accessToken (15m) + refreshToken (7d)
   → Returns accessToken in the body
   → Sets refreshToken in an httpOnly cookie

2. Every subsequent request:
   → Client sends: Authorization: Bearer [accessToken]
   → Server verifies accessToken
   → Injects user into the request object

3. accessToken expired (401 TOKEN_EXPIRED):
   → Client automatically calls POST /api/v1/auth/refresh
   → Server verifies refreshToken from the httpOnly cookie
   → Returns a new accessToken

4. refreshToken expired (401 SESSION_EXPIRED):
   → Client redirects to /login
   → User must log in again

5. POST /api/v1/auth/logout
   → Server removes refreshToken from the DB
   → Server clears the httpOnly cookie
```

### Token Storage

```
accessToken   → Stored in memory (a JS variable)
              → NEVER localStorage, NEVER sessionStorage
refreshToken  → httpOnly cookie (set by the server, unreadable by the client)
```

### Guards & Decorators

| Guard / Decorator | File | Used for |
|---|---|---|
| `JwtAuthGuard` | common/guards/ | Routes requiring login |
| `RolesGuard` | common/guards/ | Routes with role-based access |
| `RefreshGuard` | common/guards/ | Only for /auth/refresh |
| `@CurrentUser()` | common/decorators/ | Get user from JWT payload |
| `@Roles('admin')` | common/decorators/ | Attach required role |
| `@Public()` | common/decorators/ | Bypass JwtAuthGuard |

### Applied Globally

```typescript
// main.ts — applied to the whole app
app.useGlobalGuards(new JwtAuthGuard())

// To bypass JwtAuthGuard for a public route:
@Public()
@Post('login')
login() { ... }
```

---

## Error Handling

> Standard format → Claude generates consistent error handling across the app.
> Every exception goes through the GlobalExceptionFilter.

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

### Error Codes

| Code | HTTP | Used when |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid input |
| `UNAUTHORIZED` | 401 | Not logged in |
| `TOKEN_EXPIRED` | 401 | Access token expired |
| `SESSION_EXPIRED` | 401 | Refresh token expired |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `FORBIDDEN` | 403 | No permission |
| `EMAIL_NOT_VERIFIED` | 403 | Email not yet verified |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Convention

```
✅ Every exception goes through the GlobalExceptionFilter
✅ Use NestJS built-ins: NotFoundException, ForbiddenException...
✅ Log all 5xx errors with a stack trace
❌ Never throw a raw Error in the controller/service
❌ Never expose a stack trace to the client in production
❌ Never use a status code outside the table above
```

---

## Storage

> Upload flow via presigned URL — bypasses the server, reducing bandwidth.

**Provider:** Cloudflare R2
**SDK:** @aws-sdk/client-s3 (R2 is S3-API compatible)
**CDN:** Cloudflare (automatic via the R2 public bucket)

### Upload Flow

```
1. Client → GET /api/v1/storage/presigned-url
           ?filename=avatar.jpg&type=image/jpeg

2. Server → Generates a presigned URL (expires in 5 minutes)
          → Returns { uploadUrl, fileUrl }

3. Client → PUT [uploadUrl] with the binary file
          → Uploads directly to R2, bypassing the server

4. Client → PATCH /api/v1/users/avatar
           { avatarUrl: fileUrl }
          → Server saves the URL to the DB
```

### Limits

```
Max file size:  10MB
Allowed types:  image/jpeg, image/png, image/webp, application/pdf
Presigned URL:  Expires after 5 minutes
```

### Folder Convention on R2

```
[bucket]/
├── avatars/[userId]/[timestamp]-[filename]
├── attachments/[taskId]/[timestamp]-[filename]
└── temp/[filename]     ← Automatically deleted after 24h if not confirmed
```

---

## Queue / Background Jobs

**Provider:** BullMQ + Redis (Upstash)
**Use case:** Email notifications, cleanup jobs

### Jobs

| Job | Queue | Trigger | Retry |
|---|---|---|---|
| `send-email` | `email:send` | Task assign, invite | 3 times, 1m backoff |
| `cleanup-temp` | `storage:cleanup` | Cron 00:00 UTC | 1 time |

---

## Third-party Services

> Specify the SDK clearly → Claude imports the correct package, avoiding mistakes.

| Service | Provider | Use case | Package |
|---|---|---|---|
| Email | Resend | Transactional email | `resend` |
| Storage | Cloudflare R2 | File upload | `@aws-sdk/client-s3` |
| Cache/Queue | Upstash Redis | BullMQ jobs | `ioredis` |
| Error tracking | Sentry | Monitor 5xx | `@sentry/nestjs` |

---

## Non-Functional Decisions

> Important technical decisions — Claude must not change these on its own.

| Decision | Reason |
|---|---|
| cuid() instead of auto-increment | Doesn't expose record counts, safe when merging data |
| Soft delete (deletedAt) instead of hard delete | Audit trail, can be restored |
| Refresh token stored in DB | Individual sessions can be revoked |
| accessToken in memory | Safer than localStorage (XSS-proof) |
| Upload via presigned URL | Bypasses the server, saves bandwidth |
| httpOnly cookie for refresh token | Cannot be read by JS (XSS-proof) |

---

## References

- PRD: `docs/PRD.md`
- Database Schema: `docs/Database.md`
- API Specification: `docs/API.md`
- UI Components: `docs/UI.md`
- Coding Convention: `docs/CodingConvention.md`

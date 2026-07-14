> **Stack:** Do not hardcode Nest/Laravel/Django here. Set `backend.framework` / `frontend.framework` in `stack.config.yaml` and follow `stacks/<framework>/CONVENTION.md`. This doc describes product architecture only.

# [Product Name] — Architecture

> **How to use this template:**
> - Remove all `>` blockquote (notes) sections before actual use
> - Keep only the sections relevant to the project
> - Every section must be specific enough for Claude to generate code without asking again

---

## System Overview

> Describe the system at the highest level. Use a text diagram — Claude can read it without needing an image.

**Pattern:** [Monolith / Modular Monolith / Microservices]
**Communication:** [REST / GraphQL / gRPC]
**Deployment:** [Single server / Containerized / Serverless]

### Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   [Frontend]    │────▶│   [Backend]     │────▶│   [Database]    │
│   (Vercel)      │     │   (Railway)     │     │   (Neon)        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                   ┌────────────┴────────────┐
                   │                         │
          ┌────────┴────────┐      ┌─────────┴────────┐
          │     [Redis]     │      │    [Storage]     │
          │   (Upstash)     │      │  (Cloudflare R2) │
          └─────────────────┘      └──────────────────┘
```

**Example:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  React App  │────▶│  NestJS API │────▶│  PostgreSQL  │
│  (Vercel)   │     │  (Railway)  │     │   (Neon)    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │    Redis    │
                    │  (Upstash)  │
                    └─────────────┘
```

---

## Frontend

> A specific folder structure helps Claude know exactly where to create files the first time.

**Framework:** [React 18 / Next.js 14 / Vue 3] + TypeScript
**Styling:** [Tailwind CSS / shadcn/ui / MUI]
**State Management:** [Zustand / Redux Toolkit / Jotai]
**Data Fetching:** [TanStack Query v5 / SWR]
**Routing:** [React Router v6 / Next.js App Router]
**Form:** [React Hook Form + Zod]
**HTTP Client:** [Axios / Fetch]

### Folder Structure

```
src/
├── components/          ← Shared UI components (Button, Modal, Input...)
├── pages/               ← Route-level components
├── features/            ← Feature modules
│   └── [feature]/
│       ├── components/  ← UI used only within this feature
│       ├── hooks/       ← Custom hooks for the feature
│       ├── services/    ← API calls for the feature
│       └── types/       ← TypeScript types for the feature
├── hooks/               ← Shared hooks
├── services/            ← Shared API calls + axios instance
├── stores/              ← Global state (Zustand stores)
├── types/               ← Shared TypeScript types
├── utils/               ← Helper functions
└── constants/           ← App-wide constants
```

### API Client Convention

```typescript
// All API calls must go through this axios instance
// File: src/services/axios.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // To send the httpOnly cookie
})
```

### Environment Variables

```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=[App Name]
VITE_APP_ENV=development
```

---

## Backend

> Clearly describe the Module Pattern — Claude follows the exact order, without skipping any files.

**Framework:** [NestJS / Express / Fastify] + TypeScript
**ORM:** [Prisma / TypeORM / Drizzle]
**Validation:** [class-validator + class-transformer / Zod]
**Testing:** [Jest + Supertest]

### Folder Structure

```
src/
├── modules/
│   └── [feature]/
│       ├── [feature].module.ts
│       ├── [feature].controller.ts
│       ├── [feature].service.ts
│       ├── dto/
│       │   ├── create-[feature].dto.ts
│       │   └── update-[feature].dto.ts
│       └── [feature].spec.ts
├── common/
│   ├── decorators/      ← Custom decorators (@CurrentUser, @Roles...)
│   ├── filters/         ← Exception filters
│   ├── guards/          ← Auth guards
│   ├── interceptors/    ← Response interceptors
│   └── pipes/           ← Validation pipes
├── config/              ← App configuration
├── prisma/              ← Prisma schema + migrations
└── main.ts
```

### Module Pattern — Claude Always Follows This Order

```
When creating a new feature, always create files in this order:
1. [feature].module.ts       ← Module declaration
2. [feature].controller.ts   ← Route definitions
3. [feature].service.ts      ← Business logic
4. dto/create-[feature].dto.ts
5. dto/update-[feature].dto.ts
6. Register in AppModule
```

### Response Format Convention

```typescript
// Success response
{
  "data": { ... },
  "message": "Success",
  "statusCode": 200
}

// Paginated response
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### Environment Variables

```
# App
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# [Add variables depending on the services used]
```

---

## Database

> A clear naming convention → Claude generates a consistent schema without asking again.

**Database:** [PostgreSQL 15 / MySQL 8 / MongoDB]
**ORM:** [Prisma / TypeORM / Drizzle]
**Hosting:** [Neon / Supabase / RDS / PlanetScale]
**Migration:** [Prisma Migrate / TypeORM Migration]

### Naming Convention

| Element | Convention | Example |
|---|---|---|
| Table name | snake_case, plural | `users`, `task_items` |
| Column name | snake_case | `created_at`, `user_id` |
| Primary Key | uuid or cuid | `id String @id @default(cuid())` |
| Foreign Key | [table_singular]_id | `user_id`, `project_id` |
| Index | idx_[table]_[column] | `idx_tasks_user_id` |
| Enum | PascalCase | `TaskStatus`, `UserRole` |

### Timestamp Convention

```
Every table must have:
- created_at DateTime @default(now())
- updated_at DateTime @updatedAt
- deleted_at DateTime? ← Soft delete, never hard delete
```

### Connection

```
DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"
```

---

## Authentication

> Step-by-step flow + Guards/Decorators → Claude implements auth correctly right away.

**Strategy:** [JWT Access Token + Refresh Token / Session / OAuth]
**Library:** [@nestjs/jwt + passport-jwt]
**Password:** [bcrypt, salt rounds = 12]

### Token Flow

```
1. POST /auth/login
   → Returns accessToken (15m) in the body
   → Returns refreshToken (7d) in an httpOnly cookie

2. Every request is sent with:
   Authorization: Bearer [accessToken]

3. When accessToken expires:
   → The client automatically calls POST /auth/refresh
   → The server verifies the refreshToken from the cookie
   → Returns a new accessToken

4. When refreshToken expires:
   → Returns 401 { code: "SESSION_EXPIRED" }
   → The client redirects to /login

5. Logout:
   → POST /auth/logout
   → The server removes the refreshToken from the DB
   → Clears the httpOnly cookie
```

### Token Storage

```
accessToken  → Stored in memory (a JS variable), NEVER in localStorage
refreshToken → Stored in an httpOnly cookie (set by the server)
```

### Guards

| Guard | Used for | How to use |
|---|---|---|
| `JwtAuthGuard` | Routes requiring login | `@UseGuards(JwtAuthGuard)` |
| `RolesGuard` | Routes restricted by role | `@UseGuards(JwtAuthGuard, RolesGuard)` |
| `RefreshGuard` | /auth/refresh only | `@UseGuards(RefreshGuard)` |

### Decorators

| Decorator | Description | Example |
|---|---|---|
| `@CurrentUser()` | Gets the user from the JWT payload | `@CurrentUser() user: User` |
| `@Roles('admin')` | Attaches a role to the route | `@Roles('admin', 'member')` |
| `@Public()` | Bypasses JwtAuthGuard | Used for /auth/login, /auth/register |

---

## Storage

> Only add this section if the app has file uploads.

**Provider:** [AWS S3 / Cloudflare R2 / Supabase Storage]
**SDK:** [@aws-sdk/client-s3]
**Max file size:** [10MB]
**Allowed types:** [image/jpeg, image/png, application/pdf]
**CDN:** [CloudFront / Cloudflare]

### Upload Flow

```
1. Client requests a presigned URL
   GET /storage/presigned-url?filename=avatar.jpg&type=image/jpeg

2. Server generates a presigned URL (expires in 5 minutes)
   → Returns { uploadUrl, fileUrl }

3. Client uploads directly to S3
   PUT [uploadUrl] with the binary file

4. Client sends the fileUrl to the API to save in the DB
   PATCH /users/avatar { avatarUrl: fileUrl }
```

### S3 Folder Convention

```
[bucket]/
├── avatars/[userId]/[filename]
├── attachments/[taskId]/[filename]
└── temp/[filename]           ← Deleted after 24h if not confirmed
```

---

## Queue / Background Jobs

> Only add this section if the app has background processing.

**Provider:** [BullMQ + Redis / Upstash QStash]
**Redis:** [Upstash Redis]

### Jobs

| Job Name | Trigger | Description | Retry |
|---|---|---|---|
| `send-email` | Task assign, invite | Send email via Resend | 3 times |
| `resize-image` | Avatar upload | Resize to 200x200 | 2 times |
| `cleanup-temp` | Cron 00:00 UTC | Delete temp files > 24h old | 1 time |

### Queue Convention

```
Queue name: [domain]:[action]
Example: email:send, image:resize, task:notify
```

---

## Error Handling

> A standard error format → Claude generates consistent error handling across the whole app.

### API Error Response Format

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Title is required",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/tasks"
}
```

### Error Codes

| Code | HTTP Status | When to use |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid input |
| `UNAUTHORIZED` | 401 | Not logged in |
| `TOKEN_EXPIRED` | 401 | Access token has expired |
| `SESSION_EXPIRED` | 401 | Refresh token has expired |
| `FORBIDDEN` | 403 | No permission |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Convention

```
- All exceptions must go through the GlobalExceptionFilter
- Never throw a raw Error in a controller/service
- Use NestJS built-in exceptions: NotFoundException, ForbiddenException...
- Log all 5xx errors with a stack trace
- Never expose the stack trace to the client in production
```

---

## Third-party Services

> Clearly note the SDK → Claude imports the correct package, avoiding mistakes.

| Service | Provider | Use case | SDK/Package |
|---|---|---|---|
| Email | [Resend / SendGrid] | Transactional email | `resend` |
| Storage | [Cloudflare R2 / S3] | File upload | `@aws-sdk/client-s3` |
| Payment | [Stripe] | Subscription | `stripe` |
| Analytics | [PostHog] | User tracking | `posthog-js` |
| Monitoring | [Sentry] | Error tracking | `@sentry/nestjs` |
| SMS | [Twilio] | OTP | `twilio` |

---

## Non-Functional Architecture Decisions

> Important technical decisions — Claude must not change these on its own.

| Decision | Reason |
|---|---|
| Use UUID instead of auto-increment | Avoids exposing record counts, easier to merge data |
| Soft delete instead of hard delete | Audit trail, ability to recover data |
| Refresh token stored in DB | Allows revoking individual sessions |
| accessToken kept in memory | More secure than localStorage |
| Presigned URL for uploads | Bypasses the server, reduces bandwidth |

---

## References

- PRD: `docs/PRD.md`
- Database Schema: `docs/Database.md`
- API Spec: `docs/API.md`
- Coding Convention: `docs/CodingConvention.md`

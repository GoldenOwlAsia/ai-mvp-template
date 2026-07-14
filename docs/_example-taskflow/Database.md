# [Product Name] — Database

> **How to use this file:**
> - Delete every `>` (note) block before using this for real
> - Fill in every field completely — missing fields will cause Claude to guess incorrectly
> - When you change the schema → update this file immediately in the same PR
> - Claude reads this file when: generating a schema, migration, service, or seed data

---

## Enums

> Define all enums first — Claude needs to know the valid values
> before generating entities or business logic.

### UserRole

| Value | Description | Used when |
|---|---|---|
| `ADMIN` | Workspace administrator | Creating projects, managing members |
| `MEMBER` | Regular member | Performing assigned tasks |

### TaskStatus

| Value | Description | Valid transitions |
|---|---|---|
| `TODO` | Not started | → IN_PROGRESS |
| `IN_PROGRESS` | In progress | → TODO, DONE, CANCELLED |
| `DONE` | Completed | → IN_PROGRESS |
| `CANCELLED` | Cancelled | → TODO |

> Clearly state valid transitions → Claude generates the correct state machine,
> preventing arbitrary status changes.

### TaskPriority

| Value | Description |
|---|---|
| `LOW` | Low priority — can be delayed |
| `MEDIUM` | Medium priority — default |
| `HIGH` | High priority — needs to be done soon |
| `URGENT` | Urgent — do it today |

### ProjectMemberRole

| Value | Description |
|---|---|
| `OWNER` | Project creator, has full permissions |
| `MEMBER` | Project member |

---

## Entities

> Complete field tables → Claude generates the Prisma model 100% accurately.
> Don't write plain descriptions — always provide a concrete table.

---

### Entity: User

| Field | Type | Nullable | Default | Constraint | Note |
|---|---|---|---|---|---|
| id | String | No | cuid() | PK | Primary key |
| email | String | No | — | UNIQUE, max 255 | Lowercase before saving |
| password | String | No | — | — | Bcrypt hash, never exposed |
| name | String | No | — | max 100 | Display name |
| role | UserRole | No | MEMBER | — | Enum |
| avatarUrl | String | Yes | null | — | URL to R2 storage |
| isVerified | Boolean | No | false | — | Whether email is verified |
| lastLoginAt | DateTime | Yes | null | — | Updated on every login |
| createdAt | DateTime | No | now() | — | Auto |
| updatedAt | DateTime | No | updatedAt | — | Auto |
| deletedAt | DateTime | Yes | null | — | Soft delete |

---

### Entity: RefreshToken

> Stores the refresh token so individual sessions can be revoked.

| Field | Type | Nullable | Default | Constraint | Note |
|---|---|---|---|---|---|
| id | String | No | cuid() | PK | — |
| token | String | No | — | UNIQUE | Hashed refresh token |
| userId | String | No | — | FK → users.id | — |
| expiresAt | DateTime | No | — | — | Expiration time |
| createdAt | DateTime | No | now() | — | Auto |

---

### Entity: Project

| Field | Type | Nullable | Default | Constraint | Note |
|---|---|---|---|---|---|
| id | String | No | cuid() | PK | — |
| name | String | No | — | max 100 | — |
| description | String | Yes | null | max 500 | — |
| color | String | No | '#6366f1' | max 7 | Hex color for UI |
| ownerId | String | No | — | FK → users.id | Project creator |
| createdAt | DateTime | No | now() | — | Auto |
| updatedAt | DateTime | No | updatedAt | — | Auto |
| deletedAt | DateTime | Yes | null | — | Soft delete |

---

### Entity: ProjectMember

> Junction table — User joins Project.

| Field | Type | Nullable | Default | Constraint | Note |
|---|---|---|---|---|---|
| id | String | No | cuid() | PK | — |
| projectId | String | No | — | FK → projects.id | — |
| userId | String | No | — | FK → users.id | — |
| role | ProjectMemberRole | No | MEMBER | — | Enum |
| joinedAt | DateTime | No | now() | — | Auto |

> UNIQUE constraint: (projectId, userId) — a user can only join a project once.

---

### Entity: Task

| Field | Type | Nullable | Default | Constraint | Note |
|---|---|---|---|---|---|
| id | String | No | cuid() | PK | — |
| title | String | No | — | max 200 | — |
| description | String | Yes | null | max 2000 | Markdown |
| status | TaskStatus | No | TODO | — | Enum |
| priority | TaskPriority | No | MEDIUM | — | Enum |
| deadline | DateTime | Yes | null | > createdAt | Must be in the future |
| position | Float | No | — | — | Used to sort within a Kanban column |
| projectId | String | No | — | FK → projects.id | — |
| assigneeId | String | Yes | null | FK → users.id | Nullable — not yet assigned |
| createdBy | String | No | — | FK → users.id | Task creator |
| createdAt | DateTime | No | now() | — | Auto |
| updatedAt | DateTime | No | updatedAt | — | Auto |
| deletedAt | DateTime | Yes | null | — | Soft delete |

---

### Entity: Comment

| Field | Type | Nullable | Default | Constraint | Note |
|---|---|---|---|---|---|
| id | String | No | cuid() | PK | — |
| content | String | No | — | max 2000 | Markdown |
| taskId | String | No | — | FK → tasks.id | — |
| authorId | String | No | — | FK → users.id | — |
| createdAt | DateTime | No | now() | — | Auto |
| updatedAt | DateTime | No | updatedAt | — | Auto |
| deletedAt | DateTime | Yes | null | — | Soft delete |

---

## Relationships

> Clearly state the ON DELETE behavior — Claude generates the migration correctly,
> avoiding FK constraint errors.

### User — RefreshToken (One-to-Many)

- **Description:** A User has many RefreshTokens (multiple sessions)
- **FK:** `refresh_tokens.user_id` → `users.id`
- **ON DELETE:** CASCADE — deleting a user deletes all their tokens
- **Nullable:** userId NOT NULL

### User — Project (One-to-Many — ownership)

- **Description:** A User can own many Projects
- **FK:** `projects.owner_id` → `users.id`
- **ON DELETE:** RESTRICT — cannot delete a user who still owns a project
- **Nullable:** ownerId NOT NULL

### User — Project (Many-to-Many via ProjectMember)

- **Description:** A User belongs to many Projects, a Project has many Members
- **Junction:** `project_members`
- **FK 1:** `project_members.user_id` → `users.id` — ON DELETE CASCADE
- **FK 2:** `project_members.project_id` → `projects.id` — ON DELETE CASCADE
- **Extra fields:** role, joinedAt

### Project — Task (One-to-Many)

- **Description:** A Project has many Tasks
- **FK:** `tasks.project_id` → `projects.id`
- **ON DELETE:** CASCADE — deleting a project deletes all its tasks
- **Nullable:** projectId NOT NULL

### User — Task (One-to-Many — assignee)

- **Description:** A User can be assigned many Tasks
- **FK:** `tasks.assignee_id` → `users.id`
- **ON DELETE:** SET NULL — deleting a user leaves the task intact, assignee = null
- **Nullable:** assigneeId nullable — a task may not yet be assigned

### User — Task (One-to-Many — creator)

- **Description:** A User can create many Tasks
- **FK:** `tasks.created_by` → `users.id`
- **ON DELETE:** RESTRICT — cannot delete a user who still has tasks they created
- **Nullable:** createdBy NOT NULL

### Task — Comment (One-to-Many)

- **Description:** A Task has many Comments
- **FK:** `comments.task_id` → `tasks.id`
- **ON DELETE:** CASCADE — deleting a task deletes all its comments
- **Nullable:** taskId NOT NULL

### User — Comment (One-to-Many — author)

- **Description:** A User can write many Comments
- **FK:** `comments.author_id` → `users.id`
- **ON DELETE:** RESTRICT — cannot delete a user who still has comments
- **Nullable:** authorId NOT NULL

---

## Indexes

> State the reason clearly — Claude should not remove an index during refactoring.

### users

| Index | Columns | Type | Reason |
|---|---|---|---|
| `idx_users_email` | email | UNIQUE | Login, duplicate check |
| `idx_users_deleted_at` | deletedAt | NORMAL | Filter soft-deleted rows |

### refresh_tokens

| Index | Columns | Type | Reason |
|---|---|---|---|
| `idx_refresh_tokens_token` | token | UNIQUE | Lookup during verification |
| `idx_refresh_tokens_user_id` | userId | NORMAL | List a user's sessions |

### projects

| Index | Columns | Type | Reason |
|---|---|---|---|
| `idx_projects_owner_id` | ownerId | NORMAL | List a user's projects |
| `idx_projects_deleted_at` | deletedAt | NORMAL | Filter soft-deleted rows |

### project_members

| Index | Columns | Type | Reason |
|---|---|---|---|
| `uq_project_members` | (projectId, userId) | UNIQUE | Each user joins once |
| `idx_pm_project_id` | projectId | NORMAL | List a project's members |
| `idx_pm_user_id` | userId | NORMAL | List a user's projects |

### tasks

| Index | Columns | Type | Reason |
|---|---|---|---|
| `idx_tasks_project_id` | projectId | NORMAL | List tasks by project |
| `idx_tasks_assignee_id` | assigneeId | NORMAL | My tasks |
| `idx_tasks_created_by` | createdBy | NORMAL | Tasks I created |
| `idx_tasks_project_status` | (projectId, status) | COMPOSITE | Kanban board query |
| `idx_tasks_project_position` | (projectId, status, position) | COMPOSITE | Sort within a Kanban column |
| `idx_tasks_deleted_at` | deletedAt | NORMAL | Filter soft-deleted rows |

### comments

| Index | Columns | Type | Reason |
|---|---|---|---|
| `idx_comments_task_id` | taskId | NORMAL | List a task's comments |
| `idx_comments_author_id` | authorId | NORMAL | A user's comments |
| `idx_comments_deleted_at` | deletedAt | NORMAL | Filter soft-deleted rows |

---

## Constraints

### DB Layer (enforced by schema)

```
users:
  - email: UNIQUE, NOT NULL, VARCHAR(255)
  - name: NOT NULL, VARCHAR(100)
  - role: NOT NULL, DEFAULT 'MEMBER'
  - isVerified: NOT NULL, DEFAULT false

projects:
  - name: NOT NULL, VARCHAR(100)
  - color: NOT NULL, DEFAULT '#6366f1', VARCHAR(7)
  - ownerId: NOT NULL, FK RESTRICT

project_members:
  - UNIQUE (projectId, userId)
  - role: NOT NULL, DEFAULT 'MEMBER'

tasks:
  - title: NOT NULL, VARCHAR(200)
  - status: NOT NULL, DEFAULT 'TODO'
  - priority: NOT NULL, DEFAULT 'MEDIUM'
  - projectId: NOT NULL, FK CASCADE
  - createdBy: NOT NULL, FK RESTRICT

comments:
  - content: NOT NULL, VARCHAR(2000)
  - taskId: NOT NULL, FK CASCADE
  - authorId: NOT NULL, FK RESTRICT
```

### Application Layer (enforced by DTO + Service)

```
tasks:
  - deadline must be a date in the future (hard to CHECK easily at the DB level)
  - assigneeId must be a member of the project (requires a join query)
  - status transitions must follow the correct flow (TODO→IN_PROGRESS, no skipping)
  - position is calculated automatically on creation (max position in the column + 1)

users:
  - password: min 8 characters, 1 uppercase letter, 1 number (enforced at DTO level)
  - email: lowercase + trimmed before saving (enforced at service level)

project_members:
  - Cannot remove the owner from their own project
  - There must always be at least 1 OWNER in any project
```

---

## Prisma Schema Reference

> Claude follows this pattern for the entire schema.
> Do not change the convention without an explicit requirement.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ───────────────────────────────────────────────────

enum UserRole {
  ADMIN
  MEMBER
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
  CANCELLED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum ProjectMemberRole {
  OWNER
  MEMBER
}

// ─── Models ──────────────────────────────────────────────────

// Sample pattern — Claude follows this for all remaining models
model User {
  id          String    @id @default(cuid())
  email       String    @unique @db.VarChar(255)
  password    String
  name        String    @db.VarChar(100)
  role        UserRole  @default(MEMBER)
  avatarUrl   String?
  isVerified  Boolean   @default(false)
  lastLoginAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?

  // Relations
  refreshTokens  RefreshToken[]
  ownedProjects  Project[]         @relation("ProjectOwner")
  projectMembers ProjectMember[]
  assignedTasks  Task[]            @relation("TaskAssignee")
  createdTasks   Task[]            @relation("TaskCreator")
  comments       Comment[]

  @@index([email])
  @@index([deletedAt])
  @@map("users")
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([userId])
  @@map("refresh_tokens")
}

// [Claude generates the remaining models following the pattern above]
// Project, ProjectMember, Task, Comment
```

### Pattern Claude must follow

```
1. id          → String @id @default(cuid())
2. Timestamps  → createdAt, updatedAt, deletedAt (soft delete)
3. Relation    → Explicit @relation("RelationName") when multiple relations exist on the same model
4. @@map       → snake_case table name
5. @@index     → All FK columns + columns commonly used for filtering
6. @db.VarChar → For length-limited Strings
7. onDelete    → Always explicit, never left as default
```

---

## Common Query Patterns

> Claude knows which queries are used frequently → avoids N+1, uses the right index.

### Frequently used queries

```typescript
// 1. Kanban board — get tasks by project, grouped by status
prisma.task.findMany({
  where: {
    projectId,
    deletedAt: null,
  },
  include: {
    assignee: { select: { id: true, name: true, avatarUrl: true } },
  },
  orderBy: [{ status: 'asc' }, { position: 'asc' }],
})
// → Uses composite index: idx_tasks_project_status

// 2. My tasks — get tasks assigned to the user
prisma.task.findMany({
  where: {
    assigneeId: userId,
    deletedAt: null,
  },
  include: {
    project: { select: { id: true, name: true, color: true } },
  },
  orderBy: { deadline: 'asc' },
})
// → Uses index: idx_tasks_assignee_id

// 3. Check if a user belongs to a project (used before any task operation)
prisma.projectMember.findUnique({
  where: {
    projectId_userId: { projectId, userId },  // Unique index
  },
})

// 4. Login — find user by email
prisma.user.findUnique({
  where: { email: email.toLowerCase() },
})
// → Uses unique index: idx_users_email
```

### Anti-patterns to avoid

```typescript
// ❌ Query inside a loop (N+1)
for (const task of tasks) {
  const assignee = await prisma.user.findUnique({ where: { id: task.assigneeId } })
}
// ✅ Use include
prisma.task.findMany({ include: { assignee: true } })

// ❌ Selecting the entire user (includes the password hash)
prisma.task.findMany({ include: { assignee: true } })
// ✅ Select only the fields needed
prisma.task.findMany({
  include: {
    assignee: { select: { id: true, name: true, avatarUrl: true } },
  },
})

// ❌ Filtering at the application layer
const tasks = await prisma.task.findMany()
const filtered = tasks.filter(t => t.projectId === projectId)
// ✅ Filter within the query
prisma.task.findMany({ where: { projectId, deletedAt: null } })
```

---

## Seed Data

> Claude uses this spec to generate prisma/seed.ts.

```
Users:
  - 1 Admin:   admin@example.com   / Admin@123456
  - 3 Members: member1@example.com / Member@123456
               member2@example.com / Member@123456
               member3@example.com / Member@123456
  - All isVerified = true (so testing doesn't require email verification)

Projects:
  - "Project Alpha" — owned by Admin, color: #6366f1
    Members: Admin (OWNER), Member1 (MEMBER), Member2 (MEMBER)
  - "Project Beta" — owned by Admin, color: #10b981
    Members: Admin (OWNER), Member2 (MEMBER), Member3 (MEMBER)

Tasks (in Project Alpha):
  - 2 tasks with status TODO    — 1 assigned, 1 unassigned
  - 2 tasks with status IN_PROGRESS — assigned to Member1, Member2
  - 1 task with status DONE    — assigned to Member1
  - 1 task with a deadline today
  - 1 task with a deadline next week
  - 1 task with priority URGENT

Comments:
  - 2 comments on the first IN_PROGRESS task
  - Authors: Member1 and Member2
```

---

## References

- PRD: `docs/PRD.md`
- Architecture: `docs/Architecture.md`
- API Spec: `docs/API.md`
- Coding Convention: `docs/CodingConvention.md`

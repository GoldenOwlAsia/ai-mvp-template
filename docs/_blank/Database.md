# [Product Name] — Database

> **How to use this template:**
> - Remove all `>` blockquote (notes) sections before actual use
> - Fill in every field completely — Claude will guess incorrectly if a field is missing
> - Clearly distinguish DB-layer constraints from Application-layer constraints
> - Show Claude a sample Prisma Schema so it follows the correct pattern

---

## Enums

> Define all enums first — Claude needs to know the valid values before generating an entity.

### [EnumName]
| Value | Description |
|---|---|
| [VALUE_1] | [Explain when to use this] |
| [VALUE_2] | [Explain when to use this] |

**Example:**
```
### UserRole
| Value  | Description                  |
|--------|-------------------------------|
| ADMIN  | Manages the entire system     |
| MEMBER | A regular member               |

### TaskStatus
| Value       | Description      |
|-------------|-------------------|
| TODO        | Not started yet   |
| IN_PROGRESS | In progress       |
| DONE        | Completed         |
| CANCELLED   | Cancelled         |

### TaskPriority
| Value  | Description       |
|--------|--------------------|
| LOW    | Low priority       |
| MEDIUM | Medium priority    |
| HIGH   | High priority      |
| URGENT | Urgent             |
```

---

## Entities

> One field table per entity — Claude generates the Prisma model with 100% accuracy.
> Do not write a plain description — a concrete field table is required.

### Entity: [EntityName]

| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | Primary key |
| [field] | [type] | [Yes/No] | [value/—] | [notes] |
| createdAt | DateTime | No | now() | Auto-generated |
| updatedAt | DateTime | No | updatedAt | Auto-updated |
| deletedAt | DateTime | Yes | null | Soft delete |

**Type reference:**
```
String    → VARCHAR, TEXT
Int       → INTEGER
Float     → FLOAT, DECIMAL
Boolean   → BOOLEAN
DateTime  → TIMESTAMP
Json      → JSONB (PostgreSQL)
[Enum]    → Prisma enum type
```

**Example:**
```
### Entity: User

| Field       | Type     | Nullable | Default  | Notes                |
|-------------|----------|----------|----------|------------------------|
| id          | String   | No       | cuid()   | Primary key           |
| email       | String   | No       | —        | Unique, max 255 chars  |
| password    | String   | No       | —        | Bcrypt hash            |
| name        | String   | No       | —        | Max 100 chars          |
| role        | UserRole | No       | MEMBER   | Enum                   |
| avatarUrl   | String   | Yes      | null     | URL to storage         |
| isVerified  | Boolean  | No       | false    | Email verified flag    |
| createdAt   | DateTime | No       | now()    | Auto-generated         |
| updatedAt   | DateTime | No       | updatedAt| Auto-updated           |
| deletedAt   | DateTime | Yes      | null     | Soft delete            |

### Entity: Project

| Field       | Type     | Nullable | Default  | Notes                |
|-------------|----------|----------|----------|------------------------|
| id          | String   | No       | cuid()   | Primary key           |
| name        | String   | No       | —        | Max 100 chars          |
| description | String   | Yes      | null     | Max 2000 chars         |
| ownerId     | String   | No       | —        | FK → users.id          |
| createdAt   | DateTime | No       | now()    | Auto-generated         |
| updatedAt   | DateTime | No       | updatedAt| Auto-updated           |
| deletedAt   | DateTime | Yes      | null     | Soft delete            |

### Entity: Task

| Field       | Type         | Nullable | Default  | Notes                    |
|-------------|--------------|----------|----------|----------------------------|
| id          | String       | No       | cuid()   | Primary key               |
| title       | String       | No       | —        | Max 200 chars              |
| description | String       | Yes      | null     | Max 2000 chars, markdown   |
| status      | TaskStatus   | No       | TODO     | Enum                       |
| priority    | TaskPriority | No       | MEDIUM   | Enum                       |
| deadline    | DateTime     | Yes      | null     | Must be a future date      |
| projectId   | String       | No       | —        | FK → projects.id           |
| assigneeId  | String       | Yes      | null     | FK → users.id              |
| createdBy   | String       | No       | —        | FK → users.id              |
| createdAt   | DateTime     | No       | now()    | Auto-generated             |
| updatedAt   | DateTime     | No       | updatedAt| Auto-updated               |
| deletedAt   | DateTime     | Yes      | null     | Soft delete                |

### Entity: ProjectMember (Junction Table)

| Field     | Type     | Nullable | Default | Notes                |
|-----------|----------|----------|---------|------------------------|
| id        | String   | No       | cuid()  | Primary key            |
| projectId | String   | No       | —       | FK → projects.id       |
| userId    | String   | No       | —       | FK → users.id           |
| role      | String   | No       | MEMBER  | OWNER or MEMBER        |
| joinedAt  | DateTime | No       | now()   | Auto-generated          |
```

---

## Relationships

> Clearly specify ON DELETE behavior — Claude generates the correct migration, avoiding FK constraint errors.

### [Entity A] — [Entity B] ([Relationship Type])

- **Description:** [One sentence describing the relationship]
- **FK:** `[table_a].[column]` → `[table_b].[id]`
- **ON DELETE:** [CASCADE / SET NULL / RESTRICT]
- **Nullable:** [Is the FK nullable — affects required/optional]

**Example:**
```
### User — Task (One-to-Many)
- Description: A User can be assigned many Tasks, a Task has only 1 assignee
- FK: tasks.assignee_id → users.id
- ON DELETE: SET NULL (deleting the user does not delete the task)
- Nullable: assigneeId is nullable — a task may not be assigned yet

### Project — Task (One-to-Many)
- Description: A Project has many Tasks, a Task belongs to exactly 1 Project
- FK: tasks.project_id → projects.id
- ON DELETE: CASCADE (deleting the project deletes all its tasks)
- Nullable: projectId is NOT NULL — a task must belong to a project

### User — Project (Many-to-Many via ProjectMember)
- Description: A User belongs to many Projects, a Project has many Members
- Junction table: project_members
- FK 1: project_members.user_id → users.id — ON DELETE CASCADE
- FK 2: project_members.project_id → projects.id — ON DELETE CASCADE
- Extra fields: role (OWNER/MEMBER), joinedAt

### Task — Comment (One-to-Many)
- Description: A Task has many Comments
- FK: comments.task_id → tasks.id
- ON DELETE: CASCADE (deleting the task deletes all its comments)
- Nullable: taskId is NOT NULL
```

---

## Indexes

> Explain the reason — Claude should not remove a "seemingly unnecessary" index during refactoring.

### [Table Name]

| Index Name | Columns | Type | Reason |
|---|---|---|---|
| [idx_table_column] | [column] | UNIQUE / NORMAL | [Which query needs this index] |

**Example:**
```
### users
| Index Name            | Columns    | Type   | Reason                          |
|------------------------|------------|--------|----------------------------------|
| idx_users_email       | email      | UNIQUE | Login, checking for duplicate email |
| idx_users_deleted_at  | deletedAt  | NORMAL | Filtering soft-deleted records  |

### projects
| Index Name               | Columns    | Type   | Reason                      |
|----------------------------|------------|--------|-------------------------------|
| idx_projects_owner_id    | ownerId    | NORMAL | Listing a user's projects    |
| idx_projects_deleted_at  | deletedAt  | NORMAL | Filtering soft-deleted records |

### tasks
| Index Name                    | Columns              | Type      | Reason                            |
|---------------------------------|----------------------|-----------|-------------------------------------|
| idx_tasks_project_id          | projectId            | NORMAL    | Listing tasks by project           |
| idx_tasks_assignee_id         | assigneeId           | NORMAL    | Listing tasks assigned to a user   |
| idx_tasks_status              | status               | NORMAL    | Filtering by status                |
| idx_tasks_project_status      | (projectId, status)  | COMPOSITE | Kanban board query                 |
| idx_tasks_deleted_at          | deletedAt            | NORMAL    | Filtering soft-deleted records     |

### project_members
| Index Name                       | Columns              | Type   | Reason                                  |
|-------------------------------------|----------------------|--------|--------------------------------------------|
| idx_project_members_project_id   | projectId            | NORMAL | Listing members of a project             |
| idx_project_members_user_id      | userId               | NORMAL | Listing projects a user belongs to       |
| uq_project_members_project_user  | (projectId, userId)  | UNIQUE | Each user can only join a project once    |
```

---

## Constraints

> Clearly distinguish DB layer vs Application layer — avoid duplicate logic.

### DB Layer (enforced by schema/migration)

```
[Table]: [constraint description]

Example:
users:
  - email: UNIQUE, NOT NULL, VARCHAR(255)
  - name: NOT NULL, VARCHAR(100)
  - role: NOT NULL, DEFAULT 'MEMBER'

tasks:
  - title: NOT NULL, VARCHAR(200)
  - status: NOT NULL, DEFAULT 'TODO'
  - projectId: NOT NULL, FK with a clear CASCADE behavior

project_members:
  - UNIQUE (projectId, userId)
  - role: NOT NULL, DEFAULT 'MEMBER'
```

### Application Layer (enforced by DTO validation)

```
More complex rules, enforced at the service/DTO level:

Example:
tasks:
  - deadline must be a future date (not easily enforceable with a DB CHECK)
  - assigneeId must be a member of the project (requires a join query to check)
  - title must not consist only of whitespace

users:
  - password must be at least 8 characters, with an uppercase letter and a number (enforced in the DTO)
  - email must be lowercased before saving (enforced in the service)
```

---

## Prisma Schema Reference

> Show Claude one sample model — Claude generates the rest of the schema following the same pattern.

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ───────────────────────────────────────────

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

// ─── Models ──────────────────────────────────────────

// Sample model — Claude follows this pattern for the entire schema
model User {
  id         String    @id @default(cuid())
  email      String    @unique @db.VarChar(255)
  password   String
  name       String    @db.VarChar(100)
  role       UserRole  @default(MEMBER)
  avatarUrl  String?
  isVerified Boolean   @default(false)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  deletedAt  DateTime?

  // Relations
  assignedTasks  Task[]          @relation("AssignedTasks")
  createdTasks   Task[]          @relation("CreatedTasks")
  projects       ProjectMember[]

  @@index([email])
  @@index([deletedAt])
  @@map("users")
}

// [Claude generates the remaining models following the pattern above]
```

**Mandatory pattern Claude must follow:**
```
1. id is always String @id @default(cuid())
2. Timestamps: createdAt, updatedAt, deletedAt (soft delete)
3. Relation names must be explicit (@relation("Name"))
4. @@map("table_name") to map to snake_case
5. @@index on all FK columns
6. @db.VarChar(n) for a String with a length limit
```

---

## Common Query Patterns

> Claude should know which queries to optimize, avoiding N+1 and full table scans.

### High-frequency queries

```
1. Get tasks by project + status (Kanban board)
   WHERE project_id = ? AND status = ? AND deleted_at IS NULL
   → Uses the composite index: idx_tasks_project_status

2. Get tasks assigned to a user
   WHERE assignee_id = ? AND deleted_at IS NULL ORDER BY deadline ASC
   → Uses the index: idx_tasks_assignee_id

3. Login by email
   WHERE email = ? AND deleted_at IS NULL
   → Uses the unique index: idx_users_email

4. List a user's projects
   JOIN project_members ON project_members.project_id = projects.id
   WHERE project_members.user_id = ?
   → Uses the index: idx_project_members_user_id
```

### Complex queries (require special attention)

```
1. Dashboard — Count tasks by status across the whole team
   → GROUP BY status, needs an index on status
   → If data is large (>100k rows): consider a materialized view

2. Kanban board — Get all tasks with assignee info
   → Needs to include the relation: { assignee: { select: { id, name, avatarUrl } } }
   → Avoid selecting the full user object (contains the password hash)

3. Activity feed — Get recently updated tasks
   → ORDER BY updated_at DESC, needs an index if the query is slow
```

### Anti-patterns to avoid

```
❌ Do not use findMany() and then filter at the application layer
   → Use a WHERE clause in the query

❌ Do not select all fields when only a few are needed
   → Use select: { id, name, email }

❌ Do not query inside a loop (N+1 problem)
   → Use an included relation or a batch query
```

---

## Seed Data

> Describe sample data so Claude generates the seed file correctly.

```
The development environment needs the following seed data:

1. Users
   - 1 Admin: admin@example.com / Admin@123
   - 3 Members: member1@example.com, member2@example.com, member3@example.com / Member@123

2. Projects
   - 2 projects, owned by Admin
   - Member1 and Member2 belong to Project 1
   - Member2 and Member3 belong to Project 2

3. Tasks
   - Each project has 5 tasks, spread evenly across statuses
   - Some tasks have a deadline, some don't
   - Some tasks are unassigned
```

---

## References

- PRD: `docs/PRD.md`
- Architecture: `docs/Architecture.md`
- API Spec: `docs/API.md`
- Coding Convention: `docs/CodingConvention.md`

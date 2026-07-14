# [Product Name] — PRD

> **How to use this template:**
> - Remove all `>` blockquote (notes) sections before actual use
> - Each large feature should be split into its own file at `docs/features/[name].md`
> - Keep this file under 500 lines — if it gets longer, split out a feature

---

## Overview

> Write this briefly, just enough for Claude to immediately understand the context without reading more.

**App:** [App name — one-sentence description]
**Problem:** [The problem users are facing]
**Solution:** [How the app solves that problem]
**Stack:** [Frontend] + [Backend] + [Database] + [Auth] + [Storage, if any]

**Example:**
```
App: Task management for remote teams
Problem: The team doesn't know who is doing what, and deadlines keep getting missed
Solution: Real-time Kanban board, task assignment, deadline tracking, notifications
Stack: React + TypeScript + NestJS + PostgreSQL + JWT
```

---

## Personas

> Include specific permissions — Claude will automatically generate the correct permission/guard logic.

### [Role 1: e.g. Admin]
- [Short description of this role]
- **Permissions:** [List specific CRUD actions — e.g. CRUD all projects, CRUD all tasks]
- **Restrictions:** [What this role CANNOT do]

### [Role 2: e.g. Member]
- [Short description of this role]
- **Permissions:** [List specific CRUD actions — e.g. Read project, Update own tasks]
- **Restrictions:** [What this role CANNOT do]

**Example:**
```
### Admin
- Manages the whole team and its projects
- Permissions: CRUD project, CRUD task, CRUD member
- Restrictions: Cannot delete their own account

### Member
- Performs assigned tasks
- Permissions: Read project, Read team's tasks, Update status of their own tasks
- Restrictions: Cannot create/delete a project, cannot assign tasks to others
```

---

## Features

> Add Priority and Status so Claude knows what to build first and what to skip.

| Feature | Description | Priority | Status |
|---|---|---|---|
| [Feature 1] | [Short description] | P0 | Todo |
| [Feature 2] | [Short description] | P0 | In Progress |
| [Feature 3] | [Short description] | P1 | Todo |
| [Feature 4] | [Short description] | P2 | Todo |

> **Priority:**
> - `P0` — Must have, the app doesn't work without it
> - `P1` — Should have, important but can be delayed
> - `P2` — Nice to have, do later if there's time

---

## User Flow

> Use numbered steps — Claude can map each step to an API call and a UI interaction.

### Flow: [Flow name — e.g. Account registration]

1. [Step 1 — What the user does]
2. [Step 2 — How the system responds]
3. [Step 3 — What the user does next]
4. [Step N — End of flow]

**Example:**
```
### Flow: Create a new task

1. Member goes to the Project Board
2. Clicks "Add Task" in the Todo column
3. Enters title (required), description (optional), deadline (optional)
4. Assigns a member (optional — defaults to themselves)
5. Clicks Save
6. The system creates the task and immediately displays it in the Todo column
7. The system sends an email notification to the assignee
```

---

## Functional Requirements

> Use `- [ ]` checkboxes with concrete numbers — Claude generates the correct validation right away.

### [Feature 1: e.g. Authentication]

- [ ] [Requirement 1 — with specific conditions and numbers]
- [ ] [Requirement 2]
- [ ] [Requirement 3]

### [Feature 2: e.g. Task Management]

- [ ] [Requirement 1]
- [ ] [Requirement 2]

**Example:**
```
### Authentication
- [ ] User registers with email + password
- [ ] Password must be at least 8 characters, with at least 1 uppercase letter and 1 number
- [ ] JWT access token expires after 15 minutes
- [ ] Refresh token expires after 7 days, stored in an httpOnly cookie
- [ ] Email must be verified before the user can log in
- [ ] Each email can only be used to register 1 account

### Task Management
- [ ] Title is at most 200 characters, cannot be empty
- [ ] Description is at most 2000 characters, markdown allowed
- [ ] Deadline must be a future date
- [ ] A task can only be assigned to 1 person at a time
- [ ] Status can only be: Todo | In Progress | Done
```

---

## Non-Functional Requirements

> Concrete numbers help Claude generate the correct config — timeout, rate limit, bcrypt rounds...

| Criterion | Requirement |
|---|---|
| API Response Time | < 200ms for 95% of requests |
| Concurrent Users | Supports [X] concurrent users |
| Uptime | [X]% |
| Password Hashing | Bcrypt with salt rounds = 12 |
| Rate Limiting | Max [X] requests/min per IP |
| File Upload | Max [X]MB per file |
| Session | Access token 15 minutes, refresh token 7 days |

---

## Edge Cases

> **This is the most important section for Claude.**
> Without this section → Claude will guess → inconsistent behavior.
> Always include a specific HTTP status code and message.

### [Feature 1: e.g. Authentication]

- [Situation] → [HTTP Status] — [Message / Behavior]
- [Situation] → [HTTP Status] — [Message / Behavior]

### [Feature 2: e.g. Task]

- [Situation] → [HTTP Status] — [Message / Behavior]

**Example:**
```
### Authentication
- Email already exists at registration → 409 Conflict — "Email already exists"
- Wrong password → 401 Unauthorized — "Invalid credentials" (does not reveal whether the email exists)
- Access token expired → 401 — { code: "TOKEN_EXPIRED" }
- Refresh token expired → 401 — { code: "SESSION_EXPIRED" }, requires logging in again
- More than 5 failed login attempts → 429 Too Many Requests — locked for 15 minutes
- Logging in with an unverified email → 403 Forbidden — "Please verify your email"

### Task
- Assigning a task to someone outside the project → 403 Forbidden
- Deadline is a date in the past → 400 Bad Request — "Deadline must be a future date"
- Deleting a task that is In Progress → 200 OK but logged in the audit trail
- Moving a task to In Progress without an assignee → 400 — "Task must have an assignee"
- Empty title → 400 Bad Request — "Title is required"
```

---

## Acceptance Criteria

> GIVEN/WHEN/THEN format — Claude maps this directly to test cases.

### Feature: [Feature name]

**Scenario: [Scenario name — happy path]**
- **GIVEN** [context — where the user is, what state the system is in]
- **WHEN** [action — what the user does]
- **THEN** [expected result — how the system responds, with a specific time if relevant]

**Scenario: [Scenario name — error case]**
- **GIVEN** [context]
- **WHEN** [action that triggers the error]
- **THEN** [expected error behavior]

**Example:**
```
### Feature: Create Task

**Scenario: Successfully create a task**
- GIVEN the user is logged in and on the Project Board
- WHEN they enter a valid title and click Save
- THEN the task appears in the Todo column within < 1 second, without reloading the page

**Scenario: Create a task with an empty title**
- GIVEN the user is on the create task form
- WHEN they leave the title empty and click Save
- THEN an error "Title is required" is shown right below the field, and no API call is made

**Scenario: Assign a task to someone outside the project**
- GIVEN the user is creating a task in Project A
- WHEN they select an assignee who is not part of Project A
- THEN the API returns 403, and the UI shows a toast "User is not a member of this project"
```

---

## References

> Links to related files — helps Claude know what else to read.

- Architecture: `docs/Architecture.md`
- Database Schema: `docs/Database.md`
- API Spec: `docs/API.md`
- UI Components: `docs/UI.md`
- Coding Convention: `docs/CodingConvention.md`
- Feature details: `docs/features/[feature-name].md`

# Feature: [Feature Name]

> **How to use this file:**
> - This is the source of truth for this feature — Claude reads it before implementing
> - Fill in every section completely — Claude will guess at any section left blank
> - This file must be enough for Claude to implement without asking again
> - Keep the file under 300 lines — if the feature is too large, split it into smaller ones

---

## Overview

> 3-5 sentences describing what this feature does, why it's needed, and who uses it.
> Claude reads this section first to understand context before reading the details.

**Feature:** [Feature name]
**Description:** [What this feature does — one concise sentence]
**Reason:** [Why this feature is needed — what problem it solves]
**Users:** [Which role uses this feature]
**Priority:** [P0 / P1 / P2]
**Status:** [📋 Todo / 🚧 In Progress / ✅ Done]

**Example:**
```
Feature: Task Management
Description: Allows members to create, assign, track, and update the status of tasks in a project
Reason: The team needs visibility into who is doing what and how progress is going
Users: Admin and Member in the project
Priority: P0
Status: 🚧 In Progress
```

---

## API Endpoints

> Full list of endpoints to implement for this feature.
> Claude uses this section to know how many routes to create in the controller.
> Full details for each endpoint are in `docs/API.md`.

| Method | Path | Permission | Description |
|---|---|---|---|
| GET | `/api/v1/[resource]` | [Role] | [Short description] |
| POST | `/api/v1/[resource]` | [Role] | [Short description] |
| GET | `/api/v1/[resource]/:id` | [Role] | [Short description] |
| PATCH | `/api/v1/[resource]/:id` | [Role] | [Short description] |
| DELETE | `/api/v1/[resource]/:id` | [Role] | [Short description] |

*Request/response/error details: `docs/API.md` section [Feature] Endpoints*

**Example:**
```
| Method | Path                        | Permission          | Description              |
|--------|-----------------------------|----------------------|---------------------------|
| GET    | /api/v1/tasks               | Member of project    | Get list of tasks        |
| POST   | /api/v1/tasks               | Member of project    | Create a new task        |
| GET    | /api/v1/tasks/:id           | Member of project    | Get task details         |
| PATCH  | /api/v1/tasks/:id           | Member of project    | Update task               |
| DELETE | /api/v1/tasks/:id           | Owner/Creator        | Delete task               |
```

---

## Database Entities

> List which entities are used in this feature.
> Claude uses this section to know which Prisma model to import.
> Full schema details are in `docs/Database.md`.

**Related entities:**
- `[Entity1]` — [What it's used for in this feature]
- `[Entity2]` — [What it's used for in this feature]

**Example:**
```
- Task       — Main entity of the feature
- User       — Assignee and creator of the task
- Project    — Task belongs to a project
- ProjectMember — Checks whether the user has permission in the project
```

*Schema details: `docs/Database.md` section Entity [Name]*

---

## Business Rules

> This is the most important section — Claude needs it to implement the correct logic.
> Write clearly, with concrete figures, no ambiguity.
> One rule per line — each rule should be verifiable.

### [Rule Group 1 — e.g. Permission Rules]

- [ ] [Rule 1 — specific, verifiable]
- [ ] [Rule 2]
- [ ] [Rule 3]

### [Rule Group 2 — e.g. Data Rules]

- [ ] [Rule 1]
- [ ] [Rule 2]

**Example:**
```
### Permission Rules
- [ ] Only members of the project can view and create tasks in that project
- [ ] Any member of the project can update any task
- [ ] Only the project OWNER or the task creator can delete a task
- [ ] Admin has full rights over all tasks

### Data Rules
- [ ] Title is required, max 200 characters, whitespace is automatically trimmed
- [ ] Description is optional, max 2000 characters, supports markdown
- [ ] Deadline must be a future date both on create and on update
- [ ] assigneeId must be a member of the project — cannot assign to an outsider
- [ ] status defaults to TODO when created
- [ ] priority defaults to MEDIUM when created
- [ ] position is automatically calculated = max(position in the same column) + 1024 on create

### Status Transition Rules
- [ ] TODO → IN_PROGRESS ✅
- [ ] TODO → DONE ❌ (must go through IN_PROGRESS)
- [ ] TODO → CANCELLED ✅
- [ ] IN_PROGRESS → DONE ✅
- [ ] IN_PROGRESS → TODO ✅
- [ ] IN_PROGRESS → CANCELLED ✅
- [ ] DONE → IN_PROGRESS ✅ (reopen)
- [ ] DONE → TODO ❌
- [ ] CANCELLED → TODO ✅ (reopen)
- [ ] CANCELLED → IN_PROGRESS ❌

### Notification Rules
- [ ] Send an email to the assignee when a task is assigned for the first time
- [ ] Send an email to the assignee when the deadline changes
- [ ] Do not send an email when a user assigns a task to themselves
- [ ] Do not send an email when a task is unassigned (assigneeId = null)
```

---

## Edge Cases

> The second most important section — Claude needs it to handle things correctly.
> Missing this section → Claude will guess → inconsistent behavior.
> Always include the specific HTTP status code and error code.

### [Edge Case Group 1 — e.g. Not Found Cases]

- [Situation] → [HTTP Status] `[ERROR_CODE]` — [Expected behavior]

### [Edge Case Group 2 — e.g. Permission Cases]

- [Situation] → [HTTP Status] `[ERROR_CODE]` — [Expected behavior]

**Example:**
```
### Not Found Cases
- Task ID does not exist → 404 `NOT_FOUND` — "Task not found"
- Task has been soft deleted → 404 `NOT_FOUND` — treat as non-existent
- Project does not exist when creating a task → 404 `NOT_FOUND` — "Project not found"

### Permission Cases
- A user who is not a project member tries to view a task → 403 `FORBIDDEN`
- A member tries to delete someone else's task (not the creator) → 403 `FORBIDDEN`
- An unauthenticated user tries to access → 401 `UNAUTHORIZED` → redirect to /login

### Data Validation Cases
- Title is empty after trim → 400 `VALIDATION_ERROR` — "Title is required"
- Title > 200 characters → 400 `VALIDATION_ERROR` — "Title must be at most 200 characters"
- Deadline is yesterday's date → 400 `VALIDATION_ERROR` — "Deadline must be a future date"
- assigneeId is not a member of the project → 403 `INVALID_ASSIGNEE` — "User is not a member of this project"
- Invalid status transition (TODO → DONE) → 400 `INVALID_STATUS_TRANSITION` — "Cannot transition from TODO to DONE"

### Cascade Cases
- Deleting a project → cascades soft delete to all tasks in that project
- Deleting the assigned user → SET NULL on assigneeId, the task remains
- Deleting a task that is IN_PROGRESS → allowed, not blocked

### Concurrent Cases
- Two users update the same task at the same time → last write wins (no lock needed for v1)
- Creating two tasks at the same time in the same column → position may collide → sort by createdAt as tiebreaker
```

---

## UI Components

> List of components to create for this feature.
> Claude uses this section to know which files to create under features/[name]/components/.
> Use existing components from docs/UI.md first — only create new ones if none exist.

### Components to create

| Component | File | Description |
|---|---|---|
| `[ComponentName]` | `features/[feature]/components/[ComponentName].tsx` | [What it's used for] |

### Components used from the UI library

| Component | Source | Used for |
|---|---|---|
| `Button` | `@/components/ui/button` | [Where it's used] |
| `Dialog` | `@/components/ui/dialog` | [Where it's used] |

**Example:**
```
### Components to create
| Component         | File                                          | Description                        |
|-------------------|-----------------------------------------------|-------------------------------------|
| TaskCard          | features/task/components/TaskCard.tsx         | Card displaying a task in the kanban board |
| TaskForm          | features/task/components/TaskForm.tsx         | Form for creating and editing a task |
| TaskDetail        | features/task/components/TaskDetail.tsx       | Drawer for viewing task details    |
| TaskStatusBadge   | features/task/components/TaskStatusBadge.tsx  | Status badge with color            |
| AssigneePicker    | features/task/components/AssigneePicker.tsx   | Dropdown for selecting an assignee |
| DeadlinePicker    | features/task/components/DeadlinePicker.tsx   | Date picker for the deadline       |

### Components used from the UI library (do not recreate)
| Component    | Source                      | Used for                   |
|--------------|-----------------------------|-----------------------------|
| Button       | @/components/ui/button      | Actions in TaskCard         |
| Dialog       | @/components/ui/dialog      | TaskForm dialog             |
| AlertDialog  | @/components/ui/alert-dialog| Confirm delete task         |
| Badge        | @/components/ui/badge       | TaskStatusBadge base        |
| Avatar       | @/components/ui/avatar      | Assignee avatar             |
```

---

## User Flows

> Describe the main flows of the feature from the user's perspective.
> Claude uses this section to make sure the UI covers all flows.
> No need to be overly detailed — focus on the happy path and critical path.

### Flow 1: [Flow name]

```
[Step 1 — What the user does]
        ↓
[Step 2 — How the system responds]
        ↓
[Step 3 — What the user does next]
        ↓
[Final result]
```

**Example:**
```
### Flow 1: Create a new task

Member clicks "New Task" on the Kanban board
        ↓
A dialog opens with an empty form
        ↓
Enter title (required), select assignee and deadline (optional)
        ↓
Click "Create Task"
        ↓
Loading state on the button
        ↓
[Success] Dialog closes, the task appears in the Todo column, toast "Task created"
[Error]   Error toast with the message from the API, dialog stays open

### Flow 2: Update task status (Kanban drag & drop)

Member drags a TaskCard from the Todo column to the In Progress column
        ↓
Optimistic update — the card moves immediately (without waiting for the API)
        ↓
API call PATCH /tasks/:id { status: 'IN_PROGRESS' }
        ↓
[Success] Nothing changes (the UI has already updated)
[Error]   The card rolls back to its previous position, error toast

### Flow 3: Delete a task

Member clicks "..." → "Delete" on the TaskCard
        ↓
AlertDialog confirmation: "Delete task? This cannot be undone."
        ↓
Click "Delete" to confirm
        ↓
Loading state
        ↓
[Success] The task disappears from the board, toast "Task deleted"
[Error]   Error toast, the task remains on the board
```

---

## Files to Create

> Full checklist of every file to create when implementing this feature.
> Claude creates them in this exact order — no file should be skipped.

### Backend

```
src/modules/[feature]/
├── dto/
│   ├── create-[feature].dto.ts       ← Validation for POST
│   ├── update-[feature].dto.ts       ← PartialType of Create
│   └── query-[feature].dto.ts        ← Filter + pagination for GET
├── [feature].service.ts              ← Business logic
├── [feature].controller.ts           ← Routes + Guards
├── [feature].module.ts               ← Register + imports
└── [feature].spec.ts                 ← Unit tests
```

### Frontend

```
src/features/[feature]/
├── components/
│   ├── [Feature]Card.tsx             ← Card component
│   ├── [Feature]Form.tsx             ← Create/Edit form
│   └── [Feature]Detail.tsx           ← Detail view
├── hooks/
│   ├── use-[feature]-list.ts         ← useQuery for the list
│   ├── use-[feature]-detail.ts       ← useQuery for the detail
│   ├── use-create-[feature].ts       ← useMutation for create
│   ├── use-update-[feature].ts       ← useMutation for update
│   └── use-delete-[feature].ts       ← useMutation for delete
├── services/
│   └── [feature].service.ts          ← API calls
└── types/
    └── [feature].types.ts            ← TypeScript interfaces
```

### Pages

```
src/pages/
└── [Feature]Page.tsx                 ← Route-level component
```

---

## Acceptance Criteria

> GIVEN/WHEN/THEN format — maps directly to test cases.
> Must cover all 5 categories: Happy path, Validation, Permission, Edge case, UI/UX.
> AC standard details: docs/AcceptanceCriteria.md

### Happy Path

**Scenario: [Name of the successful scenario]**
- GIVEN [context]
- WHEN [action]
- THEN [expected result]
- AND [additional result, if any]

### Validation

**Scenario: [Required field left blank]**
- GIVEN [context]
- WHEN [action with missing input]
- THEN [error message shown in the right place]
- AND [no API call made]

### Permission

**Scenario: [User without permission]**
- GIVEN [context]
- WHEN [action without permission]
- THEN [403 or 401]
- AND [UI responds correctly]

### Edge Cases

**Scenario: [Resource does not exist]**
- GIVEN [context]
- WHEN [action with a non-existent ID]
- THEN [404 response]
- AND [UI shows the error state]

### UI/UX

**Scenario: [Loading state]**
- GIVEN [context]
- WHEN [triggering an async action]
- THEN [loading indicator shown]
- AND [button disabled]
- AND [loading disappears once done]

**Full example:**
```
### Happy Path

**Scenario: Successfully create a task with an assignee**
- GIVEN a member is logged in and on the Project Board
- WHEN they click "New Task", enter title "Fix bug", select Member1 as assignee, and click "Create"
- THEN the task appears in the Todo column in < 1 second (without reloading the page)
- AND a "Task created successfully" toast is shown for 3 seconds
- AND the form dialog closes
- AND an email notification is sent to Member1

**Scenario: Update status via drag & drop**
- GIVEN a member is viewing a Kanban board with a task in the Todo column
- WHEN they drag the task to the In Progress column
- THEN the task moves immediately (optimistic update)
- AND an API call PATCH /tasks/:id { status: 'IN_PROGRESS' } is sent
- AND the task status in the DB is updated

### Validation

**Scenario: Create a task with an empty title**
- GIVEN a member is on the create task form
- WHEN they leave the title empty and click "Create"
- THEN an error "Title is required" appears right below the title field
- AND the Create button is disabled
- AND no API call is made

**Scenario: Deadline is a date in the past**
- GIVEN a member is on the create task form
- WHEN they select yesterday's date as the deadline and click "Create"
- THEN an error "Deadline must be a future date" appears right below the date picker
- AND no API call is made

### Permission

**Scenario: A member tries to delete someone else's task**
- GIVEN member A is viewing a task created by member B (A is not the creator)
- WHEN member A clicks "Delete" on that task
- THEN the API returns 403 FORBIDDEN
- AND an error toast "You don't have permission to delete this task" is shown
- AND the task is not deleted

**Scenario: A logged-out user tries to access the task list**
- GIVEN the user is not logged in
- WHEN they access /projects/proj-1/tasks
- THEN they are redirected to /login?returnUrl=/projects/proj-1/tasks

### Edge Cases

**Scenario: A task is deleted by someone else while being viewed**
- GIVEN member A is viewing the details of task X
- WHEN member B (owner) deletes task X from another device
- THEN on member A's next refresh → the task disappears from the board
- AND if member A tries to update task X → 404 NOT_FOUND → toast "Task no longer exists"

**Scenario: Assigning a task to a user who was just removed from the project**
- GIVEN a task is currently assigned to Member1
- WHEN Admin removes Member1 from the project
- THEN the task remains with assigneeId = null (SET NULL)
- AND the task card shows "Unassigned" instead of Member1's avatar

### UI/UX

**Scenario: Loading state when creating a task**
- GIVEN a member is on the create task form
- WHEN they click "Create Task"
- THEN the "Create Task" button changes to a spinner + "Creating..."
- AND the button is disabled (cannot be clicked twice)
- AND the loading state disappears once the API responds (success or error)

**Scenario: Empty state when a project has no tasks yet**
- GIVEN a member opens a newly created project with no tasks yet
- WHEN they view the Kanban board
- THEN an empty state is shown: icon + "No tasks yet" + "Create your first task" button
- AND no empty columns are shown
```

---

## Out of Scope

> What will NOT be implemented in this feature.
> Claude must not add these features on its own, even if they seem "reasonable".

- ❌ [Feature not being built — reason]
- ❌ [Feature not being built]

**Example:**
```
- ❌ Real-time updates when someone else creates a task — use manual refresh for v1
- ❌ Task dependencies (task A blocks task B) — v2
- ❌ Subtasks — v2
- ❌ Time tracking — out of scope
- ❌ Task templates — v2
- ❌ Bulk actions (selecting multiple tasks at once) — v2
- ❌ Task history/audit log — v2
```

---

## References

> Related files — Claude reads these when more detail is needed.

- Business context: `docs/PRD.md`
- System design: `docs/Architecture.md`
- Database schema: `docs/Database.md` section Entity [Name]
- API details: `docs/API.md` section [Feature] Endpoints
- UI components: `docs/UI.md`
- AC standards: `docs/AcceptanceCriteria.md`
- Coding rules: `docs/CodingConvention.md`

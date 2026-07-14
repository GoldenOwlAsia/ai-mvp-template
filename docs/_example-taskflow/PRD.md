# [Product Name] — PRD

> **How to use this file:**
> - This file is an overview — feature details live in docs/features/[name].md
> - Keep this file under 300 lines — if it grows longer, split features out
> - Delete every `>` (note) block before using this for real
> - Claude reads this file to understand "Why" and "What" — not "How"

---

## Overview

> 3-5 sentences are enough for Claude to grasp the context immediately without reading any other file.
> Add Stack and Deploy here — Claude gets technical context from the start.

**App:** [App name] — [One-sentence description]
**Problem:** [The specific problem users are facing]
**Solution:** [How the app solves that problem]
**Stack:** [Frontend] + [Backend] + [Database] + [Cache if any]
**Deploy:** [FE platform] + [BE platform] + [DB platform]

**Example:**
```
App: TaskFlow — Task management for remote teams
Problem: Teams don't know who's working on what, deadlines are constantly missed,
        there's no overall visibility into progress
Solution: Realtime Kanban board, task assignment with deadlines,
           automatic notifications when assigned
Stack: React 18 + TypeScript + NestJS + PostgreSQL + Redis
Deploy: Vercel (FE) + Railway (BE) + Neon (DB) + Upstash (Redis)
```

---

## Problem & Goals

> Goals must have measurable metrics — Claude uses them to know which features matter,
> instead of adding "cool" features unrelated to the objective.

### Problem

- [Problem 1 — specific, observable]
- [Problem 2]
- [Problem 3]

### Goals

- [Goal 1 — with a metric: "Reduce X from Y% to Z% after N months"]
- [Goal 2]
- [Goal 3]

**Example:**
```
### Problem
- Team leads don't know which tasks are blocked
- Members forget deadlines because there's no automatic reminder
- No clear way to assign tasks → tasks get forgotten

### Goals
- Reduce missed deadlines from 40% to < 10% after 1 month of use
- 100% of tasks have a clear assignee and deadline
- Team leads can view the whole team's status in < 30 seconds
```

---

## Personas & Permissions

> Claude uses this section to generate Guards, Decorators, and Permission checks.
> Write specific permissions — don't be vague.

### [Role 1: e.g. Admin]

- **Description:** [Who this person is, what they do in the app]
- **Permissions:** [List specific CRUD actions]
- **Restrictions:** [What they CANNOT do]
- **Count:** [How many people/workspace or /project]

### [Role 2: e.g. Member]

- **Description:** [Who this person is, what they do in the app]
- **Permissions:** [List specific CRUD actions]
- **Restrictions:** [What they CANNOT do]
- **Count:** [How many people/workspace or /project]

### [Role 3: e.g. Guest] *(if applicable)*

- **Description:** [Who this person is]
- **Permissions:** [Usually partial read-only]
- **Status:** [In scope / Out of scope v1]

**Example:**
```
### Admin
- Description: The person who creates the workspace, manages the whole team and projects
- Permissions: CRUD workspace, CRUD project, CRUD member,
         CRUD all tasks in the workspace
- Restrictions: Cannot delete their own account
- Count: 1-2 people/workspace

### Member
- Description: Team member, performs assigned tasks
- Permissions: Read projects they belong to, CRUD their own tasks,
         Update status of tasks assigned to them,
         Comment on tasks in projects they belong to
- Restrictions: Cannot create/delete projects, cannot view other projects,
            cannot assign tasks to others
- Count: 5-50 people/workspace

### Guest (Out of scope v1)
- Description: Someone viewing a report without needing an account
- Permissions: Read-only dashboard shared publicly
- Status: Out of scope — not implemented in v1
```

---

## Features

> Each feature has a pointer to its feature file — Claude reads PRD.md
> and then knows which file to read next when implementing it.
> The Status column lets Claude know what already exists, avoiding regeneration.

| Feature | Short Description | Priority | Status | Details |
|---|---|---|---|---|
| [Feature 1] | [Description] | P0 | 📋 Todo | docs/features/[name].md |
| [Feature 2] | [Description] | P0 | 🚧 In Progress | docs/features/[name].md |
| [Feature 3] | [Description] | P1 | 📋 Todo | docs/features/[name].md |
| [Feature 4] | [Description] | P2 | 📋 Todo | docs/features/[name].md |

**Priority:**
- `P0` — Must have: can't ship without it
- `P1` — Should have: important but can be delayed to v1.1
- `P2` — Nice to have: do it later if there's time

**Status:**
- ✅ Done — Implemented and tested
- 🚧 In Progress — Currently being implemented
- 📋 Todo — Not started yet

**Example:**
```
| Feature      | Description                  | Priority | Status         | Details                          |
|--------------|-------------------------------|----------|----------------|----------------------------------|
| Auth         | Register, login, JWT          | P0       | ✅ Done        | docs/features/auth.md            |
| Task CRUD    | Create, edit, delete, assign tasks | P0  | 🚧 In Progress | docs/features/task.md            |
| Kanban Board | Drag and drop tasks between columns | P1 | 📋 Todo        | docs/features/kanban.md          |
| Notification | Email when assigned a task    | P1       | 📋 Todo        | docs/features/notification.md    |
| Report       | Dashboard with team stats     | P2       | 📋 Todo        | docs/features/report.md          |
```

---

## Core User Flows

> Only write the 2-3 most important flows here.
> Step-by-step detail lives in the corresponding docs/features/ file.
> Claude uses this section to understand the "big picture" before diving into a specific feature.

### Flow 1: [Flow name — e.g. First-time onboarding]

1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [End of flow]

*Details: docs/features/[name].md*

### Flow 2: [Flow name — e.g. Member's daily workflow]

1. [Step 1]
2. [Step 2]
3. [Step 3]

*Details: docs/features/[name].md*

**Example:**
```
### Flow 1: Onboarding — From registration to first task

1. Register an account with email
2. Verify email via the link sent to their inbox
3. Create a new workspace (Admin) or join via invite link (Member)
4. Admin creates the first project
5. Admin invites a member into the project via email
6. Admin creates the first task and assigns it to the member
7. Member receives an email notification and views the task

Details: docs/features/auth.md, docs/features/task.md

### Flow 2: Member's daily workflow

1. Login → go to the My Tasks page
2. View the list of assigned tasks, sorted by deadline
3. Click a task → view details, update status
4. Drag the task to the In Progress column on the Kanban board
5. Comment if blocked, @mention relevant people
6. Drag the task to Done when completed

Details: docs/features/task.md, docs/features/kanban.md
```

---

## Out of Scope (v1)

> This section is extremely important — often overlooked.
> Without it, Claude will "invent" extra features outside the scope.
> Clearly list what is NOT being done in v1.

The following features are **not included in v1** — Claude should not implement them:

- ❌ [Feature not being done — brief reason]
- ❌ [Feature not being done]
- ❌ [Feature not being done]

**Example:**
```
- ❌ Real-time collaboration (WebSocket) — use simple polling for v1
- ❌ Mobile app — web responsive only
- ❌ Time tracking — out of scope
- ❌ Billing / subscription — v1 is completely free
- ❌ Third-party integration (Slack, Jira, GitHub) — v2
- ❌ AI features — v2
- ❌ Multi-language — English only for v1
- ❌ Dark mode — v2
- ❌ Offline mode — not supported
```

---

## References

> Claude reads these files for additional context.

- Architecture & Stack: `docs/Architecture.md`
- Database Schema: `docs/Database.md`
- API Specification: `docs/API.md`
- UI Components: `docs/UI.md`
- Coding Convention: `docs/CodingConvention.md`
- Feature details: `docs/features/[feature-name].md`

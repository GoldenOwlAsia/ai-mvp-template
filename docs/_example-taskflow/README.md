# Docs Folder — README

> Standard documentation structure guide so Claude can read and generate the app most effectively.

---

## Core Principles

- **Read less = understand deeper** — Claude only reads the right file, at the right time
- **Structure must be self-explaining** — File/folder names are clear enough for Claude to infer what to read
- **CLAUDE.md is the orchestration brain** — Contains only pointers, no stuffed content

---

## Folder Structure

```
project-root/
│
├── CLAUDE.md                    ← Orchestrates everything, always read automatically
│
└── docs/
    ├── README.md                ← This file — guide to using docs
    ├── PRD.md                   ← Product overview, goals, personas
    ├── Architecture.md          ← Stack, system design, data flow
    ├── Database.md              ← Schema, relationships, indexes
    ├── API.md                   ← Endpoints, request/response
    ├── UI.md                    ← Design system, component rules
    ├── AcceptanceCriteria.md    ← Definition of done
    ├── CodingConvention.md      ← Naming, folder, code style
    │
    └── features/
        ├── auth.md              ← Read when working on the auth feature
        ├── payment.md           ← Read when working on the payment feature
        └── [feature-name].md   ← One file per feature
```

---

## Role of Each File

| File | Read when | Answers the question |
|---|---|---|
| `CLAUDE.md` | Always (automatically) | What is this project? Which file should I read? |
| `docs/PRD.md` | Need to understand business logic | What does the app do? For whom? What problem does it solve? |
| `docs/Architecture.md` | Setup or need to understand the system | What's the stack? How do the services connect? |
| `docs/Database.md` | Generate schema / migration | What entities exist? What are the relationships? |
| `docs/API.md` | Generate controller / service | Which endpoints? Request/response format? |
| `docs/UI.md` | Generate component / page | Which components are available? What design tokens? |
| `docs/AcceptanceCriteria.md` | Check before marking done | What is the definition of done? |
| `docs/CodingConvention.md` | Always, when writing code | How to name things? What's the folder structure? |
| `docs/features/[name].md` | Exactly the feature being implemented | What does this feature need? What edge cases? |

---

## Sample CLAUDE.md Content

```markdown
# Project: [App Name]

## Stack
- Frontend: React + TypeScript
- Backend: NestJS
- Database: PostgreSQL

## Required Rules
- Read docs/CodingConvention.md before writing any code
- Read docs/PRD.md when you need to understand business logic
- Read docs/Architecture.md when setting up or changing the system
- Read docs/features/[name].md when implementing a specific feature

## Principles
- Don't infer requirements yourself — always read the corresponding docs file
- Don't generate a schema without having read docs/Database.md
- Don't create an API without having read docs/API.md
```

> Keep CLAUDE.md concise. It's just a pointer — don't stuff content into it.

---

## Workflow Claude Uses for This Folder

```
Receives task: "Implement login feature"
        ↓
Automatically reads CLAUDE.md
        ↓
CLAUDE.md says: "read docs/features/auth.md"
        ↓
Reads auth.md → understands requirements, AC, edge cases
        ↓
auth.md references docs/Database.md → reads schema
        ↓
Reads docs/CodingConvention.md → applies the correct style
        ↓
Generates accurate code, without asking again
```

---

## Why Separate `features/`

| Not separated | Separated into features/ |
|---|---|
| PRD.md contains everything → long, wastes tokens | One file per feature → load only what's needed |
| Claude reads unrelated features too | Claude only reads `auth.md` when working on auth |
| Exceeds context window as the project grows | Token usage per read is controlled |
| Hard to maintain when adding new features | Add a new file, without affecting existing ones |

---

## Rules for Writing Docs Claude Understands Best

### 1. Use clear headings
Claude uses headings to navigate long files.
```markdown
## Authentication
### Login Flow
### Token Strategy
### Edge Cases
```

### 2. Be concise
Each file should be under 500 lines. If longer → split into another file.

### 3. Use code blocks for examples
Claude learns better from examples than plain descriptions.
```markdown
// Good
Example response:
{
  "id": "uuid-xxx",
  "email": "user@example.com"
}

// Not good
The response returns the user's id and email.
```

### 4. Avoid ambiguity — use concrete numbers
```markdown
// Unclear
The API must be fast.

// Claude understands this
API response time < 200ms.
```

### 5. Be explicit rather than implicit
```markdown
// Unclear
Use a standard ID.

// Claude understands this
Use UUID v4 for all primary keys.
```

### 6. Always include an Edge Cases section in feature files
```markdown
## Edge Cases
- Email already exists → return 409 Conflict
- Wrong password 5 times → lock account for 15 minutes
- Token expired → return 401, no redirect
```

---

## Checklist for Creating a New Docs File

- [ ] Clear file name, follows convention (`auth.md`, not `login-stuff.md`)
- [ ] Has a clear heading structure (H2, H3)
- [ ] Under 500 lines (if longer → split into another file)
- [ ] Has code examples for complex sections
- [ ] Has an Edge Cases section if it's a feature file
- [ ] Doesn't use vague words (fast, good, standard...)
- [ ] References other files when needed (`See also: docs/Database.md`)

# Workflow — Build an MVP with Claude

> **How to use this file:**
> - Follow Phase 0 → 1 → 2 → 3 → 4 in order
> - Each Step includes a ready prompt — copy into Claude and replace [placeholders]
> - Do not skip Checkpoints — they are the gate to the next step
> - Phase 2 repeats for every new feature

---

## Overview

```
Phase 0 — Project Setup      (once, when starting the project)
        ↓
Phase 1 — Foundation         (once, build the foundation)
        ↓
Phase 2 — Feature Development (repeat for each feature)
        ↓
Phase 3 — Quality Check      (each feature before merge)
        ↓
Phase 4 — Deploy             (when ready to release)
```

---

## Phase 0 — Project Setup

> Do this once when starting a new project.

---

### Step 0.1 — Write docs

**Goal:** Have complete docs before Claude generates code

**Write order:**
```
1. docs/PRD.md                ← By hand, using prd-template.md
2. docs/Architecture.md       ← By hand, using architecture-template.md
3. docs/Database.md           ← By hand, using database-template.md
4. docs/API.md                ← By hand, using api-template.md
5. docs/CodingConvention.md   ← By hand or generate with Claude
6. docs/features/[name].md    ← One file per feature; write when needed
```

**Checkpoint:**
- [ ] docs/PRD.md has: Overview, Personas, Features, Edge Cases, AC
- [ ] docs/Architecture.md has: Stack, Folder Structure, Auth Flow, Error Format
- [ ] docs/Database.md has: Entities, Relationships, Indexes, Prisma sample
- [ ] docs/API.md has: Convention, Permission Matrix, all endpoints

---

### Step 0.2 — Initialize CLAUDE.md

**Input:** docs/Architecture.md, chosen stack
**Output:** CLAUDE.md at project root

**Prompt for Claude:**
```
Read docs/Architecture.md.
Create CLAUDE.md at the project root with:
1. Project name and one-sentence description
2. Stack (copy from Architecture.md)
3. Required rules: which file to read before which action
4. Pointers to each file under docs/
5. Principles Claude must NOT change on its own

Keep CLAUDE.md under 80 lines — pointers only, no content dump.
```

**Checkpoint:**
- [ ] CLAUDE.md includes stack + pointers to all docs/
- [ ] CLAUDE.md is under 80 lines
- [ ] Rules clearly state "which file to read before which action"

---

### Step 0.3 — Initialize folder structure

**Input:** docs/Architecture.md (Folder Structure section)
**Output:** Full folder tree matching the structure

**Prompt for Claude:**
```
Read docs/Architecture.md Folder Structure for Frontend and Backend.
Create the full folder structure for both.
Only create folders and empty placeholder files (index.ts with a TODO comment).
Do not implement anything yet.
When done, list every file created.
```

**Checkpoint:**
- [ ] Frontend folder structure matches Architecture.md
- [ ] Backend folder structure matches Architecture.md
- [ ] No file is implemented — placeholders only

---

## Phase 1 — Foundation

> Build the technical foundation before implementing features.

---

### Step 1.1 — Generate Database Schema

**Input:** docs/Database.md
**Output:** Complete prisma/schema.prisma

**Prompt for Claude:**
```
Read docs/Database.md.
Generate the full Prisma schema in this order:
1. Enums (all enums in the Enums section)
2. Models (all entities in the Entities section)
3. Relations (per the Relationships section)
4. Indexes (per the Indexes section)

Follow the pattern in the "Prisma Schema Reference" section of Database.md.
When done, list:
- All models created
- All enums created
- All indexes created
so I can verify before running the migration.
```

**Checkpoint:**
- [ ] Every entity in Database.md has a matching model
- [ ] All enums match the Enums section
- [ ] ON DELETE behavior matches Relationships
- [ ] Indexes match the Indexes section
- [ ] `npx prisma validate` — no errors
- [ ] `npx prisma migrate dev --name init` — succeeds

---

### Step 1.2 — Generate Seed Data

**Input:** docs/Database.md (Seed Data section)
**Output:** prisma/seed.ts

**Prompt for Claude:**
```
Read docs/Database.md Seed Data section.
Generate prisma/seed.ts with sample data matching the spec.
Use upsert instead of create so it can run repeatedly without errors.
After generate, run: npx prisma db seed
```

**Checkpoint:**
- [ ] `npx prisma db seed` succeeds
- [ ] DB data matches the Database.md spec

---

### Step 1.3 — Generate Auth Module

**Input:** docs/Architecture.md (Authentication), docs/API.md, docs/Database.md
**Output:** Complete src/modules/auth/

**Prompt for Claude:**
```
Read:
- docs/Architecture.md Authentication section (token flow, guards, decorators)
- docs/API.md Authentication Endpoints section
- docs/Database.md Entity User section

Generate the full auth module using the Module Pattern in Architecture.md:
1. dto/register.dto.ts
2. dto/login.dto.ts
3. strategies/jwt.strategy.ts
4. strategies/refresh.strategy.ts
5. guards/jwt-auth.guard.ts
6. guards/refresh.guard.ts
7. decorators/current-user.decorator.ts
8. decorators/public.decorator.ts
9. auth.service.ts
10. auth.controller.ts
11. auth.module.ts

Implement the token flow exactly as in Architecture.md.
```

**Checkpoint:**
- [ ] `POST /api/v1/auth/register` — creates a new user
- [ ] `POST /api/v1/auth/login` — returns accessToken, sets refreshToken cookie
- [ ] `POST /api/v1/auth/refresh` — returns a new accessToken
- [ ] `POST /api/v1/auth/logout` — clears refreshToken
- [ ] JwtAuthGuard protects a test route
- [ ] `npm run test:e2e -- auth` — passes

---

### Step 1.4 — Setup API Client (Frontend)

**Input:** docs/Architecture.md (Frontend, Authentication)
**Output:** src/services/axios.ts, src/services/auth.service.ts

**Prompt for Claude:**
```
Read docs/Architecture.md Frontend and Authentication sections.
Generate:
1. src/services/axios.ts — axios instance with:
   - baseURL from env
   - interceptor that attaches accessToken
   - interceptor that auto-refreshes on 401 TOKEN_EXPIRED
   - interceptor that redirects to /login on SESSION_EXPIRED
2. src/services/auth.service.ts — wrapper for all auth API calls
```

**Checkpoint:**
- [ ] Axios instance has all interceptors
- [ ] Auto-refresh token works
- [ ] Redirects to /login when the session expires

---

## Phase 2 — Feature Development

> Repeat this entire phase for every new feature.
> Order: Spec → Confirm → Backend → Frontend → Test

---

### Step 2.1 — Write Feature Spec

**Input:** docs/PRD.md (feature to implement)
**Output:** docs/features/[feature-name].md

**Prompt for Claude:**
```
Read docs/PRD.md section [Feature Name].
Generate docs/features/[feature-name].md with:
1. Overview (what this feature does)
2. API Endpoints to implement (list them)
3. Business Rules (special logic)
4. Edge Cases (from PRD + reasoned extras)
5. Acceptance Criteria (GIVEN/WHEN/THEN format)

When done, ask me to confirm before starting code.
```

**Checkpoint:**
- [ ] docs/features/[feature-name].md exists
- [ ] Includes: Business Rules, Edge Cases, Acceptance Criteria
- [ ] Developer has reviewed and confirmed

---

### Step 2.2 — Confirm understanding of requirements

> Required step — prevents Claude from implementing the wrong thing.

**Prompt for Claude:**
```
Read docs/features/[feature-name].md.
Before coding, summarize:
1. How many API endpoints are needed? List each.
2. Which special business rules need attention?
3. Which edge cases are most complex?
4. Are there other docs files to read?

Wait for me to say "OK, start" before coding.
```

**Checkpoint:**
- [ ] Claude's summary matches the requirements
- [ ] Developer says "OK, start" to trigger the next step

---

### Step 2.3 — Generate Backend

**Input:** docs/features/[feature-name].md, docs/Database.md, docs/API.md
**Output:** Complete src/modules/[feature]/

**Prompt for Claude:**
```
Read:
- docs/features/[feature-name].md
- docs/Database.md (entity [Entity] and related relations)
- docs/API.md ([feature] endpoints)
- docs/Architecture.md Error Handling section

Generate the [feature] module using the Module Pattern:
1. dto/create-[feature].dto.ts
2. dto/update-[feature].dto.ts
3. dto/query-[feature].dto.ts (if filter/pagination applies)
4. [feature].service.ts
5. [feature].controller.ts
6. [feature].module.ts (and register in AppModule)

Requirements:
- Permissions match the Permission Matrix in docs/API.md
- Error handling matches the format in docs/Architecture.md
- No N+1 queries
- Soft delete (use deletedAt; no hard deletes)
```

**Checkpoint:**
- [ ] All endpoints in API.md are implemented
- [ ] Permissions match the Permission Matrix
- [ ] Error responses match the format
- [ ] `npm run build` — no TypeScript errors

---

### Step 2.4 — Generate Frontend

**Input:** docs/features/[feature-name].md, docs/UI.md, docs/API.md
**Output:** Complete src/features/[feature]/

**Prompt for Claude:**
```
Read:
- docs/features/[feature-name].md
- docs/UI.md (existing components)
- docs/API.md ([feature] endpoints)
- docs/Architecture.md Frontend section

Generate frontend for [feature] in this order:
1. types/[feature].types.ts (TypeScript interfaces)
2. services/[feature].service.ts (API calls)
3. hooks/use-[feature].ts (useQuery + useMutation)
4. components/ (feature UI components)
5. pages/[Feature]Page.tsx (page component)

Requirements:
- Prefer existing components from docs/UI.md
- Handle loading state for every async operation
- Handle error state with messages from the API response
- Do not hard-code strings — use constants or i18n keys
```

**Checkpoint:**
- [ ] All user flows in PRD.md work
- [ ] Loading states display correctly
- [ ] Error states show the correct messages
- [ ] No TypeScript errors

---

### Step 2.5 — Generate Tests

**Input:** docs/features/[feature-name].md (Acceptance Criteria)
**Output:** [feature].spec.ts + [feature].e2e-spec.ts

**Prompt for Claude:**
```
Read docs/features/[feature-name].md Acceptance Criteria section.
Generate test cases in GIVEN/WHEN/THEN format:

1. Unit tests ([feature].service.spec.ts):
   - Test each service method
   - Mock Prisma client

2. E2E tests ([feature].e2e-spec.ts):
   - Test each AC in Acceptance Criteria
   - Cover: happy path, error cases, edge cases
   - Use seed data from prisma/seed.ts

After generate, run: npm run test && npm run test:e2e
```

**Checkpoint:**
- [ ] Every AC has a matching test case
- [ ] `npm run test` — all pass
- [ ] `npm run test:e2e` — all pass
- [ ] Coverage > 80%

---

## Phase 3 — Quality Check

> Run before merging to the main branch.

---

### Step 3.1 — Code Review

**Prompt for Claude:**
```
Review all of src/modules/[feature]/ and src/features/[feature]/:

Backend checklist:
1. Does it follow the Module Pattern?
2. Any DTO missing validation?
3. Any N+1 queries?
4. Any missing auth guards?
5. Does error handling match the format?
6. Any magic numbers/strings?

Frontend checklist:
1. Any missing loading states?
2. Any missing error states?
3. Any memory leaks (useEffect cleanup)?
4. Any unnecessary re-renders?

Output: List each issue with file path + line number + how to fix.
```

---

### Step 3.2 — Acceptance Criteria Verification

**Prompt for Claude:**
```
Read docs/features/[feature-name].md Acceptance Criteria section.
Check each AC in this format:

| AC | Implemented | Test Covered | Note |
|----|-------------|--------------|------|
| [AC 1] | ✅/❌ | ✅/❌ | ... |

If any AC is not implemented or not tested — list it to fix.
```

---

### Step 3.3 — Security Check

**Prompt for Claude:**
```
Security review for [feature]:
1. Do all routes that need auth have JwtAuthGuard?
2. Any route exposing sensitive data? (password hash, token...)
3. Is input validation sufficient?
4. Is rate limiting applied where required?
5. Can a user access another user's resources?

Output: List issues if any, with file path and how to fix.
```

---

## Phase 4 — Deploy

---

### Step 4.1 — Generate Environment Config

**Prompt for Claude:**
```
Read docs/Architecture.md Environment Variables (Frontend + Backend).
Generate:
1. .env.example (all variables, with comments explaining each)
2. .env.development (values for local dev)
Do not put real secret values — use placeholders like YOUR_SECRET_HERE.
```

---

### Step 4.2 — Generate Deployment Config

**Prompt for Claude:**
```
Read docs/Architecture.md Deployment section.
Generate deployment config for [Vercel/Railway/Docker]:
- Frontend: vercel.json
- Backend: [railway.toml / Dockerfile / docker-compose.yml]
Add comments explaining important settings.
```

---

### Step 4.3 — Pre-deploy Checklist

**Prompt for Claude:**
```
Create a pre-deploy checklist from docs/Architecture.md and docs/PRD.md:
1. Are environment variables fully set?
2. Has the database migration run?
3. Are all P0 features in the PRD implemented?
4. Do all tests pass?
5. Does the production build succeed?
Output as a markdown checklist.
```

---

## Quick Reference

> Lookup: what you are doing → which prompt to use.

| Situation | Phase/Step | Docs to read |
|---|---|---|
| Starting a new project | Phase 0 | Architecture.md |
| Creating the database schema | Step 1.1 | Database.md |
| Implementing a new feature | Phase 2 | features/[name].md |
| Adding an API endpoint | Step 2.3 | API.md, features/[name].md |
| Creating a UI component | Step 2.4 | UI.md, features/[name].md |
| Writing tests | Step 2.5 | features/[name].md (AC) |
| Reviewing code | Step 3.1 | Architecture.md (convention) |
| Checking AC | Step 3.2 | features/[name].md (AC) |
| Preparing deploy | Phase 4 | Architecture.md |

---

## Principles for Using This Workflow

```
1. Always read docs before prompting Claude
   → If docs are wrong, output will be wrong

2. Do not skip Step 2.2 (Confirm requirements)
   → Avoid implementing the wrong thing and redoing it

3. Checkpoints must pass 100% before the next step
   → Accumulated errors get harder to fix later

4. One prompt does one job
   → "Generate DTO + Service + Controller + Test" in one prompt → sloppy work
   → Split into steps → better output

5. Always ask Claude to summarize before generating
   → Catch misunderstandings early and save time
```

---

## References

- PRD: `docs/PRD.md`
- Architecture: `docs/Architecture.md`
- Database: `docs/Database.md`
- API: `docs/API.md`
- Prompt Strategy: `prompt-strategy.md`
- Best Practice: `best-practice.md`

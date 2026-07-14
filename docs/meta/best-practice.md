# Best Practice — Use Claude to Build MVPs Effectively

> **This file captures lessons from building this template set.**
> Read before starting a new project. Update after each sprint if you learn something new.

---

## Overview

Best practices are organized into four views:

```
1. Docs Best Practice     → How to write docs
2. Prompt Best Practice   → How to prompt Claude
3. Workflow Best Practice → How to follow the process
4. Team Best Practice     → How the whole team uses Claude
```

---

## 1. Docs Best Practice

### ✅ Do

**One file per feature**

```
docs/features/
├── auth.md        ← Auth only
├── task.md        ← Task only
└── payment.md     ← Payment only
```

Claude loads only what it needs → less context waste → deeper understanding.

---

**Use concrete numbers instead of vague language**

```
❌ "Password must be strong enough"
✅ "Password at least 8 characters, 1 uppercase letter, 1 digit"

❌ "API must be fast"
✅ "API response time < 200ms for the 95th percentile"

❌ "Files must not be too large"
✅ "File upload max 10MB; only image/jpeg, image/png"
```

---

**Always include Edge Cases in feature files**

```
Edge case missing from docs
        ↓
Claude invents its own handling
        ↓
Inconsistent behavior across features
        ↓
Hard-to-reproduce production bugs
```

Every feature file must have an Edge Cases section with full HTTP status codes.

---

**Spell out HTTP status codes in Edge Cases**

```
❌ "If the email already exists, return an error"

✅ "Email already exists → 409 Conflict
    { code: 'EMAIL_EXISTS', message: 'Email already exists' }"
```

---

**Show Claude one sample artifact per type**

| Docs file | Sample to include |
|---|---|
| Database.md | 1 complete Prisma model |
| API.md | 1 full endpoint: Request + Response + Errors |
| Architecture.md | 1 module pattern in the correct order |

Claude follows the sample pattern for everything else — less explanation needed.

---

**Keep heading structure consistent across files**

```markdown
## Main section (H2)
### Sub-section (H3)
#### Detail (H4 — use sparingly)
```

Claude navigates long files via headings. Inconsistent headings
→ Claude misses important sections.

---

### ❌ Don't

**Don't dump everything into one file**

```
❌ PRD.md — 2000 lines with every feature
✅ PRD.md — 200-line overview
   docs/features/*.md — one file per feature
```

**Don't use implicit wording**

```
❌ "Use the standard convention"  → Which standard? Claude doesn't know
❌ "Handle errors properly"       → What does "properly" mean?
❌ "Optimize performance"         → To what level?
✅ Always be explicit; always include numbers or concrete examples
```

**Don't let docs go stale**

```
Change an API endpoint  → Update API.md immediately
Add a DB field          → Update Database.md immediately
Change auth flow        → Update Architecture.md immediately

Rule: Stale docs = corrupted source of truth = Claude generates wrong code
```

**Don't write files that are too long**

```
> 500 lines  → Split the file
> 200 lines for one feature → Feature too large; break it down
```

**Don't give one file multiple jobs**

```
❌ Architecture.md also contains the Database schema
❌ PRD.md also contains the API spec
✅ One responsibility per file (Single Responsibility)
```

---

## 2. Prompt Best Practice

### ✅ Do

**Always confirm before generating**

```
Every important task starts with:

"Read [file].
Summarize what you will do.
Wait for my confirm before starting."

Cost: 30 seconds reading a summary
Saves: 30 minutes fixing wrong code
```

---

**One prompt — one job**

```
❌ "Create service + controller + test + security review"

✅ Prompt 1: "Create task.service.ts"
   Prompt 2: "Create task.controller.ts"
   Prompt 3: "Write unit tests for task.service.ts"
   Prompt 4: "Security review for the task module"
```

One focused prompt does one thing well → overall quality beats
one prompt that tries to do everything at once.

---

**Reference files; don't paste content**

```
❌ [paste 300 lines of Database.md into the prompt]

✅ "Read docs/Database.md, Entity Task section"
```

File references save tokens; Claude can read the full file when needed
instead of only the pasted excerpt.

---

**Add negative constraints (what not to do)**

```
Most prompts only say what Claude SHOULD do.
Add negative constraints → Claude does not over-engineer:

❌ Do not add dependencies not already in package.json
❌ Do not create files outside the agreed list
❌ Do not change naming conventions
❌ Do not implement features not in the spec
```

---

**End prompts with an output format**

```
"Output as markdown, ready to paste into docs/API.md"
"List every file created when done"
"Show only the diff, not the full file"
"Show the code, then wait for my confirm before writing real files"
```

---

**Use role assignment for review tasks**

```
"You are a senior NestJS developer reviewing a junior's code.
Find issues in performance, security, and error handling.
Output: [Severity] [File:Line] [Issue] [Fix]"
```

Role assignment → Claude adopts the right mindset → deeper output.

---

### ❌ Don't

**Don't use mega prompts**

```
❌ "Read all of docs/ and build the entire backend"
→ Claude rushes, ignores conventions, skips edge cases
```

**Don't let Claude invent permissions**

```
❌ "Create the task endpoint with appropriate auth"

✅ "Create the task endpoint.
   Permissions follow the Permission Matrix in docs/API.md:
   Members only access tasks in projects they belong to."
```

**Don't fix bugs without context**

```
❌ "Fix this error: Cannot read property 'id' of undefined"

✅ "File task.service.ts line 45 error: Cannot read property 'id' of undefined.
   Context: calling findTaskById after user login.
   Read docs/Database.md, Entity Task section.
   Find the root cause before fixing; don't patch blindly."
```

**Don't assume Claude remembers prior sessions**

```
❌ Session 2: "Continue from yesterday"

✅ Session 2: "Read CLAUDE.md and docs/features/task.md.
   Continue implementing the task module.
   Done yesterday: DTO, Service.
   Needed today: Controller, Module."
```

Claude resets fully between sessions — provide context again every time.

**Don't mix multiple concerns in one prompt**

```
❌ "Create the task service, write tests for it, and do a security review"

✅ Three separate prompts, in order.
   Each is much better when focused.
```

---

## 3. Workflow Best Practice

### ✅ Do

**Docs first, code second — always**

```
With complete docs:
Claude is correct 90%+ on the first try → fewer fixes

Without docs:
Claude generates → developer fixes → Claude regenerates → developer fixes
→ 3× the time
```

Required order:

```
PRD → Architecture → Database → API → Feature Spec → Code
```

---

**Work small; verify often**

```
❌ Generate the entire backend → test once at the end
✅ Generate one module → test immediately → fix → next module

Bug found at step 1: ~10 minutes to fix
Bug found at step 5: ~2 hours (spread across many files)
```

---

**Required checkpoints before the next step**

```
After generating schema:
→ npx prisma validate
→ npx prisma migrate dev

After generating auth module:
→ Manually test POST /auth/login
→ npm run test:e2e -- auth

After generating a feature:
→ Test each AC in the feature spec
→ npm run test

Wrong schema unchecked → wrong migrate → wrong service → wrong controller
→ Rework from the start
```

---

**Feature spec → confirm → code (skip none)**

```
Developer writes feature spec
        ↓
Claude reads and summarizes
        ↓
Developer confirms (or corrects)
        ↓
Claude starts coding

Confirm step costs ~5 minutes.
Skipping it risks 2–3 hours of redo.
```

---

**Update docs in the same change**

```
API change → Update API.md in the same PR
New DB field → Update Database.md in the same PR
Flow change → Update Architecture.md immediately

Never "update later" → never updated → stale docs
```

---

**Test right after generate; don't batch**

```
❌ Finish all code → write tests → many failures → heavy fixes
✅ Code feature → write tests immediately → fix failures → next feature

Tests written right after code: developer still has context → better tests
Tests written a week later: must re-read code → extra time
```

---

### ❌ Don't

**Don't skip feature specs even for "simple" features**

```
❌ "This feature is simple; no spec needed"
→ Edge cases undefined → Claude invents behavior → production bugs

✅ Every feature gets a spec, even if only ~20 lines
   Minimum: Overview + Edge Cases + Acceptance Criteria
```

**Don't generate tests last**

```
❌ Finish the sprint → spend the last day on tests
→ Tests get cut when deadlines slip
→ Production bugs rise sprint over sprint

✅ Tests are part of "done" — no tests = not done
```

**Don't deploy before all checkpoints pass**

```
Pre-deploy checklist:
- [ ] All P0 features implemented
- [ ] All tests pass (unit + e2e)
- [ ] All ACs in feature specs verified
- [ ] No Critical/High issues from code review
- [ ] Environment variables fully set
- [ ] Database migration ran successfully
```

---

## 4. Team Best Practice

### ✅ Do

**Standardize CLAUDE.md for the whole team**

```
Every developer on the project uses the same CLAUDE.md
→ Claude behaves consistently for everyone
→ No "my prompt works, yours doesn't"

CLAUDE.md must be version-controlled in git
Change CLAUDE.md → open a PR → team review → merge
```

---

**Build a shared prompt library**

```
prompts/
├── generate-module.md      ← New NestJS module
├── generate-feature.md     ← Full BE+FE feature
├── review-code.md          ← Review before merge
├── debug-error.md          ← Debug with context
├── write-test.md           ← Tests from AC
└── generate-migration.md   ← DB migration
```

New developers read `prompts/` → correct Claude usage from day one.

---

**Review docs like code**

```
Process:
Docs change → open a PR → at least one reviewer → merge

Why: Wrong docs → whole team generates wrong code → more bugs
     Docs are the source of truth; review them as seriously as code
```

---

**Use Claude to onboard new developers**

```
New developer → reads docs/ → asks Claude about the codebase
Instead of: New developer → asks a senior → senior spends 2–3 days explaining

CLAUDE.md should include "For new developers:
- Read in order: PRD → Architecture → Database → API
- Ask Claude about any part you don't understand"
```

---

**Benchmark and improve on a schedule**

| Cadence | Action |
|---|---|
| Every sprint | Check whether docs need updates |
| Every month | Review whether prompt strategy still works |
| Every quarter | Update best-practice.md with new lessons |
| Every project | Retrospective on the Claude workflow |

---

### ❌ Don't

**Don't let everyone use Claude differently**

```
❌ Developer A: mega prompts
   Developer B: free-form
   Developer C: structured prompts
→ Inconsistent output, mixed styles, harder reviews

✅ Team agrees on Prompt Strategy → everyone follows it
   Store in prompts/ and reference from CLAUDE.md
```

**Don't share secrets via docs**

```
❌ Paste API keys, passwords, or connection strings into any docs file

✅ Use placeholders: YOUR_API_KEY, YOUR_DATABASE_URL, YOUR_JWT_SECRET
   Real secrets live in .env (not committed) or a secret manager
```

**Don't replace human code review entirely with Claude**

```
Claude reviews well:
✅ Conventions and patterns
✅ Obvious bugs and missing validation
✅ Missing error handling
✅ N+1 queries

Claude cannot replace:
❌ Deep business context
❌ Deep security audit
❌ Real performance benchmarks
❌ Architectural decisions with business trade-offs

Correct process: Claude review first → human review second
```

**Don't let CLAUDE.md get too long**

```
❌ CLAUDE.md > 100 lines
→ Wastes context window at the start of every session

✅ CLAUDE.md < 80 lines
→ Pointers only; real content lives in docs/
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│                BEST PRACTICE QUICK CARD                 │
├─────────────────────────────────────────────────────────┤
│ DOCS                                                    │
│  ✅ One file per feature (< 500 lines)                  │
│  ✅ Concrete numbers, not vague language                │
│  ✅ Always Edge Cases + HTTP status codes               │
│  ✅ One sample artifact per type for Claude             │
│  ✅ Update docs immediately when things change          │
│  ❌ Don't let files exceed 500 lines                    │
│  ❌ Don't use implicit words (standard, suitable...)    │
│  ❌ Don't leave docs stale                              │
├─────────────────────────────────────────────────────────┤
│ PROMPT                                                  │
│  ✅ Confirm before generating                           │
│  ✅ One prompt — one job                                │
│  ✅ Reference files; don't paste content                │
│  ✅ Negative constraints (what not to do)               │
│  ✅ End with desired output format                      │
│  ❌ No mega prompts                                     │
│  ❌ Don't let Claude invent permissions                 │
│  ❌ Don't assume Claude remembers old sessions          │
│  ❌ Don't fix bugs without context                      │
├─────────────────────────────────────────────────────────┤
│ WORKFLOW                                                │
│  ✅ Docs first, code second — always                    │
│  ✅ Work small; verify often                            │
│  ✅ Feature spec → confirm → code                       │
│  ✅ Test immediately after generate                     │
│  ✅ Required checkpoints before next step               │
│  ❌ Don't skip feature specs                            │
│  ❌ Don't generate tests last                           │
│  ❌ Don't deploy before checklist passes                │
├─────────────────────────────────────────────────────────┤
│ TEAM                                                    │
│  ✅ Shared CLAUDE.md + prompt library                   │
│  ✅ Review docs like code                               │
│  ✅ Benchmark and improve on a schedule                 │
│  ✅ Use Claude to onboard new developers                │
│  ❌ Don't let everyone use Claude differently           │
│  ❌ Don't share secrets via docs                        │
│  ❌ Don't replace human review entirely with Claude     │
│  ❌ Don't let CLAUDE.md exceed 80 lines                 │
└─────────────────────────────────────────────────────────┘
```

---

## Most Important Lessons

```
Lesson 1: Docs are code
   Wrong docs → wrong Claude output → production bugs
   Treat docs as seriously as code

Lesson 2: Prompting is a skill
   Good prompts → good output on the first try
   Bad prompts → heavy revision → wasted time

Lesson 3: Confirm saves time
   5 minutes confirming first → saves 2–3 hours of redo
   Best ROI in the whole workflow

Lesson 4: Claude has no memory
   Every session is a blank page
   CLAUDE.md + docs/ are Claude's only memory

Lesson 5: Small is better
   Small files → Claude reads them better
   Small prompts → more accurate output
   Small features → easier to verify
   Keep everything small → the project runs better
```

---

## References

- Context Loading: `research/context-loading.md`
- Docs Structure: `docs/README.md`
- PRD Template: `templates/prd-template.md`
- Architecture Template: `templates/architecture-template.md`
- Database Template: `templates/database-template.md`
- API Template: `templates/api-template.md`
- Workflow: `workflow.md`
- Prompt Strategy: `prompt-strategy.md`

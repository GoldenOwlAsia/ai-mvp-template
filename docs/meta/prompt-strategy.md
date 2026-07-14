# Prompt Strategy — How to Prompt Claude Effectively

> **This is the most important file in the template set.**
> Good docs with bad prompts still produce poor Claude output.
> Read carefully before using Claude to build features.

---

## How Claude Processes Prompts

```
Claude does not "comprehend" like a human
Claude matches patterns → maps them to actions

Vague prompts  → Claude guesses → inconsistent output
Clear prompts  → Claude maps precisely → correct on the first try
```

### Five dimensions of a good prompt

```
1. CONTEXT    → Where are we in the project?
2. INPUT      → Which files must be read?
3. TASK       → Exactly what to do?
4. OUTPUT     → What should the result look like?
5. CONSTRAINT → What must not be done?
```

> Missing any dimension → Claude fills gaps itself → higher risk of errors.

---

## Standard Prompt Template

> Copy this template for every task. You do not need all five parts for simple work,
> but always include at least INPUT + TASK + OUTPUT.

```
## CONTEXT
[Which feature, which step in the workflow]

## INPUT
Read:
- [file 1] — [why this file is needed]
- [file 2] — [why this file is needed]

## TASK
[Do exactly one job — do not combine multiple jobs in one prompt]

## OUTPUT
[What the result should look like — format, files, content]

## CONSTRAINT
✅ [Must do]
❌ [Must not do]

## CONFIRM
Before starting, summarize what you will do.
```

---

## Benchmark of Five Strategies

### ❌ Strategy 1 — Free-form (Worst)

```
"Create an API for task management"
```

**Problems:**
- Claude does not know stack, conventions, or schema
- Invents structure freely

**Result:** Output needs 70–80% revision. Never use.

---

### ❌ Strategy 2 — Context dump

```
"Here is my entire PRD: [paste 500 lines]
Here is Architecture: [paste 300 lines]
Here is Database: [paste 400 lines]
Create the task API"
```

**Problems:**
- Burns context window
- Claude gets overwhelmed and misses important details
- No structure for Claude to navigate

**Result:** Incomplete output; many follow-ups. Never use.

---

### ⚠️ Strategy 3 — Simple file reference

```
"Read docs/API.md and docs/Database.md.
Create a NestJS task module."
```

**Problems:**
- Does not describe desired output
- No constraints
- Claude decides scope on its own

**Result:** ~60% correct. Only for very simple tasks.

---

### ✅ Strategy 4 — Structured prompt

```
"Read:
- docs/features/task.md
- docs/API.md, Task Endpoints section
- docs/Database.md, Entity Task section

Create the task module using the Module Pattern in Architecture.md.
Output: DTO, Service, Controller, Module.
When done, list the files created."
```

**Result:** ~85% correct. Use for medium tasks.

---

### ⭐ Strategy 5 — Structured + Confirm + Constraint (Best)

```
[Step 1 — Confirm first]
Read docs/features/task.md.
Summarize: how many endpoints, which business rules, which edge cases?
Wait for my confirm before coding.

[After confirm — Step 2 — Generate]
Also read:
- docs/API.md, Task Endpoints section
- docs/Database.md, Entity Task section
- docs/Architecture.md, Error Handling section

Generate the task module in this order:
1. dto/create-task.dto.ts
2. dto/update-task.dto.ts
3. task.service.ts
4. task.controller.ts
5. task.module.ts

Constraints:
✅ Follow Module Pattern in Architecture.md
✅ Permissions match Permission Matrix in API.md
✅ Error format matches Architecture.md Error Handling
❌ Do not create files outside the list above
❌ Do not change naming conventions
❌ Do not add new dependencies

After each file, confirm with me before creating the next.
```

**Result:** 95%+ correct. Always use for important tasks.

---

## Summary Benchmark Table

| Strategy | Tokens used | Accuracy | Revision needed | When to use |
|---|---|---|---|---|
| Free-form | Low | 20–30% | Heavy | Never |
| Context dump | Very high | 50–60% | High | Never |
| Simple file reference | Low | 60–70% | Medium | Very simple tasks only |
| Structured | Medium | 80–85% | Low | Medium tasks |
| Structured + Confirm + Constraint | Medium | 95%+ | Minimal | Always |

---

## Six Most Important Prompt Patterns

---

### Pattern 1 — Confirm before coding

**Use when:** Starting a new feature, or complex requirements.

```
Read [docs/features/[feature].md].
Summarize requirements in this format:
- Number of endpoints to create:
- Special business rules:
- Edge cases to watch:
- Files that will be created:

Wait for my confirm before starting.
```

**Why it works:** Forces Claude to externalize understanding → catch
misunderstanding before code; saves rework time.

---

### Pattern 2 — Step-by-step with checkpoints

**Use when:** Complex tasks spanning related files.

```
Follow this order. After each step, show the code and wait for my confirm
before the next step:

Step 1: Create dto/create-task.dto.ts
Step 2: Create task.service.ts (import DTO from step 1)
Step 3: Create task.controller.ts (import Service from step 2)
Step 4: Create task.module.ts (register everything)
```

**Why it works:** Fix step-1 errors immediately so they do not spread
to steps 2–3. Total time is much shorter than fixing everything at the end.

---

### Pattern 3 — Show me first

**Use when:** You are unsure Claude understands the desired output.

```
Before creating files, show me:
1. What the Prisma schema for the Task entity looks like
2. What the CreateTaskDto interface looks like

I will confirm, then you create the real files.
```

**Why it works:** ~30 seconds of review instead of ~30 minutes of fixes.
Especially useful for complex schemas or interfaces.

---

### Pattern 4 — Constraint list

**Use when:** You want Claude to stay inside the defined scope.

```
Generate [task] with these constraints:

✅ Follow the pattern in docs/Architecture.md
✅ Only create files in this list: [file list]
✅ Use class-validator for DTO validation
✅ Use Prisma (no raw SQL)

❌ Do not create files outside the list
❌ Do not rename fields vs Database.md
❌ Do not add dependencies not already in package.json
❌ Do not implement logic not in the feature spec
```

**Why it works:** Clear boundaries → less over-engineering,
no invented features, conventions stay aligned.

---

### Pattern 5 — Role assignment

**Use when:** You need Claude in a specific deep perspective.

```
You are a senior NestJS developer reviewing a junior's code.
Read src/modules/task/task.service.ts.

Find issues in:
- Performance: N+1 queries, missing indexes, slow queries
- Security: missing auth guards, data leaks, injection
- Error handling: missing try-catch, wrong status codes
- Code quality: magic numbers, duplicated logic, naming

Output issue list as:
[Severity: Critical/High/Medium/Low] [File:Line] [Issue] [How to fix]
```

**Why it works:** Role assignment → Claude adopts the right mindset
→ deeper, more structured output than a normal prompt.

---

### Pattern 6 — Format specification

**Use when:** You need output in a specific format, usable without editing.

```
Generate API documentation for task endpoints.

Follow the exact format in docs/api-template.md:
- Every endpoint includes: Method, Path, Auth, Request Body, Response, Errors
- Request Body has inline comments explaining each field
- Errors include Status Code and Code string

Output as markdown, ready to paste into docs/API.md.
```

**Why it works:** Clear format → immediately usable output; no reformat time.

---

## Docs Reading Strategy — When to Use What

| How to read | When | Pros | Cons |
|---|---|---|---|
| `CLAUDE.md` automatic | Always | No mention needed | Pointers only |
| `@docs/[file].md` | Specific file needed | Precise, token-efficient | Manual |
| `@docs/[file].md section [X]` | One section only | Very token-efficient | Must know section name |
| `/add-dir docs` | Need full context | Complete | Expensive on context |
| `/memory` | Short facts across sessions | Persists | Limited capacity |

**Principle:** Read as little as possible, the right file as precisely as possible.

```
✅ "Read docs/Database.md, Entity Task section"     ← Good
✅ "Read docs/features/auth.md"                     ← Good
❌ "Read all of docs/"                              ← Unnecessary tokens
❌ No file mentioned                                ← Claude guesses
```

---

## Anti-patterns to Avoid Absolutely

---

### ❌ Anti-pattern 1 — Mega prompt

```
"Read every file in docs/ and build the entire backend for a task management
app including auth, task CRUD, project management, notifications, and Railway deploy"
```

**Consequence:** Claude rushes, skips conventions, ignores patterns.

**Fix:** Split into small steps per workflow.md. One prompt, one job.

---

### ❌ Anti-pattern 2 — No file reference

```
"Create a Task DTO with the necessary fields"
```

**Consequence:** Claude invents fields → wrong schema → full rework.

**Fix:**
```
"Read docs/Database.md, Entity Task section.
Create CreateTaskDto with exactly the fields in the Entity Task table."
```

---

### ❌ Anti-pattern 3 — Fix bugs without context

```
[Claude just created a buggy file]
"Fix this error: Cannot read property 'id' of undefined"
```

**Consequence:** Claude patches by guesswork; may introduce new bugs.

**Fix:**
```
"File task.service.ts line 45 has an error:
Cannot read property 'id' of undefined.

Context:
- Calling findTaskById(id) after user login
- id comes from the JWT payload
- Task may not exist or may be soft-deleted

Read docs/Database.md, Entity Task section for the schema.
Find the root cause and suggest a fix; don't patch blindly."
```

---

### ❌ Anti-pattern 4 — Forgetting context across sessions

```
Session 1: "We use NestJS + Prisma, conventions are..."
Session 2: "Continue implementing the task module"
```

**Consequence:** Session 2 Claude does not remember session 1 → wrong conventions.

**Fix:** Every new session must reference docs again:
```
"Read CLAUDE.md and docs/features/task.md.
Continue implementing the task module:
- Done: DTO and Service (yesterday)
- Needed today: Controller and Module
Start with task.controller.ts."
```

---

### ❌ Anti-pattern 5 — Mixing multiple concerns in one prompt

```
"Create the task service, write tests for it, and do a security review"
```

**Consequence:** Claude does a little of each; none of it well.

**Fix:** Split into three prompts, in order:
```
Prompt 1: "Generate task.service.ts..."
Prompt 2: "Write unit tests for the task.service.ts just created..."
Prompt 3: "Security review for task.service.ts..."
```

---

## Ready-made Prompt Templates by Situation

### Starting a new feature
```
Read docs/features/[feature].md.
Summarize requirements: which endpoints, which business rules, which edge cases.
Wait for my confirm before coding.
```

### Generate backend module
```
Read docs/features/[feature].md, docs/API.md section [Feature],
docs/Database.md section Entity [Entity].

Generate the [feature] module using the Module Pattern in docs/Architecture.md.
Order: DTO → Service → Controller → Module.
After each file, wait for confirm.

Constraints:
✅ Permissions follow Permission Matrix in API.md
✅ Error format follows Architecture.md Error Handling
❌ Do not create files outside the list
❌ Do not add new dependencies
```

### Generate frontend feature
```
Read docs/features/[feature].md, docs/UI.md, docs/API.md section [Feature].

Generate frontend in this order:
1. types/[feature].types.ts
2. services/[feature].service.ts
3. hooks/use-[feature].ts
4. components/
5. pages/[Feature]Page.tsx

Constraints:
✅ Prefer existing components from UI.md
✅ Handle loading and error states
❌ Do not hard-code strings
❌ Do not create new components if UI.md already has them
```

### Review code
```
You are a senior developer reviewing code.
Read [file path].

Check in order:
1. Does it follow the pattern in docs/Architecture.md?
2. Any security issues?
3. Any performance issues?
4. Any missing error handling?

Output: [Severity] [File:Line] [Issue] [Fix suggestion]
Severity: Critical / High / Medium / Low
```

### Debug an error
```
Error: [error message]
File: [file path], Line: [line number]
Context: [what you were doing, what the data looks like]

Read [related docs file] for expected behavior.
Analyze the root cause; do not patch blindly.
Suggest a fix with an explanation of why.
```

### Write tests
```
Read docs/features/[feature].md Acceptance Criteria section.
Read src/modules/[feature]/[feature].service.ts.

Generate unit tests for [feature].service.ts:
- One describe block per method
- Cover: happy path, error cases, edge cases from AC
- Mock Prisma with jest.mock
- Use GIVEN/WHEN/THEN in describe/it names
```

---

## Golden Rules

```
1. One prompt — one job
   → Do not combine generate + review + test in one prompt

2. Confirm first, code second
   → Always ask Claude to summarize before writing real files

3. Reference files; don't paste content
   → "Read docs/Database.md" beats pasting the whole file

4. Clear constraints
   → Tell Claude what not to do, not only what to do

5. New session, re-reference docs
   → Claude does not remember old sessions; restate context
```

---

## References

- Context Loading: `research/context-loading.md`
- Docs Structure: `docs/README.md`
- Workflow: `workflow.md`
- Best Practice: `best-practice.md`

# [Product Name] — Acceptance Criteria

> **How to use this file:**
> - This file defines the "Definition of Done" for the entire project
> - Claude reads this file when: writing tests, reviewing code, verifying a feature before marking it done
> - AC specific to each feature lives in docs/features/[name].md
> - This file contains: general standards + checklist + standard format

---

## Definition of Done

> A feature is only considered "Done" once it passes this entire checklist.
> Claude uses this checklist when reviewing and verifying a feature.

### Code Checklist

- [ ] All requirements in docs/features/[name].md are implemented correctly
- [ ] All edge cases in the feature spec are handled
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] No ESLint errors (`npm run lint` passes)
- [ ] Follows the Module Pattern in docs/Architecture.md correctly
- [ ] Follows the Coding Convention in docs/CodingConvention.md correctly
- [ ] No N+1 queries
- [ ] No hardcoded strings or magic numbers

### API Checklist

- [ ] Every endpoint in docs/API.md is implemented
- [ ] Permissions match the Permission Matrix in docs/API.md
- [ ] Error responses match the format in docs/Architecture.md
- [ ] Full validation at the DTO layer
- [ ] Rate limiting applied (if required by the endpoint)
- [ ] Soft delete (deletedAt) instead of hard delete

### UI Checklist

- [ ] Every user flow in the PRD works end-to-end
- [ ] Loading state displays correctly for every async operation
- [ ] Error state displays the correct message from the API
- [ ] Empty state includes: icon, title, description, CTA
- [ ] Responsive correctly on mobile (375px) and desktop (1280px)
- [ ] No console.error in the browser

### Test Checklist

- [ ] Unit tests cover all service methods
- [ ] E2E tests cover all AC in the feature spec
- [ ] Happy path passes
- [ ] Error cases pass
- [ ] Edge cases pass
- [ ] `npm run test` — 100% pass
- [ ] `npm run test:e2e` — 100% pass
- [ ] Coverage > 80%

### Security Checklist

- [ ] Every route requiring auth has a JwtAuthGuard
- [ ] No sensitive data (password, token) exposed in the response
- [ ] Sufficient input validation (not injectable)
- [ ] Users cannot access other users' resources

---

## Standard AC Format

> Claude uses GIVEN/WHEN/THEN format for every AC.
> This format maps directly to test cases — no need to rewrite it.

### Format

```
**Scenario: [Scenario name — a brief description of the situation]**
- **GIVEN** [context — where the user is, what state the system is in]
- **WHEN** [action — what the user does or what event occurs]
- **THEN** [expected result — how the system responds]
- **AND** [additional result if any — optional]
```

### Full Example

```
**Scenario: Create task successfully**
- GIVEN the user is logged in and on the Project Board
- WHEN they enter a valid title and click "Create Task"
- THEN the task appears in the Todo column within < 1 second
- AND the assignee receives an email notification if one was assigned

**Scenario: Create task with an empty title**
- GIVEN the user is on the create task form
- WHEN they leave the title field empty and click "Create Task"
- THEN an error "Title is required" appears directly below the title field
- AND the API is not called
- AND the form does not close

**Scenario: Assign a task to someone outside the project**
- GIVEN the user is creating a task in Project Alpha
- WHEN they select an assignee who is not a member of Project Alpha
- THEN the API returns 403 FORBIDDEN
- AND the UI shows a toast error "User is not a member of this project"
- AND the task is not created
```

---

## AC Categories

> Every feature file must have AC for all of these categories.
> Use this as a checklist when writing AC for a new feature.

### 1. Happy Path AC
The normal successful scenario — the user does the right thing, the system responds correctly.

```
Checklist when writing:
- [ ] Main flow from start to finish
- [ ] Data displays correctly after the action
- [ ] Success feedback (toast, redirect, UI update)
- [ ] Performance requirement (if any — "within < 1 second")
```

### 2. Validation AC
Invalid input — the system must reject it and report a clear error.

```
Checklist when writing:
- [ ] Required field left empty
- [ ] Field exceeds max length
- [ ] Field has an invalid format (email, date, url...)
- [ ] Enum field has an invalid value
- [ ] Error message displays in the right place (inline below the field)
- [ ] The API must not be called when there's a client-side validation error
```

### 3. Permission AC
User lacks permission — the system must block the action.

```
Checklist when writing:
- [ ] User not logged in tries to access a protected route
- [ ] Member tries to perform an Owner-only action
- [ ] User tries to access another user's resource
- [ ] Response has the correct HTTP status (401 vs 403)
```

### 4. Edge Case AC
Special situations — usually a source of bugs if not handled.

```
Checklist when writing:
- [ ] Resource doesn't exist (deleted or wrong ID)
- [ ] Duplicate (creating the same resource twice)
- [ ] Concurrent action (2 users editing the same resource)
- [ ] Empty state (empty list, no data for the user)
- [ ] Boundary value (max length, negative number, date in the past)
- [ ] Cascade (how deleting a parent affects children)
```

### 5. UI/UX AC
User experience — often overlooked.

```
Checklist when writing:
- [ ] Loading state while fetching/submitting
- [ ] Empty state when the list is empty
- [ ] Disabled state for the button while submitting
- [ ] Error state with a clear message
- [ ] Success feedback after the action
- [ ] Form resets after successful submission
```

---

## AC by Feature — Index

> Quick links to the AC for each feature.
> Claude looks here when it needs to find the AC for a specific feature.

| Feature | File | Status |
|---|---|---|
| Authentication | `docs/features/auth.md#acceptance-criteria` | ⬜ Todo |
| Task Management | `docs/features/task.md#acceptance-criteria` | ⬜ Todo |
| Project Management | `docs/features/project.md#acceptance-criteria` | ⬜ Todo |
| Kanban Board | `docs/features/kanban.md#acceptance-criteria` | ⬜ Todo |
| Notification | `docs/features/notification.md#acceptance-criteria` | ⬜ Todo |

> Update Status once a feature's AC has been written and verified.

---

## Sample AC — Auth Feature

> This is a complete AC example for the Auth feature.
> Claude follows this format when generating AC for a new feature.

### Feature: Register

**Scenario: Register successfully**
- GIVEN the user does not have an account yet and is on the Register page
- WHEN they enter a valid email, a strong password, a name, and click "Register"
- THEN the account is created with isVerified = false
- AND a verification email is sent to the address entered
- AND a message "Please check your email to verify your account" is shown
- AND the user is redirected to the Login page

**Scenario: Email already exists**
- GIVEN a user already has an account with the email "john@example.com"
- WHEN another user registers with the same email "john@example.com"
- THEN the API returns 409 Conflict
- AND a toast error "Email already exists" is shown
- AND the form does not reset, the user can edit the email

**Scenario: Password not strong enough**
- GIVEN the user is on the Register form
- WHEN they enter the password "12345678" (no uppercase letter or special character)
- THEN an inline error "Password must contain at least 1 uppercase and 1 number" is shown
- AND the Register button is disabled until the password is valid
- AND the API is not called

**Scenario: Email has an invalid format**
- GIVEN the user is on the Register form
- WHEN they enter the email "not-an-email" and blur out of the field
- THEN an inline error "Please enter a valid email address" is shown
- AND the API is not called on submit

---

### Feature: Login

**Scenario: Log in successfully**
- GIVEN the user has a verified account
- WHEN they enter the correct email and password and click "Login"
- THEN they receive an accessToken in the response body
- AND the refreshToken is set in an httpOnly cookie
- AND they are redirected to /dashboard
- AND lastLoginAt is updated

**Scenario: Wrong password**
- GIVEN the user is on the Login page
- WHEN they enter the correct email but the wrong password
- THEN the API returns 401 INVALID_CREDENTIALS
- AND a toast error "Invalid email or password" is shown
- AND it does not reveal whether the email exists
- AND the password field is cleared, the email is kept

**Scenario: Email not yet verified**
- GIVEN the user has registered but has not verified their email
- WHEN they log in with the correct email and password
- THEN the API returns 403 EMAIL_NOT_VERIFIED
- AND a message "Please verify your email. Resend verification email?" is shown
- AND there is a "Resend Email" button to resend the verification email

**Scenario: Too many attempts**
- GIVEN the user has failed to log in 5 times within 1 minute
- WHEN they attempt to log in a 6th time
- THEN the API returns 429 RATE_LIMITED
- AND a message "Too many attempts. Please wait 1 minute." is shown
- AND the Login button is disabled for 60 seconds with a countdown timer

**Scenario: Token expires while using the app**
- GIVEN the user is using the app and the accessToken has expired (after 15 minutes)
- WHEN the user performs any action that requires the API
- THEN the app automatically calls /auth/refresh
- AND receives a new accessToken
- AND the original action is retried automatically
- AND the user is not interrupted (not kicked to the login page)

**Scenario: refreshToken has expired**
- GIVEN the user hasn't used the app for > 7 days
- WHEN the user reopens the app and performs an action
- THEN /auth/refresh returns 401 SESSION_EXPIRED
- AND the app redirects to /login
- AND a toast "Your session has expired. Please login again." is shown

---

### Feature: Task — Create Task

**Scenario: Create a task successfully with no assignee**
- GIVEN a member is on the Project Board of Project Alpha
- WHEN they click "New Task", enter the title "Fix login bug", and click "Create"
- THEN the task appears in the Todo column with priority MEDIUM
- AND the task has no assignee
- AND no notification is sent
- AND the form dialog closes

**Scenario: Create a task with an assignee**
- GIVEN a member is on the create task form
- WHEN they enter a title, select Member1 as the assignee, and click "Create"
- THEN the task is created with assignee = Member1
- AND an email notification is sent to Member1
- AND the task appears in Member1's My Tasks

**Scenario: Create a task with a deadline in the past**
- GIVEN a member is on the create task form
- WHEN they select yesterday's date as the deadline and click "Create"
- THEN an inline error "Deadline must be a future date" is shown
- AND the API is not called

**Scenario: Assign to someone outside the project**
- GIVEN a member is creating a task in Project Alpha
- WHEN they select an assignee who is not a member of Project Alpha
- THEN the API returns 403 INVALID_ASSIGNEE
- AND a toast error "User is not a member of this project" is shown
- AND the task is not created

---

## Non-Functional AC

> Applies to every feature — no need to repeat this in each feature file.

### Performance

```
- API response time < 200ms for 95% of requests (except heavy queries)
- Page load time < 3 seconds on 3G
- Kanban board renders in < 1 second with 100 tasks
- Search/filter results appear within < 500ms
```

### Security

```
- Cannot access a protected route while not logged in
  → Redirect to /login with returnUrl
- Cannot access another user's resource
  → 403 Forbidden
- Password must never be returned in any API response
- Tokens must not be stored in localStorage
- refreshToken cannot be read by JavaScript (httpOnly)
```

### Reliability

```
- The app must not crash on any API error
- The app must not crash when the network connection is lost
  → Show a toast "No internet connection"
- Form data must not be lost on a network timeout
  → The user can retry without re-entering data
```

### Accessibility

```
- Every interactive element is accessible via keyboard
- Screen readers can read every label and error message
- Color contrast ratio >= 4.5:1 (WCAG AA)
- No element relies solely on color to convey information
```

---

## How Claude Uses This File

```
When writing tests:
→ Read the AC in docs/features/[name].md
→ Each Scenario = 1 test case with it('Scenario name')
→ GIVEN = beforeEach setup
→ WHEN = action within the test
→ THEN = expect assertions

When reviewing code:
→ Check each AC against the feature spec
→ Verify the code covers the happy path + error cases + edge cases
→ Output: a table of AC with an Implemented ✅/❌ column and a Test Covered ✅/❌ column

When verifying before marking done:
→ Go through the Definition of Done checklist
→ Go through the AC categories checklist
→ Only mark Done once everything is ✅
```

---

## References

- PRD: `docs/PRD.md`
- Architecture: `docs/Architecture.md`
- Feature specs: `docs/features/[name].md`
- Workflow: `workflow.md`

# CI/CD Standard

> **Purpose:** Define a repeatable, auditable delivery pipeline for web, backend, database, and mobile applications.

---

## 1. Pipeline objectives

A compliant pipeline must:

- Fail early and clearly.
- Produce repeatable results.
- Avoid dependence on individual workstations.
- Protect credentials.
- Create traceable artifacts.
- Separate staging and production.
- Require production approval.
- Validate service health after deployment.
- Retain a known rollback target.
- Record version, build number, commit SHA, and deployment destination.

---

## 2. Standard pipeline stages

```text
Checkout
→ Validate configuration
→ Install dependencies
→ Lint
→ Type check
→ Unit tests
→ Integration tests
→ Build
→ Security checks
→ Package artifact
→ Database migration, when required
→ Deploy
→ Health check
→ Smoke test
→ Publish deployment summary
→ Notify
```

A project may omit a stage only when the omission is documented and accepted.

---

## 3. Recommended workflows

```text
.github/workflows/
├── pull-request.yml
├── deploy-staging.yml
├── deploy-production.yml
├── mobile-ci.yml
├── mobile-android-beta.yml
├── mobile-ios-testflight.yml
└── mobile-release.yml
```

---

## 4. Pull-request workflow

Recommended trigger:

```yaml
on:
  pull_request:
```

Required responsibilities:

- Validate formatting.
- Run linting.
- Run type checks.
- Run unit tests.
- Build the application.
- Run dependency or security checks when configured.
- Create a preview deployment when appropriate.
- Avoid production credentials.
- Avoid production store uploads.

Required checks should block merging when they fail.

---

## 5. Staging workflow

Possible trigger:

```yaml
on:
  push:
    branches: [staging]
```

Manual trigger should also be available when useful:

```yaml
on:
  workflow_dispatch:
```

Responsibilities:

- Use the `staging` CI/CD environment.
- Build a versioned artifact.
- Run staging migrations.
- Deploy staging resources.
- Run health checks.
- Run smoke tests.
- Publish the deployment URL or artifact identifier.
- Notify the team.

---

## 6. Production workflow

Use a protected manual trigger or release tag.

Manual example:

```yaml
on:
  workflow_dispatch:
    inputs:
      version:
        description: Release version
        required: true
```

Tag example:

```yaml
on:
  push:
    tags:
      - "v*"
```

Production jobs must:

- Use the protected `production` environment.
- Require approval.
- Confirm the version is unique.
- Confirm the commit is from an allowed branch.
- Use a previously validated artifact when promotion is supported.
- Create a backup before high-risk migrations.
- Deploy.
- Run health checks.
- Run smoke tests.
- Record release metadata.
- Publish release notes when required.
- Retain a rollback target.

---

## 7. Artifact strategy

Artifacts should include:

- Application name.
- Semantic version or release version.
- Commit SHA.
- Build number.
- Checksum.
- Build timestamp.
- SBOM when required.

Examples:

```text
product-api-1.4.0-a1b2c3d.tar.gz
product-android-1.4.0-204.aab
product-ios-1.4.0-204.ipa
```

Preferred model:

```text
Build once
→ Test the artifact
→ Promote the same artifact
```

Mobile builds may require distribution-specific signing, but every artifact must remain traceable to the same source revision.

---

## 8. Dependency caching

Safe cache targets may include:

- Package-manager download caches.
- Gradle cache.
- Flutter pub cache.
- Ruby Bundler cache.
- Carefully managed CocoaPods or Swift Package Manager caches.

Never cache:

- `.env` files.
- Keystores.
- Private keys.
- Service account files.
- Temporary keychains.
- Unverified deployment artifacts.

Cache keys must include the relevant lockfile hash.

---

## 9. Database migration control

Rules:

- Store migrations in version control.
- Allow only one migration job per environment.
- Test migrations in staging.
- Review production migrations.
- Back up data before risky operations.
- Prefer backward-compatible changes.
- Avoid destructive schema changes in the same release that introduces the replacement schema.

Recommended expand-contract model:

```text
Release 1: Add the new schema while keeping the old schema
Release 2: Move application reads and writes to the new schema
Release 3: Remove the deprecated schema after verification
```

---

## 10. Fastlane in CI/CD

### Android

```text
Set up Java, Flutter or Node, and Ruby
→ bundle install
→ restore keystore and store credentials
→ bundle exec fastlane android internal
→ publish artifact and summary
→ remove credentials
```

### iOS

```text
Use a supported macOS runner
→ set up Flutter or Node and Ruby
→ bundle install
→ restore App Store Connect API key
→ fastlane match in read-only mode
→ bundle exec fastlane ios testflight
→ remove credentials and temporary keychain
```

Release logic belongs in the `Fastfile`. CI should prepare the environment, inject credentials, and invoke a lane.

Example:

```bash
cd android
bundle exec fastlane internal
```

---

## 11. Fastlane lane convention

Recommended lane names:

```text
validate
test
build
internal
beta
production
```

Every lane must:

- Fail when required inputs are missing.
- Avoid logging secrets.
- Write output to a predictable path.
- Set version and build metadata.
- Clearly distinguish upload from public release.
- Avoid automatic production submission unless explicitly designed and approved.

---

## 12. Environment protection

Production should define:

- Required reviewers.
- Allowed branches or tags.
- Environment-scoped credentials.
- Deployment history.
- Concurrency control.

Example:

```yaml
concurrency:
  group: production
  cancel-in-progress: false
```

Two production deployments must not run concurrently unless the architecture explicitly supports it.

---

## 13. Health checks and smoke tests

A health check confirms the service is alive:

```http
GET /health
```

A smoke test confirms that a critical business path works:

- Web application loads.
- Core API endpoint returns a valid response.
- Database connectivity works.
- Authentication works at a minimum level.
- Critical queue, upload, or payment path works when applicable.

A successful deploy command is not equivalent to a healthy service.

---

## 14. Notifications

A deployment notification should contain:

- Environment.
- Version.
- Commit SHA.
- Triggered-by identity.
- Deployment URL or build identifier.
- Status.
- Workflow link.
- Rollback target.

Do not include secrets or sensitive logs.

---

## 15. Generic GitHub Actions skeleton

```yaml
name: Deploy Staging

on:
  push:
    branches: [staging]
  workflow_dispatch:

concurrency:
  group: staging
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Validate configuration
        run: ./scripts/validate-environment.sh

      - name: Install dependencies
        run: npm ci

      - name: Test
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy
        run: ./scripts/deploy-staging.sh

      - name: Smoke test
        run: ./scripts/smoke-test.sh
```

This is a template. Current action versions and project-specific commands must be verified before use.

---

## 16. Failure handling

When a pipeline fails:

1. Do not rerun without understanding the failure.
2. Identify the failing stage.
3. Find the first actionable error.
4. Compare with the last successful run.
5. Check configuration and credential availability.
6. Check provider status.
7. Determine whether a partial deployment occurred.
8. Roll back if production is affected.
9. Record the root cause and prevention action.

---

## 17. Completion checklist

- [ ] Workflow triggers are explicit.
- [ ] Pull requests do not receive production credentials.
- [ ] Lockfiles are committed and used.
- [ ] Lint, tests, and build run in CI.
- [ ] Artifacts include version and commit SHA.
- [ ] Staging and production use separate environments.
- [ ] Production requires approval.
- [ ] Migrations are controlled.
- [ ] Health checks and smoke tests exist.
- [ ] Concurrency is defined.
- [ ] Credentials are not uploaded as artifacts.
- [ ] A rollback target is retained.

# Deployment Knowledge Base

> **Owner:** Deployment & Release Engineer  
> **Primary consumers:** Claude Code, software engineers, DevOps engineers, QA engineers, and release managers  
> **Status:** Reusable project template  
> **Scope:** Web, backend, database, mobile, CI/CD, release validation, and rollback

---

## 1. Purpose

This directory defines the minimum deployment and release standards for projects built or maintained with Claude.

It is intended to help Claude and project contributors:

- Identify the correct target platform and deployment environment.
- Generate deployment configuration without guessing project-specific values.
- Manage environment variables and credentials safely.
- Build repeatable CI/CD pipelines.
- Validate deployments before and after release.
- Automate mobile delivery with Fastlane where appropriate.
- Recover quickly from failed releases.
- Produce consistent deployment reports and audit trails.

This knowledge base is a **runbook**, not only a collection of recommendations. Project-specific platform guides and executable templates should reference these rules.

---

## 2. Directory structure

```text
deployment/
├── README.md
├── platform-matrix.md
├── environment.md
├── secrets.md
├── ci-cd.md
├── rollback.md
├── troubleshooting.md
├── deployment-checklist.md
├── release-checklist.md
├── web/
├── backend/
├── database/
└── mobile/
```

| File | Responsibility |
|---|---|
| `README.md` | Defines how Claude and engineers must use the deployment knowledge base |
| `platform-matrix.md` | Provides a structured process for selecting deployment platforms |
| `environment.md` | Defines development, staging, preview, and production conventions |
| `secrets.md` | Defines credential storage, access, rotation, and incident handling |
| `ci-cd.md` | Defines pipeline stages, artifact handling, approvals, and deployment controls |
| `rollback.md` | Defines recovery strategies for web, backend, database, and mobile |
| `troubleshooting.md` | Provides a systematic deployment failure investigation process |
| `deployment-checklist.md` | Provides per-deployment technical verification |
| `release-checklist.md` | Provides production release governance and rollout validation |

---

---

## Claude Code integration

The `deployment/` directory is a reference library. Claude Code does not automatically load every Markdown file in this directory.

This package therefore includes:

```text
CLAUDE.md
.claude/
├── rules/
│   └── deployment-safety.md
└── skills/
    └── deploy/
        ├── SKILL.md
        ├── references/
        │   └── reading-map.md
        └── evals/
            └── evals.json
```

Use `/deploy` for task-specific deployment work. The skill is configured with `disable-model-invocation: true`, so Claude cannot decide to deploy on its own.

`CLAUDE.md` and rules provide behavioral guidance, not a hard security boundary. Provider permissions, protected CI environments, approvals, and hooks remain the enforcement layer.


## 3. Required reading order

### 3.1 New deployment setup

Claude must read files in this order:

```text
README.md
→ platform-matrix.md
→ environment.md
→ secrets.md
→ ci-cd.md
→ deployment-checklist.md
→ platform-specific guide
```

### 3.2 Production release

```text
README.md
→ environment.md
→ secrets.md
→ ci-cd.md
→ rollback.md
→ deployment-checklist.md
→ release-checklist.md
→ platform-specific guide
```

### 3.3 Deployment failure

```text
troubleshooting.md
→ environment.md
→ secrets.md
→ ci-cd.md
→ rollback.md, when service recovery is required
```

---

## 4. Rules for Claude

Claude must not:

- Invent secrets, account identifiers, certificate values, project IDs, domains, or provider credentials.
- Place real secrets in source files, Markdown, terminal output, workflow logs, or generated examples.
- deploy to production unless the target environment is explicit.
- Run destructive database operations without identifying backup, compatibility, and recovery requirements.
- Rebuild a different artifact during promotion when the project supports promotion of a previously tested artifact.
- Skip tests, health checks, or smoke tests without reporting the omission and its risk.
- Automatically submit an application for public store review unless explicitly requested.
- Delete production infrastructure as a troubleshooting shortcut.
- Reuse staging credentials or data stores in production.
- expose complete environment files or secret payloads while debugging.

Claude must:

- Detect the current stack from the repository before proposing changes.
- Identify the target environment, target platform, release channel, and expected outcome.
- Use official provider documentation when provider behavior, CLI commands, or action versions may have changed.
- Prefer small, reviewable, and reversible changes.
- create placeholder configuration files such as `.env.example`, never populated secret files.
- Validate required configuration before build and deployment.
- Record version, build number, commit SHA, artifact identifier, and deployment target.
- Define verification and rollback steps before a production deployment.
- Clearly report blockers caused by missing accounts, permissions, certificates, or credentials.

---

## 5. Minimum deployment input

Claude should discover these values from the repository whenever possible:

```yaml
application:
  name: ""
  type: web | backend | mobile | fullstack | desktop
  framework: ""
  language: ""
  package_manager: ""
  build_command: ""
  test_command: ""
  health_check_path: ""

deployment:
  environment: development | preview | staging | production
  provider: ""
  region: ""
  branch_or_tag: ""
  domain: ""
  release_channel: internal | beta | production

database:
  provider: ""
  migration_command: ""
  migration_strategy: expand-contract | in-place
  backup_required: true

mobile:
  framework: flutter | react-native | expo | android-native | ios-native
  android_application_id: ""
  ios_bundle_id: ""
  build_distribution: firebase | play-internal | testflight | store
  automation: fastlane | eas | native

ci:
  provider: github-actions | gitlab-ci | bitbucket-pipelines | other
  production_approval_required: true
```

If a required value cannot be discovered safely, Claude must mark it as an unresolved input rather than guessing.

---

## 6. Standard deployment output

Every deployment task should end with a report in this format:

```markdown
## Deployment result

- Application:
- Environment:
- Platform:
- Provider:
- Region:
- Version:
- Build number:
- Commit SHA:
- Artifact:
- Deployment URL or store build:
- Database migration:
- Health check:
- Smoke test:
- Monitoring status:
- Final status:

## Changes made

- ...

## Unresolved requirements

- ...

## Rollback plan

- Trigger:
- Target version:
- Command, workflow, or dashboard action:

## Follow-up actions

- ...
```

Never include secret values in the report.

---

## 7. Recommended reference path

When a project has no infrastructure constraints, the following stack is a practical starting point:

```text
Web: Vercel
Backend: Railway, Render, or a managed container platform
Database: Supabase, Neon, or managed PostgreSQL
CI/CD: GitHub Actions
Flutter / React Native bare / native mobile: Fastlane
Expo managed: EAS Build and EAS Submit
Internal mobile distribution: Firebase App Distribution
Android beta: Google Play Internal Testing
iOS beta: TestFlight
```

This is not a mandatory stack. The final selection must follow `platform-matrix.md`.

---

## 8. Required structure for future platform guides

Every provider-specific guide should use this structure:

```markdown
# Platform name

## 1. Purpose
## 2. Supported workloads
## 3. When to use and when not to use
## 4. Prerequisites
## 5. Accounts and permissions
## 6. Environment variables and secrets
## 7. Initial setup
## 8. Local validation
## 9. Manual deployment
## 10. CI/CD deployment
## 11. Post-deployment verification
## 12. Rollback
## 13. Troubleshooting
## 14. Security considerations
## 15. Completion checklist
```

Every command must state:

- The directory from which it must run.
- The expected runtime and toolchain.
- Required inputs.
- Expected output.
- Whether it affects production.
- How success is verified.
- How the change is reverted.

---

## 9. Definition of Done

A deployment guide is complete when:

- Prerequisites are documented.
- Environment boundaries are explicit.
- Required secrets are listed without real values.
- Local validation is documented.
- A manual deployment path exists.
- A CI/CD path exists, or its omission is justified.
- Health checks and smoke tests are defined.
- A rollback strategy exists.
- Common failures are documented.
- The flow has been validated with at least one reference project.
- Another engineer can follow the guide without undocumented knowledge.

---

## 10. Example prompt for Claude

```text
Read the complete deployment directory at the project root.

Goal: prepare and deploy this application to staging.

Before changing files:
1. Detect the application stack and current deployment configuration.
2. Select the provider using platform-matrix.md.
3. Validate the environment model using environment.md.
4. Identify required credentials using secrets.md.
5. List unresolved blockers without requesting secrets inside source code.

Then:
1. Create or update deployment configuration.
2. Create CI/CD according to ci-cd.md.
3. Run local validation.
4. Deploy only when credentials and permissions are available.
5. Run health checks and smoke tests.
6. Report the result using the format in README.md.
7. Do not deploy to production.
```

---

## 11. Official references

Provider commands and action versions must be checked against current official documentation before production use:

- GitHub Actions deployments, environments, and secrets
- Fastlane actions and continuous integration guidance
- Vercel deployment environments
- Docker build best practices

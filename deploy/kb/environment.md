# Environment Strategy

> **Purpose:** Define consistent boundaries between local development, preview, staging, and production.

---

## 1. Standard environments

| Environment | Purpose | Primary users | Data | Deployment model |
|---|---|---|---|---|
| Development | Local implementation and developer testing | Engineers | Synthetic or development data | Local or shared development services |
| Preview | Temporary validation of a branch or pull request | Engineers, reviewers, QA | Isolated test data where practical | Automatically created and disposable |
| Staging | Production-like integration and release validation | QA, product, stakeholders | Non-production data | Automated or manually approved deployment |
| Production | Live customer traffic | End users | Real production data | Protected and auditable deployment |

Optional environments may include `qa`, `sandbox`, or `demo`, but they must have a documented purpose and owner.

---

## 2. Branch and release mapping

Recommended baseline:

```text
feature/*  → pull request checks and optional preview
develop    → shared development
staging    → staging deployment
main       → production candidate
v* tag     → production release
```

A trunk-based project may deploy staging from `main`. The repository must still define one authoritative mapping.

Example:

```yaml
deployment_mapping:
  pull_request: preview
  develop: development
  staging: staging
  main: production-candidate
  tag_v*: production
```

---

## 3. Domain conventions

```text
Web:
- Development: http://localhost:3000
- Preview: provider-generated URL
- Staging: https://staging.example.com
- Production: https://example.com

API:
- Development: http://localhost:8080
- Staging: https://api-staging.example.com
- Production: https://api.example.com
```

A staging frontend must not point to the production API unless explicitly approved for a controlled read-only scenario.

---

## 4. Mobile application identifiers

```text
Android:
- Development: com.company.product.dev
- Staging: com.company.product.staging
- Production: com.company.product

iOS:
- Development: com.company.product.dev
- Staging: com.company.product.staging
- Production: com.company.product
```

Each environment should also define:

- Display name.
- App icon or visual badge.
- API base URL.
- Firebase project.
- Deep-link and universal-link configuration.
- Push notification environment.
- Analytics environment.
- Error-monitoring environment.

Recommended display names:

```text
Product Dev
Product Staging
Product
```

---

## 5. Environment files

Commit templates only:

```text
.env.example
.env.development.example
.env.staging.example
.env.production.example
```

Do not commit populated files:

```text
.env
.env.local
.env.development
.env.staging
.env.production
```

Example:

```dotenv
# Application
APP_ENV=
APP_NAME=
APP_VERSION=

# Public runtime configuration
PUBLIC_WEB_URL=
PUBLIC_API_URL=

# Server-only configuration
DATABASE_URL=
REDIS_URL=
AUTH_ISSUER=
AUTH_CLIENT_ID=
AUTH_CLIENT_SECRET=

# Observability
SENTRY_DSN=
LOG_LEVEL=
```

A template must:

- Include all required keys.
- Contain no real credentials.
- Explain unusual formats.
- Distinguish public values from secrets.
- Be updated whenever the application introduces a new required variable.

---

## 6. Configuration classification

| Classification | Examples | Safe for client bundles? |
|---|---|---|
| Public configuration | Public API URL, app environment name | Yes, when intended |
| Internal configuration | Server log level, queue name | No |
| Secret | Database password, private token, signing key | No |
| Build-time configuration | Bundle ID, flavor, application ID | Depends on the value |
| Runtime configuration | Database URL, service endpoint, queue URL | Usually server-only |

Variables prefixed with framework-specific public prefixes may be embedded into client bundles. Never place credentials in those variables.

---

## 7. Configuration precedence

A project must document its effective precedence:

```text
Application defaults
→ environment-specific configuration
→ CI/CD variables
→ secret manager
→ runtime overrides
```

Production must not depend on an undocumented file that exists only on a developer workstation.

---

## 8. Resource isolation

Use separate resources per environment when practical:

- Database.
- Object storage bucket.
- Redis or cache.
- Queue.
- OAuth client.
- Firebase project.
- Analytics project or environment tag.
- Error-monitoring environment.
- Domain and TLS certificate.
- Mobile app identifier.
- Service account.

Production credentials must not be reused in staging.

---

## 9. Feature flags

Feature flags are preferred over long-lived release branches for incomplete features.

Rules:

- A new production flag defaults to `off` unless explicitly approved.
- Every flag has an owner.
- Every temporary flag has a removal date or cleanup issue.
- Both enabled and disabled states are tested.
- Flags must not hide an unsafe database migration.
- Remove stale flags after rollout is stable.

---

## 10. Environment validation

Pipelines must fail before build or deployment when required variables are missing.

Example:

```bash
#!/usr/bin/env bash
set -euo pipefail

required_vars=(
  APP_ENV
  PUBLIC_API_URL
  DATABASE_URL
)

for name in "${required_vars[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required environment variable: ${name}"
    exit 1
  fi
done
```

Do not print the values of secret variables.

---

## 11. Production controls

Production must have:

- A protected branch or protected release tag.
- Required review or approval.
- A dedicated CI/CD environment.
- Production-scoped credentials.
- A backup before high-risk migrations.
- A versioned release artifact.
- Health checks.
- Smoke tests.
- A known rollback target.
- Post-release monitoring.
- A named release owner.

Direct deployment from a personal workstation is reserved for documented emergency procedures.

---

## 12. Environment manifest template

Commit a non-secret environment manifest:

```yaml
project: sample-product

environments:
  development:
    branch: develop
    web_url: http://localhost:3000
    api_url: http://localhost:8080
    database_name: sample_dev

  staging:
    branch: staging
    web_url: https://staging.example.com
    api_url: https://api-staging.example.com
    database_name: sample_staging

  production:
    branch: main
    release_trigger: tag
    web_url: https://example.com
    api_url: https://api.example.com
    database_name: sample_production
    approval_required: true
```

---

## 13. Completion checklist

- [ ] Development, preview, staging, and production are defined.
- [ ] Branch or tag mapping is explicit.
- [ ] Domains and API endpoints are isolated.
- [ ] Databases are isolated.
- [ ] Mobile identifiers are isolated.
- [ ] `.env.example` is complete.
- [ ] No secret is exposed through a public variable.
- [ ] CI validates required configuration.
- [ ] Production requires approval.
- [ ] Monitoring data includes an environment tag.

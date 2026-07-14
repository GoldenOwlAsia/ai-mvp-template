# Railway Backend Deployment Runbook

> **Scope:** APIs, workers, scheduled jobs, and Docker-based services on Railway

---

## 1. Prerequisites

- Railway account and project access.
- Railway CLI for terminal deployment.
- GitHub repository access for Git-based deployment.
- Known service root and start command.
- Health endpoint.
- Environment-specific variables.
- Database migration plan.

Install and authenticate using the current official CLI instructions, then:

```bash
railway login
railway init
```

For an existing project:

```bash
railway link
```

---


### Non-interactive authentication

For CI/CD, use the credential type appropriate to the required scope:

```text
RAILWAY_TOKEN       → project-scoped token
RAILWAY_API_TOKEN   → account/workspace API token
```

Store the token in the protected CI environment. Never pass it as a workflow input or commit it to the repository.

A CI job must target the service and environment explicitly rather than relying on an interactive link state.


## 2. Deployment modes

| Mode | Use case |
|---|---|
| GitHub integration | Normal continuous deployment from a repository branch |
| Railway CLI | Manual staging deployment, troubleshooting, or custom CI |
| Dockerfile | Reproducible application packaging |
| Prebuilt image | Central image registry and artifact promotion |

Prefer GitHub integration or immutable images for production. Avoid untracked production uploads from personal machines.

---

## 3. Runtime requirements

Railway injects a `PORT` variable. The application must listen on it and bind to `0.0.0.0`.

Example Node configuration:

```ts
const port = Number(process.env.PORT ?? 3000);
await app.listen(port, '0.0.0.0');
```

Required endpoint:

```http
GET /health
```

Keep the endpoint fast and return a success response only when the service is able to receive traffic.

---

## 4. Config as Code

Railway supports `railway.toml` or `railway.json`.

Example `railway.toml`:

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 120
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

Validate current schema fields against Railway documentation before production use.

For a non-standard Dockerfile path:

```toml
[build]
dockerfilePath = "deploy/Dockerfile"
```

Keep environment-specific secrets in Railway variables, not this file.

Config-as-code values are applied to deployments and can override corresponding dashboard deployment settings. Treat `railway.toml` or `railway.json` as the source of truth for fields managed in code, and avoid maintaining conflicting dashboard values.

---

## 5. Variables

Configure variables per Railway environment.

Run locally with linked project variables:

```bash
railway run npm run dev
```

Do not use production variables for routine local development.

Recommended names:

```text
APP_ENV
DATABASE_URL
REDIS_URL
SENTRY_DSN
LOG_LEVEL
```

Use Railway reference variables where appropriate rather than copying credentials manually.

---

## 6. CLI deployment

Deploy the linked directory:

```bash
railway up
```

CI mode:

```bash
railway up --ci --service "<SERVICE_NAME>" --environment "<ENVIRONMENT_NAME>"
```

The exact available flags must be checked with the installed CLI:

```bash
railway up --help
```

Detached mode:

```bash
railway up --detach
```

Target the explicit service and environment using current CLI options. Do not rely on an interactive selection in CI.

View logs:

```bash
railway logs
```

Check the dashboard after detached or CI deployment to confirm the health check reached `Active`.

---

## 7. GitHub deployment

Recommended sequence:

1. Create the Railway project and staging environment.
2. Connect the repository.
3. Select service root for a monorepo.
4. Configure variables.
5. Configure health check.
6. Deploy staging branch.
7. Verify logs and public/private networking.
8. Create production environment with separate variables.
9. Protect production branch and deployment workflow.

Do not use the same database for staging and production.

---

## 8. Database migrations

Preferred choices:

- A dedicated CI migration job before application rollout.
- A release command that runs once.
- An explicit manual migration for high-risk production changes.

Avoid running migration automatically in every container replica at startup.

Migration flow:

```text
Backup if required
→ run migration once
→ verify schema
→ deploy compatible application
→ health check
```

Use expand-contract changes for production.

---

## 9. Networking

Determine:

- Which services need a public domain.
- Which services should use Railway private networking.
- Whether outbound allow-lists are required.
- Whether WebSockets, long polling, or streaming are used.
- Which port and target port are configured.

Workers generally do not need a public domain.

---

## 10. Persistent data

Container filesystems are not a database.

Use:

- Managed database.
- Object storage.
- Railway volume only when the workload specifically requires a mounted persistent filesystem.

Document backup and restore for every volume.

---

## 11. Verification

```bash
curl --fail --silent --show-error \
  --retry 5 \
  --retry-delay 3 \
  "https://api-staging.example.com/health"
```

Then test:

- Authentication.
- One critical read endpoint.
- One safe write in staging.
- Worker processing.
- External integrations.
- Error monitoring release.

---

## 12. Rollback

Options:

- Redeploy a previous Railway deployment.
- Deploy the previous immutable image.
- Revert the release commit and redeploy.
- Disable the feature through configuration.

Before rollback, verify database compatibility. Railway rollback does not restore database state.

---

## 13. Common failures

### Deployment never becomes Active

- Health path is wrong.
- Application does not read `PORT`.
- Application binds to localhost.
- Startup exceeds timeout.
- Required variable is missing.

### Service restarts repeatedly

- Start command exits.
- Migration runs in every replica.
- Memory limit is exceeded.
- Unhandled exception occurs at startup.

### CLI deploy targets wrong service

- Directory is linked to the wrong project/environment.
- Service selection is implicit.
- CI variables target another project.

### Database connection fails

- Environment uses the wrong connection string.
- Network path or TLS mode is incorrect.
- Pool limit is exhausted.
- Production and staging values were mixed.

---

## 14. Completion checklist

- [ ] Correct Railway project, environment, and service are selected.
- [ ] Application reads `PORT` and binds to `0.0.0.0`.
- [ ] Health check reaches Active.
- [ ] Variables are isolated.
- [ ] Dockerfile or build configuration is reproducible.
- [ ] Migration runs once.
- [ ] Logs and monitoring work.
- [ ] Smoke tests pass.
- [ ] Previous deployment or image is available.

---

## 15. Official references

- https://docs.railway.com/quick-start
- https://docs.railway.com/cli
- https://docs.railway.com/cli/up
- https://docs.railway.com/deployments/healthchecks
- https://docs.railway.com/config-as-code/reference
- https://docs.railway.com/variables
- https://docs.railway.com/observability/logs

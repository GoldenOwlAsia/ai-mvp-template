# Backend Deployment Runbooks

> **Scope:** Stateless APIs, background workers, scheduled jobs, container deployment, health checks, and runtime operations

---

## 1. Purpose

Use this directory to package and deploy backend services consistently.

Golden path:

```text
Application source
→ tests
→ production Docker image
→ Railway staging
→ health and smoke tests
→ approved production release
```

Docker is the default portability boundary unless the project has a documented provider-native build strategy.

---

## 2. Required discovery

```yaml
backend:
  framework: ""
  language: ""
  application_root: ""
  install_command: ""
  test_command: ""
  build_command: ""
  start_command: ""
  listen_host: "0.0.0.0"
  port_variable: PORT
  health_path: /health
  readiness_path: /ready
  migration_command: ""
  worker_command: ""
  stateless: true
  persistent_files: false
```

Stop and redesign if the application writes irreplaceable data to the container filesystem.

---

## 3. Runtime contract

Every production service must:

- Listen on `0.0.0.0`.
- Read the provider-assigned port when applicable.
- Handle termination signals.
- Log to standard output/error.
- Avoid storing credentials in the image.
- expose a health endpoint.
- Use external persistent storage for durable data.
- Run database migrations through a controlled job.

Suggested endpoints:

```http
GET /health
GET /ready
```

`/health` confirms the process is alive. `/ready` confirms it can receive traffic. Keep checks fast and avoid unnecessary dependencies.

---

## 4. Service categories

| Service | Deployment requirement |
|---|---|
| API | Public/private network, health checks, scaling |
| Worker | No public domain required, queue credentials, graceful shutdown |
| Scheduler | Idempotent jobs, overlap protection, observable execution |
| Migration job | Single execution, protected credentials, explicit approval |
| Webhook consumer | Public TLS endpoint, signature validation, retry safety |

Do not combine all service types into one process unless the architecture intentionally accepts coupled scaling and failure.

---

## 5. Standard release flow

```text
Validate environment
→ lint and test
→ build image
→ scan image
→ run container smoke test
→ push immutable image
→ run compatible migration
→ deploy API and workers
→ verify health and critical flow
→ monitor
```

---

## 6. Required artifacts

```text
Dockerfile
.dockerignore
.env.example
railway.toml or railway.json, when Railway is selected
scripts/validate-environment.sh
scripts/smoke-test.sh
```

Recommended image tag:

```text
<registry>/<application>:<version>-<short-sha>
```

Do not rely only on `latest`.

---

## 7. Observability baseline

Production must provide:

- Structured application logs.
- Request or correlation IDs.
- Error monitoring.
- Health status.
- Latency and error-rate metrics.
- Deployment version in logs/metrics.
- Worker queue depth when applicable.

Do not log authorization headers, passwords, tokens, or full sensitive payloads.

---

## 8. Claude operating contract

```text
Read deployment/backend/ and shared deployment documents.

Before changes:
1. Detect framework, runtime, start command, and port behavior.
2. Identify API, worker, scheduler, and migration processes.
3. Identify persistent filesystem use.
4. Identify health/readiness endpoints.
5. Identify database and external dependencies.

Then:
1. Create the smallest production Docker setup.
2. Run as a non-root user where practical.
3. Keep credentials out of images and logs.
4. Add health checks and graceful shutdown.
5. Add provider configuration only for the selected provider.
6. Define verification and rollback before Production.
```

---

## 9. Definition of Done

- [ ] Image builds reproducibly.
- [ ] Image does not contain secrets.
- [ ] Container listens on the required host and port.
- [ ] Health endpoint passes.
- [ ] Service handles termination.
- [ ] Migration is separate and controlled.
- [ ] Logs are visible.
- [ ] Staging deployment succeeds.
- [ ] Smoke tests pass.
- [ ] Previous image is retained for rollback.

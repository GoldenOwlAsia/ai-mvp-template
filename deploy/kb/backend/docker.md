# Docker Backend Runbook

> **Purpose:** Build small, repeatable, secure backend images suitable for Railway and other container platforms.

---

## 1. Required files

```text
Dockerfile
.dockerignore
.env.example
```

Recommended validation:

```bash
docker build --check .
docker build --pull -t sample-api:local .
docker run --rm -p 8080:8080 --env-file .env.local sample-api:local
```

`docker build --check` requires a compatible Buildx version. Use it when available.

---

## 2. Design rules

- Use multi-stage builds.
- Use an appropriate, minimal trusted base image.
- Pin versions according to the team's update policy.
- Copy dependency manifests before source to improve caching.
- Install only production dependencies in the runtime stage.
- Run as a non-root user where practical.
- Use `COPY`, not remote downloads through `ADD`, unless specifically needed.
- Keep build context small with `.dockerignore`.
- Put secrets in runtime configuration, never image layers.
- One container should have one primary responsibility.
- Write durable files to managed storage or mounted volumes.

---

## 3. `.dockerignore`

```dockerignore
.git
.github
.env
.env.*
!.env.example
node_modules
coverage
build
dist
.tmp
*.log
*.pem
*.key
*.p12
*.jks
*.keystore
```

Do not ignore source files required by the build. Validate with a clean CI build.

---

## 4. Node/NestJS example

**This boilerplate:** use the maintained stub [`../../Dockerfile.api`](../../Dockerfile.api). Preserve monorepo install layout in the runner — see [`../deploy-invariants.md`](../deploy-invariants.md) §1–2.

Generic single-package illustration (not the monorepo stub):

```dockerfile
# syntax=docker/dockerfile:1

FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --from=build --chown=app:app /app/package.json ./package.json
COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/dist ./dist

USER app
EXPOSE 8080
CMD ["node", "dist/main.js"]
```

Project requirements may need additional files such as Prisma schema, templates, or static assets. Include only required runtime files.

The application must read `PORT` and bind to `0.0.0.0`.

---

## 5. Python example

```dockerfile
# syntax=docker/dockerfile:1

FROM python:3.13-slim AS build
WORKDIR /app
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1
COPY requirements.txt ./
RUN python -m venv /opt/venv \
 && /opt/venv/bin/pip install --requirement requirements.txt

FROM python:3.13-slim AS runtime
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1
WORKDIR /app
RUN useradd --create-home --uid 10001 app
COPY --from=build /opt/venv /opt/venv
COPY --chown=app:app . .
USER app
EXPOSE 8080
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8080"]
```

Adapt worker count, framework entrypoint, and health behavior to the project.

---

## 6. Build-time secrets

Do not pass sensitive tokens as ordinary `ARG` or `ENV`, because values can be exposed in image history or metadata.

Use BuildKit secret mounts when a private package registry is required:

```dockerfile
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci
```

Build:

```bash
docker build \
  --secret id=npmrc,src="$HOME/.npmrc" \
  -t sample-api:local .
```

---

## 7. Container health check

Provider-level health checks are generally preferred because they control traffic switching.

An image-level check may be added when the runtime image includes a suitable client:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:8080/health || exit 1
```

Do not install a large utility package solely for a Dockerfile health check if the platform already provides one.

---

## 8. Local validation

```bash
docker build --pull -t sample-api:local .

docker run --rm \
  --name sample-api \
  --env-file .env.local \
  -p 8080:8080 \
  sample-api:local
```

In another terminal:

```bash
curl --fail http://localhost:8080/health
```

Termination test:

```bash
docker stop --time 20 sample-api
```

Confirm the process shuts down cleanly.

---

## 9. Image inspection

```bash
docker image inspect sample-api:local
docker history sample-api:local
```

Check:

- Entrypoint and command.
- User is not root where practical.
- No secret appears in history.
- Image architecture is correct.
- Runtime contains only required files.

Use an approved vulnerability scanner in CI.

---

## 10. Registry and tags

Recommended tags:

```text
1.4.0
1.4.0-a1b2c3d
a1b2c3d
```

Push immutable tags and record the digest:

```bash
docker push registry.example.com/sample-api:1.4.0-a1b2c3d
docker inspect --format='{{index .RepoDigests 0}}' \
  registry.example.com/sample-api:1.4.0-a1b2c3d
```

Deploy by immutable digest when supported.

---

## 11. Common failures

### Build context is unexpectedly large

- Review `.dockerignore`.
- Do not include `.git`, caches, build output, or local databases.

### Container exits immediately

- Check command and entrypoint.
- Check missing runtime files.
- Check required environment variables.
- Check database connectivity and migration behavior.

### Works locally but not in provider

- Ensure bind address is `0.0.0.0`.
- Read provider `PORT`.
- Avoid writing to read-only or ephemeral paths.
- Check CPU architecture and native modules.

### Secret found in image

- Revoke the credential.
- Remove it from all layers and build context.
- Rebuild without cache.
- Scan the new image.

---

## 12. Completion checklist

- [ ] Multi-stage build is used when beneficial.
- [ ] `.dockerignore` is reviewed.
- [ ] Build passes from a clean checkout.
- [ ] Runtime user is non-root where practical.
- [ ] No secret exists in image history or files.
- [ ] Health endpoint passes.
- [ ] Termination is graceful.
- [ ] Image is versioned and traceable.
- [ ] Vulnerability checks meet project policy.

---

## 13. Official references

- https://docs.docker.com/build/building/best-practices/
- https://docs.docker.com/build/building/multi-stage/
- https://docs.docker.com/reference/dockerfile/
- https://docs.docker.com/build/checks/

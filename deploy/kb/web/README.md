# Web Deployment Runbooks

> **Owner:** Deployment & Release Engineer  
> **Consumers:** Claude Code, frontend engineers, QA, and release managers  
> **Scope:** Provider selection, preview deployments, production promotion, validation, and rollback

---

## 1. Purpose

Use this directory to deploy web applications without guessing framework output, environment variables, routing behavior, or provider settings.

Read first:

```text
deployment/README.md
deployment/platform-matrix.md
deployment/environment.md
deployment/secrets.md
deployment/ci-cd.md
deployment/rollback.md
```

Then read:

```text
deployment/web/vercel.md
```

Use `alternatives.md` when Vercel is not suitable.

---

## 2. Required discovery

Claude must identify:

```yaml
web:
  framework: ""
  application_root: ""
  package_manager: npm | pnpm | yarn | bun
  runtime_version: ""
  install_command: ""
  lint_command: ""
  test_command: ""
  build_command: ""
  output_directory: ""
  production_branch: ""
  health_check_path: "/"
  server_rendering: false
  server_functions: false
  edge_runtime: false
  monorepo: false
```

Do not guess the output directory. Run the build and inspect the framework configuration.

---

## 3. Standard environment model

```text
Local       → developer workstation
Preview     → pull request or feature branch
Staging     → protected non-production release environment
Production  → protected branch, tag, or approved promotion
```

Rules:

- Preview and staging never receive production write credentials.
- Authentication callback URLs must include approved preview and staging origins.
- Public client variables must be separated from server-only secrets.
- Staging must use non-production APIs and databases.
- Monitoring must include environment and release identifiers.

---

## 4. Standard deployment flow

```text
Detect framework and project root
→ validate runtime and lockfile
→ install dependencies
→ lint and test
→ build
→ deploy Preview
→ run route and API smoke tests
→ approve
→ promote or deploy Production
→ verify domain, TLS, monitoring, and critical flow
→ retain rollback target
```

---

## 5. Minimum smoke test

```bash
#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:?Usage: smoke-test.sh <base-url>}"

curl --fail --silent --show-error \
  --retry 3 \
  --retry-delay 2 \
  "${BASE_URL}/" > /dev/null

echo "Web smoke test passed: ${BASE_URL}"
```

Add direct-route, API, and authentication checks for the actual project.

---

## 6. Source of truth

Prefer version-controlled non-secret configuration:

- Vercel: `vercel.json`, only when needed.
- Cloudflare Pages: `wrangler.jsonc` or `wrangler.toml` when Functions or bindings require it.
- Netlify: `netlify.toml`.
- Static routing: provider-supported redirect and header files.

Secrets remain in the provider or CI/CD secret store.

---

## 7. Security requirements

Do not:

- Put credentials in client-prefixed variables.
- Commit provider access tokens.
- expose production secrets to pull requests from forks.
- disable deployment protection to make tests pass.
- log `.env` contents.
- use preview URLs as permanent production dependencies.

---

## 8. Claude operating contract

```text
Read deployment/ and deployment/web/.

Target provider: <provider>
Target environment: <preview|staging|production>
Application root: <path>

Before changes:
1. Detect framework, package manager, runtime, build command, and output.
2. Inspect existing provider configuration.
3. Classify public configuration and secrets.
4. Check routing, server functions, edge runtime, and monorepo settings.
5. Report unresolved account, domain, and credential requirements.

Then:
1. Make the minimum required changes.
2. Add validation and smoke tests.
3. Add CI/CD only when required.
4. Do not expose secrets.
5. Do not deploy Production unless explicitly requested.
6. Report URL, commit SHA, checks, and rollback action.
```

---

## 9. Definition of Done

- [ ] Framework and application root are correct.
- [ ] Lockfile and runtime are pinned.
- [ ] Build output is verified.
- [ ] Preview deployment succeeds.
- [ ] Production deployment is protected.
- [ ] Variables are scoped by environment.
- [ ] Domain and TLS are verified.
- [ ] Direct routes and assets work.
- [ ] Functions work when used.
- [ ] Smoke tests pass.
- [ ] Rollback target is recorded.

---

## 10. Official references

- Vercel deployments: https://vercel.com/docs/deployments
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Netlify deploy overview: https://docs.netlify.com/deploy/deploy-overview/

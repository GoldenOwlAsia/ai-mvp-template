# Vercel Deployment Runbook

> **Scope:** Web applications deployed through Vercel Git integration or Vercel CLI  
> **Recommended for:** Next.js and other Vercel-supported frameworks  
> **Last reviewed:** 2026-07-11

---

## 1. Purpose

This runbook defines how to configure, deploy, verify, promote, and roll back a web application on Vercel.

Vercel provides default Local, Preview, and Production environments. A connected Git repository normally creates Preview deployments for non-production branches and Production deployments from the configured production branch.

---

## 2. Use Vercel when

Vercel is a strong candidate when:

- The project uses Next.js.
- Pull-request preview URLs are required.
- The team wants provider-managed builds and deployment history.
- The application fits Vercel-supported runtime and function limits.
- The team accepts the provider's operating and pricing model.

Perform additional review when:

- The application requires long-running processes.
- Fixed private networking or specialized infrastructure is required.
- Data residency or compliance constraints apply.
- The workload depends on provider behavior not supported by the selected plan.
- Projected function, bandwidth, image optimization, or build usage may be significant.

---

## 3. Prerequisites

Required:

- A Vercel account and team access.
- Access to the Git repository, or a Vercel access token for CLI/CI.
- A valid package-manager lockfile.
- A known build command.
- A known project root and output behavior.
- Required environment variables.
- Domain access for custom-domain setup.

Recommended repository files:

```text
package.json
pnpm-workspace.yaml          # monorepo: packages apps/*
apps/web/package.json        # name: @app/web (FIXED boilerplate)
package-lock.json | pnpm-lock.yaml | yarn.lock | bun.lock
.env.example
.nvmrc | .node-version
vercel.json                  # repo root; sync with deploy/vercel.json
```

Boilerplate Vite SPA defaults (when `deploy.web: vercel`):

- `installCommand`: `pnpm install`
- `buildCommand`: `pnpm --filter @app/web build`
- `outputDirectory`: `apps/web/dist` (or `{frontend.appDir}/dist`)
- SPA rewrite to `/index.html`
- Env: `VITE_API_URL` (absolute API URL + `/api/v1` for hosted builds)

---

## 4. Required project discovery

Before changing files, Claude must inspect:

```yaml
project:
  framework: ""
  root_directory: ""
  package_manager: ""
  install_command: ""
  build_command: ""
  output_directory: ""
  node_version: ""
  production_branch: ""
  uses_server_functions: false
  uses_edge_runtime: false
  uses_image_optimization: false
  monorepo: false
```

For supported frameworks, do not override the output directory unless required by the framework or project layout.

---

## 5. Environment model

Default targets:

| Environment | Typical trigger |
|---|---|
| Local | Developer workstation |
| Preview | Non-production branch, pull request, or `vercel deploy` |
| Production | Production branch or `vercel deploy --prod` |
| Custom environment | Explicit project configuration and `--target=<name>` |

Recommended variable separation:

```text
Development variables → local development
Preview variables     → preview API and non-production services
Production variables  → production services only
```

Branch-specific Preview variables may be used when a feature branch requires isolated infrastructure.

---

## 6. Initial Git integration

Preferred setup for most projects:

1. Import the repository into Vercel.
2. Select the correct team.
3. Set the project root for monorepos.
4. Confirm framework detection.
5. Confirm install and build commands.
6. Configure the production branch.
7. Add Preview and Production environment variables separately.
8. Deploy.
9. Verify the generated deployment URL.
10. Configure the custom domain only after the deployment passes validation.

Do not put secret values in `vercel.json`.

---

## 7. CLI setup

Install and authenticate:

```bash
npm install --global vercel
vercel login
```

Run from the application root.

Link the local directory:

```bash
vercel link
```

The `.vercel` directory contains local project linkage and should normally remain ignored by Git.

Pull project settings for local Vercel builds:

```bash
vercel pull
```

Pull a specific target:

```bash
vercel pull --environment=preview
vercel pull --environment=production
```

Use environment variables without writing a local file when possible:

```bash
vercel env run -e preview -- npm test
```

If a framework requires a local file:

```bash
vercel env pull .env.local
```

The generated `.env.local` must not be committed.

---

## 8. Local validation

Run the project's own checks first:

```bash
npm ci
npm run lint
npm test
npm run build
```

When reproducing the Vercel build environment:

```bash
vercel pull --environment=preview
vercel build
```

For production variables:

```bash
vercel pull --environment=production
vercel build --prod
```

`vercel build` writes Build Output API artifacts under `.vercel/output`.

Do not run a production-variable build on an untrusted workstation.

---

## 9. Preview deployment

Deploy from source:

```bash
vercel deploy
```

The command writes the deployment URL to standard output.

Capture it:

```bash
DEPLOYMENT_URL="$(vercel deploy)"
echo "${DEPLOYMENT_URL}"
```

Custom environment:

```bash
vercel deploy --target=staging
```

Verify:

```bash
curl --fail --silent --show-error "${DEPLOYMENT_URL}/" > /dev/null
```

For build and deployment inspection:

```bash
vercel inspect "<deployment-url-or-id>" --logs --wait
```

For runtime logs from a specific deployment:

```bash
vercel logs --follow --deployment "<deployment-id>"
```

Use the current CLI help for filtering options supported by the installed Vercel CLI:

```bash
vercel logs --help
```

Do not use Preview credentials that have production write access.

---

## 10. Production deployment

Direct production deployment:

```bash
vercel deploy --prod
```

Safer production flow:

1. Validate a Preview deployment.
2. Run smoke tests.
3. Obtain approval.
4. Promote the validated deployment to production.

Vercel supports promoting an existing ready Preview deployment through the dashboard and current CLI workflows. Promotion reduces the risk of validating one build and serving a different build.

For a staged production deployment that must not immediately receive the production domain:

```bash
vercel deploy --prod --skip-domain
```

Promote or assign the production domain only after verification.

---

## 11. Prebuilt deployment

Use only when the project intentionally builds in its own CI environment:

```bash
vercel pull --environment=preview
vercel build
vercel deploy --prebuilt
```

Production:

```bash
vercel pull --environment=production
vercel build --prod
vercel deploy --prebuilt --prod
```

Important constraints:

- Prebuilt deployment uploads `.vercel/output`.
- Vercel system environment variables may be unavailable at local build time.
- Frameworks relying on those system values may require Git-based or provider-managed builds.
- Validate the application before adopting a prebuilt workflow.

---

## 12. Environment variables

List variables:

```bash
vercel env ls
vercel env ls preview
vercel env ls production
```

Add interactively:

```bash
vercel env add API_URL preview
vercel env add API_URL production
```

For secret values, prefer secure input from standard input or the dashboard. Avoid commands that place secrets in shell history.

After variable changes:

- Create a new deployment.
- Re-run local pulls if local Vercel settings are used.
- Verify that public variables are intentionally exposed.
- Verify Preview and Production values separately.

---

## 13. Example `vercel.json`

Create this file only when the project requires version-controlled Vercel configuration.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

Do not blindly apply immutable caching to files without content hashes.

Framework-native routing should remain the primary source of truth when available.

---

## 14. GitHub Actions example

Use this only when the project intentionally deploys through custom CI instead of Vercel's built-in Git integration.

Required secrets:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Example Preview workflow:

```yaml
name: Vercel Preview

on:
  pull_request:

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: preview

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

      - name: Deploy preview
        id: deploy
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: |
          npm install --global vercel
          url="$(vercel deploy --yes --token="$VERCEL_TOKEN")"
          echo "url=$url" >> "$GITHUB_OUTPUT"

      - name: Smoke test
        run: |
          curl --fail --silent --show-error \
            --retry 3 \
            "${{ steps.deploy.outputs.url }}/" > /dev/null
```

Before production use:

- Pin or control CLI versions according to team policy.
- Verify current action major versions.
- Protect production with a GitHub Environment.
- Do not expose secrets to forked pull requests.

---

## 15. Custom domains

Before attaching a domain:

- Verify the deployment.
- Confirm DNS ownership.
- Confirm production environment variables.
- Confirm authentication callback URLs.
- Confirm canonical URL and redirects.
- Confirm no old provider still serves traffic unexpectedly.

After DNS configuration:

```bash
curl --head --fail https://example.com/
```

Verify TLS, redirects, and the expected deployment.

---

## 16. Post-deployment verification

Required checks:

- [ ] Production domain resolves.
- [ ] TLS is valid.
- [ ] Root page loads.
- [ ] Direct application routes load.
- [ ] Static assets load.
- [ ] Correct API environment is used.
- [ ] Authentication callback works.
- [ ] Server or edge functions work.
- [ ] Monitoring reports the correct release.
- [ ] No material build or runtime error appears.
- [ ] Deployment and commit SHA are recorded.

---

## 17. Rollback

Preferred rollback methods:

1. Promote a previous known-good deployment through the Vercel deployment history.
2. Revert the release commit and create a new production deployment.
3. Disable a feature through configuration or feature flags where appropriate.

Before rollback:

- Confirm frontend compatibility with the current backend and database.
- Identify whether environment variables changed.
- Identify cache or route changes.
- Record the current and target deployment IDs.

After rollback:

- Verify the production domain.
- Run smoke tests.
- Check error and latency metrics.
- Do not assume backend or database state was rolled back.

---

## 18. Troubleshooting

### Build succeeds locally but fails on Vercel

Check:

- Node and package-manager versions.
- Case-sensitive file paths.
- Missing environment variables.
- Framework adapter or output mode.
- Monorepo root.
- Files excluded from Git.
- Native dependencies.

### Preview uses the wrong API

Check:

- Variable target.
- Branch-specific Preview variables.
- Whether the variable is build-time or runtime.
- Whether a new deployment was created after changing it.

### Direct route returns 404

Check:

- Framework routing support.
- SPA rewrite requirements.
- `vercel.json` routes only when framework-native handling is unavailable.
- Output mode and static export behavior.

### Deployment is ready but domain serves an older version

Check:

- Whether the deployment was promoted.
- Domain assignment.
- `--skip-domain`.
- DNS and proxy cache.
- Production branch configuration.

---

## 19. Completion checklist

- [ ] Project is linked to the correct Vercel team and project.
- [ ] Framework and root directory are correct.
- [ ] Preview and Production variables are isolated.
- [ ] Pull requests receive Preview deployments.
- [ ] Production deployment requires approval.
- [ ] Custom domain and TLS are verified.
- [ ] Smoke tests pass.
- [ ] Previous deployment is available for rollback.
- [ ] Deployment URL, version, and commit SHA are recorded.

---

## 20. Official documentation

- Deployments: https://vercel.com/docs/deployments
- Environments: https://vercel.com/docs/deployments/environments
- CLI deployment: https://vercel.com/docs/projects/deploy-from-cli
- `vercel deploy`: https://vercel.com/docs/cli/deploy
- `vercel build`: https://vercel.com/docs/cli/build
- Environment variables: https://vercel.com/docs/environment-variables
- Promote deployment: https://vercel.com/docs/deployments/promote-preview-to-production

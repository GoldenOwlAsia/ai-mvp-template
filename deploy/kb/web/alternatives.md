# Web Hosting Alternatives

> **Purpose:** Select and configure a provider when Vercel is not the correct operational fit.

---

## Coverage status

This file is a provider comparison and selection aid. It is **not** a complete executable deployment runbook for every provider listed here.

Before Claude implements one of these alternatives, add a provider-specific runbook with current official commands, authentication, CI/CD, verification, and rollback instructions.

---

## 1. Decision matrix

| Provider | Best fit | Preview support | Server runtime | Main concern |
|---|---|---:|---|---|
| Cloudflare Pages | Static sites, SPAs, edge-first applications | Yes | Pages Functions / Workers | Edge-runtime compatibility and initial deployment model |
| Netlify | Static/Jamstack applications and Netlify Functions | Yes | Functions and Edge Functions | Deploy-context configuration and usage limits |
| Firebase Hosting | SPA/PWA projects centered on Firebase | Preview channels | Cloud Functions/Run separately | Backend is a separate deployment concern |
| AWS Amplify Hosting | Teams already operating in AWS | Yes | Framework-dependent | IAM and AWS operational complexity |
| S3 + CloudFront | Static assets requiring AWS control | Custom CI required | None | Team owns invalidation, routing, and release automation |

Use `platform-matrix.md` before selecting.

---

## 2. Cloudflare Pages golden path

### Choose setup model

- **Git integration:** Cloudflare owns build and branch deployments.
- **Direct Upload:** CI builds assets and uploads with Wrangler.

Choose deliberately. Do not assume every Pages project can freely switch setup models later.

### Required discovery

```yaml
provider: cloudflare-pages
production_branch: main
build_command: "npm run build"
output_directory: dist
uses_pages_functions: false
uses_bindings: false
```

### Direct Upload commands

```bash
npm ci
npm run lint
npm test
npm run build

npx wrangler pages project create
npx wrangler pages deploy dist --project-name="<PROJECT_NAME>"
```

Preview branch:

```bash
npx wrangler pages deploy dist \
  --project-name="<PROJECT_NAME>" \
  --branch="<BRANCH_NAME>"
```

Local Pages Functions:

```bash
npx wrangler pages dev dist
```

### CI credentials

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_PAGES_PROJECT
```

Use an API token with the minimum permissions required for the target account/project.

### Rollback

Use the Pages deployment history to roll production back to a previous successful production deployment. Then run smoke tests. This does not restore databases, storage, or external services.

### Common failures

- Wrong output directory or missing top-level `index.html`.
- SPA fallback missing.
- Preview bindings accidentally point to production resources.
- Pages Function binding name differs from code.
- Wrangler token lacks account/project permissions.

Official documentation:

- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/pages/configuration/rollbacks/

---

## 3. Netlify golden path

### Required discovery

```yaml
provider: netlify
production_branch: main
base_directory: ""
build_command: "npm run build"
publish_directory: dist
functions_directory: netlify/functions
```

### Recommended `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[context.deploy-preview]
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Remove the SPA rewrite for frameworks that provide server routing.

### CLI

```bash
npm install --global netlify-cli
netlify login
netlify link
netlify build
netlify deploy
netlify deploy --prod
```

### CI credentials

```text
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

### Rollback

Open deployment history, select a previous known-good production deploy, and publish it. Verify frontend compatibility with the current backend and database.

### Common failures

- `netlify.toml` overrides dashboard settings unexpectedly.
- Wrong base or publish directory in a monorepo.
- Deploy Preview variables use the wrong context.
- Functions cannot access variables because scopes are incorrect.
- SPA rewrite is missing or incorrectly applied.

Official documentation:

- https://docs.netlify.com/deploy/deploy-overview/
- https://docs.netlify.com/build/configure-builds/file-based-configuration/
- https://docs.netlify.com/build/environment-variables/overview/

---

## 4. Firebase Hosting

Use for static or SPA applications integrated heavily with Firebase.

Typical commands:

```bash
firebase login
firebase init hosting
npm run build
firebase hosting:channel:deploy preview
firebase deploy --only hosting
```

Requirements:

- Separate Firebase projects for staging and production.
- `.firebaserc` aliases checked into source control.
- `firebase.json` reviewed.
- Service-account or workload identity used in CI.
- Rewrite rules reviewed before production.

Official documentation: https://firebase.google.com/docs/hosting

---

## 5. AWS Amplify or S3 + CloudFront

Select when AWS ownership, IAM, region controls, or integration justify additional complexity.

Minimum production controls:

- Infrastructure as code.
- Separate AWS accounts or strongly isolated environments.
- OIDC from CI instead of long-lived access keys where possible.
- CloudFront invalidation or versioned assets.
- Certificate and DNS ownership.
- Logging and budget alerts.
- Tested rollback to a previous artifact.

Official documentation:

- https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html
- https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html

---

## 6. Selection record

```markdown
## Web provider decision

- Application framework:
- Selected provider:
- Deployment model:
- Alternatives considered:
- Preview strategy:
- Production trigger:
- Runtime limitations:
- Cost assumptions:
- Required secrets:
- Rollback method:
- Open risks:
```

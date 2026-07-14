# Secrets Management

> **Purpose:** Protect API keys, tokens, certificates, signing assets, service accounts, and other credentials across local development, CI/CD, and production.

---

## 1. Secret definition

Secrets include:

- Database credentials.
- API tokens.
- OAuth client secrets.
- JWT signing keys.
- Encryption keys.
- Private keys.
- Android keystores and passwords.
- Apple `.p8`, `.p12`, and provisioning assets.
- App Store Connect API credentials.
- Google Play service account credentials.
- Firebase service account credentials.
- Cloud provider credentials.
- Webhook URLs with write access.
- Fastlane Match passwords.

Public endpoints and application IDs are not secrets, but they still require environment-specific management.

---

## 2. Mandatory principles

1. Never commit a secret to Git.
2. Never write real secrets in project documentation.
3. Never hard-code secrets in application source.
4. Never print secrets in CI/CD logs.
5. Apply least privilege.
6. Separate credentials by environment.
7. Assign an owner to every production credential.
8. Track creation, rotation, and expiry where supported.
9. Revoke credentials when access is no longer required.
10. Prefer short-lived credentials or workload identity when available.

---

## 3. Approved storage locations

| Context | Recommended storage |
|---|---|
| Local development | Local `.env` file excluded from Git, OS keychain, or approved password manager |
| GitHub Actions | Repository, environment, or organization secrets |
| GitLab CI | Protected and masked CI/CD variables |
| Cloud runtime | Provider secret manager or encrypted runtime variables |
| Mobile signing | CI secret storage, protected Match repository, approved password manager |
| Team sharing | Organization-managed password manager |
| Production | Secret manager with access controls and audit logs |

Do not distribute production secrets through ordinary chat messages, email, or public tickets.

---

## 4. Secret inventory

Maintain a non-secret inventory:

```yaml
secrets:
  - name: DATABASE_URL
    environment: staging
    owner: backend-team
    consumer: backend-runtime
    storage: provider-secret-store
    rotation_policy: 90-days
    required: true

  - name: GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64
    environment: production
    owner: release-engineer
    consumer: github-actions
    storage: github-production-environment
    rotation_policy: on-role-change
    required: true
```

---

## 5. Naming convention

Use descriptive names:

```text
<PROVIDER>_<PURPOSE>_<TYPE>
```

Examples:

```text
AWS_DEPLOY_ROLE_ARN
DATABASE_URL
SENTRY_AUTH_TOKEN
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64
APP_STORE_CONNECT_KEY_ID
APP_STORE_CONNECT_ISSUER_ID
APP_STORE_CONNECT_API_KEY_BASE64
ANDROID_KEYSTORE_BASE64
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
ANDROID_STORE_PASSWORD
MATCH_PASSWORD
MATCH_GIT_URL
```

Avoid ambiguous names such as `TOKEN`, `KEY`, or `PASSWORD1`.

---

## 6. Restoring secret files in CI

Binary or JSON files may be stored as protected base64 values and restored temporarily.

Example:

```bash
printf '%s' "$ANDROID_KEYSTORE_BASE64" \
  | base64 --decode \
  > "$RUNNER_TEMP/release.keystore"

chmod 600 "$RUNNER_TEMP/release.keystore"
```

Cleanup:

```bash
rm -f "$RUNNER_TEMP/release.keystore"
```

Rules:

- Do not echo secret variables.
- Do not upload restored secret files as artifacts.
- Store them under the runner temporary directory.
- Remove them in an `always()` cleanup step.
- Do not cache credential directories.
- Limit file permissions.

---

## 7. Android release credentials

Common values:

```text
ANDROID_KEYSTORE_BASE64
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
ANDROID_STORE_PASSWORD
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64
FIREBASE_APP_ID_ANDROID
FIREBASE_SERVICE_ACCOUNT_JSON
```

Do not commit:

```text
*.jks
*.keystore
key.properties
service-account.json
```

Safe `key.properties.example`:

```properties
storeFile=
storePassword=
keyAlias=
keyPassword=
```

---

## 8. iOS release credentials

Common values:

```text
APP_STORE_CONNECT_KEY_ID
APP_STORE_CONNECT_ISSUER_ID
APP_STORE_CONNECT_API_KEY_BASE64
APPLE_TEAM_ID
APP_STORE_CONNECT_TEAM_ID
MATCH_PASSWORD
MATCH_GIT_URL
MATCH_GIT_BASIC_AUTHORIZATION
```

Do not commit:

```text
*.p8
*.p12
*.mobileprovision
fastlane/.env
temporary keychains
```

Fastlane Match storage must be protected and access-restricted.

CI should use Match in read-only mode unless the workflow is explicitly responsible for certificate creation:

```ruby
match(
  type: "appstore",
  readonly: true
)
```

---

## 9. CI/CD secret scope

### Pull requests

- Provide only secrets required for validation.
- Never provide production secrets to untrusted pull requests.
- Do not expose secrets to workflows originating from forks.

### Staging

- Use a dedicated `staging` CI/CD environment.
- Use staging-only credentials.

### Production

- Use a dedicated `production` environment.
- Require approval.
- Restrict branches or tags.
- Restrict reviewers.
- Keep audit history.
- Use production-only credentials.

---

## 10. Rotation process

Rotate a credential when:

- Exposure is suspected.
- A person with access leaves the project.
- The credential reaches its rotation interval.
- Permissions change.
- The provider requires rotation.
- The credential appeared in source control, logs, artifacts, or caches.

Safe rotation sequence:

```text
Create replacement credential
→ Add it to the secret store
→ Deploy consumers with the replacement
→ Verify
→ Revoke the previous credential
→ Update the inventory
```

During an active security incident, revoke first if continued access presents greater risk than downtime.

---

## 11. Secret exposure response

If a secret is committed or logged:

1. Treat it as compromised.
2. Revoke or rotate it immediately.
3. Do not rely on deleting it in a later commit.
4. Remove it from Git history where appropriate.
5. Inspect CI logs, artifacts, and caches.
6. Review provider audit logs.
7. Record the incident.
8. Enable or improve secret scanning.
9. Evaluate whether data or infrastructure was accessed.

A secret exposed in a private repository is still considered compromised.

---

## 12. Safe logging

Do not log:

- Authorization headers.
- Session cookies.
- Database URLs containing passwords.
- Private keys.
- Service account payloads.
- Complete request bodies containing credentials.

When an identifier is needed, mask it:

```text
token: ****abcd
account: release-service-account
```

Do not rely only on automatic CI masking.

---

## 13. Rules for Claude

Claude must not:

- Ask users to paste production secrets into committed source files.
- Generate placeholder credentials and claim deployment succeeded.
- Print secret values while debugging.
- Put production values in `.env.example`.
- Treat base64 encoding as encryption.
- Use production secrets in general pull-request workflows.

Claude must:

- Generate placeholders only.
- Identify the correct secret storage location.
- Validate presence without printing values.
- Report missing permissions or credentials as blockers.
- Prefer OIDC or workload identity where officially supported.

---

## 14. Completion checklist

- [ ] No secret exists in Git history.
- [ ] `.gitignore` covers sensitive files.
- [ ] `.env.example` contains placeholders only.
- [ ] Credentials are isolated by environment.
- [ ] Production credentials require protected access.
- [ ] Service accounts use least privilege.
- [ ] Temporary credential files are removed in CI.
- [ ] Artifacts contain no credentials.
- [ ] Production secrets have an owner.
- [ ] Rotation and incident procedures are documented.

# Fastlane Match Runbook

> **Purpose:** Synchronize Apple certificates and provisioning profiles across approved developer machines and CI.

---

## 1. Storage

Use an approved protected backend supported by Match, commonly a private Git repository or supported cloud storage.

Requirements:

- Restricted access.
- Auditability.
- Encryption password stored separately.
- Backup and recovery.
- No application source in the signing repository.

---

## 2. Initialize

From `ios/`:

```bash
bundle exec fastlane match init
```

Review generated `Matchfile` before committing.

Example:

```ruby
git_url(ENV.fetch("MATCH_GIT_URL"))
storage_mode("git")
type("appstore")
app_identifier([
  "com.company.product.staging",
  "com.company.product"
])
team_id(ENV.fetch("APPLE_TEAM_ID"))
```

Do not hard-code credentials or repository passwords.

---

## 3. Create or update signing

Authorized signing administrator:

```bash
bundle exec fastlane match appstore
```

Development profiles when required:

```bash
bundle exec fastlane match development
```

Ad hoc profiles when required:

```bash
bundle exec fastlane match adhoc
```

Creation should not occur automatically in normal CI.

---

## 4. CI mode

```bash
bundle exec fastlane match appstore --readonly
```

Recommended environment:

```text
MATCH_PASSWORD
MATCH_GIT_URL
MATCH_GIT_BASIC_AUTHORIZATION, when required
APPLE_TEAM_ID
```

CI must not modify signing assets during normal build jobs.

---

## 5. Multiple environments

Use explicit identifiers and profiles for staging and production.

Do not let a wildcard or incorrect profile silently sign the wrong app.

Fastfile example:

```ruby
match(
  type: "appstore",
  app_identifier: options[:bundle_id],
  readonly: ENV["CI"] == "true"
)
```

Validate `options[:bundle_id]` against an allow-list.

---

## 6. Certificate renewal

Plan renewal before expiry:

```text
Review expiry
→ create replacement as authorized operator
→ sync profiles
→ validate staging archive
→ validate CI
→ release
→ remove obsolete assets only after verification
```

Do not revoke active distribution certificates without understanding all affected applications.

---

## 7. Incident response

If the Match repository or password is compromised:

- Revoke repository access.
- Rotate Match encryption password/storage credentials.
- Assess certificate/private-key exposure.
- Revoke and recreate affected certificates if required.
- Regenerate profiles.
- Update CI.
- Record the incident.

---

## 8. Common failures

- Wrong Apple team.
- Incorrect bundle identifier.
- Expired certificate.
- Match password differs between environments.
- Repository authentication fails.
- CI keychain is locked.
- Capability change requires profile regeneration.

---

## 9. Completion checklist

- [ ] Signing storage is private.
- [ ] Match password is separate from repository access.
- [ ] `Matchfile` has no secrets.
- [ ] Staging and production IDs are explicit.
- [ ] CI uses `readonly`.
- [ ] Renewal and incident owners are documented.

---

## 10. Official reference

- https://docs.fastlane.tools/actions/match/

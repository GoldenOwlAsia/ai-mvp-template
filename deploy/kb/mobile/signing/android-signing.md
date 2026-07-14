# Android Signing Runbook

---

## 1. Asset ownership

Production signing key must have:

- Named organizational owner.
- Secure backup.
- Password-manager record.
- Access list.
- Recovery process.
- Separation from source repository.

Use Google Play App Signing for store releases according to project policy. Understand the difference between app signing key and upload key.

---

## 2. Generate an upload key

Example:

```bash
keytool -genkeypair \
  -v \
  -keystore upload-keystore.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias upload
```

Run interactively in a secure environment. Do not put passwords in command history or documentation.

---

## 3. Local configuration

`android/key.properties`:

```properties
storeFile=/secure/path/upload-keystore.jks
storePassword=<local-secret>
keyAlias=upload
keyPassword=<local-secret>
```

Add to `.gitignore`:

```text
android/key.properties
*.jks
*.keystore
```

Commit only `key.properties.example` with empty values.

---

## 4. Gradle configuration

Use the current Flutter Android Gradle structure. Read values from `key.properties` or environment variables and apply only to release signing.

Do not:

- Hard-code passwords.
- Fall back silently to debug signing for production.
- Share one identifier/key across unrelated products.

Fail the production build if signing configuration is missing.

---

## 5. CI secrets

```text
ANDROID_KEYSTORE_BASE64
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
ANDROID_STORE_PASSWORD
```

Restore:

```bash
printf '%s' "$ANDROID_KEYSTORE_BASE64" \
  | base64 --decode \
  > "$RUNNER_TEMP/upload-keystore.jks"

chmod 600 "$RUNNER_TEMP/upload-keystore.jks"
```

Generate `key.properties` in the runner temporary workspace, build, then delete both files in an always-run cleanup step.

---

## 6. Validate artifact

Build:

```bash
flutter build appbundle \
  --flavor production \
  --release
```

Inspect signing with Android build tools appropriate to the artifact. Confirm:

- Correct application ID.
- Release certificate.
- Version code/name.
- AAB path.
- No debug certificate.

---

## 7. Rotation and loss

If upload key is compromised:

- Revoke access.
- Follow Google Play upload-key reset process.
- Update CI credentials.
- Record incident.

If an app signing key is self-managed and lost, release continuity may be impossible. Secure backup is mandatory.

---

## 8. Completion checklist

- [ ] App signing/upload-key model is documented.
- [ ] Keystore is backed up securely.
- [ ] Passwords are not in Git.
- [ ] CI restores files temporarily.
- [ ] Production fails when signing is absent.
- [ ] Artifact uses the intended certificate.
- [ ] Recovery owner is known.

# Fastlane Secrets Reference

---

## 1. Android

```text
ANDROID_KEYSTORE_BASE64
ANDROID_KEYSTORE_PATH
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
ANDROID_STORE_PASSWORD
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64
FIREBASE_APP_ID_ANDROID
FIREBASE_SERVICE_ACCOUNT_JSON
```

---

## 2. iOS

```text
APP_STORE_CONNECT_KEY_ID
APP_STORE_CONNECT_ISSUER_ID
APP_STORE_CONNECT_API_KEY_BASE64
APPLE_TEAM_ID
APP_STORE_CONNECT_TEAM_ID
MATCH_PASSWORD
MATCH_GIT_URL
MATCH_GIT_BASIC_AUTHORIZATION
FIREBASE_APP_ID_IOS
FIREBASE_SERVICE_ACCOUNT_JSON
```

---

## 3. Shared non-secret variables

```text
APP_ENV
APP_VERSION
BUILD_NUMBER
RELEASE_NOTES_FILE
ANDROID_PACKAGE_NAME
IOS_BUNDLE_ID
```

Treat as configuration, but scope by environment.

---

## 4. Prohibited files

```text
*.jks
*.keystore
*.p8
*.p12
*.mobileprovision
service-account.json
fastlane/.env
android/key.properties
```

---

## 5. File restoration

Use runner temporary directories and cleanup.

For JSON:

```bash
printf '%s' "$GOOGLE_PLAY_SERVICE_ACCOUNT_JSON" \
  > "$RUNNER_TEMP/google-play.json"
chmod 600 "$RUNNER_TEMP/google-play.json"
```

If the secret is stored as base64, decode exactly once. Document the encoding convention in the secret inventory.

---

## 6. Presence validation

```ruby
def require_env!(*names)
  missing = names.select { |name| ENV[name].to_s.empty? }
  UI.user_error!("Missing: #{missing.join(', ')}") unless missing.empty?
end
```

Never print values.

---

## 7. Rotation

Rotate when:

- A credential is exposed.
- Team access changes.
- Certificate/key expires.
- Provider role changes.
- Secret reaches policy age.

Update staging first, validate, then production, then revoke the previous credential.

---

## 8. Completion checklist

- [ ] Every secret has an owner.
- [ ] Environment scope is documented.
- [ ] Encoding convention is documented.
- [ ] No secret exists in Git or artifacts.
- [ ] Rotation procedure exists.
- [ ] CI logs are reviewed for leakage.

# Fastlane Configuration Standard

---

## 1. Appfile

Android example:

```ruby
json_key_file(ENV["GOOGLE_PLAY_JSON_KEY_FILE"])
package_name(ENV.fetch("ANDROID_PACKAGE_NAME"))
```

iOS example:

```ruby
app_identifier(ENV.fetch("IOS_BUNDLE_ID"))
apple_id(ENV["FASTLANE_USER"])
team_id(ENV.fetch("APPLE_TEAM_ID"))
itc_team_id(ENV["APP_STORE_CONNECT_TEAM_ID"])
```

Prefer App Store Connect API key for supported CI actions rather than relying on interactive Apple ID sessions.

---

## 2. Fastfile structure

```ruby
def require_env!(*names)
  missing = names.select { |name| ENV[name].to_s.empty? }
  UI.user_error!("Missing environment variables: #{missing.join(', ')}") unless missing.empty?
end

platform :android do
  before_all do
    require_env!("APP_ENV", "ANDROID_PACKAGE_NAME")
  end

  lane :validate do
    sh("flutter", "analyze")
    sh("flutter", "test")
  end
end
```

Use `sh` with separate arguments where practical to avoid quoting errors.

---

## 3. Environment input

Use `.env.example` for names only.

Local secrets may use an ignored file or password manager integration.

Do not commit:

```text
fastlane/.env
*.p8
*.json service-account credentials
```

Validate allowed environments:

```ruby
allowed = %w[development staging production]
UI.user_error!("Invalid APP_ENV") unless allowed.include?(ENV["APP_ENV"])
```

---

## 4. App Store Connect API key

```ruby
api_key = app_store_connect_api_key(
  key_id: ENV.fetch("APP_STORE_CONNECT_KEY_ID"),
  issuer_id: ENV.fetch("APP_STORE_CONNECT_ISSUER_ID"),
  key_content: Base64.decode64(
    ENV.fetch("APP_STORE_CONNECT_API_KEY_BASE64")
  ),
  is_key_content_base64: false
)
```

Alternatively, use `is_key_content_base64` according to the chosen input format and installed Fastlane action behavior. Do not double-decode.

---

## 5. Release notes

Read from a generated file:

```ruby
notes = File.read(ENV.fetch("RELEASE_NOTES_FILE"))
```

Avoid unescaped raw multi-line secrets or arbitrary shell interpolation.

---

## 6. Artifact paths

Use deterministic output directories:

```text
build/releases/android/
build/releases/ios/
```

Clean only project-generated output, never broad directories outside the workspace.

---

## 7. Error handling

```ruby
error do |lane, exception|
  UI.error("Lane #{lane} failed: #{exception.message}")
end
```

Do not print environment dumps or credential payloads.

---

## 8. Completion checklist

- [ ] Required inputs fail early.
- [ ] Environment is allow-listed.
- [ ] App IDs are explicit.
- [ ] API-key authentication is used where supported.
- [ ] Secrets are not committed/logged.
- [ ] Output paths are deterministic.
- [ ] Errors are actionable.

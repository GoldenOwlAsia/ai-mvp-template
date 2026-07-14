# Fastlane Lane Convention

---

## 1. Public lane names

### Android

```text
android validate
android build_apk
android build_aab
android firebase
android internal
android production
```

### iOS

```text
ios validate
ios sync_signing
ios build
ios firebase
ios testflight
ios appstore_upload
ios submit_review
```

---

## 2. Semantics

| Lane | Required behavior |
|---|---|
| `validate` | Analyze, test, and validate configuration; no upload |
| `build_*` | Build artifact only |
| `firebase` | Upload non-production artifact to Firebase App Distribution |
| `internal` | Upload Android artifact to Play Internal Testing |
| `testflight` | Upload iOS artifact to TestFlight; no public App Store release |
| `appstore_upload` | Upload App Store candidate without automatic review submission unless documented |
| `submit_review` | Explicit review submission with approval |
| `production` | Explicit production upload/rollout behavior documented in lane description |

---

## 3. Private lanes

Prefix implementation lanes with `_` or mark `private_lane`:

```ruby
private_lane :ensure_clean_git do
  ensure_git_status_clean
end
```

Examples:

```text
resolve_version
validate_environment
build_flutter_android
build_flutter_ios
load_release_notes
```

---

## 4. Inputs

Use lane options for non-secret, task-specific inputs:

```bash
bundle exec fastlane android internal \
  flavor:production \
  version:1.4.0 \
  build_number:204
```

Use environment variables/secret store for credentials.

Validate options:

```ruby
version = options[:version].to_s
UI.user_error!("version is required") if version.empty?
```

---

## 5. Idempotency

- Validation/build lanes can be rerun safely.
- Upload lanes must detect version/build conflicts.
- Tester management should not duplicate entries.
- Production lane should not publish twice without explicit override.
- Migration or destructive tasks do not belong in mobile lanes.

---

## 6. Lane descriptions

Every public lane needs `desc`:

```ruby
desc "Build and upload the production AAB to Play Internal Testing"
lane :internal do |options|
  # ...
end
```

Description must distinguish build, upload, distribution, review, and public rollout.

---

## 7. Output

Every distribution lane should report:

- Platform.
- Flavor/environment.
- Version/build.
- Commit SHA.
- Artifact path.
- Target channel.
- Upload result/link where available.
- Next manual action.

---

## 8. Completion checklist

- [ ] Lane names are consistent.
- [ ] Upload and public release are separate.
- [ ] Public lanes have descriptions.
- [ ] Inputs are validated.
- [ ] Credentials are not lane options on the command line.
- [ ] Re-run behavior is documented.

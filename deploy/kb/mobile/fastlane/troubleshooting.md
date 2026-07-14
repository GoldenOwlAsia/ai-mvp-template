# Fastlane Troubleshooting

---

## 1. Investigation order

```text
Identify lane
→ capture first actionable error
→ print tool versions, not secrets
→ compare last successful build
→ validate project identifiers and build number
→ validate signing
→ validate provider credentials and status
→ reproduce with staging credentials
```

---

## 2. Ruby/Bundler

### `fastlane` command differs between machines

Use:

```bash
bundle exec fastlane --version
bundle install
```

Commit `Gemfile.lock` and align Ruby versions.

### Native gem installation fails

Check:

- Ruby architecture.
- Xcode command-line tools.
- Bundler version.
- Runner image update.

---

## 3. Locale errors

```bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

Apply in local shell and CI environment.

---

## 4. Android

### Gradle task not found

Check flavor/build-type task names and Gradle project location.

### AAB not found

Check Flutter output path, flavor name, and whether Fastlane built APK instead of AAB.

### Google Play upload fails

Check:

- Service-account role.
- Application ID.
- Existing version code.
- Initial Play Console app setup.
- Track name and release status.
- App-signing configuration.

---

## 5. iOS

### Match fails

Check storage authentication, Match password, team, bundle ID, certificate expiry, and CI keychain.

### `build_app` fails

Check scheme sharing, workspace path, Xcode version, export method, and entitlements.

### TestFlight upload fails

Check duplicate build number, API-key permissions, App Store agreements, export compliance, and binary processing state.

---

## 6. Firebase App Distribution

Check:

- Plugin installed.
- Firebase app ID.
- Service credentials.
- Tester group alias.
- Artifact format/path.
- iOS provisioning includes tester devices for ad hoc distribution.

---

## 7. CI-only failures

- Toolchain differs from local.
- Secret is stored in another environment.
- Match is not readonly.
- Temporary file path is wrong.
- Shell decoding changes line endings.
- Xcode/Java version changed.
- CI runner lacks disk space.

---

## 8. Safe debugging

Allowed:

```bash
bundle exec fastlane lanes
flutter --version
ruby --version
bundle --version
java -version
xcodebuild -version
```

Do not run commands that print complete environment variables, key files, or service-account JSON.

---

## 9. Failure report

```markdown
## Fastlane failure

- Platform:
- Lane:
- Environment:
- Version/build:
- Commit:
- Runner/tool versions:
- First error:
- Signing state:
- Upload state:
- Root cause:
- Resolution:
- Prevention:
```

# Mobile Release Flow

---

## 1. Pull request

```text
Checkout
→ Flutter version setup
→ flutter pub get
→ formatting/lint
→ flutter analyze
→ flutter test
→ optional integration tests
→ build validation
```

No production signing secret is exposed to untrusted PRs.

---

## 2. Internal QA release

```text
Select staging flavor
→ validate environment
→ increment build number
→ build signed APK/IPA as appropriate
→ upload Firebase App Distribution
→ notify tester group
→ record release notes and commit
```

Use TestFlight internal instead of ad hoc Firebase distribution for iOS when device registration/signing overhead is not desired.

---

## 3. Store beta

### Android

```text
Build signed AAB
→ upload Play Internal Testing
→ verify install/upgrade
→ QA approval
→ optionally promote to closed/open track
```

### iOS

```text
Sync signing
→ build IPA
→ upload TestFlight
→ wait for processing
→ distribute internal testers
→ complete beta review for external testers when required
```

---

## 4. Production release

```text
Freeze scope
→ release checklist
→ tag source
→ protected CI approval
→ build/upload
→ verify store processing
→ staged/phased release
→ monitor crash and business metrics
→ expand rollout or halt
```

Upload and public release are separate actions.

---

## 5. Example lane mapping

```text
android validate
android firebase
android internal
ios validate
ios firebase
ios testflight
```

Production lanes should be explicit:

```text
android production
ios appstore_upload
ios submit_review
```

Do not combine `appstore_upload` and `submit_review` unless the team explicitly wants that behavior.

---

## 6. Release notes

Generate from reviewed changes, not raw commit messages alone.

```markdown
## What to test

- ...

## Changes

- ...

## Known issues

- ...

## Build

- Version:
- Build:
- Commit:
- Environment:
```

Do not include internal secrets or sensitive incident details.

---

## 7. Failure handling

- Build failure: no upload.
- Upload failure: verify credentials, identifier, version, and provider status.
- Processing failure: preserve logs and inspect store validation.
- QA failure: stop promotion and create a new build.
- Production incident: halt rollout, disable feature if possible, prepare higher build hotfix.

---

## 8. Release result

```markdown
## Mobile release result

- Platform:
- Environment:
- Channel:
- Version/build:
- Commit:
- Artifact:
- Fastlane lane:
- Upload status:
- Tester/store status:
- Verification:
- Known issues:
- Next action:
```

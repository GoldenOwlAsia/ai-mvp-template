# Mobile Deployment Runbooks

> **Primary stack:** Flutter  
> **Automation:** Fastlane  
> **Distribution:** Firebase App Distribution, TestFlight, and Google Play Internal Testing

---

## 1. Reading order

```text
mobile/README.md
→ mobile/mobile-deployment-strategy.md
→ mobile/environments.md
→ mobile/versioning.md
→ mobile/release-flow.md
→ mobile/signing/*
→ mobile/fastlane/*
→ mobile/flutter/*
→ mobile/checklists/*
```

---

## 2. Responsibility boundary

This knowledge base covers:

- Development/staging/production identifiers.
- Android and iOS signing.
- Fastlane installation and lane design.
- Flutter flavors.
- Internal and beta distribution.
- Store upload readiness.
- CI/CD integration.
- Verification and post-release monitoring.

It does not assume that store review will complete within the task window.

---

## 3. Required discovery

```yaml
mobile:
  framework: flutter
  flutter_version: ""
  dart_version: ""
  environments: [development, staging, production]
  android_application_ids: {}
  ios_bundle_ids: {}
  version: ""
  build_number: ""
  android_distribution: firebase | play-internal | play-production
  ios_distribution: firebase | testflight | app-store
  signing_owner: ""
  fastlane_enabled: true
  ci_provider: github-actions
```

---

## 4. Non-negotiable rules

- Production signing assets are not committed.
- Every store build has a unique build identifier.
- Production build never uses staging API configuration.
- Fastlane runs through Bundler.
- Store uploads are traceable to commit SHA.
- Android keystore and Apple credentials have named owners.
- TestFlight/Play upload does not automatically imply public release.
- Backend remains compatible with supported mobile versions.

---

## 5. Golden path

```text
Pull request
→ analyze and test
→ build development/staging flavor
→ Firebase App Distribution
→ QA approval
→ Android Play Internal / iOS TestFlight
→ production approval
→ store upload or rollout
→ post-release monitoring
```

---

## 6. Expected project files

```text
Gemfile
Gemfile.lock
android/fastlane/Appfile
android/fastlane/Fastfile
ios/fastlane/Appfile
ios/fastlane/Fastfile
ios/fastlane/Matchfile
.env.example
```

Optional:

```text
android/fastlane/Pluginfile
ios/fastlane/Pluginfile
fastlane/metadata/
```

---

## 7. Claude operating contract

```text
Before mobile release changes:
1. Detect Flutter version, flavors, IDs, signing, and current Fastlane files.
2. Determine target platform, environment, and distribution channel.
3. Verify version/build-number policy.
4. Identify required credentials without requesting them in source code.
5. Confirm whether the task is build, upload, beta distribution, or public release.

Then:
1. Make the minimum required changes.
2. Run analyze/test/build validation.
3. Use Fastlane as release automation.
4. Do not print signing credentials.
5. Do not submit public review or rollout unless explicitly requested.
6. Return artifact, version, commit, distribution link/status, and next step.
```

---

## 8. Definition of Done

- [ ] Flavors and identifiers are isolated.
- [ ] Fastlane configuration is version-controlled.
- [ ] Credentials are externalized.
- [ ] Android build succeeds.
- [ ] iOS build succeeds on macOS when credentials are available.
- [ ] Internal distribution works.
- [ ] TestFlight/Play Internal workflow is documented.
- [ ] Release checklists pass.

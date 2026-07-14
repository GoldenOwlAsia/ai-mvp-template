# Firebase App Distribution Runbook

> **Purpose:** Deliver Android and iOS pre-release builds to controlled QA groups.

---

## 1. Use cases

Use for:

- Frequent internal QA builds.
- Stakeholder review outside stores.
- Automated tester groups.
- Release notes and tester notifications.

For iOS, ad hoc distribution requires registered tester devices in the provisioning profile. TestFlight may be simpler for broad internal testing.

---

## 2. Prerequisites

- Firebase project per environment.
- Android/iOS Firebase app IDs.
- Tester groups.
- Fastlane Firebase App Distribution plugin.
- CI service account with minimum required access.
- Correct signed APK/IPA.

Install:

```bash
bundle exec fastlane add_plugin firebase_app_distribution
```

---

## 3. Android lane

```ruby
lane :firebase do |options|
  build_apk(options)

  firebase_app_distribution(
    app: ENV.fetch("FIREBASE_APP_ID_ANDROID"),
    android_artifact_type: "APK",
    android_artifact_path: "../build/app/outputs/flutter-apk/app-staging-release.apk",
    groups: ENV.fetch("FIREBASE_TESTER_GROUPS"),
    release_notes_file: ENV.fetch("RELEASE_NOTES_FILE"),
    service_credentials_file: ENV.fetch("FIREBASE_SERVICE_ACCOUNT_FILE")
  )
end
```

Verify the actual flavor artifact path.

---

## 4. iOS lane

```ruby
lane :firebase do |options|
  build(options)

  firebase_app_distribution(
    app: ENV.fetch("FIREBASE_APP_ID_IOS"),
    ipa_path: "../build/ios/ipa/Product.ipa",
    groups: ENV.fetch("FIREBASE_TESTER_GROUPS"),
    release_notes_file: ENV.fetch("RELEASE_NOTES_FILE"),
    service_credentials_file: ENV.fetch("FIREBASE_SERVICE_ACCOUNT_FILE")
  )
end
```

Signing must be valid for the intended tester devices/distribution method.

---

## 5. CI secrets

```text
FIREBASE_APP_ID_ANDROID
FIREBASE_APP_ID_IOS
FIREBASE_SERVICE_ACCOUNT_JSON
FIREBASE_TESTER_GROUPS
```

Restore service-account JSON temporarily and delete it after the lane.

---

## 6. Tester management

Prefer stable groups:

```text
mobile-qa
product-review
stakeholders
```

Avoid hard-coding personal email lists in `Fastfile`.

---

## 7. Verification

- Release appears in Firebase console.
- Correct application/environment.
- Correct version/build.
- Correct tester group.
- Tester can accept invitation and install.
- Release notes are present.
- Application points to staging services.

---

## 8. Common failures

- Wrong Firebase app ID.
- Service account lacks permission.
- Tester group alias is incorrect.
- Artifact path does not match flavor output.
- iOS tester device is missing from profile.
- Expired or invalid signing profile.

---

## 9. Completion checklist

- [ ] Plugin is locked.
- [ ] Service account is protected.
- [ ] App IDs are environment-specific.
- [ ] Tester groups are managed centrally.
- [ ] Android install succeeds.
- [ ] iOS install succeeds or TestFlight is chosen.
- [ ] Release is traceable to commit SHA.

---

## 10. Official references

- https://firebase.google.com/docs/app-distribution
- https://firebase.google.com/docs/app-distribution/android/distribute-fastlane
- https://firebase.google.com/docs/app-distribution/ios/distribute-fastlane
- https://firebase.google.com/docs/app-distribution/register-additional-devices

---

## Artifact path safety

Do not assume an artifact filename from the product name or flavor.

The lane must:

1. Build into a deterministic directory when supported.
2. Resolve the produced artifact.
3. Fail if zero or more than one artifact matches.
4. Print the non-sensitive artifact path in the deployment summary.

Example validation pattern:

```ruby
artifacts = Dir["../build/**/*.aab"]
UI.user_error!("Expected exactly one AAB, found #{artifacts.length}") unless artifacts.length == 1
artifact = artifacts.first
```

Use a narrower project-specific glob in production.

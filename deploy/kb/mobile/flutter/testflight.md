# Flutter TestFlight Runbook

---

## 1. Prerequisites

- Apple Developer and App Store Connect access.
- App record.
- Production/staging bundle ID as intended.
- App Store signing profile.
- App Store Connect API key with suitable role.
- Fastlane Match or another documented signing process.
- Unique version/build.
- Required export compliance and test information.

---

## 2. Build and upload lane

```ruby
platform :ios do
  desc "Build and upload to TestFlight"
  lane :testflight do |options|
    match(type: "appstore", readonly: ENV["CI"] == "true")

    Dir.chdir("..") do
      sh(
        "flutter", "build", "ipa",
        "--flavor", options.fetch(:flavor, "production"),
        "--release",
        "--build-name", options.fetch(:version),
        "--build-number", options.fetch(:build_number).to_s
      )
    end

    upload_to_testflight(
      api_key: app_store_connect_api_key(
        key_id: ENV.fetch("APP_STORE_CONNECT_KEY_ID"),
        issuer_id: ENV.fetch("APP_STORE_CONNECT_ISSUER_ID"),
        key_content: ENV.fetch("APP_STORE_CONNECT_API_KEY_BASE64"),
        is_key_content_base64: true
      ),
      ipa: "../build/ios/ipa/Product.ipa",
      skip_waiting_for_build_processing: false
    )
  end
end
```

Confirm IPA name and API-key encoding.

---

## 3. Internal vs external testers

### Internal

- App Store Connect users.
- Fast distribution after processing.
- Suitable for team QA.

### External

- Requires beta app review for the build as applicable.
- Requires beta description and contact information.
- Can use tester groups or public link.

Do not promise immediate external availability.

---

## 4. Build processing

After upload:

- Wait for App Store Connect processing.
- Resolve missing compliance information.
- Verify build appears under the correct app/version.
- Add internal groups.
- Monitor processing errors.

Upload success is not processing success.

---

## 5. Verification

- Correct bundle ID.
- Correct version/build.
- Correct icon/name/environment.
- Internal tester can install.
- Upgrade from previous TestFlight build works.
- API and push environment are correct.
- Crash reporting receives the release.

---

## 6. Common failures

- Duplicate build number.
- Wrong bundle ID/team.
- Missing or invalid profile.
- App Store Connect agreement pending.
- API key role insufficient.
- Export compliance missing.
- Binary still processing.
- dSYM missing from crash reporting.

---

## 7. Completion checklist

- [ ] Archive/IPA builds.
- [ ] Upload succeeds.
- [ ] Processing succeeds.
- [ ] Compliance is complete.
- [ ] Testers receive build.
- [ ] Installation and upgrade pass.
- [ ] Build is not automatically submitted to public review.

---

## 8. Official references

- https://docs.fastlane.tools/actions/upload_to_testflight/
- https://docs.fastlane.tools/actions/pilot/
- https://developer.apple.com/testflight/
- https://docs.flutter.dev/deployment/ios

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

# Google Play Internal Testing Runbook

---

## 1. Prerequisites

- Google Play Console application exists.
- Application ID matches the project.
- Initial application setup and required declarations are complete.
- Google Play App Signing is configured according to project policy.
- Service account is linked and has minimum release permissions.
- At least one initial build may need manual setup before full supply automation, depending on Play Console state.
- Unique version code.
- Signed AAB.

---

## 2. Fastlane lane

```ruby
platform :android do
  desc "Build and upload AAB to Play Internal Testing"
  lane :internal do |options|
    Dir.chdir("..") do
      sh(
        "flutter", "build", "appbundle",
        "--flavor", options.fetch(:flavor, "production"),
        "--release",
        "--build-name", options.fetch(:version),
        "--build-number", options.fetch(:build_number).to_s
      )
    end

    upload_to_play_store(
      json_key: ENV.fetch("GOOGLE_PLAY_JSON_KEY_FILE"),
      package_name: ENV.fetch("ANDROID_PACKAGE_NAME"),
      aab: "../build/app/outputs/bundle/productionRelease/app-production-release.aab",
      track: "internal",
      release_status: "completed",
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true
    )
  end
end
```

Confirm output path and choose release status according to desired behavior.

---

## 3. Internal track strategy

- Keep a named tester list/group.
- Test fresh install.
- Test upgrade from previous production/internal build.
- Verify Play-generated app bundle delivery.
- Verify app signing certificate dependencies such as OAuth and app links.

---

## 4. Metadata

Fastlane supply can manage:

- Store text.
- Changelogs.
- Screenshots/images.
- Track uploads and promotion.

For an upload-only internal lane, skip unrelated metadata deliberately. Manage metadata in a separate lane if needed.

---

## 5. Promotion

After validation, promote the already tested release to another track when appropriate rather than uploading an unrelated build.

Document:

- Source track.
- Destination track.
- Version code.
- Rollout percentage.
- Release status.

---

## 6. Verification

- Build appears in Internal Testing.
- Correct application ID.
- Correct version name/code.
- Tester can install from Play.
- Upgrade works.
- App links/OAuth use the Play signing certificate where required.
- Backend environment is correct.

---

## 7. Common failures

- Version code already exists.
- Service account not linked or role insufficient.
- Package name mismatch.
- AAB is unsigned or signed incorrectly.
- Required Play declarations are incomplete.
- Initial app setup is incomplete.
- Track name/release status is incorrect.

---

## 8. Completion checklist

- [ ] Signed AAB exists.
- [ ] Version code is unique.
- [ ] Service account has minimum permissions.
- [ ] Internal upload succeeds.
- [ ] Tester install and upgrade pass.
- [ ] Promotion strategy is documented.
- [ ] Public rollout is not triggered unintentionally.

---

## 9. Official references

- https://docs.fastlane.tools/actions/upload_to_play_store/
- https://docs.fastlane.tools/getting-started/android/release-deployment/
- https://docs.flutter.dev/deployment/android

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

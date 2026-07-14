# Fastlane CI Integration

---

## 1. Runner matrix

| Platform | Runner |
|---|---|
| Android | Linux or macOS with Flutter, Java, Android SDK, Ruby |
| iOS | Supported macOS runner with Xcode, Flutter, Ruby |

Pin Flutter, Java, Ruby, and Xcode according to project compatibility.

---

## 2. CI stages

```text
Checkout
→ toolchain setup
→ dependency restore
→ bundle install
→ flutter pub get
→ validation
→ credential restore
→ Fastlane lane
→ artifact/report upload
→ credential cleanup
```

Restore credentials as late as possible and delete them in an always-run cleanup step.

---

## 3. Android GitHub Actions skeleton

```yaml
name: Android Internal

on:
  workflow_dispatch:
    inputs:
      version:
        required: true
      build_number:
        required: true

env:
  LANG: en_US.UTF-8
  LC_ALL: en_US.UTF-8

jobs:
  release:
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - uses: actions/checkout@v4

      # Add approved Flutter, Java, and Ruby setup actions.

      - run: bundle install
      - run: flutter pub get

      - name: Restore Android signing
        env:
          ANDROID_KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
        run: |
          printf '%s' "$ANDROID_KEYSTORE_BASE64" \
            | base64 --decode \
            > "$RUNNER_TEMP/upload-keystore.jks"

      - name: Release
        env:
          ANDROID_KEYSTORE_PATH: ${{ runner.temp }}/upload-keystore.jks
          ANDROID_KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}
          ANDROID_KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
          ANDROID_STORE_PASSWORD: ${{ secrets.ANDROID_STORE_PASSWORD }}
          GOOGLE_PLAY_SERVICE_ACCOUNT_JSON: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON }}
        run: |
          bundle exec fastlane android internal \
            version:"${{ inputs.version }}" \
            build_number:"${{ inputs.build_number }}"

      - name: Cleanup
        if: always()
        run: rm -f "$RUNNER_TEMP/upload-keystore.jks"
```

Setup action versions must be verified and approved by the project.

---

## 4. iOS skeleton

```yaml
name: iOS TestFlight

on:
  workflow_dispatch:
    inputs:
      version:
        required: true
      build_number:
        required: true

jobs:
  release:
    runs-on: macos-latest
    environment: staging

    steps:
      - uses: actions/checkout@v4

      # Add approved Flutter and Ruby setup actions.

      - run: bundle install
      - run: flutter pub get

      - name: Upload TestFlight build
        env:
          APP_STORE_CONNECT_KEY_ID: ${{ secrets.APP_STORE_CONNECT_KEY_ID }}
          APP_STORE_CONNECT_ISSUER_ID: ${{ secrets.APP_STORE_CONNECT_ISSUER_ID }}
          APP_STORE_CONNECT_API_KEY_BASE64: ${{ secrets.APP_STORE_CONNECT_API_KEY_BASE64 }}
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
          MATCH_GIT_URL: ${{ secrets.MATCH_GIT_URL }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
        run: |
          bundle exec fastlane ios testflight \
            version:"${{ inputs.version }}" \
            build_number:"${{ inputs.build_number }}"
```

Use a pinned Xcode image if `macos-latest` changes are unacceptable.

---

## 5. Security

- No production secrets in pull requests.
- No secrets in workflow inputs.
- Use protected CI environments.
- Restrict workflow permissions.
- Avoid long-lived cloud credentials where workload identity exists.
- Do not upload keychains, keystores, `.p8`, service accounts, or `.env` files as artifacts.

---

## 6. Concurrency

```yaml
concurrency:
  group: mobile-production-${{ github.ref }}
  cancel-in-progress: false
```

Do not run conflicting production uploads concurrently.

---

## 7. Completion checklist

- [ ] Toolchains are pinned.
- [ ] Bundler uses lockfile.
- [ ] Protected environment is used.
- [ ] Credentials are restored temporarily.
- [ ] Cleanup always runs.
- [ ] Artifact metadata is retained.
- [ ] Production requires approval.

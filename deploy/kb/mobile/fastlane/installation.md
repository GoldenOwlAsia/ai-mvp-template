# Fastlane Installation

---

## 1. Prerequisites

- Ruby version supported by the selected Fastlane release and runner.
- Bundler.
- Xcode command-line tools for iOS.
- Java/Android SDK for Android.
- Flutter SDK for Flutter projects.

On macOS:

```bash
xcode-select --install
```

Do not depend on macOS system Ruby for a production team workflow.

---

## 2. Gemfile

```ruby
source "https://rubygems.org"

gem "fastlane"
```

Install:

```bash
bundle install
```

Commit:

```text
Gemfile
Gemfile.lock
```

Update intentionally:

```bash
bundle update fastlane
```

Validate lanes after every Fastlane update.

---

## 3. Initialize Android

```bash
cd android
bundle exec fastlane init
```

Review:

- Package name.
- Google Play configuration.
- Generated metadata.
- `Appfile`.
- `Fastfile`.

Do not automatically accept generated files without review.

---

## 4. Initialize iOS

```bash
cd ios
bundle exec fastlane init
```

Review:

- Bundle ID.
- Apple team.
- App Store Connect application.
- Authentication method.
- `Appfile`.
- `Fastfile`.

---

## 5. Plugins

Add only approved plugins:

```bash
bundle exec fastlane add_plugin firebase_app_distribution
```

Commit `Pluginfile` and lockfile changes.

Review plugin maintenance, source, and permissions before use.

---

## 6. Environment

Fastlane requires a UTF-8 locale in environments where locale errors occur:

```bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

CI images must include required Ruby native build dependencies.

---

## 7. Validation

```bash
bundle exec fastlane --version
bundle exec fastlane lanes
bundle exec fastlane actions
```

For an action:

```bash
bundle exec fastlane action upload_to_testflight
```

Use installed-version action documentation to validate options.

---

## 8. Completion checklist

- [ ] Ruby strategy is documented.
- [ ] Bundler installs from lockfile.
- [ ] Fastlane initializes for both platforms.
- [ ] Generated configuration is reviewed.
- [ ] Plugins are approved and locked.
- [ ] CI uses the same dependency model.

---

## 9. Official references

- https://docs.fastlane.tools/getting-started/android/setup/
- https://docs.fastlane.tools/getting-started/ios/setup/
- https://docs.fastlane.tools/best-practices/continuous-integration/

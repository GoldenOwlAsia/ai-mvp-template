# Flutter Fastlane Setup

---

## 1. Dependency setup

At project root:

```ruby
source "https://rubygems.org"
gem "fastlane"
```

```bash
bundle install
```

Initialize:

```bash
cd android && bundle exec fastlane init
cd ../ios && bundle exec fastlane init
```

Review all generated files.

---

## 2. Android build lane example

```ruby
platform :android do
  desc "Validate Flutter project"
  lane :validate do
    Dir.chdir("..") do
      sh("flutter", "pub", "get")
      sh("flutter", "analyze")
      sh("flutter", "test")
    end
  end

  desc "Build production AAB"
  lane :build_aab do |options|
    version = options.fetch(:version)
    build_number = options.fetch(:build_number).to_s

    Dir.chdir("..") do
      sh(
        "flutter", "build", "appbundle",
        "--flavor", "production",
        "--release",
        "--build-name", version,
        "--build-number", build_number
      )
    end
  end
end
```

Confirm relative directory behavior from the location where Fastlane runs.

---

## 3. iOS build lane example

```ruby
platform :ios do
  desc "Build production IPA"
  lane :build do |options|
    version = options.fetch(:version)
    build_number = options.fetch(:build_number).to_s

    match(type: "appstore", readonly: ENV["CI"] == "true")

    Dir.chdir("..") do
      sh(
        "flutter", "build", "ipa",
        "--flavor", "production",
        "--release",
        "--build-name", version,
        "--build-number", build_number
      )
    end
  end
end
```

Some projects use `build_app` for finer Xcode export control. Choose one source of truth and test it.

---

## 4. Artifact paths

Typical Flutter outputs:

```text
build/app/outputs/flutter-apk/
build/app/outputs/bundle/
build/ios/ipa/
```

Do not hard-code a path before confirming flavor/build output in the project.

---

## 5. Plugins

Firebase distribution:

```bash
bundle exec fastlane add_plugin firebase_app_distribution
```

Commit `Pluginfile` and dependency lock changes.

---

## 6. Local execution

```bash
bundle exec fastlane android validate
bundle exec fastlane android build_aab version:1.4.0 build_number:204
bundle exec fastlane ios build version:1.4.0 build_number:204
```

Do not run production upload lanes with personal credentials unless authorized.

---

## 7. Completion checklist

- [ ] Root/platform Bundler model is consistent.
- [ ] Android and iOS initialize successfully.
- [ ] Relative paths are correct.
- [ ] Validation lane passes.
- [ ] AAB and IPA lanes create expected artifacts.
- [ ] Credentials are externalized.
- [ ] CI calls the same lanes.

---

## 8. Official reference

- https://docs.flutter.dev/deployment/cd

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

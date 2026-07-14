# Fastlane Runbooks

---

## 1. Purpose

Fastlane is the mobile release automation source of truth for Flutter Android and iOS projects in this template.

Directory:

```text
android/fastlane/
ios/fastlane/
```

Shared Ruby dependency files may live at project root or platform directories. Choose one model and use it consistently.

---

## 2. Required files

```text
Gemfile
Gemfile.lock
android/fastlane/Appfile
android/fastlane/Fastfile
ios/fastlane/Appfile
ios/fastlane/Fastfile
ios/fastlane/Matchfile
```

Optional:

```text
Pluginfile
metadata/
screenshots/
```

---

## 3. Execution rule

Always use Bundler:

```bash
bundle install
bundle exec fastlane android validate
bundle exec fastlane ios testflight
```

Do not rely on an unpinned global Fastlane installation in CI.

---

## 4. Responsibility

Fastlane owns:

- Input validation.
- Flutter/native build commands.
- Signing synchronization.
- Artifact paths.
- Upload actions.
- Release notes.
- Distribution result.

CI owns:

- Runner/toolchain setup.
- Protected secrets.
- Approval.
- Calling lanes.
- Artifact/report retention.

---

## 5. Lane layers

```text
private validation/build lanes
→ internal distribution lanes
→ store beta lanes
→ explicit production lanes
```

Production submission is never hidden inside a generic `release` lane without documentation.

---

## 6. Definition of Done

- [ ] Bundler is configured.
- [ ] Fastlane files are committed.
- [ ] Lanes have consistent names.
- [ ] Secrets are externalized.
- [ ] Internal lanes work.
- [ ] Store lanes distinguish upload from rollout/review.
- [ ] CI integration works.

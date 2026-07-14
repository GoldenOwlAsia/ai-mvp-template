# Flutter Deployment Runbooks

---

## 1. Baseline commands

```bash
flutter pub get
flutter analyze
flutter test
flutter build apk
flutter build appbundle
flutter build ipa
```

Use flavors and version inputs defined by the project.

---

## 2. Release-mode rule

- Debug mode is for development.
- Profile mode is for performance analysis.
- Release mode is for distribution.

Production lanes must build release artifacts.

---

## 3. Project validation

```bash
flutter doctor -v
flutter --version
dart --version
flutter pub get
flutter analyze
flutter test
```

Record Flutter version in CI and release reports.

---

## 4. Artifact expectations

| Platform | Artifact |
|---|---|
| Android direct/internal | APK |
| Android Play | AAB |
| iOS Firebase/TestFlight/App Store | IPA/archive with correct distribution signing |

---

## 5. Obfuscation

When using:

```bash
--obfuscate --split-debug-info=<directory>
```

Retain symbol output securely for crash symbolization. Obfuscation is not a replacement for secret management.

---

## 6. Completion checklist

- [ ] Flutter version is pinned.
- [ ] Analyze/test pass.
- [ ] Flavors work on both platforms.
- [ ] Release build uses correct environment.
- [ ] Symbols are retained.
- [ ] Fastlane invokes reproducible commands.

---

## 7. Official references

- https://docs.flutter.dev/deployment/cd
- https://docs.flutter.dev/deployment/android
- https://docs.flutter.dev/deployment/ios
- https://docs.flutter.dev/testing/build-modes

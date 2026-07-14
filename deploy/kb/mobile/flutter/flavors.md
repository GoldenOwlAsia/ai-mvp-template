# Flutter Flavors Runbook

---

## 1. Flavor set

```text
development
staging
production
```

Use the same names across Dart, Android, iOS, Fastlane, and CI when practical.

---

## 2. Android product flavors

Define a flavor dimension and product flavors in the current Android Gradle configuration.

Conceptual example:

```kotlin
android {
    flavorDimensions += "environment"

    productFlavors {
        create("development") {
            dimension = "environment"
            applicationIdSuffix = ".dev"
            versionNameSuffix = "-dev"
        }
        create("staging") {
            dimension = "environment"
            applicationIdSuffix = ".staging"
            versionNameSuffix = "-staging"
        }
        create("production") {
            dimension = "environment"
        }
    }
}
```

Adapt to Groovy/Kotlin DSL and current Flutter template.

Run:

```bash
flutter run --flavor staging
flutter build appbundle --flavor production
```

---

## 3. iOS schemes/configurations

Create corresponding:

- Xcode configurations.
- Schemes.
- `.xcconfig` files.
- Bundle identifiers.
- Display names.
- Firebase configuration selection.

Schemes used by CI must be shared.

Run:

```bash
flutter run --flavor staging
flutter build ipa --flavor production
```

---

## 4. Dart configuration

```dart
enum AppEnvironment { development, staging, production }

final class AppConfig {
  AppConfig._();

  static AppEnvironment fromName(String value) => switch (value) {
        'development' => AppEnvironment.development,
        'staging' => AppEnvironment.staging,
        'production' => AppEnvironment.production,
        _ => throw StateError('Unsupported APP_ENV: $value'),
      };
}
```

Build input:

```bash
--dart-define=APP_ENV=staging
```

Do not compile private credentials into the app.

---

## 5. App icons and names

Make non-production builds visually distinct.

Validate launcher icons on actual devices and store-generated previews.

---

## 6. Automated validation

Add a script or test that verifies:

- Flavor exists on Android/iOS.
- Expected application/bundle ID.
- Expected API URL.
- Expected Firebase project.
- Production contains no staging host.

---

## 7. Completion checklist

- [ ] Three flavors build.
- [ ] IDs are unique.
- [ ] Schemes are shared.
- [ ] Display names/icons differ.
- [ ] Service config is isolated.
- [ ] Fastlane flavor names match.
- [ ] Production config validation passes.

---

## 8. Official references

- https://docs.flutter.dev/deployment/flavors
- https://docs.flutter.dev/deployment/flavors-ios

# Mobile Environment Standard

---

## 1. Required environments

```text
development
staging
production
```

Each must have separate identifiers and service configuration.

---

## 2. Identifiers

```text
Android:
com.company.product.dev
com.company.product.staging
com.company.product

iOS:
com.company.product.dev
com.company.product.staging
com.company.product
```

Do not change an existing production identifier without a migration/product decision.

---

## 3. Visible differentiation

| Setting | Development | Staging | Production |
|---|---|---|---|
| Display name | Product Dev | Product Staging | Product |
| Icon | Dev badge | Staging badge | Production icon |
| API | Development | Staging | Production |
| Analytics | Development | Staging | Production |
| Logging | Verbose | Normal | Warning/error |
| Crash environment | development | staging | production |

Users and testers must be able to identify a non-production build.

---

## 4. Service isolation

Separate when used:

- Firebase project and config files.
- API base URL.
- OAuth clients.
- Push credentials/topics.
- Deep/universal links.
- Analytics.
- Crash reporting.
- Payment sandbox/production mode.
- App Attest/Play Integrity configuration.
- Remote Config defaults.

---

## 5. Configuration pattern

Use compile-time Dart definitions only for non-secret configuration:

```bash
flutter run \
  --flavor staging \
  --dart-define=APP_ENV=staging \
  --dart-define=API_BASE_URL=https://api-staging.example.com
```

Do not put private server credentials in `--dart-define`; compiled mobile applications cannot safely hold secrets.

A typed configuration layer should fail when required values are missing.

---

## 6. Firebase files

Common arrangement:

```text
android/app/src/development/google-services.json
android/app/src/staging/google-services.json
android/app/src/production/google-services.json

ios/Runner/Config/development/GoogleService-Info.plist
ios/Runner/Config/staging/GoogleService-Info.plist
ios/Runner/Config/production/GoogleService-Info.plist
```

Whether these files are committed depends on organization policy. They contain project configuration rather than server private keys, but should still be reviewed and environment-isolated.

Never commit Firebase Admin service-account JSON.

---

## 7. Links and callbacks

Document per environment:

```yaml
links:
  development:
    scheme: product-dev
    host: dev.example.com
  staging:
    scheme: product-staging
    host: staging.example.com
  production:
    scheme: product
    host: example.com
```

Update associated domains, asset links, OAuth callbacks, and provider consoles consistently.

---

## 8. Validation

For every build, record:

- Flavor.
- Application ID/bundle ID.
- Display name.
- API URL.
- Firebase project ID.
- Version/build.
- Commit SHA.

Add a non-sensitive diagnostics screen in non-production builds when useful.

---

## 9. Completion checklist

- [ ] IDs are unique.
- [ ] App names/icons are distinguishable.
- [ ] API endpoints are isolated.
- [ ] Firebase and OAuth clients are isolated.
- [ ] Deep links are environment-specific.
- [ ] No secret is compiled into the app.
- [ ] Production build validation is automated.

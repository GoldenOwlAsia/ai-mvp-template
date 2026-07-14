# iOS Signing Runbook

---

## 1. Required Apple assets

- Apple Developer Program membership.
- Team ID.
- Bundle identifier/App ID.
- Distribution certificate or cloud-managed signing strategy.
- App Store provisioning profile.
- App Store Connect application record.
- App Store Connect API key for CI where supported.
- Entitlements matching application capabilities.

---

## 2. Ownership

The organization, not an individual developer, should own:

- Apple Developer account access.
- App Store Connect application.
- API keys.
- Signing repository.
- Recovery credentials.

Use role-based access and least privilege.

---

## 3. Bundle IDs and capabilities

Each environment uses its own bundle ID.

Review capabilities:

- Push Notifications.
- Associated Domains.
- Sign in with Apple.
- Keychain groups.
- App Groups.
- iCloud.
- Background modes.

Provisioning profiles must include the required entitlements.

---

## 4. App Store Connect API key

Preferred for supported Fastlane actions.

Required values:

```text
APP_STORE_CONNECT_KEY_ID
APP_STORE_CONNECT_ISSUER_ID
APP_STORE_CONNECT_API_KEY_BASE64
```

Store the private `.p8` key securely. Apple API private keys cannot be downloaded repeatedly after creation; follow current App Store Connect behavior and organizational backup policy.

---

## 5. Local validation

```bash
flutter build ipa \
  --flavor production \
  --release
```

Or let Fastlane invoke the appropriate build action.

Validate:

- Scheme/configuration.
- Bundle ID.
- Team.
- Profile.
- Entitlements.
- Version/build number.
- Export method.

---

## 6. CI keychain

When CI imports certificate assets directly:

- Create a temporary keychain.
- Use a random runner-only password.
- Unlock it.
- Import certificate/profile.
- Limit key partition access.
- Delete the keychain after build.

Prefer Fastlane Match for coordinated signing where appropriate.

---

## 7. Common failures

### Profile does not include capability

Update App ID capability, regenerate profile, and sync signing.

### No matching provisioning profile

Check bundle ID, distribution type, team, and Match branch/storage.

### Archive succeeds but export fails

Check export method, profile mapping, certificate, and entitlements.

### API authentication fails

Check key ID, issuer ID, private key format, role, and whether the action supports API-key authentication.

---

## 8. Completion checklist

- [ ] Bundle IDs exist.
- [ ] Capabilities match profiles.
- [ ] App Store Connect record exists.
- [ ] API key is protected.
- [ ] Signing owner is known.
- [ ] CI signing works without interactive login where supported.
- [ ] Archive and export succeed.

# Mobile Deployment Strategy

---

## 1. Channel model

| Channel | Purpose | Android | iOS |
|---|---|---|---|
| Developer | Local debugging | Debug APK | Simulator/device debug |
| Internal QA | Rapid team validation | Firebase App Distribution | Firebase App Distribution or TestFlight internal |
| Store beta | Store-delivered validation | Play Internal/Closed | TestFlight internal/external |
| Production | Public release | Play production track | App Store release |

---

## 2. Tooling decision

Use Fastlane for Flutter because it provides one version-controlled automation layer around:

- Gradle and Flutter build commands.
- Android upload through `upload_to_play_store`/supply.
- iOS archive through `build_app`/gym.
- TestFlight upload through `upload_to_testflight`/pilot.
- App Store upload through `upload_to_app_store`/deliver.
- Apple signing synchronization through Match.
- Firebase App Distribution through the official plugin.

Keep build logic in `Fastfile`; CI prepares the runner and credentials.

---

## 3. Separation of concerns

```text
Flutter project
  owns code, flavors, app configuration

Fastlane
  owns repeatable build/distribution lanes

CI/CD
  owns runner setup, approvals, secret injection, and reports

Stores/providers
  own tester groups, review, rollout, and distribution state
```

Do not duplicate release logic across shell scripts, CI YAML, and Fastlane.

---

## 4. Artifact policy

Record:

```yaml
artifact:
  version: 1.4.0
  build_number: 204
  commit_sha: a1b2c3d
  environment: staging
  platform: android
  format: aab
  checksum: ""
```

Retention:

- Keep production AAB/IPA metadata and symbols.
- Keep Android mapping files when obfuscation/minification is enabled.
- Keep Flutter split-debug-info symbols when Dart obfuscation is enabled.
- Upload iOS dSYMs to crash reporting.
- Never retain signing secrets in build artifacts.

---

## 5. Promotion policy

Preferred:

```text
Internal artifact
→ QA validates
→ promote/store-test same source revision
→ production release
```

Store signing and channel-specific builds may require separate artifacts, but all must reference the same reviewed source revision and configuration.

---

## 6. Production gates

- QA approval.
- Release checklist.
- Version/build uniqueness.
- Correct flavor.
- Signing validity.
- Privacy/store metadata readiness.
- Backend compatibility.
- Monitoring readiness.
- Rollback/hotfix path.
- Explicit production approval.

---

## 7. Rollback reality

Mobile binaries cannot be instantly removed from installed devices.

Mitigation strategy:

- Feature flags and remote config.
- Backend backward compatibility.
- Halt staged/phased rollout.
- Publish a higher-numbered hotfix build.
- Avoid server changes that force immediate client upgrades.

---

## 8. Selection record

```markdown
## Mobile release decision

- Target platform:
- Environment:
- Distribution channel:
- Flavor:
- Version/build:
- Signing owner:
- Fastlane lane:
- CI workflow:
- QA approver:
- Public release requested: yes/no
- Rollout strategy:
- Hotfix strategy:
```

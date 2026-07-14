# Android Release Checklist

## Release record

```text
Environment:
Flavor:
Application ID:
Version name:
Version code:
Commit SHA:
Artifact:
Target: Firebase | Play Internal | Production
Release owner:
```

## Code and configuration

- [ ] Scope is approved.
- [ ] Flutter analyze/test pass.
- [ ] Production flavor uses production API.
- [ ] Firebase/OAuth/app links use correct project and certificate.
- [ ] No debug flags or test credentials.

## Signing

- [ ] Correct upload keystore.
- [ ] No keystore/password in Git or artifact.
- [ ] Google Play App Signing relationship is understood.
- [ ] Signing certificate-dependent integrations are verified.

## Build

- [ ] Version code is unique.
- [ ] Version name is approved.
- [ ] Signed AAB is generated for Play.
- [ ] APK is generated only when required.
- [ ] Mapping and native symbols are retained.
- [ ] Flutter split-debug-info is retained when used.

## Play Console

- [ ] Correct app and track.
- [ ] Store declarations are complete.
- [ ] Release notes are complete.
- [ ] Tester group is correct.
- [ ] Staged rollout percentage is approved for production.
- [ ] Halt criteria are known.

## Verification

- [ ] Fresh install passes.
- [ ] Upgrade passes.
- [ ] Login and critical flow pass.
- [ ] Push/deep links pass.
- [ ] Crash monitoring receives release.
- [ ] Version/build/commit are recorded.

## Result

```markdown
- Upload status:
- Track:
- Tester/install result:
- Rollout percentage:
- Known issues:
- Next action:
```

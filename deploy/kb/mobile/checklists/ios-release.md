# iOS Release Checklist

## Release record

```text
Environment:
Flavor/scheme:
Bundle ID:
Marketing version:
Build number:
Commit SHA:
Artifact:
Target: Firebase | TestFlight | App Store
Release owner:
```

## Code and configuration

- [ ] Scope is approved.
- [ ] Flutter analyze/test pass.
- [ ] Production scheme uses production API.
- [ ] Associated domains, push, OAuth, and capabilities are correct.
- [ ] No debug flags or test credentials.

## Signing

- [ ] Correct Apple team.
- [ ] Correct bundle ID.
- [ ] Certificate/profile are valid.
- [ ] Entitlements match capabilities.
- [ ] Match runs readonly in CI.
- [ ] API key has suitable permissions.

## Build

- [ ] Marketing version is approved.
- [ ] Build number is unique.
- [ ] Archive and IPA export pass.
- [ ] dSYM is retained/uploaded.
- [ ] Flutter symbols are retained when obfuscation is used.

## App Store Connect/TestFlight

- [ ] Correct app record.
- [ ] Upload succeeds.
- [ ] Processing succeeds.
- [ ] Export compliance is complete.
- [ ] Internal tester group is correct.
- [ ] External beta review information is complete when needed.
- [ ] Public review is not submitted unintentionally.

## Verification

- [ ] Fresh install passes.
- [ ] Upgrade passes.
- [ ] Login and critical flow pass.
- [ ] Push/universal links pass.
- [ ] Crash monitoring receives release.
- [ ] Version/build/commit are recorded.

## Result

```markdown
- Upload status:
- Processing status:
- Tester group:
- Review status:
- Known issues:
- Next action:
```

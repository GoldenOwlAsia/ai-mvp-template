# Release Checklist

> **Purpose:** Govern a production release from scope approval through rollout, monitoring, and closure.

---

## 1. Release record

```text
Product:
Release version:
Release channel:
Target platforms:
Release owner:
Technical reviewer:
QA or product approver:
Planned release date:
Commit or tag:
Changelog:
```

---

## 2. Scope approval

- [ ] Features are confirmed.
- [ ] Bug fixes are listed.
- [ ] Breaking changes are documented.
- [ ] Known issues are documented.
- [ ] Feature-flag state is defined.
- [ ] Unrelated pull requests are excluded.
- [ ] Release branch and tag strategy are correct.

---

## 3. Versioning

- [ ] Version follows project convention.
- [ ] Android version code is incremented.
- [ ] Android version name is correct.
- [ ] iOS build number is incremented.
- [ ] iOS marketing version is correct.
- [ ] Web and backend release include commit SHA.
- [ ] Database migration version is recorded.
- [ ] Git tag does not already exist.
- [ ] Release notes match the release version.

Use semantic versioning where appropriate:

```text
MAJOR.MINOR.PATCH
```

---

## 4. Quality gates

- [ ] Lint passes.
- [ ] Unit tests pass.
- [ ] Required integration or E2E tests pass.
- [ ] QA acceptance passes.
- [ ] Regression testing passes.
- [ ] Critical performance paths are checked.
- [ ] Required security checks pass.
- [ ] Accessibility or compliance checks pass when applicable.
- [ ] Error and crash monitoring are ready.

---

## 5. Production configuration

- [ ] Production environment is confirmed.
- [ ] Production credentials exist.
- [ ] Domains and callback URLs are correct.
- [ ] Production database is selected.
- [ ] Production analytics is selected.
- [ ] Production error monitoring is selected.
- [ ] Feature flags have approved values.
- [ ] Third-party integrations use production mode.
- [ ] Test credentials are not used.

---

## 6. Database and API compatibility

- [ ] Migration is backward-compatible.
- [ ] Required backup is complete.
- [ ] Backend supports active mobile versions.
- [ ] API changes do not break supported clients.
- [ ] Queue and event schemas are compatible.
- [ ] Application rollback remains possible.
- [ ] A forward-fix plan exists.

---

## 7. Web release

- [ ] Production build passes.
- [ ] Production environment variables are correct.
- [ ] Domain and TLS are valid.
- [ ] CDN and cache strategy are correct.
- [ ] Authentication callbacks are correct.
- [ ] Production robots, sitemap, and metadata are correct.
- [ ] Monitoring release version is configured.
- [ ] Previous deployment is available for rollback.

---

## 8. Android release

### Build

- [ ] Production flavor is selected.
- [ ] Application ID is correct.
- [ ] Signed AAB is created.
- [ ] Version code is unused.
- [ ] R8 or ProGuard output is validated.
- [ ] Mapping file is retained.
- [ ] Native symbols are retained when applicable.

### Google Play

- [ ] Store listing is complete.
- [ ] Release notes are complete.
- [ ] Data safety information is accurate.
- [ ] Required app-content declarations are complete.
- [ ] Target track is correct.
- [ ] Internal or closed testing passes.
- [ ] Staged rollout percentage is defined.
- [ ] Rollout halt criteria are defined.

---

## 9. iOS release

### Build

- [ ] Production scheme or flavor is selected.
- [ ] Bundle identifier is correct.
- [ ] Certificate and provisioning profile are correct.
- [ ] Build number is unused.
- [ ] Archive and export succeed.
- [ ] dSYM is retained or uploaded.
- [ ] Capabilities and entitlements are correct.

### App Store Connect

- [ ] Store metadata is complete.
- [ ] Screenshots are correct.
- [ ] Privacy information is accurate.
- [ ] Export compliance is complete.
- [ ] Review information is complete.
- [ ] Demo account or review instructions are available.
- [ ] TestFlight validation passes.
- [ ] Phased release is configured when required.
- [ ] Review submission is not triggered outside the approved plan.

---

## 10. Fastlane release

- [ ] `Gemfile.lock` is committed.
- [ ] Fastlane runs through `bundle exec`.
- [ ] `Appfile` points to the correct application and team.
- [ ] `Matchfile` points to the correct protected storage.
- [ ] CI uses Match in read-only mode.
- [ ] Production lane requires explicit input and approval.
- [ ] Fastlane does not print credentials.
- [ ] Artifact path is correct.
- [ ] Lanes are validated through staging or internal distribution.
- [ ] Store API credentials are valid.

---

## 11. Communication readiness

- [ ] Stakeholders know the release window.
- [ ] Release owner is available.
- [ ] Incident and rollback channel is ready.
- [ ] Support team knows the known issues.
- [ ] Release notes are distributed.
- [ ] Monitoring dashboards are open.
- [ ] An authorized rollback operator is available.

---

## 12. Rollout

- [ ] Production approval is complete.
- [ ] Deployment concurrency is locked.
- [ ] Database migration is monitored.
- [ ] Health check passes.
- [ ] Smoke test passes.
- [ ] Staged or phased rollout starts at the approved percentage.
- [ ] Service metrics are monitored.
- [ ] Error and crash rates remain normal.
- [ ] Critical business flows remain normal.

---

## 13. Post-release monitoring

### First 15–30 minutes

- [ ] Health checks remain stable.
- [ ] Error rate remains normal.
- [ ] Crash rate remains normal.
- [ ] Authentication and critical business flows work.
- [ ] Queues and workers are stable.
- [ ] No critical support reports are received.

### Later review

- [ ] Rollout percentage is reassessed.
- [ ] Business metrics remain within expected range.
- [ ] Store feedback and review status are monitored.
- [ ] Known issues are updated.
- [ ] Release is formally closed.
- [ ] Temporary flags and branches have cleanup tasks.

---

## 14. Rollback and hotfix readiness

- [ ] Previous known-good artifact exists.
- [ ] Rollout can be halted.
- [ ] Backend remains compatible with previous mobile clients.
- [ ] Feature flags can disable risky behavior.
- [ ] Hotfix branch and tag process are defined.
- [ ] Hotfix approval owner is identified.
- [ ] Database recovery plan is ready.

---

## 15. Release result

```markdown
## Release result

- Status: released | partially-released | halted | rolled-back
- Version:
- Commit:
- Platforms:
- Web or backend URL:
- Android track:
- iOS / TestFlight / App Store status:
- Rollout percentage:
- Migration:
- Health status:
- Known issues:
- Rollback target:
- Release owner:
```

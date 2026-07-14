# Deployment Checklist

> **Purpose:** Provide a repeatable technical checklist for every development, staging, or production deployment.

---

## 1. Deployment record

```text
Application:
Environment:
Platform:
Provider:
Region:
Branch or tag:
Version:
Build number:
Commit SHA:
Deployment owner:
Reviewer:
Pull request or change ticket:
Planned deployment time:
```

---

## 2. Pre-deployment

### Scope

- [ ] Change scope is understood.
- [ ] Pull request is reviewed.
- [ ] Required checks pass.
- [ ] Unrelated changes are excluded.
- [ ] Technical release notes are prepared.

### Quality

- [ ] Lint passes.
- [ ] Type checks pass.
- [ ] Unit tests pass.
- [ ] Required integration tests pass.
- [ ] Build passes in CI.
- [ ] Debug settings and sensitive logs are disabled.

### Environment

- [ ] Target environment is explicit.
- [ ] Branch or tag is correct.
- [ ] Domain and API URLs are correct.
- [ ] Application ID or bundle ID is correct.
- [ ] Required environment variables exist.
- [ ] No production resource is used unintentionally.

### Secrets

- [ ] Credentials exist in the correct secret store.
- [ ] No secret exists in the repository.
- [ ] Credentials are not expired.
- [ ] Service accounts use least privilege.
- [ ] Pipeline steps do not print secrets.

### Database

- [ ] Migration is reviewed.
- [ ] Migration succeeds in staging.
- [ ] Backward compatibility is evaluated.
- [ ] Required backup is complete.
- [ ] Restore or forward-fix procedure exists.
- [ ] Destructive operations are explicitly approved.

### Rollback readiness

- [ ] Previous known-good version is identified.
- [ ] Previous artifact is available.
- [ ] Rollback command or dashboard path is known.
- [ ] Database is compatible with rollback.
- [ ] Feature flag or configuration fallback is available.

---

## 3. During deployment

- [ ] Official pipeline is used.
- [ ] Correct protected environment is selected.
- [ ] Required approval is complete.
- [ ] Artifact includes version, build number, and commit SHA.
- [ ] No conflicting production deployment is running.
- [ ] Migration executes only once.
- [ ] Deployment logs are monitored.
- [ ] Manual production changes follow an approved runbook.
- [ ] Partial failures are recorded.

---

## 4. Post-deployment

### Technical verification

- [ ] Deployment command succeeds.
- [ ] Health check passes.
- [ ] Smoke test passes.
- [ ] Critical endpoint works.
- [ ] Database connectivity works.
- [ ] Queue, worker, or scheduler works when applicable.
- [ ] Static assets load.
- [ ] Domain and TLS work.
- [ ] No CORS or environment mismatch is present.

### Monitoring

- [ ] Error rate is normal.
- [ ] Latency is normal.
- [ ] CPU and memory are normal.
- [ ] Crash-free rate is stable.
- [ ] Queue backlog is stable.
- [ ] No unexpected alerts are firing.

### Documentation

- [ ] Deployment URL or build is recorded.
- [ ] Commit SHA is recorded.
- [ ] Migration version is recorded.
- [ ] CI/CD job summary is complete.
- [ ] Stakeholders are notified.
- [ ] Known issues are recorded.

---

## 5. Web-specific checks

- [ ] Preview or staging URL is correct.
- [ ] Home page loads.
- [ ] Direct route navigation works.
- [ ] CDN and assets work.
- [ ] Frontend points to the correct API.
- [ ] Authentication callbacks are correct.
- [ ] Cache and service worker do not serve an incompatible release.
- [ ] Production SEO configuration is correct where applicable.

---

## 6. Backend-specific checks

- [ ] Service or container is healthy.
- [ ] Application binds to the correct host and port.
- [ ] Health and readiness endpoints work.
- [ ] Migration is complete.
- [ ] Workers and scheduled jobs run.
- [ ] Logs contain no secrets.
- [ ] Rate limits and CORS are correct.
- [ ] External integrations work.

---

## 7. Database-specific checks

- [ ] Backup is complete.
- [ ] Migration version or checksum is correct.
- [ ] Indexes and constraints are created.
- [ ] No unexpected long-running lock exists.
- [ ] Connection pool is stable.
- [ ] Critical queries work.
- [ ] No data is lost or duplicated.
- [ ] Restore point is recorded when required.

---

## 8. Android-specific checks

- [ ] Application ID is correct.
- [ ] Version name is correct.
- [ ] Version code is incremented.
- [ ] APK or AAB is signed correctly.
- [ ] Mapping and symbol files are retained when applicable.
- [ ] Firebase project or Google Play track is correct.
- [ ] Tester group is correct.
- [ ] Deep links and push notifications use the correct environment.
- [ ] Production build does not use a staging API.

---

## 9. iOS-specific checks

- [ ] Bundle identifier is correct.
- [ ] Marketing version is correct.
- [ ] Build number is incremented.
- [ ] Certificate and profile are correct.
- [ ] Capabilities and entitlements are correct.
- [ ] Archive and export succeed.
- [ ] Correct App Store Connect application is selected.
- [ ] dSYM is retained or uploaded.
- [ ] Deep links and push notifications use the correct environment.
- [ ] Production build does not use a staging API.

---

## 10. Deployment result

```markdown
## Deployment result

- Status: success | failed | rolled-back
- Environment:
- Version:
- Build:
- Commit:
- URL or artifact:
- Migration:
- Health check:
- Smoke test:
- Monitoring:
- Rollback target:
- Notes:
```

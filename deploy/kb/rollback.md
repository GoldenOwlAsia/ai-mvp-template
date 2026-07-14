# Rollback Strategy

> **Purpose:** Restore service safely and quickly when a deployment or release causes unacceptable impact.

---

## 1. Core principle

Rollback planning must happen before a production release.

Every release must identify:

- Current production version.
- Candidate version.
- Previous known-good artifact.
- Related database migrations.
- Related feature flags.
- Rollback mechanism.
- Authorized rollback owner.
- Rollback trigger criteria.

---

## 2. Rollback triggers

Rollback should be considered when:

- Health checks fail.
- Smoke tests fail.
- Error rate exceeds the agreed threshold.
- Latency increases materially.
- Authentication, payment, upload, or another critical flow fails.
- A migration causes corruption, lock contention, or data loss.
- Mobile crash-free rate declines materially.
- A security issue is discovered.
- The issue cannot be safely mitigated within the agreed recovery window.

Do not continue debugging live production indefinitely when a safe rollback is available.

---

## 3. Decision sequence

```text
Is customer impact present?
│
├─ No → Stop rollout and investigate
│
└─ Yes
   ├─ Can a feature flag disable the change? → Disable the flag
   ├─ Can configuration be safely reverted? → Revert configuration
   ├─ Is the previous artifact compatible with the current database? → Roll back the application
   └─ Is the database incompatible? → Execute the database recovery plan
```

---

## 4. Web rollback

Typical mechanisms:

- Promote the previous deployment.
- Revert the release commit and redeploy.
- Disable the feature flag.
- Restore previous environment configuration.
- Roll back CDN or routing configuration.

After rollback:

- Invalidate cache only when required.
- Verify the production domain and TLS.
- Run smoke tests.
- Confirm HTML and static assets are from compatible versions.
- Monitor error rates.

---

## 5. Backend rollback

Prefer redeploying the previous artifact over rebuilding from source.

Runbook:

```text
Stop rollout
→ select the previous known-good artifact
→ verify database compatibility
→ deploy
→ run health checks
→ run smoke tests
→ monitor
```

Compatibility questions:

- Can the previous application version use the current schema?
- Can previous workers consume newly created queue messages?
- Does a cache or serialized payload require cleanup?
- Must workers and API services be rolled back together?

---

## 6. Database rollback

Database rollback has the highest data risk.

Preferred order:

1. Apply a safe forward fix.
2. Disable the feature using the new schema.
3. Roll back the application while keeping a compatible expanded schema.
4. Restore from backup only when necessary.

Do not automatically run destructive down migrations in production.

### Expand-contract model

```text
Add new table or column
→ deploy code supporting both schemas
→ migrate data
→ move traffic to the new schema
→ remove the old schema in a later release
```

Before a risky migration:

- Create a backup.
- Validate restore capability.
- Estimate lock duration and downtime.
- Validate affected data.
- Prepare a forward-fix or recovery query.
- Assign an operator to monitor the migration.

---

## 7. Mobile rollback

A mobile binary cannot be removed from every installed device immediately.

### Android

Available controls may include:

- Halt a staged rollout.
- Reduce rollout percentage.
- Release a hotfix with a higher version code.
- Disable the feature remotely.
- Disable incompatible backend behavior.
- Keep APIs compatible with the previous app version.

A previously used version code cannot be reused.

### iOS

Available controls may include:

- Pause a phased release.
- Remove a version from sale when appropriate.
- Disable the feature remotely.
- Publish a hotfix build.
- Keep APIs compatible with active older versions.

Do not assume all users update immediately.

### Architecture requirement

Backend services must support active mobile versions for the documented support window.

---

## 8. Fastlane considerations

Fastlane can automate:

- Uploading a hotfix.
- Promoting an Android track.
- Distributing a new TestFlight build.
- Rebuilding from a signed release tag.

Fastlane does not replace incident decision-making and must not automatically roll back production databases.

---

## 9. Rollback runbook template

```markdown
## Incident

- Environment:
- Detected at:
- Release version:
- Commit SHA:
- Customer impact:
- Incident owner:

## Trigger

- Metric or failure:
- Threshold:
- Decision maker:

## Rollback target

- Version:
- Artifact:
- Database compatibility:
- Configuration compatibility:

## Actions

1.
2.
3.

## Verification

- Health check:
- Smoke test:
- Error rate:
- Critical user flow:

## Follow-up

- Root cause:
- Hotfix:
- Prevention:
```

---

## 10. Emergency rollback procedure

1. Announce the incident.
2. Stop the active rollout.
3. Assign an incident owner.
4. Select the known-good version.
5. Confirm database compatibility.
6. Execute the rollback.
7. Run health checks.
8. Run smoke tests.
9. Monitor service metrics.
10. Update stakeholders.
11. Preserve the incident timeline.
12. Schedule a post-incident review.

---

## 11. Post-rollback verification

Confirm:

- Service health is restored.
- Error rate returns to baseline.
- Critical user flows work.
- Queue backlogs are stable.
- No data was lost or duplicated.
- Mobile API compatibility remains acceptable.
- Alerts are resolved for the correct reason.

---

## 12. Completion checklist

- [ ] Previous known-good artifact exists.
- [ ] Version and commit SHA are recorded.
- [ ] Previous artifact is compatible with the current database.
- [ ] Migration backup and recovery are documented.
- [ ] Feature flags can disable risky features.
- [ ] Store rollout can be halted where supported.
- [ ] An authorized operator is available.
- [ ] Health checks exist.
- [ ] Smoke tests exist.
- [ ] Incident communication is prepared.

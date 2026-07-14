# Deployment Troubleshooting

> **Purpose:** Diagnose deployment failures systematically and avoid speculative or destructive fixes.

---

## 1. Investigation workflow

```text
Identify the environment
→ identify the failing stage
→ capture the first actionable error
→ compare with the last successful run
→ inspect recent code, configuration, and credential changes
→ check provider status
→ reproduce in a safe environment
→ apply the smallest safe fix
→ verify
→ document root cause
```

Do not repeatedly rerun a failing pipeline without learning from the previous run.

---

## 2. Failure categories

| Stage | Common examples |
|---|---|
| Checkout | Repository permissions, submodules, Git LFS |
| Toolchain setup | Incorrect runtime, SDK, Xcode, Java, or Ruby |
| Dependency installation | Lockfile conflicts, registry access, networking |
| Lint and test | Code-quality or test failure |
| Build | Compilation, bundling, native dependency, signing |
| Packaging | Missing or invalid artifact |
| Deployment | Authentication, permission, provider configuration |
| Migration | Schema conflict, lock, timeout, partial execution |
| Runtime | Crash, missing configuration, incorrect port |
| Verification | Health check or smoke test failure |
| Store delivery | Signing, metadata, entitlement, or store validation |

---

## 3. Evidence to collect

- Workflow, job, and step name.
- Environment.
- Commit SHA.
- Version and build number.
- First actionable error.
- Exit code.
- Runtime and SDK versions.
- Lockfile changes.
- Whether required credentials exist, without printing them.
- Provider deployment identifier.
- Logs immediately before and after failure.
- Last successful run.
- Recent infrastructure or configuration changes.

---

## 4. Environment variable failures

### Symptoms

- `undefined`, `null`, or missing-key errors.
- Service starts and immediately exits.
- Frontend calls the wrong API.
- Local build succeeds while CI fails.

### Checks

- Is the name case-sensitive and correct?
- Is the variable stored in the correct CI/CD environment?
- Does the job declare the expected environment?
- Is the value required at build time or runtime?
- Does the provider require a redeployment after a value changes?
- Is `.env.example` current?

Never print the complete environment.

---

## 5. Dependency installation failures

### Symptoms

- Package resolution fails.
- Version conflicts.
- Local install works but CI fails.

### Checks

- Is the lockfile committed?
- Is CI using the correct package manager?
- Is the runtime version pinned?
- Does a private registry token have the correct scope?
- Is a stale cache involved?

Safe responses:

- Use a clean install command.
- Print tool versions.
- Invalidate only the relevant cache.
- Do not upgrade unrelated dependencies in the same emergency fix.

---

## 6. Docker and backend failures

### Image build failure

Check:

- Build context.
- `.dockerignore`.
- Multi-stage copy paths.
- Missing native libraries.
- CPU architecture.
- Base-image compatibility.

### Container exits after start

Check:

- Required environment variables.
- Start command.
- Bind address, usually `0.0.0.0`.
- Port configuration.
- Database availability.
- Migration result.
- File-system write requirements.

### Health check fails

Check:

- Correct route.
- Startup or warm-up time.
- Dependency failures.
- Timeout and retry settings.
- Whether health checks are too tightly coupled to optional services.

---

## 7. Database failures

### Connection timeout or refusal

Check:

- Host and port.
- Network allow-list or firewall.
- TLS or SSL mode.
- Connection-pool limits.
- Paused or unavailable managed database.
- DNS and private network configuration.

### Migration failure

Check:

- Partial execution.
- Schema drift.
- Missing privileges.
- Lock contention.
- Destructive statements.
- Application/schema compatibility.

Do not modify production schema manually without creating a tracked migration or an incident record.

---

## 8. Web deployment failures

### Successful build but blank page

Check:

- Asset base path.
- Public base URL.
- Client runtime errors.
- Build-time environment variables.
- SPA route fallback.
- Content Security Policy.
- JavaScript bundle compatibility.

### CORS failure

Check:

- Allowed staging and production origins.
- Cookie and credential settings.
- HTTP/HTTPS mismatch.
- Preflight handling.
- Proxy or gateway configuration.

### Stale release

Check:

- CDN cache.
- Service worker cache.
- HTML and JavaScript bundle mismatch.
- Cache invalidation policy.
- Versioned static assets.

---

## 9. Android and Fastlane failures

### Keystore not found

Check:

- Base64 decoding.
- Temporary file path.
- `key.properties`.
- Cleanup timing.
- CI environment scope.

### Signing failure

Check:

- Key alias.
- Store password.
- Key password.
- Build variant signing configuration.
- Package name.
- Keystore ownership.

### Google Play upload failure

Check:

- Service account permissions.
- Application ID.
- Existing version code.
- Target track.
- Release status.
- App-signing configuration.
- Artifact signature.

### Firebase App Distribution failure

Check:

- Firebase app ID.
- Tester group.
- Service account permission.
- Artifact path.
- CLI or plugin authentication.

---

## 10. iOS and Fastlane failures

### Code-signing failure

Check:

- Bundle identifier.
- Team ID.
- Certificate validity.
- Provisioning profile capabilities.
- Match repository and password.
- CI keychain unlock state.
- Required entitlements.

### Archive failure

Check:

- Shared scheme.
- Workspace or project path.
- CocoaPods or Swift Package resolution.
- Xcode version.
- Build configuration.
- Export method.

### TestFlight upload failure

Check:

- Duplicate build number.
- App Store Connect API key permissions.
- Pending agreements.
- Export compliance.
- Missing application metadata.
- Binary processing status.

---

## 11. GitHub Actions failures

### Secret appears empty

Check:

- Job environment declaration.
- Environment secret location.
- Workflow origin from a fork.
- Secret name.
- Approval state.

### Permission denied

Check:

- Workflow `permissions`.
- Token scope.
- Protected environment approval.
- Cloud-role trust policy.
- Repository or organization restrictions.

### Workflow does not trigger

Check:

- Branch or tag pattern.
- Workflow file location.
- `paths` and `paths-ignore`.
- Disabled workflow state.
- Default branch behavior.

---

## 12. Provider outage

Before making large code changes:

- Check the provider status page.
- Check active incidents.
- Compare failures across multiple projects or deployments.
- Check DNS and network health.

During a provider outage:

- Do not rotate all credentials without evidence.
- Do not continuously redeploy.
- Inform stakeholders.
- Use failover only if it is already designed and tested.

---

## 13. Rollback decision

Roll back when:

- Production impact is confirmed.
- A safe fix cannot be completed within the recovery objective.
- A compatible known-good artifact exists.
- Database state permits rollback.
- Critical metrics exceed the release threshold.

See `rollback.md`.

---

## 14. Investigation report template

```markdown
## Failure summary

- Environment:
- Workflow:
- Step:
- Commit:
- Error:

## Root cause

- ...

## Resolution

- ...

## Verification

- ...

## Prevention

- ...
```

---

## 15. Completion checklist

- [ ] Correct environment identified.
- [ ] First actionable error identified.
- [ ] Last successful run compared.
- [ ] No secret printed.
- [ ] Provider status checked.
- [ ] Partial deployment assessed.
- [ ] Fix-versus-rollback decision made.
- [ ] Verification completed.
- [ ] Root cause and prevention documented.

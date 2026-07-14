# Mobile Post-Release Checklist

---

## First 30 minutes

- [ ] Store/provider reports expected release state.
- [ ] Install/update works for a real tester/device.
- [ ] Crash-free metrics are stable.
- [ ] Authentication works.
- [ ] Critical API flows work.
- [ ] Push and deep links work.
- [ ] No environment mismatch is reported.
- [ ] Support and incident channels are monitored.

---

## Staged/phased rollout

- [ ] Current percentage is recorded.
- [ ] Error/crash thresholds are below halt criteria.
- [ ] Backend latency and error rate are stable.
- [ ] Business metrics are within expected range.
- [ ] Reviews/support reports contain no critical issue.
- [ ] Approval exists before increasing rollout.

---

## Artifact and documentation

- [ ] Version, build, commit, and tag are recorded.
- [ ] AAB/IPA metadata is retained.
- [ ] Mapping/dSYM/split-debug-info are stored.
- [ ] Release notes are archived.
- [ ] CI workflow link is recorded.
- [ ] Known issues and owner are recorded.

---

## Incident response

If impact exceeds threshold:

```text
Halt rollout
→ disable feature/config if possible
→ verify backend compatibility
→ create hotfix with higher build number
→ repeat release gates
```

Do not attempt to reuse a store build number.

---

## Release closure

- [ ] Rollout is complete or intentionally paused.
- [ ] Temporary flags have cleanup tasks.
- [ ] Release branch is handled per policy.
- [ ] Post-release issues are assigned.
- [ ] Stakeholders receive final status.
- [ ] Release is marked complete.

---

## Final report

```markdown
## Post-release result

- Platform:
- Version/build:
- Rollout status:
- Crash/error status:
- Critical-flow status:
- Support feedback:
- Known issues:
- Hotfix required: yes/no
- Release owner:
```

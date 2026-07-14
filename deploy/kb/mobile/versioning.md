# Mobile Versioning Standard

---

## 1. Flutter version format

`pubspec.yaml`:

```yaml
version: 1.4.0+204
```

- `1.4.0` is the user-visible version.
- `204` is the build number.

Android maps this to version name/code. iOS maps this to marketing version/build number unless overridden.

---

## 2. Rules

- Every uploaded Android artifact has a greater version code than previous artifacts for that application ID.
- Every uploaded iOS artifact uses a build number not already used for that marketing version.
- Production releases use a Git tag matching project convention.
- Version and build number are traceable to commit SHA.
- Rebuilding the same source for a different environment must follow the project's identifier/build-number policy.

---

## 3. Semantic versioning

```text
MAJOR.MINOR.PATCH
```

Suggested interpretation:

- MAJOR: incompatible product/API behavior requiring coordinated migration.
- MINOR: backward-compatible features.
- PATCH: backward-compatible fixes.

Mobile products may use a product release train instead. Document the actual policy.

---

## 4. Build-number strategies

Choose one:

### Monotonic CI counter

Simple and store-compatible.

### Timestamp-based

Example `YYMMDDHH`, only if it remains within platform constraints and team policy.

### Git-derived

Use CI run number or commit count; ensure uniqueness across branches and retries.

Do not use a short commit hash as the numeric build number.

---

## 5. Fastlane responsibility

Fastlane may:

- Read version from `pubspec.yaml`.
- Accept CI-provided build number.
- Validate uniqueness before upload.
- Pass `--build-name` and `--build-number` to Flutter.

Example shell build:

```bash
flutter build appbundle \
  --flavor production \
  --build-name="1.4.0" \
  --build-number="204"
```

---

## 6. Release tag

Recommended:

```text
v1.4.0
```

Metadata record:

```yaml
release:
  tag: v1.4.0
  build_number: 204
  commit_sha: a1b2c3d
  android_track: internal
  ios_channel: testflight
```

---

## 7. Hotfix

For a hotfix:

- Increment PATCH.
- Increment build number.
- Branch from the actual production tag/commit.
- Include only required fixes.
- Re-run release gates.
- Do not reuse an old store build number.

---

## 8. Completion checklist

- [ ] User-visible version is approved.
- [ ] Build number is unique.
- [ ] `pubspec.yaml` and lane inputs agree.
- [ ] Git tag is unique.
- [ ] Artifact metadata includes commit SHA.
- [ ] Hotfix path is documented.

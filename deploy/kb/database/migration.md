# Database Migration Standard

> **Purpose:** Make schema and data changes repeatable, reviewable, and compatible with safe application releases.

---

## 1. Migration categories

| Category | Example | Production risk |
|---|---|---|
| Additive schema | Add nullable column or new table | Low to medium |
| Constraint/index | Add unique constraint or index | Medium; locking may occur |
| Data migration | Backfill rows | Medium to high |
| Contract change | Rename/remove column | High |
| Security change | RLS, grants, functions | High |
| Large rewrite | Type conversion, table rewrite | Very high |

Every migration PR must state its category.

---

## 2. Naming

```text
<timestamp>_<imperative_description>.sql
```

Examples:

```text
20260711090000_create_profiles.sql
20260711103000_add_profile_status.sql
```

Do not rename or edit migrations already deployed to a shared environment. Create a new corrective migration.

---

## 3. Expand-contract strategy

### Release A: Expand

- Add new schema.
- Keep old schema functional.
- Add dual-read/write behavior only when required.

### Release B: Migrate

- Backfill data in controlled batches.
- Verify counts and invariants.
- Move traffic to new schema.

### Release C: Contract

- Stop old reads/writes.
- Confirm no supported client depends on old schema.
- Remove deprecated schema in a later release.

This is required for mobile-compatible APIs and zero/low-downtime releases.

---

## 4. Local workflow

```bash
supabase migration new add_example_feature
# Edit generated SQL
supabase db reset
```

Run:

- Schema tests.
- RLS tests.
- Application integration tests.
- Seed validation.

Optional diff workflow:

```bash
supabase db diff -f add_example_feature
supabase db reset
```

Review the generated migration manually.

---

## 5. SQL guidelines

- Qualify schemas, for example `public.profiles`.
- Use explicit constraint names for maintainability.
- Make rerun behavior clear.
- Avoid long transactions for large backfills.
- Create indexes with an approach appropriate to production size and locking constraints.
- Avoid volatile defaults that rewrite large tables without analysis.
- Write verification queries.
- Review privileges and RLS after table creation.

Example additive migration:

```sql
alter table public.profiles
  add column status text;

alter table public.profiles
  add constraint profiles_status_check
  check (status in ('active', 'disabled'))
  not valid;

alter table public.profiles
  validate constraint profiles_status_check;
```

Adapt based on existing data and PostgreSQL behavior.

---

## 6. Data backfills

For large data:

- Estimate rows and runtime.
- Use batches.
- Make the operation restartable.
- Record progress.
- Avoid blocking user traffic.
- Validate before setting `NOT NULL` or new constraints.

Prefer an application/admin job for long backfills rather than one huge migration transaction.

---

## 7. Pre-production review template

```markdown
## Migration review

- Migration files:
- Category:
- Estimated affected rows:
- Expected lock:
- Runtime estimate:
- Backward compatible:
- Application release order:
- Backup required:
- Verification queries:
- Recovery/forward-fix:
```

---

## 8. Deployment order

Choose explicitly:

### Schema-first

Use for additive, backward-compatible changes.

```text
Deploy schema
→ verify
→ deploy application
```

### Application-first

Use when the application must tolerate both schemas before a migration.

### Maintenance window

Use only when the change cannot be made safely online and downtime is approved.

---

## 9. Rollback policy

Production migration rollback is not automatically a down migration.

Preferred order:

1. Disable feature.
2. Roll back compatible application.
3. Apply forward fix.
4. Restore backup only when necessary and approved.

Do not run `supabase db reset` against production.

---

## 10. Verification

Examples:

```sql
select count(*) from public.profiles where status is null;

select constraint_name
from information_schema.table_constraints
where table_schema = 'public'
  and table_name = 'profiles';
```

Validate business invariants, not only table existence.

---

## 11. Completion checklist

- [ ] Category and impact are documented.
- [ ] Clean local reset passes.
- [ ] Migration is backward-compatible or downtime is approved.
- [ ] Staging deployment passes.
- [ ] Lock/runtime risk is assessed.
- [ ] Backup requirement is met.
- [ ] Verification queries exist.
- [ ] Recovery plan exists.

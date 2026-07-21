# Database Deployment Runbooks

> **Scope:** Supabase/Neon/PostgreSQL environments, migrations, backups, restores, and production safety
>
> Provider runbooks: [`supabase.md`](./supabase.md) · [`neon.md`](./neon.md) · [`migration.md`](./migration.md) · [`backup-restore.md`](./backup-restore.md)
>
> Resolve provider from `stack.config.yaml` → `database.provider`.

---

## 1. Core principles

- Database schema is version-controlled.
- Staging and production are separate projects/databases.
- Production changes are reviewed.
- Migrations are tested from a clean database.
- Backups have a tested restore procedure.
- Application rollback compatibility is assessed before migration.
- Storage objects are backed up separately when the database backup does not include them.
- Manual dashboard changes must be captured in migrations.

---

## 2. Recommended project structure

```text
supabase/
├── config.toml
├── migrations/
│   └── <timestamp>_<description>.sql
├── seed.sql
└── tests/
```

Never place production credentials in this directory.

---

## 3. Required discovery

```yaml
database:
  engine: postgres
  provider: supabase
  local_development: true
  staging_project_ref: ""
  production_project_ref: ""
  migration_tool: supabase-cli
  seed_policy: development-only
  backup_policy: ""
  pitr_required: false
  storage_objects: false
  rls_enabled: true
```

---

## 4. Change flow

```text
Create migration locally
→ reset local database
→ run database tests
→ review SQL and destructive operations
→ deploy to staging
→ verify application
→ create/verify production backup
→ deploy production migration
→ verify schema and critical queries
→ monitor
```

---

## 5. Safety gates

Stop before production when:

- A migration drops or rewrites a large table.
- Lock duration is unknown.
- Backup/restore is not verified.
- The previous app version cannot use the new schema.
- RLS policy impact is unclear.
- Storage objects are assumed to be covered by a database backup.
- A dashboard-only change has not been represented in code.

---

## 6. Claude operating contract

```text
Before database changes:
1. Read existing migrations and schema.
2. Identify staging and production projects.
3. Identify RLS, functions, triggers, extensions, storage, and auth dependencies.
4. Classify change as additive, data migration, destructive, or security-sensitive.
5. Define application compatibility and backup requirements.

Then:
1. Generate a named migration.
2. Test through a clean local reset.
3. Do not edit an already deployed migration.
4. Deploy staging first.
5. Require explicit approval for Production.
6. Return verification and recovery steps.
```

---

## 7. Definition of Done

- [ ] Migration is version-controlled.
- [ ] Local reset succeeds.
- [ ] Staging deployment succeeds.
- [ ] RLS policies are tested.
- [ ] Backup requirement is satisfied.
- [ ] Application compatibility is documented.
- [ ] Production verification queries exist.
- [ ] Recovery plan exists.

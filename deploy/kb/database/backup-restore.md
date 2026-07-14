# Database Backup and Restore Runbook

> **Scope:** Supabase/PostgreSQL backup policy, restore drills, and disaster recovery

---

## 1. Objectives

Define:

```yaml
recovery:
  rpo: "maximum acceptable data loss"
  rto: "maximum acceptable recovery time"
  retention: ""
  backup_owner: ""
  restore_owner: ""
  test_frequency: quarterly
```

A backup is not considered reliable until a restore has been tested.

---

## 2. Backup scope

Inventory separately:

- PostgreSQL schema and data.
- Database roles/grants where applicable.
- Supabase Storage objects.
- Storage metadata and policies.
- Auth/provider configuration.
- Edge Function code and secrets.
- Application environment configuration.
- DNS/domain configuration.

Supabase database backups cover the database; Storage API objects require a separate plan.

---

## 3. Managed Supabase backups

Review the current plan for:

- Daily backup availability.
- Download availability.
- Retention.
- Point-in-Time Recovery availability.
- Restore-to-project options.
- Region and project constraints.

Do not assume Free, Pro, Team, and Enterprise plans have identical backup features.

---

## 4. Logical backup with Supabase CLI

Use current official CLI guidance. A documented approach separates roles, schema, and data so restore order is explicit.

Never place a connection string containing a password in source control or shared shell history.

Example secure pattern:

```bash
export SUPABASE_DB_URL="<read from secure secret store>"
mkdir -p backups/$(date -u +%Y%m%dT%H%M%SZ)
```

Create separate role, schema, and data backups:

```bash
BACKUP_DIR="backups/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$BACKUP_DIR"

supabase db dump   --db-url "$SUPABASE_DB_URL"   --file "$BACKUP_DIR/roles.sql"   --role-only

supabase db dump   --db-url "$SUPABASE_DB_URL"   --file "$BACKUP_DIR/schema.sql"

supabase db dump   --db-url "$SUPABASE_DB_URL"   --file "$BACKUP_DIR/data.sql"   --data-only   --use-copy
```

The connection string is sensitive. Prefer injecting it from the CI/CD secret store instead of exporting it in an interactive shell.

Encrypt backups at rest, restrict access, and test restoration into an isolated non-production target.

---

## 5. Native PostgreSQL example

Custom-format backup:

```bash
pg_dump \
  --format=custom \
  --no-owner \
  --file="backup.dump" \
  "$DATABASE_URL"
```

Restore into an empty non-production database:

```bash
pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --dbname="$RESTORE_DATABASE_URL" \
  backup.dump
```

Flags must be reviewed for the target environment. `--clean` is destructive to objects in the restore target.

---

## 6. Restore drill

Run on a schedule:

```text
Create isolated restore target
→ restore schema and data
→ enable required extensions
→ restore roles/grants as appropriate
→ apply required provider configuration
→ run integrity queries
→ point a staging application at restored database
→ run smoke tests
→ measure RTO
→ delete isolated target securely
```

Record:

- Backup timestamp.
- Restore start/end.
- Tool versions.
- Errors.
- Missing objects/configuration.
- Data validation result.
- Actual RPO/RTO.

---

## 7. Pre-migration backup gate

Before high-risk production migrations:

- [ ] Latest managed backup is healthy.
- [ ] On-demand logical backup is created when required.
- [ ] Storage objects are handled separately.
- [ ] Restore credentials are available to authorized operators.
- [ ] Restore target and process are documented.
- [ ] Recovery impact on new writes is understood.

---

## 8. Disaster restore decision

```text
Can the system be forward-fixed without data loss?
├─ Yes → forward-fix
└─ No
   ├─ Is PITR available and suitable? → restore selected point
   ├─ Is managed snapshot suitable? → restore snapshot/project
   └─ Restore logical backup to new project/database
```

Restoring a backup may remove all writes after the recovery point. Obtain incident approval.

---

## 9. Post-restore checks

- Row counts and business invariants.
- Critical indexes and constraints.
- RLS policies and grants.
- Extensions.
- Functions/triggers.
- Auth behavior.
- API access.
- Storage object availability.
- Background jobs.
- Application health.

Do not switch production traffic based only on a successful restore command.

---

## 10. Security

- Encrypt backup files.
- Restrict access by role.
- Record downloads.
- Set retention and secure deletion.
- Never upload production backups to public artifacts.
- Mask database URLs in logs.
- Treat restored test environments as production-sensitive data.

---

## 11. Completion checklist

- [ ] RPO/RTO are defined.
- [ ] Backup scope includes non-database assets.
- [ ] Retention is documented.
- [ ] Restore has been tested.
- [ ] Integrity checks pass.
- [ ] Operators and permissions are known.
- [ ] Backups are encrypted and access-controlled.
- [ ] Production cutover procedure exists.

---

## 12. Official references

- https://supabase.com/docs/guides/platform/backups
- https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore
- https://supabase.com/docs/guides/deployment/ci/backups
- https://supabase.com/docs/guides/database/overview

# Supabase Deployment Runbook

> **Scope:** Local development, environment separation, schema deployment, RLS, and production readiness

---

## 1. Prerequisites

- Supabase account and project access.
- Supabase CLI installed using an officially supported method.
- Docker-compatible local runtime for the local Supabase stack and schema diff operations.
- Separate staging and production projects.
- Project references stored as CI variables, not source secrets.
- Database passwords or access tokens stored securely.

Initialize:

```bash
supabase init
supabase start
```

Inspect local status:

```bash
supabase status
```

---

## 2. Environment model

```text
Local       → Supabase local stack
Preview     → Supabase branch or isolated project when available
Staging     → dedicated Supabase project
Production  → dedicated protected Supabase project
```

Do not point a staging application at production Supabase.

Separate:

- Project URL.
- Public anonymous key.
- Server service-role key.
- Database connection string.
- Storage buckets.
- Auth redirect URLs.
- Edge Function secrets.

The service-role key is server-only and bypasses RLS. Never expose it in a client application.

---

## 3. Local schema workflow

Create a migration:

```bash
supabase migration new create_example_table
```

Apply all migrations from scratch:

```bash
supabase db reset
```

Create a schema diff after controlled local changes:

```bash
supabase db diff -f add_example_feature
```

Review generated SQL before committing. Generated diffs may require manual correction for data, policies, or extension behavior.

---

## 4. Linking and remote operations

Link to a non-production project:

```bash
supabase link --project-ref "<STAGING_PROJECT_REF>"
```

Pull remote schema changes when reconciling an existing project:

```bash
supabase db pull
```

Push migrations:

```bash
supabase db push
```

Rules:

- Link explicitly to the intended project.
- Verify project reference before push.
- Do not use a production password in routine local shell history.
- Staging push occurs before production.
- CI should use protected credentials and an explicit environment.

---

## 5. Row Level Security

For tables exposed through Supabase APIs:

- Enable RLS.
- Add explicit policies.
- Test anonymous and authenticated roles.
- Test ownership boundaries.
- Review `SECURITY DEFINER` functions.
- Avoid broad `using (true)` write policies in production.

Example pattern:

```sql
alter table public.documents enable row level security;

create policy "Users can read their own documents"
on public.documents
for select
to authenticated
using (user_id = auth.uid());
```

Policies must reflect the actual domain rules.

---

## 6. Seed policy

`supabase/seed.sql` is for deterministic non-production data unless explicitly designed otherwise.

Do not place:

- Production users.
- Real customer data.
- Real tokens.
- Sensitive personal data.

Seeds should be idempotent or intended for clean resets.

---

## 7. Storage and Auth

Database backups do not automatically represent a complete product backup.

Plan separately for:

- Storage objects.
- Bucket policy and metadata.
- Auth configuration.
- OAuth provider secrets.
- Redirect URLs.
- Edge Function code and secrets.

Validate staging and production callback URLs separately.

---

## 8. CI/CD outline

```text
Checkout
→ start local Supabase
→ reset database
→ run SQL and application tests
→ detect unsafe migration patterns
→ link staging
→ db push staging
→ integration tests
→ production approval
→ backup verification
→ link production
→ db push production
→ verification queries
```

Use a separate job/environment for production.

---

## 9. Production readiness

Review:

- Backups and retention.
- PITR requirement.
- Connection pooling.
- RLS and security advisor findings.
- Database size and compute.
- Indexes and slow queries.
- Auth rate limits and SMTP.
- Storage size and object backup.
- Observability.
- Project pause/deletion policy.

---

## 10. Common failures

### `db push` targets the wrong project

- Check linked project.
- Check CI environment.
- Check project reference.
- Stop immediately if production was unintended.

### Local reset fails

- Migration order is invalid.
- A migration assumes existing manual state.
- Seed references missing schema.
- Extension is not enabled correctly.

### API returns permission errors

- RLS is enabled without a matching policy.
- JWT role differs from expectation.
- Policy expression is incorrect.
- Client accidentally requires service-role behavior.

### Remote schema drift

- Dashboard edits were made without migrations.
- Pull the schema into a migration, review it, and restore migration-only discipline.

---

## 11. Completion checklist

- [ ] Local stack starts.
- [ ] `supabase db reset` succeeds.
- [ ] Staging and production are separate.
- [ ] RLS policies are reviewed and tested.
- [ ] Storage/Auth dependencies are documented.
- [ ] Staging migrations and tests pass.
- [ ] Production backup policy is verified.
- [ ] Production deployment requires approval.

---

## 12. Official references

- https://supabase.com/docs/guides/local-development/overview
- https://supabase.com/docs/guides/deployment/database-migrations
- https://supabase.com/docs/guides/deployment/managing-environments
- https://supabase.com/docs/reference/cli/introduction
- https://supabase.com/docs/guides/deployment/going-into-prod

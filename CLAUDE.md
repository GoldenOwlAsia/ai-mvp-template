# ai-mvp-template

> Read first every session. Pointer + product contracts. Versions/stack: only `stack.config.yaml` + `stacks/`.

**Folder map (EDIT vs FIXED):** `docs/FOLDER-GUIDE.md`  
**Repo:** `ai-mvp-template`


---

## Project

**App:** `stack.config.yaml` → `project.name`  
**Backend / frontend:** `backend.framework` + `frontend.framework` (catalog: nestjs | laravel | django + react-vite | none)  
**Adapters:** `stacks/<framework>/CONVENTION.md`  
**Deploy:** `deploy/PLATFORM-GUIDE.md`

This base does **not** ship app code. Generate via bootstrap after docs confirm.

---

## Read order

```
Map repo              → docs/FOLDER-GUIDE.md
Stack config          → stack.config.yaml + stacks/catalog.json
Active adapters       → stacks/<backend>/ + stacks/<frontend>/ (if not none)
Product idea          → prompts/init-product.md → docs/_blank + docs/features/
Bootstrap apps        → prompts/bootstrap-from-config.md + adapter BOOTSTRAP.md
Feature loop          → docs/features/[name].md → prompts/generate-*.md
Deploy                → prompts/deploy-from-config.md + skill deploy + pnpm preflight:deploy
Tutorial              → tutorial/DAY0 → DAY4
```

---

## Required rules

```
✅ Read stack.config + matching stack adapters before scaffold/code
✅ Confirm requirements before coding
✅ Soft delete; string PKs; error envelope
✅ One prompt, one layer (adapter defines layer names)
✅ Install only packages listed in stack.config

❌ Do not assume NestJS/React if config says otherwise
❌ Do not hard delete; do not expose passwords/tokens
❌ Do not auto-deploy production; do not invent secrets
❌ Do not assume apps/ already exists in the base
```

---

## Do not change without intent

```
- Auth: access in memory + refresh httpOnly cookie
- Soft delete + error shape statusCode/code/message/timestamp/path
- Dependency list = stack.config.yaml only
- Framework choice = stacks/catalog.json allow-list (add adapter to extend)
```

---

## Bootstrap flow

```
1. Pick example: cp stack.config.examples/<nestjs|laravel|django>-react.yaml stack.config.yaml
2. node scripts/validate-stack-config.mjs
3. node scripts/apply-stack-config.mjs
4. prompts/init-product.md (optional) → confirm docs
5. prompts/bootstrap-from-config.md → generate apps per adapters
```

When unsure → ask; do not guess.

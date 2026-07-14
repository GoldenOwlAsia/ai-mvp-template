# Repo map — folders / files / meaning / edit vs fixed

> Clear split: **you fill per app** vs **fixed product contracts** vs **stack adapters**.

## Quick legend

| Tag | Meaning |
|---|---|
| **EDIT** | Customize per project / feature |
| **TUNE** | Change with intent (framework, versions); then validate |
| **FIXED** | Product contracts — same for Nest / Laravel / Django |
| **GEN** | Produced by apply/bootstrap |
| **REF** | Reference / tutorial |

Base **has no `apps/`**. Framework choice does **not** change the MVP workflow — only the adapter under `stacks/`.

---

## Top-level tree

```text
claude-mvp-template/
├── CLAUDE.md / AGENTS.md
├── stack.config.yaml              TUNE ★ pick nestjs|laravel|django + FE
├── stack.config.examples/         REF ready configs
├── stacks/
│   ├── catalog.json               FIXED allow-list
│   ├── nestjs|laravel|django/     TUNE when extending ecosystem
│   └── react-vite/
├── scripts/validate|apply         FIXED
├── prompts/                       stack-agnostic + init-product
├── .cursor/rules/                 product FIXED + stack-resolution
├── docs/                          EDIT product; REF examples
├── deploy/                        multi-platform + runtime notes
└── tutorial/
```

---

## 1. Entry and AI rules

| Path | Meaning | Edit? |
|---|---|---|
| `CLAUDE.md` | Read order + product contracts | **FIXED** |
| `.cursor/rules/00-immutable.mdc` | Soft-delete, auth cookie, error envelope | **FIXED** |
| `.cursor/rules/05-stack-config.mdc` | Pins + catalog | **FIXED** |
| `.cursor/rules/10-stack-resolution.mdc` | Load `stacks/<framework>/` | **FIXED** |
| `.cursor/rules/20-frontend.mdc` | Defer to FE adapter | **FIXED** thin |
| `.cursor/rules/30-deploy-safety.mdc` | No invent secrets / no auto prod | **FIXED** |

---

## 2. Stack config and adapters

| Path | Meaning | Edit? |
|---|---|---|
| `stack.config.yaml` | Framework + packages + features + deploy | **TUNE** ★ |
| `stack.config.examples/*.yaml` | Nest / Laravel / Django + React samples | **REF** |
| `stacks/catalog.json` | Allow-list backends/frontends | **FIXED** (add entry when adding adapter) |
| `stacks/<fw>/CONVENTION.md` | Map product contracts → framework idioms | **REF** / TUNE with adapter |
| `stacks/<fw>/BOOTSTRAP.md` | Scaffold + runtime/Docker notes | **REF** |
| `stacks/<fw>/packages.example.yaml` | Pin source to copy into config | **REF** |
| `scripts/validate-stack-config.mjs` | Catalog + language↔framework + feature hints | **FIXED** |
| `scripts/apply-stack-config.mjs` | Manifest with `adapters.*` paths | **FIXED** |
| `stack.manifest.json` | Resolved adapters snapshot | **GEN** |

### Config fields

| Field | Edit? | Notes |
|---|---|---|
| `backend.framework` | **EDIT** | `nestjs` \| `laravel` \| `django` |
| `backend.language` | **EDIT** | must match catalog (`typescript` / `php` / `python`) |
| `frontend.framework` | **EDIT** | `react-vite` \| `none` |
| `frontend/backend.packages` | **TUNE** | exact pins; prefer adapter examples |
| `features.*` / `deploy.*` / `database.provider` | **EDIT** | product/ops |
| ~~`presets.profile`~~ | **removed** | use framework fields |

**Adding a fourth backend:** new `stacks/foo/` + catalog entry — do not free-type unknown frameworks.

---

## 3. Product docs

| Path | Meaning | Edit? |
|---|---|---|
| `docs/_blank/*` | Greenfield templates | **EDIT** |
| `docs/features/*` | Feature specs | **EDIT** ★ |
| `docs/_example-taskflow/*` | TaskFlow tutorial | **REF** |
| `prompts/init-product.md` | One-sentence idea → fill blank docs | **REF** |

Keep Architecture **stack-agnostic** in prose; point versions to `stack.config` + adapter.

---

## 4. Prompts

| Path | Meaning |
|---|---|
| `init-product.md` | Domain docs only |
| `bootstrap-from-config.md` | Scaffold via active adapters |
| `generate-input-layer.md` | DTO / FormRequest / Serializer |
| `generate-service.md` / `generate-controller.md` | Per adapter HTTP/service |
| `generate-fe-page.md` | If FE ≠ none |
| `generate-dto.md` | Alias → input-layer |

---

## 5. Deploy

| Path | Meaning | Edit? |
|---|---|---|
| `deploy/PLATFORM-GUIDE.md` | Multi-platform + **runtime by adapter** | **REF** |
| `deploy/kb/` | Runbooks | **REF** |
| `deploy/Dockerfile.api` | **Node/Nest default only** | **TUNE**; Laravel/Django use adapter Docker notes |
| Stubs vercel/railway | Golden path | **TUNE** |

---

## Day workflow

| Day | Touch | Avoid |
|---|---|---|
| 0 | Example config → validate/apply → docs / init-product | Coding apps; wrong adapter |
| 1 | Bootstrap via adapter BOOTSTRAP | Assuming Nest if Laravel selected |
| 2–3 | Feature prompts + adapter layer order | Packages outside config |
| 4 | PLATFORM-GUIDE + matching runtime Dockerfile | Auto prod deploy |

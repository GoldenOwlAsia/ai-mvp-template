# Source map — original files → role in combine

## From mvp_claude

| File | Used for |
|---|---|
| `CLAUDE.md` | Entry pointer + immutable rules |
| `workflow.md` | Phase 0→4 + sample prompts |
| `prompt-strategy.md` | Confirm / checkpoint / negative-constraint PATTERN |
| `best-practice.md` | Docs/prompt/workflow lessons |
| `docs/PRD.md` … `CodingConvention.md` | TaskFlow example + conventions |
| `docs/features/[feature-name].md` | Feature template (fill auth/task/…) |
| `templates/*` | Blank PRD/Arch/DB/API |
| `research/context-loading.md` | How Claude Code loads context |

## From deployment

| File | Used for |
|---|---|
| `README.md` | Claude deploy contract + report format |
| `platform-matrix.md` | Choose platform |
| `environment.md` / `secrets.md` | Env 4 tiers + secret hygiene |
| `ci-cd.md` / `rollback.md` / `troubleshooting.md` | Pipeline + ops |
| `web/vercel.md` | FE golden path |
| `backend/railway.md` + `docker.md` | BE golden path |
| `database/migration.md` (+ supabase.md) | DB safety |
| `mobile/**` | **Advanced** — outside MVP 3–4 days |

## Recorded gaps

- No starter code in either source folder
- No `stack.config` / bootstrap
- `features/*.md` not filled
- Docs over 500 lines (API, UI, CodingConvention)
- deployment missing skill files mentioned in its README

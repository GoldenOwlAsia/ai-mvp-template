# Current gaps & next work

## Gaps

1. Docs-only: no runnable `apps/web` + `apps/api` yet.
2. No real `stack.config.yaml` + schema + scripts yet (in the original combine notes).
3. Feature specs missing (auth/project/task/comment).
4. `.cursor/rules` / `.claude/skills` / `prompts/` not packaged yet.
5. Deploy stubs (Dockerfile, GHA) not materialized — only in `deployment/` markdown.
6. Small inconsistencies in source docs: TaskStatus transitions; DELETE body vs 204; InjectRepository vs Prisma.

## Implementation order (when Agent runs)

1. stack.config + schema + validate/apply + bootstrap prompt
2. CLAUDE.md / rules / prompts skeleton
3. Split blank docs vs `_example-taskflow`; write features
4. Starter Auth + 1 CRUD (versions from config)
5. Golden-path deploy stubs
6. Tutorial Day 0–4 wired to the happy path

---
name: deploy
description: Multi-platform deploy via deploy/PLATFORM-GUIDE and deploy/kb — never autodploy production
---

# Deploy

1. Read `stack.config.yaml` → `deploy` + `database.provider` + `backend.framework`.
2. Read `deploy/PLATFORM-GUIDE.md` §1.1 runtime table + multi-platform map.
3. Read `stacks/<backend.framework>/BOOTSTRAP.md` Runtime/Docker section.
4. If choosing or changing provider → `deploy/kb/platform-matrix.md` then matching runbook.
5. Use `deploy/Dockerfile.api` only for Nest/Node; Laravel/Django need adapter Dockerfiles.
6. Follow `deploy/kb/environment.md` + `secrets.md`. Never invent credentials.
7. Staging/preview + smoke `/health` before production confirmation.
8. Report: platform, runtime adapter, env gaps (names only), smoke, rollback one-liner.
9. Mobile → `deploy/kb/mobile/` only if human asked.

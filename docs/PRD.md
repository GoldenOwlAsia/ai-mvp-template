# TaskFlow — PRD

## Overview

**App:** TaskFlow — Trello-like Kanban for small teams  
**Problem:** Teams lack a shared board view of work; ownership, due dates, and progress are unclear  
**Solution:** Workspaces with boards, lists, and cards; drag-and-drop; roles; email invites; labels, checklists, comments, assignees  
**Stack:** React 18 + Vite + Tailwind + NestJS + Prisma + PostgreSQL + JWT (access memory + refresh httpOnly cookie)  
**Deploy:** Vercel (web) + Railway (api) + local Docker Postgres (dev)  
**Locale:** en

## Personas & Board roles

### Owner
- Creates/owns the board; full control including delete board and transfer ownership  
- **Permissions:** All board actions; manage members/invites/roles; CRUD lists/cards/labels/checklists/comments  
- **Restrictions:** Cannot demote self if sole Owner without transfer

### Admin
- Helps run the board  
- **Permissions:** Manage members/invites (not Owner); CRUD lists/cards/labels/checklists/comments  
- **Restrictions:** Cannot delete board; cannot demote/remove Owner; cannot transfer ownership

### Member
- Day-to-day work on cards  
- **Permissions:** CRUD lists/cards/checklists/comments; assign labels/assignees; DnD  
- **Restrictions:** Cannot manage members/invites/roles

### Viewer
- Read-only stakeholder  
- **Permissions:** View board, lists, cards, comments  
- **Restrictions:** No create/update/delete/move; no member management

### Workspace Owner
- Creates workspace; can create boards in workspace; soft-delete workspace (cascades soft-delete boards)

## Features (P0)

| Feature | Description | Priority | Status |
|---|---|---|---|
| Auth | Register, login, refresh, logout, me | P0 | Todo |
| Workspace | CRUD workspaces; membership | P0 | Todo |
| Board | CRUD boards; members; email invites; roles | P0 | Todo |
| List | CRUD lists; reorder via DnD | P0 | Todo |
| Card | CRUD cards; move/reorder; labels; assignees; dueDate; coverColor | P0 | Todo |
| Checklist | Checklists + items on cards | P0 | Todo |
| Comment | Comments on cards (author edit/delete) | P0 | Todo |

## User flows

### Register / login
1. User registers with email, password, name  
2. Logs in → access token in memory, refresh in httpOnly cookie  
3. Redirected to workspaces

### Invite member
1. Owner/Admin invites email + role on board  
2. Invite stored with token (no SMTP in v1 — token shown/copied in UI)  
3. Invitee registers/logs in with same email → accepts pending invite → becomes BoardMember

### Kanban DnD
1. Member opens board  
2. Drags card within/across lists or reorders lists  
3. PATCH position (and listId for cards) → UI refetches board (no realtime)

## Out of scope (v1)

- Attachments / file upload  
- Realtime / WebSocket  
- Real email SMTP (invite is in-app token)  
- Notifications, calendar, full-text search  
- Power-Ups / automation  
- OAuth / 2FA / password reset  
- Mobile apps

## Docs sync

Any requirement change updates this PRD + affected `docs/features/*`, `Database.md`, `API.md`, `UI.md`, `AcceptanceCriteria.md` before code changes.

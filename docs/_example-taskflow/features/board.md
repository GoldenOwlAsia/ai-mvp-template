# Feature: Board

## Overview
Boards in a workspace. Creator is Board OWNER. Default lists: To Do, Doing, Done. Members + email invites with roles Owner/Admin/Member/Viewer.

## API
See `docs/API.md` Boards section.

## Entities
Board, BoardMember, BoardInvite, List (defaults)

## Business Rules
- Name 1–100
- Create board → BoardMember OWNER + 3 default lists positions 0,1,2
- GET /boards/:id returns nested `lists` (position ASC, deletedAt null) each with `cards` (position ASC, deletedAt null) including labels and assignees
- Invite role cannot be OWNER; token unique; expires in 7 days
- Accept invite: email must match current user; status PENDING; not expired
- Admin cannot remove/demote Owner
- Soft-delete board → soft-delete lists and cards

## Edge Cases
- Not board member → 404 BOARD_NOT_FOUND
- Expired invite → 400 INVITE_EXPIRED
- Wrong email on accept → 403 INVITE_EMAIL_MISMATCH

## Out of Scope
SMTP email send; workspace-level board templates

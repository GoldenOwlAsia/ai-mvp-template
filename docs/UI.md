# TaskFlow — UI

## Screens

| Route | Screen | Notes |
|---|---|---|
| /login | Login | email + password |
| /register | Register | email, password, name |
| / | Workspace list | create workspace |
| /workspaces/:id | Board list | create board |
| /boards/:id | Kanban board | lists + cards + DnD |
| /boards/:id/settings | Members & invites | Owner/Admin |
| (modal) | Card detail | description, due, labels, assignees, checklist, comments, cover |

## Kanban

- Horizontal scroll of lists  
- Each list: title, add card, card stack  
- DnD via `@dnd-kit` (cards across lists; list reorder)  
- After drop: PATCH then invalidate board query  

## Visual

- Tailwind + shadcn primitives  
- Cover color as top bar on card  
- Labels as small color chips  
- Viewer: hide write actions  

## Empty states

- No workspaces / boards / cards — short CTA to create  

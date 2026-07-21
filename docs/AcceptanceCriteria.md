# TaskFlow — Acceptance Criteria

## Auth
- GIVEN valid register input WHEN submit THEN user created AND can login  
- GIVEN wrong password WHEN login THEN 401 INVALID_CREDENTIALS  
- GIVEN soft-deleted user WHEN login THEN 401 USER_INACTIVE  

## Workspace / Board
- GIVEN logged-in user WHEN create workspace THEN they are Workspace OWNER  
- GIVEN workspace member WHEN create board THEN they are Board OWNER and default lists To Do / Doing / Done exist  
- GIVEN Board Owner WHEN soft-delete board THEN lists/cards soft-deleted  

## Roles
- GIVEN Viewer WHEN PATCH card THEN 403 FORBIDDEN  
- GIVEN Member WHEN invite THEN 403 FORBIDDEN  
- GIVEN Admin WHEN delete board THEN 403 FORBIDDEN  
- GIVEN Owner WHEN invite email THEN invite PENDING with token  

## Invite
- GIVEN pending invite for email WHEN that user accepts token THEN BoardMember created AND invite ACCEPTED  

## DnD
- GIVEN Member WHEN move card to other list with position THEN card.listId and position updated  
- GIVEN Member WHEN reorder list THEN list.position updated  

## Card extras
- GIVEN Member WHEN set dueDate, coverColor, labels, assignees THEN persisted  
- GIVEN Member WHEN add checklist items and toggle isDone THEN persisted  
- GIVEN Member WHEN comment THEN visible; only author can PATCH/DELETE comment  

## Soft delete
- Soft-deleted resources return 404 as not found on subsequent GET  

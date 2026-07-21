# Feature: Card

## Overview
Cards in lists. Move/reorder via PATCH. Labels, assignees, dueDate, coverColor.

## API
See `docs/API.md` Cards + Labels.

## Entities
Card, Label, CardLabel, CardAssignee

## Business Rules
- Title 1–200; description optional
- coverColor optional hex `#RRGGBB`
- Move: PATCH `{ listId?, position }` — list must same board
- Assignees must be board members
- Labels belong to board
- Soft delete card only (no hard delete)

## Edge Cases
- Card missing → 404 CARD_NOT_FOUND
- Assignee not board member → 400 INVALID_ASSIGNEE
- Cross-board list move → 400 INVALID_LIST

## Out of Scope
Attachments, cover image upload

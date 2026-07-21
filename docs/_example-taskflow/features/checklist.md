# Feature: Checklist

## Overview
Checklists and items on cards. Toggle isDone.

## API
See `docs/API.md` Checklists.

## Entities
Checklist, ChecklistItem

## Business Rules
- Title required 1–200
- Soft delete checklist soft-deletes items (or filter items by checklist deletedAt)
- Viewer read-only

## Edge Cases
- Card missing → 404 CARD_NOT_FOUND
- Item missing → 404 CHECKLIST_ITEM_NOT_FOUND

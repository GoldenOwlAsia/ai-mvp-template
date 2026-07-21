# Feature: List

## Overview
Lists (columns) on a board. Reorder via position. Soft delete cascades to cards.

## API
| Method | Path | Auth |
|---|---|---|
| GET | /api/v1/boards/:boardId/lists | Board member |
| POST | /api/v1/boards/:boardId/lists | Member+ |
| PATCH | /api/v1/lists/:id | Member+ | name and/or position |
| DELETE | /api/v1/lists/:id | Member+ | soft + cascade cards |

## Entities
List, Card

## Business Rules
- Name 1–100
- New list position = max+1 on board
- Viewer cannot write
- Soft-delete list → soft-delete all cards in list

## Edge Cases
- Board missing → 404 BOARD_NOT_FOUND
- List missing → 404 LIST_NOT_FOUND

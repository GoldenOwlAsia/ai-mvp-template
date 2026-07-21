# TaskFlow — Database

## Enums

### WorkspaceRole
| Value | Description |
|---|---|
| OWNER | Workspace creator / owner |
| MEMBER | Workspace member |

### BoardRole
| Value | Description |
|---|---|
| OWNER | Board owner |
| ADMIN | Admin |
| MEMBER | Member |
| VIEWER | Read-only |

### InviteStatus
| Value | Description |
|---|---|
| PENDING | Awaiting accept |
| ACCEPTED | Accepted |
| REVOKED | Cancelled by inviter |

## Entities

### User
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| email | String | No | — | unique, lowercased |
| password | String | No | — | bcrypt hash |
| name | String | No | — | |
| createdAt | DateTime | No | now() | |
| updatedAt | DateTime | No | updatedAt | |
| deletedAt | DateTime | Yes | null | soft delete |

### RefreshToken
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| tokenHash | String | No | — | |
| userId | String | No | — | FK User |
| expiresAt | DateTime | No | — | |
| revokedAt | DateTime | Yes | null | |
| createdAt | DateTime | No | now() | |

### Workspace
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| name | String | No | — | 1–100 |
| description | String | Yes | null | |
| createdAt | DateTime | No | now() | |
| updatedAt | DateTime | No | updatedAt | |
| deletedAt | DateTime | Yes | null | soft + cascade boards |

### WorkspaceMember
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| workspaceId | String | No | — | FK |
| userId | String | No | — | FK |
| role | WorkspaceRole | No | MEMBER | |
| createdAt | DateTime | No | now() | |
| deletedAt | DateTime | Yes | null | soft |

Unique: (workspaceId, userId) where active.

### Board
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| workspaceId | String | No | — | FK |
| name | String | No | — | 1–100 |
| description | String | Yes | null | |
| createdAt | DateTime | No | now() | |
| updatedAt | DateTime | No | updatedAt | |
| deletedAt | DateTime | Yes | null | soft + cascade lists/cards |

### BoardMember
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| boardId | String | No | — | FK |
| userId | String | No | — | FK |
| role | BoardRole | No | MEMBER | |
| createdAt | DateTime | No | now() | |
| deletedAt | DateTime | Yes | null | soft |

### BoardInvite
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| boardId | String | No | — | FK |
| email | String | No | — | lowercased |
| role | BoardRole | No | MEMBER | not OWNER |
| token | String | No | — | unique |
| status | InviteStatus | No | PENDING | |
| invitedById | String | No | — | FK User |
| expiresAt | DateTime | No | — | |
| createdAt | DateTime | No | now() | |
| deletedAt | DateTime | Yes | null | soft |

### List
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| boardId | String | No | — | FK |
| name | String | No | — | 1–100 |
| position | Int | No | 0 | order |
| createdAt | DateTime | No | now() | |
| updatedAt | DateTime | No | updatedAt | |
| deletedAt | DateTime | Yes | null | soft + cascade cards |

### Card
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| listId | String | No | — | FK |
| title | String | No | — | 1–200 |
| description | String | Yes | null | |
| position | Int | No | 0 | |
| dueDate | DateTime | Yes | null | |
| coverColor | String | Yes | null | hex e.g. #0ea5e9 |
| createdAt | DateTime | No | now() | |
| updatedAt | DateTime | No | updatedAt | |
| deletedAt | DateTime | Yes | null | soft |

### Label
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| boardId | String | No | — | FK |
| name | String | No | — | |
| color | String | No | — | hex |
| createdAt | DateTime | No | now() | |
| deletedAt | DateTime | Yes | null | soft |

### CardLabel
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| cardId | String | No | — | PK composite |
| labelId | String | No | — | PK composite |

### CardAssignee
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| cardId | String | No | — | PK composite |
| userId | String | No | — | PK composite |

### Checklist
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| cardId | String | No | — | FK |
| title | String | No | — | |
| position | Int | No | 0 | |
| createdAt | DateTime | No | now() | |
| deletedAt | DateTime | Yes | null | soft |

### ChecklistItem
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| checklistId | String | No | — | FK |
| title | String | No | — | |
| isDone | Boolean | No | false | |
| position | Int | No | 0 | |
| createdAt | DateTime | No | now() | |
| deletedAt | DateTime | Yes | null | soft |

### Comment
| Field | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | String | No | cuid() | PK |
| cardId | String | No | — | FK |
| authorId | String | No | — | FK User |
| body | String | No | — | 1–2000 |
| createdAt | DateTime | No | now() | |
| updatedAt | DateTime | No | updatedAt | |
| deletedAt | DateTime | Yes | null | soft |

## Indexes

- User.email unique  
- BoardInvite.token unique  
- List (boardId, position), Card (listId, position)  
- Soft-delete filters always include `deletedAt: null`

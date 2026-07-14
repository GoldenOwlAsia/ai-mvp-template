# [Product Name] — Coding Convention

> **How to use this file:**
> - Claude reads this file before writing any code
> - Applies to the entire codebase — Frontend and Backend
> - When adding a new convention → update this file immediately
> - The rules here are mandatory — must not be changed arbitrarily

---

## General Rules

```
✅ TypeScript strict mode — never use `any`
✅ Explicit return type for every function
✅ Immutable first — use const, avoid let unless necessary
✅ Early return — no nested if beyond 2 levels
✅ Single Responsibility — each function does exactly one thing
✅ Max file length: 300 lines — if longer, split the file
✅ Max function length: 50 lines — if longer, split the function
❌ Never use `any`
❌ Never use `// @ts-ignore`
❌ Never leave commented-out code
❌ Never use magic numbers — name them as constants
❌ Never use magic strings — use an enum or constant
```

---

## Naming Convention

### Variables & Functions

```typescript
// camelCase for variables and functions
const userId = 'clx123abc'
const taskList = []
const isLoading = false
const hasPermission = true

// Prefix is/has/can/should for booleans
const isVerified = true
const hasAccess = false
const canDelete = true
const shouldRefetch = false

// Prefix handle for event handlers
const handleSubmit = () => {}
const handleClick = () => {}
const handleInputChange = () => {}

// Prefix on for prop callbacks
interface TaskCardProps {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onStatusChange: (status: TaskStatus) => void
}

// Prefix fetch/get/create/update/delete for async functions
const fetchTasks = async () => {}
const getTaskById = async (id: string) => {}
const createTask = async (data: CreateTaskDto) => {}
const updateTask = async (id: string, data: UpdateTaskDto) => {}
const deleteTask = async (id: string) => {}
```

### Constants

```typescript
// SCREAMING_SNAKE_CASE for constants
const MAX_FILE_SIZE = 10 * 1024 * 1024  // 10MB
const DEFAULT_PAGE_SIZE = 20
const JWT_EXPIRES_IN = '15m'
const DEBOUNCE_DELAY = 300

// Object constant with as const
const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED',
} as const

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
} as const
```

### Types & Interfaces

```typescript
// PascalCase for Type, Interface, Enum, Class
type UserId = string
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'

interface User {
  id: string
  email: string
  name: string
}

// Don't use an I prefix — use a clear name instead of IUser
// ❌ interface IUser {}
// ✅ interface User {}

// Suffix Dto for Data Transfer Objects
interface CreateTaskDto { ... }
interface UpdateTaskDto { ... }

// Suffix Response for API response types
interface TaskResponse { ... }
interface PaginatedResponse<T> { ... }

// Suffix Props for React component props
interface TaskCardProps { ... }
interface PageHeaderProps { ... }

// Enum — PascalCase for the name, SCREAMING_SNAKE_CASE for values
enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}
```

### Files & Folders

```
kebab-case for all files and folders

Frontend:
components/task-card.tsx          ✅
components/TaskCard.tsx           ❌
hooks/use-task-list.ts            ✅
hooks/useTaskList.ts              ❌
pages/project-detail.tsx          ✅

Backend:
modules/task/task.service.ts      ✅
modules/task/taskService.ts       ❌
dto/create-task.dto.ts            ✅
dto/createTask.dto.ts             ❌
```

### React Components

```typescript
// PascalCase for component names
export function TaskCard() { ... }         ✅
export function taskCard() { ... }         ❌
export const TaskCard = () => { ... }      ✅ (function expression is also fine)

// File name = Component name
// TaskCard.tsx contains export function TaskCard
// Don't export multiple components in 1 file (except small helpers)
```

### NestJS

```typescript
// Controller: PascalCase, suffix Controller
@Controller('tasks')
export class TaskController { ... }

// Service: PascalCase, suffix Service
@Injectable()
export class TaskService { ... }

// Module: PascalCase, suffix Module
@Module({...})
export class TaskModule { ... }

// DTO: PascalCase, suffix Dto
export class CreateTaskDto { ... }
export class UpdateTaskDto { ... }
export class QueryTaskDto { ... }

// Guard: PascalCase, suffix Guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { ... }

// Decorator: camelCase for the decorator function
export const CurrentUser = createParamDecorator(...)
export const Roles = (...roles: string[]) => SetMetadata('roles', roles)
```

---

## TypeScript Rules

```typescript
// ✅ Explicit type — don't let TypeScript auto-infer public API types
function getUser(id: string): Promise<User> { ... }

// ✅ Use a type alias for union types
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

// ✅ Use interface for object shapes (extendable)
interface User {
  id: string
  email: string
}

// ✅ Optional chaining — don't manually check for null
const name = user?.profile?.name ?? 'Unknown'

// ✅ Non-null assertion only when certain
const element = document.getElementById('root')!

// ✅ Readonly for immutable objects
interface Config {
  readonly apiUrl: string
  readonly timeout: number
}

// ✅ Generics with a constraint
function getById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id)
}

// ❌ Never use any
const data: any = fetchData()       ❌
const data: unknown = fetchData()   ✅ — use unknown instead of any

// ❌ Never use the Function type
type Handler = Function                    ❌
type Handler = (event: Event) => void      ✅

// ❌ Never use the Object type
type Config = Object                       ❌
type Config = Record<string, unknown>      ✅
```

---

## Frontend Convention

### Component Structure

```typescript
// Required order within a component file
import React, { useState, useEffect } from 'react'     // 1. React imports
import { useNavigate } from 'react-router-dom'          // 2. Third-party imports
import { Button } from '@/components/ui/button'         // 3. Internal UI imports
import { useTaskList } from '../hooks/use-task-list'    // 4. Feature imports
import { TaskCard } from './TaskCard'                   // 5. Component imports
import type { Task } from '../types/task.types'         // 6. Type imports

// 7. Types/interfaces
interface TaskListProps {
  projectId: string
  onTaskClick: (task: Task) => void
}

// 8. Component (default export at the end of the file)
export function TaskList({ projectId, onTaskClick }: TaskListProps) {
  // 8a. Hooks first
  const navigate = useNavigate()
  const { tasks, isLoading, error } = useTaskList(projectId)

  // 8b. State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // 8c. Derived values
  const todoTasks = tasks.filter(t => t.status === 'TODO')

  // 8d. Effects
  useEffect(() => {
    // side effects
  }, [projectId])

  // 8e. Handlers
  const handleTaskClick = (task: Task): void => {
    setSelectedTask(task)
    onTaskClick(task)
  }

  // 8f. Render helpers (if needed)
  const renderEmptyState = () => (
    <EmptyState title="No tasks" />
  )

  // 8g. JSX return
  return (
    <div className="space-y-4">
      {isLoading && <TaskListSkeleton />}
      {!isLoading && tasks.length === 0 && renderEmptyState()}
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => handleTaskClick(task)}
        />
      ))}
    </div>
  )
}
```

### Hooks Convention

```typescript
// Prefix use for every hook
// File: hooks/use-task-list.ts

interface UseTaskListReturn {
  tasks: Task[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useTaskList(projectId: string): UseTaskListReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => taskService.getByProject(projectId),
    enabled: !!projectId,
  })

  return {
    tasks: data?.data ?? [],
    isLoading,
    error,
    refetch,
  }
}

// Mutation hook
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaskDto) => taskService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] })
      toast.success('Task created successfully')
    },
    onError: (error: AxiosError) => {
      toast.error(error.response?.data?.message || 'Failed to create task')
    },
  })
}
```

### Service Convention

```typescript
// File: features/task/services/task.service.ts
// All API calls go through the service layer — never call axios directly inside a component

import { api } from '@/services/axios'
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types/task.types'
import type { PaginatedResponse, ApiResponse } from '@/types/api.types'

export const taskService = {
  getByProject: async (projectId: string): Promise<PaginatedResponse<Task>> => {
    const { data } = await api.get('/tasks', { params: { projectId } })
    return data
  },

  getById: async (id: string): Promise<ApiResponse<Task>> => {
    const { data } = await api.get(`/tasks/${id}`)
    return data
  },

  create: async (dto: CreateTaskDto): Promise<ApiResponse<Task>> => {
    const { data } = await api.post('/tasks', dto)
    return data
  },

  update: async (id: string, dto: UpdateTaskDto): Promise<ApiResponse<Task>> => {
    const { data } = await api.patch(`/tasks/${id}`, dto)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
}
```

### Tailwind Convention

```typescript
// ✅ Group classes in this order: layout → spacing → sizing → visual → interactive
<div className="
  flex items-center gap-4          // layout
  px-4 py-3                        // spacing
  w-full max-w-sm                  // sizing
  bg-white border border-slate-200 rounded-lg shadow-sm  // visual
  hover:shadow-md transition-shadow cursor-pointer        // interactive
">

// ✅ Use cn() for conditional classes
import { cn } from '@/lib/utils'

<div className={cn(
  'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
  isActive && 'bg-indigo-50 text-indigo-600 font-medium',
  isDisabled && 'opacity-50 cursor-not-allowed',
)}>

// ❌ Don't use inline style (except for dynamic values not available in Tailwind)
<div style={{ color: 'red' }}>     ❌
<div className="text-red-500">     ✅

// ❌ The only exception for inline style — a dynamic value
<div style={{ backgroundColor: project.color }}>   ✅ (color from the DB)
```

---

## Backend Convention

### Service Layer

```typescript
// The service contains all business logic
// The controller only handles HTTP — no business logic in the controller

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  // Method name: verb + noun
  async findAll(projectId: string, userId: string, query: QueryTaskDto) {
    // 1. Verify permission
    await this.verifyProjectMember(projectId, userId)

    // 2. Business logic
    const { page = 1, limit = 20, status } = query

    // 3. DB query
    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where: { projectId, status, deletedAt: null },
        include: {
          assignee: { select: { id: true, name: true, avatarUrl: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { position: 'asc' },
      }),
      this.prisma.task.count({
        where: { projectId, status, deletedAt: null },
      }),
    ])

    // 4. Return (don't throw directly here — let the filter handle it)
    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Private helper methods — prefix verify/check/calculate
  private async verifyProjectMember(projectId: string, userId: string): Promise<void> {
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    })
    if (!member) throw new ForbiddenException('You are not a member of this project')
  }
}
```

### Controller Layer

```typescript
// The controller only handles: routing, auth guard, input validation, response format
// No business logic

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async findAll(
    @Query() query: QueryTaskDto,
    @CurrentUser() user: User,
  ) {
    // Only calls the service — no logic here
    return this.taskService.findAll(query.projectId, user.id, query)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.taskService.create(dto, user.id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.taskService.update(id, dto, user.id)
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.remove(id, user.id)
  }
}
```

### DTO Convention

```typescript
// DTOs always have full validation decorators
// Always include a clear error message

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200, { message: 'Title must be at most 200 characters' })
  @Transform(({ value }) => value?.trim())
  title: string

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string

  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string

  @IsString()
  @IsOptional()
  assigneeId?: string

  @IsEnum(TaskPriority, { message: 'Invalid priority value' })
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM

  @IsDateString({}, { message: 'Deadline must be a valid ISO date' })
  @IsOptional()
  deadline?: string
}

// UpdateDto always uses PartialType — don't rewrite every field
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

// QueryDto for pagination + filtering
export class QueryTaskDto {
  @IsString()
  @IsNotEmpty()
  projectId: string

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20
}
```

### Error Handling Convention

```typescript
// Use NestJS built-in exceptions — never throw a raw Error
throw new NotFoundException('Task not found')
throw new ForbiddenException('You do not have permission')
throw new ConflictException('Email already exists')
throw new BadRequestException('Invalid status transition')
throw new UnauthorizedException('Invalid credentials')

// Custom exception code for the client
throw new ConflictException({
  code: 'EMAIL_EXISTS',
  message: 'Email already exists',
})

throw new BadRequestException({
  code: 'INVALID_STATUS_TRANSITION',
  message: `Cannot transition from ${currentStatus} to ${newStatus}`,
})

// Never throw in the controller — only in the service
// Never catch and swallow an error — always re-throw or handle it
```

### Prisma Convention

```typescript
// Always filter out soft-deleted rows
where: { id, deletedAt: null }

// Always select only the fields needed for a nested relation
include: {
  assignee: {
    select: { id: true, name: true, avatarUrl: true }
    // ❌ Never select: password, isVerified, lastLoginAt...
  }
}

// Use $transaction for multi-query operations that need to be atomic
const [tasks, total] = await this.prisma.$transaction([
  this.prisma.task.findMany({ ... }),
  this.prisma.task.count({ ... }),
])

// Soft delete — never hard delete
await this.prisma.task.update({
  where: { id },
  data: { deletedAt: new Date() },
})
// ❌ await this.prisma.task.delete({ where: { id } })
```

---

## Import Order

```typescript
// Import order — applies to both FE and BE
// Separate each group with 1 blank line

// 1. Node built-ins
import path from 'path'
import fs from 'fs'

// 2. Third-party packages
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import bcrypt from 'bcrypt'

// 3. Internal absolute imports (@/)
import { PrismaService } from '@/prisma/prisma.service'
import { CreateTaskDto } from '@/modules/task/dto/create-task.dto'

// 4. Relative imports
import { TaskService } from './task.service'
import type { Task } from './task.types'

// 5. Type-only imports (always at the end)
import type { Request, Response } from 'express'
```

---

## Comment Convention

```typescript
// ✅ Comments explain "why" — not "what"
// Use polling instead of WebSocket to reduce complexity for v1
const REFRESH_INTERVAL = 30_000

// ✅ TODO comments reference a ticket
// TODO: [TASK-123] Cache the result when data exceeds 1000 records

// ✅ JSDoc for public APIs
/**
 * Creates a new task in the project.
 * Automatically sends a notification to the assignee if one is set.
 * @throws ForbiddenException if the user is not a member of the project
 * @throws BadRequestException if the deadline is in the past
 */
async create(dto: CreateTaskDto, userId: string): Promise<Task> { ... }

// ❌ Comments explaining obvious code (code should be self-documenting)
// Loop through the tasks array        ❌
tasks.forEach(task => ...)

// ❌ Commented-out code
// const oldImpl = () => { ... }   ❌ — delete it, use git history instead
```

---

## Testing Convention

```typescript
// Unit test — file: [name].spec.ts
describe('TaskService', () => {
  // Group by method name
  describe('create', () => {
    // it() describes behavior in the format: "should [expected behavior] when [condition]"
    it('should create task successfully when user is project member', async () => {
      // Arrange
      const dto: CreateTaskDto = { title: 'Test task', projectId: 'proj-1' }
      mockPrisma.projectMember.findUnique.mockResolvedValue({ role: 'MEMBER' })
      mockPrisma.task.create.mockResolvedValue({ id: 'task-1', ...dto })

      // Act
      const result = await taskService.create(dto, 'user-1')

      // Assert
      expect(result.data.title).toBe(dto.title)
      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ title: dto.title }),
      })
    })

    it('should throw ForbiddenException when user is not project member', async () => {
      // Arrange
      mockPrisma.projectMember.findUnique.mockResolvedValue(null)

      // Act & Assert
      await expect(
        taskService.create({ title: 'Test', projectId: 'proj-1' }, 'user-1')
      ).rejects.toThrow(ForbiddenException)
    })
  })
})

// E2E test — file: [name].e2e-spec.ts
describe('Tasks API (e2e)', () => {
  describe('POST /api/v1/tasks', () => {
    it('should create task when authenticated member', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ title: 'New task', projectId: testProject.id })
        .expect(201)

      expect(response.body.data).toMatchObject({
        title: 'New task',
        status: 'TODO',
        priority: 'MEDIUM',
      })
    })
  })
})
```

---

## Git Convention

### Branch Naming

```
feature/[ticket-id]-[short-description]
bugfix/[ticket-id]-[short-description]
hotfix/[ticket-id]-[short-description]
chore/[description]

Examples:
feature/TASK-123-implement-login
bugfix/TASK-456-fix-token-refresh
hotfix/TASK-789-fix-prod-crash
chore/update-dependencies
```

### Commit Message

```
[type]([scope]): [description]

type:
  feat     — a new feature
  fix      — bug fix
  chore    — doesn't affect logic (update deps, config...)
  refactor — refactor without adding a feature or fixing a bug
  test     — add or fix tests
  docs     — add or fix docs
  style    — formatting, spacing (doesn't affect logic)

Examples:
feat(task): add create task endpoint
fix(auth): handle token refresh race condition
chore(deps): update prisma to v5.8
test(task): add e2e test for task CRUD
docs(api): update task endpoint documentation
refactor(task): extract permission check to helper
```

---

## Anti-patterns — Don't do this

```typescript
// ❌ Business logic in the controller
@Post()
async create(@Body() dto: CreateTaskDto, @CurrentUser() user: User) {
  const member = await this.prisma.projectMember.findUnique(...)  // ❌ Logic in the controller
  if (!member) throw new ForbiddenException(...)
  return this.prisma.task.create(...)
}
// ✅ Move it all into the service

// ❌ Returning a raw Prisma object (may contain sensitive fields)
return await this.prisma.user.findUnique({ where: { id } })  // ❌ Returns the password too
// ✅ Select explicitly
return await this.prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, name: true, role: true }
})

// ❌ Hardcoded string in a condition
if (user.role === 'admin') { ... }     ❌
if (user.role === UserRole.ADMIN) { ... }  ✅

// ❌ Magic number
setTimeout(callback, 900000)           ❌
setTimeout(callback, 15 * 60 * 1000)  ✅ — 15 minutes

// ❌ Nested ternary
const label = a ? b ? 'x' : 'y' : 'z'   ❌
// ✅ Early return or clear if/else

// ❌ Direct DOM manipulation in React
document.getElementById('title').value = ''   ❌
// ✅ State or ref
form.reset()

// ❌ Leftover console.log for debugging
console.log('user:', user)   ❌ — don't commit this
// ✅ Logger service (backend) or remove it (frontend)
this.logger.debug(`User ${user.id} created task`)
```

---

## References

- PRD: `docs/PRD.md`
- Architecture: `docs/Architecture.md`
- API Spec: `docs/API.md`
- UI Design System: `docs/UI.md`

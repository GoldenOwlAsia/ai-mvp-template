# [Product Name] — UI Design System

> **How to use this file:**
> - Delete every `>` (note) block before using this for real
> - Claude reads this file when: generating a component, page, layout, or form
> - When adding a new component → update this file immediately
> - Most important rule: use an existing component first, don't create a new one if one already exists

---

## Stack & Libraries

> Claude knows which library to use, without importing extras.

**UI Library:** shadcn/ui (base) + Tailwind CSS (utility)
**Icon:** Lucide React — `import { IconName } from 'lucide-react'`
**Form:** React Hook Form + Zod
**Toast:** Sonner — `import { toast } from 'sonner'`
**Date:** date-fns
**Drag & Drop:** @dnd-kit/core (Kanban board)

### Import Convention

```typescript
// shadcn/ui components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Lucide icons
import { Plus, Trash2, Edit, ChevronDown, X, Check } from 'lucide-react'

// Custom components
import { TaskCard } from '@/features/task/components/TaskCard'
import { PageHeader } from '@/components/common/PageHeader'
```

---

## Design Tokens

> Claude uses these exact tokens — no hard-coded colors, spacing, or fonts.

### Colors

```css
/* Brand */
--primary: #6366f1        /* Indigo — CTA, active state */
--primary-hover: #4f46e5  /* Darker indigo — hover */
--primary-foreground: #ffffff

/* Semantic */
--success: #10b981        /* Green — done, success */
--warning: #f59e0b        /* Amber — deadline approaching, warning */
--danger: #ef4444         /* Red — delete, error, urgent */
--info: #3b82f6           /* Blue — info, in progress */

/* Neutral */
--background: #ffffff
--foreground: #0f172a
--muted: #f1f5f9          /* Background for secondary elements */
--muted-foreground: #64748b
--border: #e2e8f0
--card: #ffffff
--card-foreground: #0f172a
```

### Tailwind Color Classes — Follow this convention

```
Primary:    bg-indigo-600    text-indigo-600    border-indigo-600
Success:    bg-emerald-500   text-emerald-500   border-emerald-500
Warning:    bg-amber-500     text-amber-500     border-amber-500
Danger:     bg-red-500       text-red-500       border-red-500
Info:       bg-blue-500      text-blue-500      border-blue-500
Muted:      bg-slate-100     text-slate-500     border-slate-200
```

### Spacing Scale

```
xs:   4px   → gap-1, p-1, m-1
sm:   8px   → gap-2, p-2, m-2
md:   16px  → gap-4, p-4, m-4   ← default padding
lg:   24px  → gap-6, p-6, m-6
xl:   32px  → gap-8, p-8, m-8
2xl:  48px  → gap-12, p-12, m-12
```

### Typography

```
Display:    text-3xl font-bold tracking-tight    ← Page title
Heading:    text-xl font-semibold               ← Section heading
Subheading: text-base font-medium               ← Card title
Body:       text-sm text-slate-700              ← Default text
Caption:    text-xs text-slate-500              ← Helper text, timestamp
```

### Border Radius

```
sm:   rounded     → 4px   ← Badge, tag
md:   rounded-md  → 6px   ← Button, input (default)
lg:   rounded-lg  → 8px   ← Card, dialog
xl:   rounded-xl  → 12px  ← Large card
full: rounded-full        ← Avatar, pill badge
```

### Shadows

```
Card:   shadow-sm
Modal:  shadow-lg
Hover:  shadow-md (on hover)
```

---

## Layout System

### App Layout

```
┌─────────────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Main Content (flex-1) │
│                         │                        │
│  Logo                   │  Header (56px)         │
│  Navigation             │  ─────────────────     │
│  ─────────────          │  Page Content          │
│  User Profile           │  (scrollable)          │
└─────────────────────────────────────────────────┘
```

```typescript
// Use AppLayout for all protected routes
// File: src/layouts/AppLayout.tsx
<AppLayout>
  <PageContent />
</AppLayout>

// Use AuthLayout for login, register
// File: src/layouts/AuthLayout.tsx
<AuthLayout>
  <LoginForm />
</AuthLayout>
```

### Page Structure Convention

```typescript
// Every page follows this structure
export default function TasksPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header: title + actions */}
      <PageHeader
        title="Tasks"
        description="Manage tasks in this project"
        action={<Button><Plus className="w-4 h-4 mr-2" />New Task</Button>}
      />

      {/* Filter bar (if any) */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <TaskList tasks={tasks} />
      </div>
    </div>
  )
}
```

### Responsive Breakpoints

```
Mobile:   < 768px   → Stack layout, hide sidebar
Tablet:   768-1024px → Collapsed sidebar
Desktop:  > 1024px  → Full sidebar (240px)
```

---

## Component Library

> Use existing components — don't create a new one if one already exists.
> When creating a new component → add it to this file.

---

### Buttons

```typescript
// Primary — main CTA
<Button>Save Changes</Button>
<Button size="sm">Add Task</Button>
<Button size="lg">Get Started</Button>

// Secondary
<Button variant="outline">Cancel</Button>

// Destructive — delete, remove
<Button variant="destructive">Delete Project</Button>

// Ghost — subtle action
<Button variant="ghost">
  <Edit className="w-4 h-4" />
</Button>

// Loading state — always show while submitting
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
  Save Changes
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Trash2 className="w-4 h-4 text-red-500" />
</Button>
```

**Rule:**
- Always disable + show a spinner while loading
- Destructive actions always use `variant="destructive"`
- Never place two primary buttons next to each other

---

### Form Inputs

```typescript
// Text input with label and error
<div className="space-y-2">
  <Label htmlFor="title">Task Title</Label>
  <Input
    id="title"
    placeholder="Enter task title..."
    {...register('title')}
  />
  {errors.title && (
    <p className="text-sm text-red-500">{errors.title.message}</p>
  )}
</div>

// Textarea
<div className="space-y-2">
  <Label htmlFor="description">Description</Label>
  <Textarea
    id="description"
    placeholder="Add description (markdown supported)..."
    rows={4}
    {...register('description')}
  />
</div>

// Select
<Select onValueChange={(value) => setValue('status', value)}>
  <SelectTrigger>
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="TODO">Todo</SelectItem>
    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
    <SelectItem value="DONE">Done</SelectItem>
  </SelectContent>
</Select>
```

**Rule:**
- Always include a `Label` for every input
- Error message directly below the input, text-red-500
- Placeholder describes the expected format, not a repeat of the label
- Never leave an input without a label (accessibility)

---

### Cards

```typescript
// Default card
<Card>
  <CardHeader>
    <CardTitle>Project Alpha</CardTitle>
    <CardDescription>5 members · 23 tasks</CardDescription>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
  <CardFooter className="flex justify-between">
    <span className="text-xs text-slate-500">Updated 2 days ago</span>
    <Button variant="outline" size="sm">View</Button>
  </CardFooter>
</Card>

// Clickable card
<Card
  className="cursor-pointer hover:shadow-md transition-shadow"
  onClick={() => navigate(`/projects/${project.id}`)}
>
  {/* content */}
</Card>

// Task card — used in Kanban
<TaskCard
  task={task}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

### Dialogs & Modals

```typescript
// Confirm dialog — used for destructive actions
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Project</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Project?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete "Project Alpha" and all its tasks.
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        className="bg-red-500 hover:bg-red-600"
        onClick={handleDelete}
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// Form dialog — create/edit
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-[480px]">
    <DialogHeader>
      <DialogTitle>Create New Task</DialogTitle>
    </DialogHeader>
    <TaskForm onSuccess={() => setOpen(false)} />
  </DialogContent>
</Dialog>
```

**Rule:**
- Destructive actions always use `AlertDialog` (2-step confirm), never `Dialog`
- Form dialog width: `sm:max-w-[480px]` for simple forms, `sm:max-w-[640px]` for complex forms
- Always include a Cancel button in every dialog

---

### Badges & Status

```typescript
// TaskStatus badge — use the correct color per status
const STATUS_CONFIG = {
  TODO:        { label: 'Todo',        className: 'bg-slate-100 text-slate-600' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
  DONE:        { label: 'Done',        className: 'bg-emerald-100 text-emerald-700' },
  CANCELLED:   { label: 'Cancelled',   className: 'bg-red-100 text-red-600' },
}

<Badge className={STATUS_CONFIG[task.status].className}>
  {STATUS_CONFIG[task.status].label}
</Badge>

// Priority badge
const PRIORITY_CONFIG = {
  LOW:    { label: 'Low',    className: 'bg-slate-100 text-slate-500' },
  MEDIUM: { label: 'Medium', className: 'bg-amber-100 text-amber-700' },
  HIGH:   { label: 'High',   className: 'bg-orange-100 text-orange-700' },
  URGENT: { label: 'Urgent', className: 'bg-red-100 text-red-700' },
}

// Role badge
<Badge variant="outline">Owner</Badge>
<Badge variant="secondary">Member</Badge>
```

---

### Avatar

```typescript
// Single avatar
<Avatar className="w-8 h-8">
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs font-medium">
    {user.name.slice(0, 2).toUpperCase()}
  </AvatarFallback>
</Avatar>

// Avatar with tooltip
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <Avatar className="w-6 h-6">...</Avatar>
    </TooltipTrigger>
    <TooltipContent>{user.name}</TooltipContent>
  </Tooltip>
</TooltipProvider>

// Avatar group (member list)
<div className="flex -space-x-2">
  {members.slice(0, 3).map(member => (
    <Avatar key={member.id} className="w-6 h-6 border-2 border-white">
      <AvatarFallback>{member.name.slice(0,2).toUpperCase()}</AvatarFallback>
    </Avatar>
  ))}
  {members.length > 3 && (
    <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white
                    flex items-center justify-center text-xs text-slate-600">
      +{members.length - 3}
    </div>
  )}
</div>
```

---

### Loading States

```typescript
// Page loading — use Skeleton
<div className="space-y-4">
  <Skeleton className="h-8 w-48" />       // Title
  <Skeleton className="h-4 w-full" />     // Line
  <Skeleton className="h-4 w-3/4" />      // Short line
</div>

// Button loading — inline spinner
<Button disabled={isLoading}>
  {isLoading
    ? <Loader2 className="w-4 h-4 animate-spin" />
    : <Plus className="w-4 h-4" />
  }
  {isLoading ? 'Creating...' : 'Create Task'}
</Button>

// List loading — skeleton cards
{isLoading
  ? Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="h-24 w-full rounded-lg" />
    ))
  : tasks.map(task => <TaskCard key={task.id} task={task} />)
}
```

**Rule:**
- Always show a loading state — never let the UI freeze
- Skeleton for page load, Spinner for button actions
- Disable the button while loading

---

### Empty States

```typescript
// Empty state component
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center
                  justify-center mb-4">
    <ClipboardList className="w-6 h-6 text-slate-400" />
  </div>
  <h3 className="text-sm font-medium text-slate-900 mb-1">No tasks yet</h3>
  <p className="text-sm text-slate-500 mb-4">
    Get started by creating your first task.
  </p>
  <Button size="sm" onClick={onCreateTask}>
    <Plus className="w-4 h-4 mr-2" />
    Create Task
  </Button>
</div>
```

**Rule:**
- Always show an empty state when the list is empty
- Include: icon, title, description, CTA action
- Never leave an empty list with nothing shown

---

### Error States

```typescript
// Inline field error
<p className="text-sm text-red-500 mt-1">{errors.title?.message}</p>

// Toast notifications — use Sonner
import { toast } from 'sonner'

// Success
toast.success('Task created successfully')

// Error
toast.error('Failed to create task. Please try again.')

// Promise (loading → success/error automatically)
toast.promise(createTask(data), {
  loading: 'Creating task...',
  success: 'Task created successfully',
  error: 'Failed to create task',
})

// API error handling convention
const handleSubmit = async (data) => {
  try {
    await createTask(data)
    toast.success('Task created successfully')
    onSuccess()
  } catch (error) {
    const message = error?.response?.data?.message || 'Something went wrong'
    toast.error(message)
  }
}
```

**Rule:**
- Form validation errors: inline below the field
- API errors: toast (never use alert)
- Always use toast.promise for async actions
- Use the API's error message if available, fallback to "Something went wrong"

---

### Dropdown Menus

```typescript
// Action menu — 3-dot button
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="w-4 h-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={onEdit}>
      <Edit className="w-4 h-4 mr-2" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      className="text-red-600 focus:text-red-600"
      onClick={onDelete}
    >
      <Trash2 className="w-4 h-4 mr-2" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Rule:**
- Destructive items always at the bottom, separated by a separator
- Destructive items in red: `className="text-red-600 focus:text-red-600"`
- The trigger is always a ghost icon button

---

## Feature Components

> Complex components dedicated to specific features.
> Don't recreate them if they already exist in this list.

### Task Components

| Component | File | Used for |
|---|---|---|
| `TaskCard` | `features/task/components/TaskCard.tsx` | Task card in Kanban + List |
| `TaskForm` | `features/task/components/TaskForm.tsx` | Form for creating and editing tasks |
| `TaskDetail` | `features/task/components/TaskDetail.tsx` | Task detail drawer |
| `TaskStatusBadge` | `features/task/components/TaskStatusBadge.tsx` | Status badge with color |
| `TaskPriorityBadge` | `features/task/components/TaskPriorityBadge.tsx` | Priority badge with color |
| `AssigneePicker` | `features/task/components/AssigneePicker.tsx` | Dropdown for choosing an assignee |
| `DeadlinePicker` | `features/task/components/DeadlinePicker.tsx` | Date picker for the deadline |

### Project Components

| Component | File | Used for |
|---|---|---|
| `ProjectCard` | `features/project/components/ProjectCard.tsx` | Project card in a list |
| `ProjectForm` | `features/project/components/ProjectForm.tsx` | Form for creating and editing projects |
| `MemberList` | `features/project/components/MemberList.tsx` | List of members |
| `InviteMemberForm` | `features/project/components/InviteMemberForm.tsx` | Form for inviting a member |

### Common Components

| Component | File | Used for |
|---|---|---|
| `PageHeader` | `components/common/PageHeader.tsx` | Header for every page |
| `FilterBar` | `components/common/FilterBar.tsx` | Filter + search bar |
| `EmptyState` | `components/common/EmptyState.tsx` | Empty list state |
| `ConfirmDialog` | `components/common/ConfirmDialog.tsx` | Confirm a destructive action |
| `UserAvatar` | `components/common/UserAvatar.tsx` | Avatar + fallback |
| `DateDisplay` | `components/common/DateDisplay.tsx` | Formatted + relative date |

---

## Form Convention

> Every form must follow this pattern — React Hook Form + Zod.

```typescript
// Standard pattern for every form
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 1. Define the schema with Zod
const taskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters')
    .trim(),
  description: z.string().max(2000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  deadline: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

// 2. useForm with zodResolver
const form = useForm<TaskFormData>({
  resolver: zodResolver(taskSchema),
  defaultValues: {
    title: '',
    priority: 'MEDIUM',
  },
})

// 3. Submit handler
const onSubmit = async (data: TaskFormData) => {
  try {
    await createTask(data)
    toast.success('Task created successfully')
    form.reset()
    onSuccess?.()
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to create task')
  }
}

// 4. Render
return (
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="title">Title *</Label>
      <Input id="title" {...form.register('title')} />
      {form.formState.errors.title && (
        <p className="text-sm text-red-500">
          {form.formState.errors.title.message}
        </p>
      )}
    </div>

    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        Create Task
      </Button>
    </div>
  </form>
)
```

---

## Accessibility Rules

> Claude must follow all of these rules — never skip them for "speed".

```
✅ Every input must have a Label linked via htmlFor + id
✅ Every icon button must have an aria-label
✅ Loading states must have aria-busy="true"
✅ Error messages must have role="alert"
✅ Dialogs must trap focus inside them
✅ Color must never be the only way to convey information
   (status badges have both icon/text, not just color)
❌ Never use div onClick instead of a button
❌ Never omit alt text for img
```

```typescript
// Icon button with aria-label
<Button variant="ghost" size="icon" aria-label="Delete task">
  <Trash2 className="w-4 h-4" />
</Button>

// Error message with role alert
<p className="text-sm text-red-500" role="alert">
  {errors.title?.message}
</p>
```

---

## Animation Convention

```typescript
// Transition — only use for interactive elements
className="transition-colors duration-150"   // Color change
className="transition-shadow duration-150"   // Shadow change
className="transition-all duration-200"      // Multiple props

// Don't animate layout shifts (avoid CLS)
// Don't use animation on the critical path
```

---

## Anti-patterns — Don't do this

```typescript
// ❌ Hard-coded color
<div className="text-[#6366f1]">...</div>
// ✅ Use a design token
<div className="text-indigo-600">...</div>

// ❌ Creating a new component when one already exists
const MyButton = styled.button`...`
// ✅ Use the shadcn Button with a variant

// ❌ Omitting the loading state
<Button onClick={handleSubmit}>Save</Button>
// ✅ Show loading
<Button onClick={handleSubmit} disabled={isLoading}>
  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
  Save
</Button>

// ❌ Omitting the empty state
{tasks.length > 0 && tasks.map(task => <TaskCard key={task.id} task={task} />)}
// ✅ Always include an empty state
{tasks.length === 0
  ? <EmptyState title="No tasks" description="..." onAction={onCreate} />
  : tasks.map(task => <TaskCard key={task.id} task={task} />)
}

// ❌ Alert for errors
alert('Something went wrong')
// ✅ Toast
toast.error('Something went wrong')

// ❌ Confirm with window.confirm
if (window.confirm('Delete?')) handleDelete()
// ✅ AlertDialog component
<ConfirmDialog onConfirm={handleDelete} />
```

---

## References

- PRD: `docs/PRD.md`
- Architecture: `docs/Architecture.md`
- API Spec: `docs/API.md`
- Coding Convention: `docs/CodingConvention.md`

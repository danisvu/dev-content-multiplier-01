# UI Components Library

Comprehensive UI component system cho Content Ideas Manager. Tất cả components đều tương thích với theme (light/dark mode), TypeScript typed, và dễ tái sử dụng.

## 📦 Installation & Setup

Components đã được setup sẵn. Để sử dụng:

```tsx
// Import từ @/components/ui
import { Button, Card, Badge, EmptyState, Modal } from '@/components/ui'

// Toast helpers
import { toast, toastSuccess, toastError } from '@/lib/toast'
```

## 📚 Component List

### 1. **Toast.tsx** - Toast Notifications

**Features:**
- ✅ Dùng Sonner cho smooth animations
- ✅ Hook `toast()` có thể gọi từ bất kỳ đâu
- ✅ Variants: success/error/info
- ✅ Tự động biến mất sau 3 giây (customizable)
- ✅ Vị trí: góc phải trên màn hình
- ✅ Theme-aware colors

**Setup trong Layout:**
```tsx
// app/layout.tsx
import { Toaster } from '@/components/ui'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

**Usage:**
```tsx
import { toast, toastSuccess, toastError, toastInfo } from '@/lib/toast'

// Simple success toast
toastSuccess('Saved!', 'Your changes have been saved.')

// Error toast
toastError('Error!', 'Something went wrong.')

// Info toast
toastInfo('Info', 'Here is some information.')

// Custom toast with options
toast({
  title: 'Custom Toast',
  description: 'This is a custom toast',
  variant: 'success',
  duration: 5000 // 5 seconds
})
```

**Props:**
- `title` (string, required): Toast title
- `description` (string, optional): Toast description
- `variant` ('success' | 'error' | 'info'): Toast type
- `duration` (number, default: 3000): Duration in milliseconds

---

### 2. **EmptyState.tsx** - Empty State Display

**Features:**
- ✅ Customizable icon (Lucide icons)
- ✅ Title, description, action button
- ✅ Multiple sizes: sm/md/lg
- ✅ Multiple variants: default/minimal
- ✅ Center trong container
- ✅ Framer Motion animations
- ✅ Theme-aware

**Usage:**
```tsx
import { EmptyState } from '@/components/ui'
import { Lightbulb } from 'lucide-react'

<EmptyState
  icon={Lightbulb}
  title="No items found"
  description="Create your first item to get started."
  actionLabel="Create Item"
  onAction={() => handleCreate()}
  size="md"
  variant="default"
/>
```

**Props:**
```typescript
interface EmptyStateProps {
  icon?: LucideIcon           // Icon từ lucide-react
  title: string               // Tiêu đề (required)
  description: string         // Mô tả (required)
  actionLabel?: string        // Label cho button
  onAction?: () => void       // Callback khi click button
  className?: string          // Custom className
  iconClassName?: string      // Custom icon className
  variant?: 'default' | 'minimal'  // Style variant
  size?: 'sm' | 'md' | 'lg'   // Size
}
```

---

### 3. **SkeletonList.tsx** - Loading Skeletons

**Features:**
- ✅ Shimmer animation với custom gradient
- ✅ Multiple types: ideas/briefs/drafts/default
- ✅ Customizable count
- ✅ Responsive grid layout
- ✅ Dùng `animate-pulse` và `animate-shimmer`

**Usage:**
```tsx
import { SkeletonList } from '@/components/ui'

function MyPage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  if (loading) {
    return <SkeletonList count={6} type="ideas" />
  }

  return <ItemsList items={items} />
}
```

**Props:**
```typescript
interface SkeletonListProps {
  count?: number              // Số lượng skeleton items (default: 6)
  type?: 'ideas' | 'briefs' | 'drafts' | 'default'  // Type
  className?: string          // Custom className
}
```

**Available Types:**
- `ideas`: Skeleton cho idea cards
- `briefs`: Skeleton cho brief cards
- `drafts`: Skeleton cho draft cards
- `default`: Generic skeleton

---

### 4. **ThemeToggle.tsx** - Theme Switcher

**Features:**
- ✅ Sun/Moon icons từ Lucide
- ✅ Dropdown menu: Light/Dark/System
- ✅ Lưu vào `localStorage`
- ✅ Tương thích với `next-themes`
- ✅ Smooth transitions

**Usage:**
```tsx
import { ThemeToggle } from '@/components/ui'

// In header or sidebar
<ThemeToggle className="ml-auto" />
```

**Props:**
```typescript
interface ThemeToggleProps {
  className?: string  // Custom className để đặt vị trí
}
```

---

### 5. **Modal.tsx** - Dialog & Confirmation Modals

**Features:**
- ✅ Base Modal component
- ✅ ConfirmDialog variant (với icon)
- ✅ DeleteDialog variant (destructive style)
- ✅ Loading state support
- ✅ Customizable buttons
- ✅ Theme-aware

**Usage:**

**Basic Modal:**
```tsx
import { Modal } from '@/components/ui'

const [isOpen, setIsOpen] = useState(false)

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to do this?"
  confirmLabel="Confirm"
  cancelLabel="Cancel"
  onConfirm={async () => {
    await handleAction()
  }}
/>
```

**Confirm Dialog:**
```tsx
import { ConfirmDialog } from '@/components/ui'

<ConfirmDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="This action cannot be undone."
  onConfirm={handleConfirm}
/>
```

**Delete Dialog:**
```tsx
import { DeleteDialog } from '@/components/ui'

<DeleteDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Delete Item"
  itemName="Content Idea #123"
  onConfirm={handleDelete}
/>
```

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  confirmLabel?: string       // Default: 'Xác nhận'
  cancelLabel?: string        // Default: 'Hủy'
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  variant?: 'default' | 'destructive'
  isLoading?: boolean
  icon?: React.ReactNode
  showCancel?: boolean        // Default: true
}
```

---

### 6. **Badge.tsx** - Status Badges

**Features:**
- ✅ Multiple variants: default/secondary/destructive/success/warning/info
- ✅ Status-specific variants: draft/review/approved/published
- ✅ StatusBadge helper component (with icons)
- ✅ Theme-aware colors
- ✅ Automatic color mapping

**Usage:**

**Standard Badges:**
```tsx
import { Badge } from '@/components/ui'

<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="warning">Warning</Badge>
```

**Status Badges:**
```tsx
import { StatusBadge } from '@/components/ui'

<StatusBadge status="draft" />      // 📝 Draft
<StatusBadge status="review" />     // 👀 Review
<StatusBadge status="approved" />   // ✅ Approved
<StatusBadge status="published" />  // 🚀 Published
```

**Props:**
```typescript
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 
            'success' | 'warning' | 'info' | 
            'draft' | 'review' | 'approved' | 'published'
  className?: string
}

interface StatusBadgeProps {
  status: 'draft' | 'review' | 'approved' | 'published'
  className?: string
}
```

---

## 🎨 Theme Support

Tất cả components tự động hỗ trợ light/dark mode:

- **Colors**: Sử dụng theme tokens (`bg-card`, `text-foreground`, `text-muted-foreground`)
- **Transitions**: Smooth transitions khi đổi theme
- **Persistence**: Theme được lưu vào `localStorage`
- **System preference**: Support system theme preference

## 📝 Best Practices

### 1. Toast Notifications

```tsx
// ✅ Good: Descriptive messages
toastSuccess('Saved!', 'Your idea has been saved successfully.')

// ❌ Bad: Vague messages
toast({ title: 'Done' })
```

### 2. EmptyState

```tsx
// ✅ Good: With action
<EmptyState
  icon={Lightbulb}
  title="No ideas yet"
  description="Create your first idea to get started."
  actionLabel="Create Idea"
  onAction={handleCreate}
/>

// ✅ Good: Without action (informational)
<EmptyState
  icon={Search}
  title="No results"
  description="Try adjusting your search filters."
  variant="minimal"
/>
```

### 3. Modal Confirmations

```tsx
// ✅ Good: Clear confirmation for destructive actions
<DeleteDialog
  isOpen={isOpen}
  onClose={onClose}
  title="Delete Idea"
  itemName={idea.title}
  onConfirm={handleDelete}
/>

// ✅ Good: Async operations with loading state
const [loading, setLoading] = useState(false)

<Modal
  isOpen={isOpen}
  isLoading={loading}
  onConfirm={async () => {
    setLoading(true)
    await deleteIdea()
    setLoading(false)
  }}
/>
```

### 4. Skeleton Loading

```tsx
// ✅ Good: Match skeleton type to content
{loading ? (
  <SkeletonList count={6} type="ideas" />
) : (
  <IdeaGrid ideas={ideas} />
)}

// ✅ Good: Same layout as actual content
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {loading ? (
    <SkeletonList count={6} type="ideas" />
  ) : (
    ideas.map(idea => <IdeaCard key={idea.id} idea={idea} />)
  )}
</div>
```

### 5. Status Badges

```tsx
// ✅ Good: Use StatusBadge for content status
<StatusBadge status={content.status} />

// ✅ Good: Use Badge variants for other indicators
<Badge variant="success">New</Badge>
<Badge variant="warning">Expiring Soon</Badge>
```

## 🔄 Common Patterns

### Pattern 1: CRUD Operations với Toast

```tsx
const handleCreate = async (data) => {
  try {
    await createItem(data)
    toastSuccess('Created!', 'Item has been created.')
    router.push('/items')
  } catch (error) {
    toastError('Error', error.message)
  }
}
```

### Pattern 2: Delete Confirmation

```tsx
const [deleteId, setDeleteId] = useState<string | null>(null)

<DeleteDialog
  isOpen={!!deleteId}
  onClose={() => setDeleteId(null)}
  title="Delete Item"
  itemName={items.find(i => i.id === deleteId)?.title}
  onConfirm={async () => {
    await deleteItem(deleteId)
    toastSuccess('Deleted!', 'Item has been deleted.')
    refetch()
  }}
/>
```

### Pattern 3: Loading States

```tsx
function MyPage() {
  const { data, isLoading, error } = useQuery()

  if (isLoading) {
    return <SkeletonList count={6} type="ideas" />
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Error Loading Data"
        description={error.message}
        actionLabel="Retry"
        onAction={() => refetch()}
      />
    )
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Lightbulb}
        title="No items"
        description="Create your first item."
        actionLabel="Create"
        onAction={handleCreate}
      />
    )
  }

  return <ItemsList items={data} />
}
```

## 🎯 Demo Page

Xem tất cả components trong action tại: `/ui-demo`

```tsx
// Visit in browser
http://localhost:3000/ui-demo
```

Demo page bao gồm:
- ✅ Interactive examples cho mỗi component
- ✅ Code snippets
- ✅ Props documentation
- ✅ Best practices
- ✅ Common use cases

## 📦 Exports

Tất cả exports có sẵn từ `@/components/ui`:

```tsx
// Components
import {
  Button,
  Card,
  Badge,
  StatusBadge,
  EmptyState,
  SkeletonList,
  ThemeToggle,
  Modal,
  ConfirmDialog,
  DeleteDialog,
  Toaster,
  // ... và nhiều hơn
} from '@/components/ui'

// Toast helpers
import { 
  toast, 
  toastSuccess, 
  toastError, 
  toastInfo 
} from '@/lib/toast'

// Types
import type {
  BadgeProps,
  StatusBadgeProps,
  ContentStatus,
  EmptyStateProps,
  ModalProps,
  // ...
} from '@/components/ui'
```

## 🔗 Related Documentation

- [ANIMATIONS.md](./ANIMATIONS.md) - Framer Motion animations
- [CONFETTI.md](./CONFETTI.md) - Success confetti
- [EMPTY-STATES.md](./EMPTY-STATES.md) - EmptyState variants
- [Theme Guide](./THEME.md) - Theme customization

## 📄 License

Part of Content Ideas Manager project.


# 🎴 IdeaCard Component - Complete Guide

## Tổng Quan

Component **IdeaCard** là một card component hoàn chỉnh để hiển thị thông tin ý tưởng (idea) với đầy đủ tính năng: **Status badges, Actions menu, Loading states, Toast notifications, Animations**.

---

## ✨ Features

### 1. **Information Display**
- Title (truncate nếu quá dài)
- Description (line-clamp-2)
- Rationale với styled box
- Persona và Industry tags
- Created date

### 2. **Status Badges**
6 loại status với màu sắc riêng:
- **Draft** (Nháp): Gray - 📝
- **Selected** (Đã chọn): Blue - ✅
- **Archived** (Lưu trữ): Red - 🗄️
- **Rejected** (Từ chối): Red - ❌
- **Pending** (Chờ xử lý): Yellow - ⏳
- **Generated** (Đã tạo Brief): Green - 📄

### 3. **Actions Dropdown**
- **View** (Xem chi tiết): Eye icon
- **Edit** (Chỉnh sửa): Edit2 icon
- **Select & Create Brief**: FileText icon
  - Chỉ enable khi status = 'selected'
  - Hiển thị hint text nếu disabled
- **Delete** (Xóa): Trash2 icon (red)

### 4. **Loading States**
- Loading overlay với backdrop blur
- Spinning loader (Loader2 icon)
- Current action text display
- Disable tất cả buttons khi loading
- Card opacity giảm + cursor wait

### 5. **Toast Notifications**
- **Success toast**: Green, 3s duration
- **Error toast**: Red, 4s duration
- Custom descriptions
- Auto-dismiss

### 6. **Animations**
- **Initial**: Fade in + slide up
- **Hover**: Scale 1.02 + lift up 4px
- **Tap**: Scale 0.98
- **Shadow**: Hover shadow-xl
- **Gradient overlay**: Subtle gradient on hover

### 7. **Dark Mode**
- Full theme support
- Status badges adapt colors
- Border and background colors
- Text contrast ratios

---

## 📦 Props

```typescript
interface Idea {
  id: number
  title: string
  description?: string
  rationale?: string
  persona?: string
  industry?: string
  status: 'draft' | 'selected' | 'archived' | 'pending' | 'rejected' | 'generated'
  created_at: string
}

interface IdeaCardProps {
  idea: Idea                                      // Required: Idea object
  onEdit?: (idea: Idea) => void                   // Optional: Edit callback
  onDelete?: (id: number) => void                 // Optional: Delete callback
  onView?: (idea: Idea) => void                   // Optional: View callback
  onSelectAndCreateBrief?: (idea: Idea) => void | Promise<void>  // Optional: Create brief callback
  formatDate?: (date: string) => string           // Optional: Custom date formatter
}
```

---

## 🚀 Usage

### Basic Usage

```tsx
import { IdeaCard } from '@/components/IdeaCard'

const idea = {
  id: 1,
  title: "AI-Powered Content Generator",
  description: "Create engaging content using AI",
  rationale: "High demand for automated content",
  persona: "Content Creator",
  industry: "Technology",
  status: "selected",
  created_at: "2025-11-03T10:00:00Z"
}

export default function MyPage() {
  return (
    <IdeaCard
      idea={idea}
      onEdit={(idea) => console.log('Edit', idea)}
      onDelete={(id) => console.log('Delete', id)}
      onView={(idea) => console.log('View', idea)}
      onSelectAndCreateBrief={async (idea) => {
        await createBrief(idea)
      }}
    />
  )
}
```

### With Custom Date Format

```tsx
<IdeaCard
  idea={idea}
  formatDate={(date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### In Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {ideas.map((idea) => (
    <IdeaCard
      key={idea.id}
      idea={idea}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSelectAndCreateBrief={handleCreateBrief}
    />
  ))}
</div>
```

### With Async Actions

```tsx
const handleCreateBrief = async (idea: Idea) => {
  // API call
  const response = await fetch(`/api/briefs/generate/${idea.id}`, {
    method: 'POST'
  })
  
  if (!response.ok) {
    throw new Error('Failed to create brief')
  }
  
  // Success - toast will show automatically
}

<IdeaCard
  idea={idea}
  onSelectAndCreateBrief={handleCreateBrief}
/>
```

---

## 🎨 Status Configuration

### Status Colors

```typescript
const statusConfig = {
  draft: {
    label: 'Nháp',
    icon: '📝',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  },
  selected: {
    label: 'Đã chọn',
    icon: '✅',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  archived: {
    label: 'Lưu trữ',
    icon: '🗄️',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  rejected: {
    label: 'Từ chối',
    icon: '❌',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  pending: {
    label: 'Chờ xử lý',
    icon: '⏳',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  generated: {
    label: 'Đã tạo Brief',
    icon: '📄',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
}
```

### Custom Status Colors

Muốn thêm status mới? Update `statusConfig`:

```typescript
// In IdeaCard.tsx
const statusConfig = {
  // ... existing statuses
  approved: {
    variant: 'default' as const,
    label: 'Đã duyệt',
    icon: '✅',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
}
```

---

## 🎯 Features Deep Dive

### 1. Loading State Management

```typescript
const [isLoading, setIsLoading] = useState(false)
const [currentAction, setCurrentAction] = useState<string | null>(null)

const handleAction = async (action, callback, arg) => {
  setIsLoading(true)
  setCurrentAction(action)
  
  try {
    const result = callback(arg)
    if (result instanceof Promise) {
      await result
    }
    
    toast.success('Thành công!', {
      description: `${action} đã được thực hiện thành công.`
    })
  } catch (error) {
    toast.error('Lỗi!', {
      description: `Không thể ${action.toLowerCase()}.`
    })
  } finally {
    setIsLoading(false)
    setCurrentAction(null)
  }
}
```

**Benefits**:
- Prevent double-clicks
- Visual feedback
- Error handling
- Automatic toast notifications

### 2. Conditional Actions

```typescript
const canCreateBrief = idea.status === 'selected'

<DropdownMenuItem 
  disabled={!canCreateBrief || isLoading}
  className={cn(
    canCreateBrief 
      ? "text-blue-600" 
      : "opacity-50 cursor-not-allowed"
  )}
>
  Chọn & Tạo Brief
  {!canCreateBrief && (
    <span className="ml-auto text-xs">
      (Chỉ khi đã chọn)
    </span>
  )}
</DropdownMenuItem>
```

**Logic**:
- Check `idea.status === 'selected'`
- Disable menu item if false
- Show hint text
- Style differently

### 3. Loading Overlay

```tsx
{isLoading && (
  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm">{currentAction}...</p>
    </div>
  </div>
)}
```

**Features**:
- Absolute positioning
- Backdrop blur effect
- Z-index 10 (above card content)
- Spinning loader icon
- Action name display

### 4. Hover Animations

```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  whileTap={{ scale: 0.98 }}
>
  <Card className={cn(
    "hover:shadow-xl",
    "before:hover:from-primary/5 before:hover:to-primary/10"
  )}>
    {/* Card content */}
  </Card>
</motion.div>
```

**Effects**:
- **Hover**: Scale up 2% + lift 4px
- **Tap**: Scale down 2%
- **Shadow**: Increase to xl
- **Gradient**: Subtle overlay

### 5. Rationale Display

```tsx
{idea.rationale && (
  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200">
    <p className="text-xs text-purple-700 italic line-clamp-2">
      <strong>💡 Lý do:</strong> {idea.rationale}
    </p>
  </div>
)}
```

**Styling**:
- Purple themed box
- Rounded corners
- Border + background
- Icon + bold label
- Line clamp 2 lines

---

## 🎭 Animation Details

### Entry Animation

```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
```

**Effect**: Fade in + slide up from 20px

### Hover Animation

```typescript
whileHover={{ scale: 1.02, y: -4 }}
```

**Effect**: Slight scale + lift up

### Tap Animation

```typescript
whileTap={{ scale: 0.98 }}
```

**Effect**: Scale down feedback

### Shadow Transition

```css
hover:shadow-xl transition-all duration-300
```

**Effect**: Smooth shadow increase

---

## 🐛 Troubleshooting

### Issue: Toast không hiển thị

**Solution**: Đảm bảo có `Toaster` component

```tsx
// app/layout.tsx
import { Toaster } from './components/ui/toast'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />  {/* Required */}
      </body>
    </html>
  )
}
```

### Issue: "Select & Create Brief" không disable

**Solution**: Kiểm tra status type

```typescript
// Make sure status is typed correctly
status: 'draft' | 'selected' | 'archived' | ...
```

### Issue: Loading overlay không hiển thị

**Solution**: Kiểm tra z-index và positioning

```tsx
<Card className="relative">  {/* Must have relative */}
  {isLoading && (
    <div className="absolute inset-0 z-10">  {/* Must have z-10 */}
      {/* Overlay content */}
    </div>
  )}
</Card>
```

### Issue: Animation lag

**Solution**: Reduce animation duration

```typescript
transition={{ duration: 0.2 }}  // Faster
```

---

## ✅ Best Practices

### 1. **Error Handling**

```tsx
const handleCreateBrief = async (idea: Idea) => {
  try {
    await api.createBrief(idea.id)
    // Success toast auto-shown by IdeaCard
  } catch (error) {
    // Error toast auto-shown by IdeaCard
    throw error  // Re-throw for IdeaCard to handle
  }
}
```

### 2. **Loading States**

```tsx
// IdeaCard handles loading automatically
// Just provide async callbacks

onSelectAndCreateBrief={async (idea) => {
  await slowAPICall(idea)  // IdeaCard shows loader
}}
```

### 3. **Type Safety**

```typescript
interface Idea {
  status: 'draft' | 'selected' | 'archived' | 'pending' | 'rejected' | 'generated'
  // Not just 'string'
}
```

### 4. **Responsive Grids**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {ideas.map(idea => <IdeaCard key={idea.id} idea={idea} />)}
</div>
```

---

## 📊 Component Structure

```
IdeaCard
├── motion.div (Entry + Hover animation)
│   └── Card
│       ├── Loading Overlay (conditional)
│       │   └── Loader2 icon + Action text
│       ├── CardHeader
│       │   ├── Title + Status Badge
│       │   └── DropdownMenu (Actions)
│       │       ├── View
│       │       ├── Edit
│       │       ├── Select & Create Brief (conditional disable)
│       │       └── Delete
│       ├── CardContent
│       │   └── Rationale (styled box)
│       └── CardFooter
│           ├── Tags (Persona + Industry)
│           └── Date + Hint text
```

---

## 🎨 Styling Classes

### Card

```css
.card {
  @apply hover:shadow-xl transition-all duration-300;
  @apply relative overflow-hidden;
  @apply before:absolute before:inset-0;
  @apply hover:before:from-primary/5 hover:before:to-primary/10;
}
```

### Loading Overlay

```css
.loading-overlay {
  @apply absolute inset-0 bg-background/50 backdrop-blur-sm z-10;
  @apply flex items-center justify-center;
}
```

### Status Badge

```css
.status-badge {
  @apply shrink-0 font-medium;
  /* Custom colors per status */
}
```

---

## 📚 Related Components

- `Card` - Base card component
- `Badge` - Status display
- `DropdownMenu` - Actions menu
- `Button` - Action buttons
- `Loader2` (Lucide) - Loading spinner

---

## 📝 Changelog

### v2.0 (Current)
- ✅ Loading states with overlay
- ✅ Toast notifications
- ✅ "Select & Create Brief" action
- ✅ Conditional action disable
- ✅ 6 status types với custom colors
- ✅ Enhanced animations
- ✅ Dark mode support
- ✅ Rationale styled box
- ✅ Async action support

---

**Created**: November 3, 2025  
**Status**: ✅ Production Ready  
**Framework**: Next.js 14 + Tailwind + shadcn/ui  
**Animation**: Framer Motion  
**Notifications**: Sonner


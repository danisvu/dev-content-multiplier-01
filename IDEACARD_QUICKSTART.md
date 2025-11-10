# 🚀 IdeaCard Component - Quick Start

## ✅ Component Đã Ready

IdeaCard component với đầy đủ tính năng production-ready!

### 📦 Đã Update
- ✅ `IdeaCard.tsx` - Updated với full features
- ✅ `IDEACARD_COMPONENT_GUIDE.md` - Documentation đầy đủ
- ✅ `ideacard-demo/page.tsx` - Interactive demo page

### 🎨 Features
- ✅ **6 Status types** với custom colors (draft, selected, archived, rejected, pending, generated)
- ✅ **Actions dropdown**: View, Edit, Delete, Select & Create Brief
- ✅ **Loading states** với overlay & spinner
- ✅ **Toast notifications** tự động (success/error)
- ✅ **Animations**: Hover, tap, shadow effects
- ✅ **Conditional disable**: "Create Brief" chỉ khi status = 'selected'
- ✅ **Dark mode** support
- ✅ **Responsive** design

---

## 🧪 Test Ngay

### 1. Truy cập demo page

```
http://localhost:3000/ideacard-demo
```

### 2. Test các tính năng

#### ✅ Hover Effects:
```
→ Hover card → Scale up + lift + shadow increase
→ Smooth animations với Framer Motion
```

#### ✅ Actions Menu:
```
1. Click three-dot icon (⋮)
2. Try actions:
   - View → Info toast
   - Edit → Console log
   - Delete → Remove card
   - Select & Create Brief → Loading 2s → Status changes
```

#### ✅ Loading States:
```
→ Click "Select & Create Brief" trên card màu xanh (selected)
→ Loading overlay appears
→ Spinner animates for 2 seconds
→ Success toast shows
→ Card status changes to "Đã tạo Brief" (green)
```

#### ✅ Conditional Disable:
```
→ Try "Select & Create Brief" trên card không phải "selected"
→ Menu item disabled với hint text "(Chỉ khi đã chọn)"
→ Opacity 50%, cursor not-allowed
```

---

## 🚀 Usage Examples

### Basic Usage

```tsx
import { IdeaCard } from '@/components/IdeaCard'

const idea = {
  id: 1,
  title: "AI Content Generator",
  description: "Generate content with AI",
  rationale: "High demand for automation",
  persona: "Content Creator",
  industry: "Technology",
  status: "selected",
  created_at: "2025-11-03T10:00:00Z"
}

export default function Page() {
  return (
    <IdeaCard
      idea={idea}
      onEdit={(idea) => console.log('Edit', idea)}
      onDelete={(id) => console.log('Delete', id)}
      onView={(idea) => console.log('View', idea)}
      onSelectAndCreateBrief={async (idea) => {
        await api.createBrief(idea.id)
      }}
    />
  )
}
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
  // IdeaCard shows loading automatically
  const response = await fetch(`/api/briefs/generate/${idea.id}`, {
    method: 'POST'
  })
  
  if (!response.ok) {
    throw new Error('Failed')  // IdeaCard shows error toast
  }
  
  // IdeaCard shows success toast automatically
}

<IdeaCard
  idea={idea}
  onSelectAndCreateBrief={handleCreateBrief}
/>
```

---

## 🎯 Props

```typescript
interface IdeaCardProps {
  // Required
  idea: Idea
  
  // Optional callbacks
  onEdit?: (idea: Idea) => void
  onDelete?: (id: number) => void
  onView?: (idea: Idea) => void
  onSelectAndCreateBrief?: (idea: Idea) => void | Promise<void>
  
  // Optional formatter
  formatDate?: (date: string) => string
}

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
```

---

## 🏷️ Status Types

| Status | Color | Icon | Description |
|--------|-------|------|-------------|
| `draft` | Gray | 📝 | Ý tưởng nháp |
| `selected` | Blue | ✅ | Đã chọn (có thể tạo Brief) |
| `pending` | Yellow | ⏳ | Chờ xử lý |
| `rejected` | Red | ❌ | Từ chối |
| `archived` | Red | 🗄️ | Lưu trữ |
| `generated` | Green | 📄 | Đã tạo Brief |

---

## 🔧 Key Features

### 1. Loading States

```tsx
// IdeaCard handles loading automatically
const handleAction = async (idea: Idea) => {
  await slowAPICall(idea)
  // Loading overlay shows during API call
  // Success toast appears when done
}
```

**Features**:
- Backdrop blur overlay
- Spinning loader (Loader2 icon)
- Action name display
- Disable all buttons
- Auto-cleanup

### 2. Toast Notifications

```tsx
// Success toast (automatic)
toast.success('Thành công!', {
  description: 'Action đã được thực hiện thành công.',
  duration: 3000
})

// Error toast (automatic)
toast.error('Lỗi!', {
  description: 'Không thể thực hiện action.',
  duration: 4000
})
```

**Auto-triggered on**:
- All actions (Edit, Delete, View, Create Brief)
- Success → Green toast
- Error → Red toast

### 3. Conditional Actions

```tsx
const canCreateBrief = idea.status === 'selected'

<DropdownMenuItem 
  disabled={!canCreateBrief}
>
  Chọn & Tạo Brief
  {!canCreateBrief && (
    <span>(Chỉ khi đã chọn)</span>
  )}
</DropdownMenuItem>
```

**Logic**:
- Check status === 'selected'
- Disable if false
- Show hint text
- Different styling

### 4. Animations

```tsx
// Entry
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Hover
whileHover={{ scale: 1.02, y: -4 }}

// Tap
whileTap={{ scale: 0.98 }}
```

**Effects**:
- Fade in + slide up on mount
- Scale + lift on hover
- Scale down on tap
- Shadow transition

---

## 🐛 Troubleshooting

### Toast không hiển thị

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

### "Select & Create Brief" không disable

**Solution**: Check status type

```typescript
// Must use literal types, not just 'string'
status: 'draft' | 'selected' | 'archived' | ...
```

### Loading overlay không hiển thị

**Solution**: Card phải có `relative` position

```tsx
<Card className="relative">  {/* Must have */}
  {isLoading && (
    <div className="absolute inset-0 z-10">
      {/* Overlay */}
    </div>
  )}
</Card>
```

---

## ✅ Integration Checklist

- [ ] Import IdeaCard component
- [ ] Provide `idea` object with correct types
- [ ] Add callback functions (onEdit, onDelete, etc.)
- [ ] Ensure `Toaster` component exists in layout
- [ ] Test all actions in dropdown menu
- [ ] Verify loading states work
- [ ] Check toast notifications appear
- [ ] Test "Select & Create Brief" conditional disable
- [ ] Verify animations work (hover, tap)
- [ ] Test dark mode support

---

## 📚 Full Documentation

Chi tiết đầy đủ: **`IDEACARD_COMPONENT_GUIDE.md`**

---

## 🎉 What's New

### v2.0 Updates:
- ✅ Added `onSelectAndCreateBrief` callback
- ✅ 6 status types với custom colors
- ✅ Loading overlay với backdrop blur
- ✅ Automatic toast notifications
- ✅ Conditional action disable
- ✅ Enhanced hover animations (lift + scale)
- ✅ Rationale styled box (purple theme)
- ✅ Status hint text in footer
- ✅ Async action support
- ✅ Dark mode colors for all statuses

---

**Created**: November 3, 2025  
**Status**: ✅ Production Ready!  
**Test URL**: http://localhost:3000/ideacard-demo  
**Full Guide**: IDEACARD_COMPONENT_GUIDE.md


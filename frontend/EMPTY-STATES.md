# EmptyState Components

Comprehensive empty state component system với animations và theme support.

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Pre-built Variants](#pre-built-variants)
- [Customization](#customization)
- [Examples](#examples)

## 🎯 Overview

EmptyState components cung cấp một cách consistent và beautiful để hiển thị empty states trong ứng dụng. Bao gồm:

- ✨ Framer Motion animations
- 🎨 Theme-aware colors
- 📏 Multiple sizes (sm, md, lg)
- 🎭 Multiple variants (default, minimal)
- 🧩 Pre-built variants cho common use cases
- 🔧 Highly customizable

## 📦 Installation

Components đã được tích hợp sẵn. Chỉ cần import và sử dụng:

```tsx
import { EmptyState } from '@/components/EmptyState'
import { EmptyIdeas } from '@/components/EmptyStateVariants'
```

## 🚀 Usage

### Basic Usage

```tsx
import { EmptyState } from '@/components/EmptyState'
import { Lightbulb } from 'lucide-react'

function MyComponent() {
  return (
    <EmptyState
      icon={Lightbulb}
      title="No items found"
      description="Create your first item to get started."
      actionLabel="Create Item"
      onAction={() => handleCreate()}
    />
  )
}
```

### Using Pre-built Variants

```tsx
import { EmptyIdeas } from '@/components/EmptyStateVariants'

function IdeasPage() {
  return <EmptyIdeas onAction={() => openCreateDialog()} />
}
```

## 📚 Props

| Prop            | Type                         | Default     | Description                                  |
| --------------- | ---------------------------- | ----------- | -------------------------------------------- |
| `icon`          | `LucideIcon`                 | -           | Icon component từ lucide-react               |
| `title`         | `string`                     | required    | Tiêu đề empty state                          |
| `description`   | `string`                     | required    | Mô tả chi tiết (text-muted-foreground)       |
| `actionLabel`   | `string`                     | -           | Label cho action button                      |
| `onAction`      | `() => void`                 | -           | Callback khi click button                    |
| `variant`       | `'default' \| 'minimal'`     | `'default'` | Style variant                                |
| `size`          | `'sm' \| 'md' \| 'lg'`       | `'md'`      | Kích thước component                         |
| `className`     | `string`                     | -           | Custom className cho container               |
| `iconClassName` | `string`                     | -           | Custom className cho icon (e.g., color)      |

## 🎨 Pre-built Variants

### Available Variants

```tsx
import {
  EmptyIdeas,        // Empty ideas list
  EmptyBriefs,       // Empty briefs list
  EmptyDrafts,       // Empty drafts list
  EmptySearchResults,// No search results
  EmptyInbox,        // Empty inbox
  EmptyImages,       // No images
  EmptyTeam,         // No team members
  EmptyFiles,        // Empty folder
  EmptyData,         // No data
  ErrorState,        // Error state
} from '@/components/EmptyStateVariants'
```

### Examples

```tsx
// Ideas
<EmptyIdeas onAction={handleCreateIdea} />

// Briefs
<EmptyBriefs onAction={handleCreateBrief} />

// Search Results (no action)
<EmptySearchResults />

// Error with retry
<ErrorState onRetry={handleRetry} />
```

## 🎨 Customization

### Sizes

```tsx
// Small - compact for smaller containers
<EmptyState
  icon={Lightbulb}
  title="Small State"
  description="Compact version."
  size="sm"
/>

// Medium (default) - standard size
<EmptyState
  icon={Lightbulb}
  title="Medium State"
  description="Default size."
  size="md"
/>

// Large - prominent for main pages
<EmptyState
  icon={Lightbulb}
  title="Large State"
  description="Large version."
  size="lg"
/>
```

### Variants

```tsx
// Default - với border và background
<EmptyState
  icon={Lightbulb}
  title="Default Variant"
  description="With border and background."
  variant="default"
/>

// Minimal - không border, inline friendly
<EmptyState
  icon={Lightbulb}
  title="Minimal Variant"
  description="No border or background."
  variant="minimal"
/>
```

### Custom Icon Colors

```tsx
<EmptyState
  icon={Settings}
  title="Custom Colors"
  description="Icon có thể customize màu sắc."
  iconClassName="text-amber-500"
  onAction={handleConfigure}
/>

// Error state với red icon
<EmptyState
  icon={AlertCircle}
  title="Error Occurred"
  description="Something went wrong."
  iconClassName="text-destructive"
/>
```

### Custom Styling

```tsx
<EmptyState
  icon={Lightbulb}
  title="Custom Styled"
  description="With custom classes."
  className="my-8 border-primary"
  iconClassName="text-primary"
  size="lg"
/>
```

## 📝 Examples

### Conditional Rendering

```tsx
function MyList({ items, onCreateNew }) {
  if (items.length === 0) {
    return <EmptyIdeas onAction={onCreateNew} />
  }

  return (
    <div className="grid gap-4">
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
```

### With Loading State

```tsx
function MyPage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  if (loading) return <LoadingSkeleton />
  
  if (items.length === 0) {
    return <EmptyIdeas onAction={openDialog} />
  }

  return <ItemsList items={items} />
}
```

### Error Handling

```tsx
function MyPage() {
  const [error, setError] = useState(null)
  const [items, setItems] = useState([])

  const handleRetry = async () => {
    setError(null)
    try {
      const data = await fetchItems()
      setItems(data)
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) {
    return <ErrorState onRetry={handleRetry} />
  }

  if (items.length === 0) {
    return <EmptyIdeas onAction={openDialog} />
  }

  return <ItemsList items={items} />
}
```

### Search Results

```tsx
function SearchResults({ query, results }) {
  if (results.length === 0) {
    return (
      <EmptySearchResults />
    )
  }

  return (
    <div>
      {results.map(result => (
        <ResultCard key={result.id} result={result} />
      ))}
    </div>
  )
}
```

## 🎬 Animations

EmptyState components bao gồm các animations:

1. **Fade-in + Slide-up**: Container animation khi mount
2. **Scale-in (Spring)**: Icon animation với spring effect
3. **Staggered appearance**: Title, description, và button appear lần lượt

Animations được powered by Framer Motion và tự động respect user's motion preferences.

## 🌈 Theme Support

Tất cả EmptyState components tự động respect theme:

- Light mode: Lighter colors và subtle borders
- Dark mode: Darker colors với better contrast
- Uses theme tokens: `bg-card`, `text-muted-foreground`, `border`, etc.

## 🎯 Best Practices

1. **Choose appropriate variant**: Use `default` cho main empty states, `minimal` cho inline/nested states
2. **Meaningful descriptions**: Provide clear, helpful descriptions
3. **Always provide actions**: Khi có thể, cung cấp action button để user biết next step
4. **Use appropriate size**: `sm` cho dialogs/sidebars, `md` cho content areas, `lg` cho main pages
5. **Consistent iconography**: Use icons that match the context

## 📱 Demo Page

Visit `/empty-states-demo` để xem tất cả variants và examples trong action.

## 🔗 Related Components

- `PageTransition` - Page-level animations
- `IdeasSkeleton` - Loading state
- `Button` - Action buttons
- `Card` - Container component

## 📄 License

Part of Content Ideas Manager project.


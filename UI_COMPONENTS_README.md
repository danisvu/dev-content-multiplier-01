# 🎨 UI Components Library - Content Multiplier

## 📚 Tổng Quan

Thư viện UI components hoàn chỉnh được xây dựng với **Next.js**, **TypeScript**, **Tailwind CSS**, và **shadcn/ui**. Tất cả components đều hỗ trợ **dark mode**, **responsive**, và **accessible**.

---

## 📦 Component List

### 🏗️ Layout & Navigation

| Component | Description | Demo | Guide |
|-----------|-------------|------|-------|
| **Layout** | Main app layout với sidebar, header, content | `/layout-demo` | [Guide](./LAYOUT_COMPONENT_GUIDE.md) |
| **Sidebar** | Responsive sidebar với navigation | `/sidebar-demo` | [Guide](./SIDEBAR_COMPONENT_GUIDE.md) |
| **Navbar** | Top navigation bar | - | - |
| **Breadcrumb** | Navigation breadcrumbs | - | - |

### 📝 Content Display

| Component | Description | Demo | Guide |
|-----------|-------------|------|-------|
| **IdeaCard** | Display idea với actions menu | `/ideacard-demo` | [Guide](./IDEACARD_COMPONENT_GUIDE.md) |
| **BriefCard** | Display brief với linked idea | `/briefcard-demo` | [Guide](./BRIEFCARD_COMPONENT_GUIDE.md) |
| **DocumentCard** | Display document với delete | `/documents-demo` | - |
| **MarkdownEditor** | Rich markdown editor | - | - |
| **StreamingDisplay** | Real-time text streaming | `/streaming-demo` | - |

### 🔍 Search & Filter

| Component | Description | Demo | Guide |
|-----------|-------------|------|-------|
| **DocumentSearch** | Semantic search cho documents | `/search-demo` | [Guide](./DOCUMENTSEARCH_COMPONENT_GUIDE.md) |
| **InlineCitations** | Parse và display citations | `/documents-demo` | - |
| **Footnotes** | Reference section với accordion | `/documents-demo` | - |

### 📤 Input & Forms

| Component | Description | Demo | Guide |
|-----------|-------------|------|-------|
| **DocumentUpload** | Drag-drop file upload dialog | `/documents-demo` | - |
| **Input** | Text input field | - | - |
| **Button** | Interactive button với tap feedback | All pages | - |
| **Dialog** | Modal dialog | All pages | - |
| **Modal** | Confirmation/notification modals | - | - |

### 🎭 UI Elements

| Component | Description | Demo | Guide |
|-----------|-------------|------|-------|
| **EmptyState** | No data placeholder | `/emptystate-demo` | [Guide](./EMPTYSTATE_QUICKSTART.md) |
| **SkeletonList** | Loading shimmer effect | `/ui-demo` | - |
| **Badge** | Status/label badges | All pages | - |
| **Toast** | Notification toasts (sonner) | All pages | - |
| **ThemeToggle** | Dark/light mode toggle | All pages | - |
| **Card** | Content card | All pages | - |
| **Progress** | Progress bar | `/documents-demo` | - |

### 🎉 Special Effects

| Component | Description | Demo | Guide |
|-----------|-------------|------|-------|
| **SuccessConfetti** | Confetti animation | `/confetti-demo` | - |
| **PageTransition** | Page entry animations | All pages | - |

---

## 🚀 Quick Start

### 1. Import từ `@/components/ui`

```tsx
import { 
  Button, 
  Card, 
  Badge, 
  EmptyState,
  Input 
} from '@/components/ui'
```

### 2. Import Component riêng lẻ

```tsx
import { DocumentSearch } from '@/components/DocumentSearch'
import { IdeaCard } from '@/components/IdeaCard'
import { BriefCard } from '@/components/BriefCard'
```

### 3. Sử dụng trong Page

```tsx
export default function MyPage() {
  return (
    <div className="container mx-auto p-8">
      <EmptyState
        title="No data yet"
        description="Get started by creating your first item"
        ctaLabel="Create"
        onClick={handleCreate}
      />
    </div>
  )
}
```

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── skeleton-list.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   ├── modal.tsx
│   │   │   └── index.ts       # Centralized exports
│   │   │
│   │   ├── Layout.tsx          # Main app layout
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── IdeaCard.tsx        # Idea display card
│   │   ├── BriefCard.tsx       # Brief display card
│   │   ├── DocumentSearch.tsx  # Semantic search
│   │   ├── DocumentUpload.tsx  # File upload dialog
│   │   ├── DocumentCard.tsx    # Document card
│   │   ├── InlineCitations.tsx # Citation parser
│   │   ├── Footnotes.tsx       # References section
│   │   ├── ThemeProvider.tsx   # Theme context
│   │   └── ...
│   │
│   ├── ideas/page.tsx          # Ideas list page
│   ├── briefs/page.tsx         # Briefs list page
│   ├── search-demo/page.tsx    # Search demo
│   ├── documents-demo/page.tsx # Documents demo
│   └── ...
│
├── lib/
│   ├── utils.ts                # cn() utility
│   ├── animations.ts           # Framer Motion variants
│   ├── toast.ts                # Toast helpers
│   └── constants.ts            # App constants
│
└── globals.css                 # Global styles + theme variables
```

---

## 🎨 Design System

### Colors

```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 221.2 83.2% 53.3%;
--secondary: 210 40% 96.1%;
--muted: 210 40% 96.1%;
--accent: 210 40% 96.1%;
--destructive: 0 84.2% 60.2%;

/* Dark Mode */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
/* ... */
```

### Typography

- **Heading**: `text-3xl font-bold`
- **Subheading**: `text-xl font-semibold`
- **Body**: `text-base`
- **Small**: `text-sm`
- **Tiny**: `text-xs`

### Spacing

- **Container**: `container mx-auto px-4 sm:px-6 lg:px-8`
- **Section**: `py-8 md:py-12`
- **Card**: `p-6`
- **Gap**: `gap-4` (16px) hoặc `gap-6` (24px)

### Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

---

## 🎭 Theme System

### ThemeProvider Setup

```tsx
// app/layout.tsx
import { ThemeProvider } from './components/ThemeProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### ThemeToggle Usage

```tsx
import { ThemeToggle } from '@/components/ui'

<ThemeToggle className="fixed top-4 right-4" />
```

### Theme-Aware Styling

```tsx
<div className="bg-background text-foreground">
  <Card className="bg-card text-card-foreground">
    <Badge variant="default" className="bg-primary text-primary-foreground">
      Status
    </Badge>
  </Card>
</div>
```

---

## 🎬 Animations

### Framer Motion Variants

```tsx
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { motion } from 'framer-motion'

<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeInUp}
>
  Content
</motion.div>
```

### Hover Effects

```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -4 }}
  whileTap={{ scale: 0.98 }}
>
  Hover me
</motion.div>
```

### Page Transitions

```tsx
import { PageTransition } from '@/components/PageTransition'

export default function MyPage() {
  return (
    <PageTransition>
      Page content
    </PageTransition>
  )
}
```

---

## 🍞 Toast Notifications

### Setup (Already configured)

```tsx
// app/layout.tsx
import { Toaster } from '@/components/ui/toast'

<Toaster position="top-right" />
```

### Usage

```tsx
import { toast } from 'sonner'

// Success
toast.success('Success!', {
  description: 'Operation completed successfully.'
})

// Error
toast.error('Error!', {
  description: 'Something went wrong.'
})

// Info
toast.info('Info', {
  description: 'Just letting you know.'
})

// Loading
toast.loading('Processing...')
```

---

## 📊 Common Patterns

### 1. CRUD Operations with Toast

```tsx
const handleDelete = async (id: number) => {
  try {
    await deleteIdea(id)
    toast.success('Deleted!', {
      description: 'Idea has been deleted.'
    })
  } catch (error) {
    toast.error('Error!', {
      description: 'Could not delete idea.'
    })
  }
}
```

### 2. Loading States

```tsx
const [isLoading, setIsLoading] = useState(false)

{isLoading ? (
  <SkeletonList count={6} type="ideas" />
) : ideas.length === 0 ? (
  <EmptyState
    title="No ideas yet"
    description="Start by creating your first idea"
    ctaLabel="Create Idea"
    onClick={handleCreate}
  />
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {ideas.map(idea => (
      <IdeaCard key={idea.id} idea={idea} />
    ))}
  </div>
)}
```

### 3. Responsive Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  {items.map(item => (
    <Card key={item.id}>
      {item.title}
    </Card>
  ))}
</div>
```

### 4. Confirmation Dialog

```tsx
import { ConfirmDialog } from '@/components/ui'

const [isOpen, setIsOpen] = useState(false)

<ConfirmDialog
  isOpen={isOpen}
  title="Delete Idea?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
  onCancel={() => setIsOpen(false)}
/>
```

---

## 🧪 Demo Pages

Visit these pages to see components in action:

| Page | URL | Components |
|------|-----|------------|
| **Layout Demo** | `/layout-demo` | Layout, Sidebar, Header |
| **Sidebar Demo** | `/sidebar-demo` | Sidebar |
| **IdeaCard Demo** | `/ideacard-demo` | IdeaCard |
| **BriefCard Demo** | `/briefcard-demo` | BriefCard |
| **EmptyState Demo** | `/emptystate-demo` | EmptyState |
| **UI Demo** | `/ui-demo` | Badge, Toast, Skeleton |
| **Confetti Demo** | `/confetti-demo` | SuccessConfetti |
| **Documents Demo** | `/documents-demo` | DocumentUpload, DocumentCard, InlineCitations, Footnotes |
| **Search Demo** | `/search-demo` | DocumentSearch |
| **Streaming Demo** | `/streaming-demo` | StreamingDisplay |

---

## 🛠️ Dependencies

### Core
- `next`: ^14.0.0
- `react`: ^18.0.0
- `typescript`: ^5.0.0

### UI & Styling
- `tailwindcss`: ^3.4.0
- `@radix-ui/*`: Multiple packages (Dialog, DropdownMenu, etc.)
- `class-variance-authority`: ^0.7.0
- `clsx`: ^2.0.0
- `tailwind-merge`: ^2.0.0

### Animations & Effects
- `framer-motion`: ^10.16.0
- `react-confetti`: ^6.1.0

### Notifications
- `sonner`: ^1.2.0

### Markdown
- `@uiw/react-markdown-editor`: ^5.0.0

### Icons
- `lucide-react`: ^0.292.0

---

## 📖 Documentation

### Component-Specific Guides

- [Layout Component](./LAYOUT_COMPONENT_GUIDE.md) + [Quickstart](./LAYOUT_QUICKSTART.md)
- [Sidebar Component](./SIDEBAR_COMPONENT_GUIDE.md) + [Quickstart](./SIDEBAR_QUICKSTART.md)
- [IdeaCard Component](./IDEACARD_COMPONENT_GUIDE.md) + [Quickstart](./IDEACARD_QUICKSTART.md)
- [BriefCard Component](./BRIEFCARD_COMPONENT_GUIDE.md) + [Quickstart](./BRIEFCARD_QUICKSTART.md)
- [EmptyState Component](./EMPTYSTATE_QUICKSTART.md)
- [DocumentSearch Component](./DOCUMENTSEARCH_COMPONENT_GUIDE.md) + [Quickstart](./DOCUMENTSEARCH_QUICKSTART.md)

### General Guides

- [Theme System](./THEME_GUIDE.md) - *Coming soon*
- [Animation Patterns](./ANIMATION_GUIDE.md) - *Coming soon*
- [Responsive Design](./RESPONSIVE_GUIDE.md) - *Coming soon*

---

## ✅ Best Practices

### 1. Consistent Imports

```tsx
// ✅ Good: Import from centralized index
import { Button, Card, Badge } from '@/components/ui'

// ❌ Bad: Import from individual files
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

### 2. Type Safety

```tsx
// ✅ Good: Define interfaces
interface IdeaCardProps {
  idea: Idea
  onEdit?: (idea: Idea) => void
  onDelete?: (id: number) => void
}

// ❌ Bad: Use any
function IdeaCard({ idea }: any) { ... }
```

### 3. Accessibility

```tsx
// ✅ Good: ARIA labels, keyboard navigation
<Button
  onClick={handleClick}
  aria-label="Delete idea"
  className="..."
>
  <Trash2 className="w-4 h-4" />
  <span className="sr-only">Delete</span>
</Button>
```

### 4. Responsive Design

```tsx
// ✅ Good: Mobile-first responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(...)}
</div>

// ❌ Bad: Fixed layout
<div className="grid grid-cols-3 gap-4">
  {items.map(...)}
</div>
```

### 5. Theme Compatibility

```tsx
// ✅ Good: Use theme variables
<div className="bg-background text-foreground border-border">
  Content
</div>

// ❌ Bad: Hardcoded colors
<div className="bg-white text-black border-gray-300">
  Content
</div>
```

---

## 🆘 Troubleshooting

### Issue: Components not styled correctly

**Solution**: Ensure `globals.css` is imported in `app/layout.tsx`

### Issue: Theme toggle not working

**Solution**: 
1. Check `ThemeProvider` wraps your app
2. Ensure `suppressHydrationWarning` on `<html>`
3. Check localStorage is available

### Issue: Icons not showing

**Solution**: Install `lucide-react`:
```bash
npm install lucide-react
```

### Issue: Animations not working

**Solution**: Install `framer-motion`:
```bash
npm install framer-motion
```

---

## 🚀 Next Steps

1. **Browse Demo Pages**: Visit `/search-demo`, `/documents-demo`, etc.
2. **Read Component Guides**: Check individual component documentation
3. **Start Building**: Use components in your pages
4. **Customize**: Extend components for your needs

---

## 🤝 Contributing

To add new components:

1. Create component in `app/components/` or `app/components/ui/`
2. Export from `app/components/ui/index.ts` (if UI component)
3. Create demo page in `app/[component-name]-demo/page.tsx`
4. Write documentation: `[COMPONENT]_GUIDE.md` and `[COMPONENT]_QUICKSTART.md`
5. Update this README

---

## 📄 License

MIT License - Free to use and modify

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion**

**Questions?** Check the demo pages or individual component guides!


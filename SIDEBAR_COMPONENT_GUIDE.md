# 🎯 Sidebar Component - Complete Guide

## Tổng Quan

Component **Sidebar** là một thanh điều hướng hoàn chỉnh với đầy đủ tính năng: **Responsive, Tooltips, Animations, Dark Mode Support**.

---

## ✨ Features

### 1. **Responsive Design**
- **Desktop (≥1024px)**: Sticky sidebar 240px, luôn hiển thị
- **Mobile (<1024px)**: Hamburger menu với Sheet drawer
- **Auto-close**: Đóng tự động sau khi click nav item (mobile)

### 2. **Rich Navigation**
- 4 nav items mặc định: Ideas, Briefs, Drafts, Settings
- Lucide icons cho mỗi item
- Active route highlighting với smooth animation
- Tooltips khi hover (instant, no delay)
- Hover effects: slide animation (4px)

### 3. **Animations** 
- Framer Motion cho mọi interaction
- Active indicator với `layoutId` → morphing animation
- Hover: slide + scale effects
- Sheet open/close: slide from left

### 4. **Header/Logo**
- Gradient logo với Sparkles icon
- Online status indicator (animated pulse)
- App name + version
- Click to home

### 5. **Footer**
- App version display
- System status (operational indicator)
- Logout button với destructive styling
- Tooltips

### 6. **Dark Mode**
- Full theme support (light/dark)
- Automatic color switching
- Proper contrast ratios

---

## 📦 Dependencies

### Required Packages

```bash
# Radix UI Primitives
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-dialog
npm install @radix-ui/react-separator

# Icons & Animation
npm install lucide-react
npm install framer-motion

# Utils
npm install clsx tailwind-merge
npm install class-variance-authority
```

### shadcn/ui Components Used
- `Button`
- `Sheet` (Mobile drawer)
- `Separator`
- `ScrollArea`
- `Tooltip`

---

## 🚀 Usage

### Option 1: SidebarLayout Wrapper (Recommended)

```tsx
// app/ideas/page.tsx
import { SidebarLayout } from '@/components/Sidebar'

export default function IdeasPage() {
  return (
    <SidebarLayout>
      <div className="p-8">
        <h1>My Ideas</h1>
        {/* Your page content */}
      </div>
    </SidebarLayout>
  )
}
```

### Option 2: Sidebar Component Only

```tsx
// app/layout.tsx
import { Sidebar } from '@/components/Sidebar'

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
```

### Option 3: Custom Layout

```tsx
import { Sidebar } from '@/components/Sidebar'

export default function CustomLayout() {
  return (
    <div className="flex">
      <Sidebar className="custom-class" />
      <div className="flex-1">
        <header>{/* Header */}</header>
        <main>{/* Content */}</main>
      </div>
    </div>
  )
}
```

---

## 🎨 Component Structure

### Props

```typescript
interface SidebarProps {
  className?: string  // Optional additional classes
}
```

### Navigation Items

```typescript
interface NavItem {
  href: string              // Route path
  label: string            // Display name
  icon: React.ElementType  // Lucide icon component
  badge?: number           // Optional badge count
}

const navItems: NavItem[] = [
  { href: '/ideas', label: 'Ý tưởng', icon: Lightbulb },
  { href: '/briefs', label: 'Briefs', icon: FileText },
  { href: '/drafts', label: 'Bản nháp', icon: Pen },
  { href: '/settings', label: 'Cài đặt', icon: Settings },
]
```

---

## 🎯 Features Deep Dive

### 1. Active Route Detection

```typescript
const isActive = (href: string) => {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}
```

**Logic**:
- Exact match cho home (`/`)
- Prefix match cho other routes
- `/ideas` matches `/ideas`, `/ideas/123`, `/ideas/new`, etc.

### 2. Active Indicator Animation

```tsx
{active && (
  <motion.div
    layoutId="activeTab"
    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
  />
)}
```

**Effect**: Smooth morphing từ tab này sang tab khác

### 3. Hover Animation

```tsx
<motion.div
  whileHover={{ x: 4 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  <Button>...</Button>
</motion.div>
```

**Effect**: Item slide sang phải 4px khi hover

### 4. Tooltip Implementation

```tsx
<TooltipProvider delayDuration={0}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>...</Button>
    </TooltipTrigger>
    <TooltipContent side="right">
      Ý tưởng
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Features**:
- `delayDuration={0}` → Instant tooltip
- `side="right"` → Hiển thị bên phải
- Auto-dismiss khi move mouse away

### 5. Responsive Sheet (Mobile)

```tsx
<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon">
      <Menu />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="p-0 w-60">
    <SidebarContent onItemClick={() => setMobileOpen(false)} />
  </SheetContent>
</Sheet>
```

**Features**:
- Fixed hamburger button (top-left, z-40)
- Slide from left animation
- Auto-close on nav item click
- Backdrop overlay

---

## 📱 Responsive Behavior

### Desktop (≥1024px)

```css
.sidebar {
  @apply hidden lg:block sticky top-0 h-screen w-60;
}
```

- Sticky positioning → stays visible when scrolling
- Fixed width: 240px (w-60)
- Full height: 100vh (h-screen)

### Mobile (<1024px)

```css
.hamburger {
  @apply lg:hidden fixed top-3 left-3 z-40;
}
```

- Sidebar hidden
- Hamburger menu visible (fixed position)
- Sheet drawer on click

---

## 🎨 Styling & Theming

### Color Scheme

**Light Mode**:
- Background: `bg-card` (white)
- Border: `border-r` (gray-200)
- Active: `bg-primary/10` + `text-primary`
- Hover: `hover:bg-accent`

**Dark Mode**:
- Background: `bg-card` (dark gray)
- Border: `border-r` (gray-800)
- Active: `bg-primary/10` + `text-primary`
- Hover: `hover:bg-accent`

### Logo Gradient

```tsx
<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
  <Sparkles className="text-white" />
</div>
```

**Colors**: Purple → Blue → Cyan

### Status Indicator

```tsx
<div className="w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
```

**Effect**: Green dot with pulse animation

---

## 🔧 Customization

### Add New Nav Item

```tsx
const navItems: NavItem[] = [
  // ... existing items
  { 
    href: '/analytics', 
    label: 'Analytics', 
    icon: BarChart3,
    badge: 5  // Optional badge
  },
]
```

### Change Logo

```tsx
<div className="p-6 border-b">
  <Link href="/">
    <div className="flex items-center gap-3">
      <img src="/logo.png" alt="Logo" className="w-10 h-10" />
      <div>
        <h2 className="font-bold text-lg">Your App Name</h2>
        <p className="text-xs text-muted-foreground">v1.0.0</p>
      </div>
    </div>
  </Link>
</div>
```

### Change Sidebar Width

```tsx
// Sidebar.tsx
<aside className="lg:w-72"> {/* Change from w-60 to w-72 */}
  ...
</aside>

// Also update Sheet width
<SheetContent className="p-0 w-72">
  ...
</SheetContent>
```

### Customize Logout Action

```tsx
<Button
  onClick={() => {
    // Your logout logic
    signOut()
    router.push('/login')
  }}
>
  <LogOut />
  Đăng xuất
</Button>
```

### Add Badge to Nav Item

```tsx
const navItems: NavItem[] = [
  { 
    href: '/ideas', 
    label: 'Ý tưởng', 
    icon: Lightbulb,
    badge: 12  // NEW: Shows badge with number
  },
]
```

**Display**:
```tsx
{item.badge && (
  <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
    {item.badge}
  </span>
)}
```

---

## 🎭 Animation Details

### Active Indicator (layoutId)

```tsx
<motion.div
  layoutId="activeTab"
  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
/>
```

**Effect**: Smooth morphing between tabs
**Duration**: ~0.3s với spring easing

### Hover Effect

```tsx
<motion.div
  whileHover={{ x: 4 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
/>
```

**Effect**: Slide 4px to right
**Duration**: ~0.2s

### Logo Hover

```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
/>
```

**Effect**: Slight scale on hover/tap

### Sheet Animation

Handled by Radix UI + Tailwind:
```css
data-[state=open]:slide-in-from-left
data-[state=closed]:slide-out-to-left
```

---

## 🐛 Troubleshooting

### Issue: Sidebar không hiển thị trên desktop

**Solution**: Kiểm tra screen width ≥1024px

```tsx
// Add debug
useEffect(() => {
  console.log('Screen width:', window.innerWidth)
}, [])
```

### Issue: Hamburger menu không hoạt động

**Solution**: Kiểm tra Sheet state

```tsx
<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
  {/* Make sure state is working */}
</Sheet>
```

### Issue: Active tab không highlight

**Solution**: Kiểm tra pathname matching

```tsx
const pathname = usePathname()
console.log('Current path:', pathname)
console.log('Is active:', isActive('/ideas'))
```

### Issue: Tooltip không hiển thị

**Solution**: Đảm bảo có `TooltipProvider` wrapper

```tsx
<TooltipProvider delayDuration={0}>
  {/* Tooltips here */}
</TooltipProvider>
```

### Issue: Animation lag

**Solution**: Reduce spring stiffness

```tsx
transition={{ type: 'spring', stiffness: 200, damping: 20 }}
```

---

## ✅ Best Practices

### 1. **Consistent Routing**
```tsx
// Keep nav items in sync with actual routes
{ href: '/ideas', ... } → app/ideas/page.tsx exists
```

### 2. **Mobile UX**
```tsx
// Always close drawer after navigation
<Link href="..." onClick={onItemClick}>
```

### 3. **Accessibility**
```tsx
// Use semantic HTML
<nav>Navigation items</nav>

// Add ARIA labels
<Button aria-label="Toggle menu">
  <Menu />
</Button>
```

### 4. **Performance**
```tsx
// Memoize sidebar content if needed
const SidebarContent = React.memo(({ onItemClick }) => {
  // ...
})
```

### 5. **Tooltip Delay**
```tsx
// Use instant tooltips for nav items
<TooltipProvider delayDuration={0}>
```

---

## 📊 Component Tree

```
Sidebar
├── Desktop (lg:block)
│   └── SidebarContent
│       ├── Header (Logo + App name)
│       ├── ScrollArea
│       │   └── Navigation
│       │       └── TooltipProvider
│       │           └── navItems.map()
│       │               └── Tooltip + Button
│       ├── Separator
│       └── Footer
│           ├── Version info
│           └── Logout button
│
└── Mobile (lg:hidden)
    └── Sheet
        ├── SheetTrigger (Hamburger)
        └── SheetContent
            └── SidebarContent
```

---

## 🎯 Integration Examples

### Example 1: Simple Page

```tsx
// app/ideas/page.tsx
import { SidebarLayout } from '@/components/Sidebar'

export default function IdeasPage() {
  return (
    <SidebarLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold">My Ideas</h1>
        {/* Content */}
      </div>
    </SidebarLayout>
  )
}
```

### Example 2: With Header

```tsx
import { Sidebar } from '@/components/Sidebar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b">
          {/* Header content */}
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### Example 3: Multiple Sidebars

```tsx
import { Sidebar } from '@/components/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />  {/* Left sidebar */}
      <main className="flex-1">
        {/* Content */}
      </main>
      <aside className="w-64">  {/* Right sidebar */}
        {/* Additional sidebar */}
      </aside>
    </div>
  )
}
```

---

## 🚀 Performance Tips

1. **Lazy load icons**: Only import used icons
2. **Memoize callbacks**: Use `useCallback` for handlers
3. **Optimize re-renders**: Use `React.memo` for static parts
4. **Reduce motion**: Respect user preferences

```tsx
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

<motion.div
  animate={prefersReducedMotion ? {} : { x: 4 }}
/>
```

---

## 📚 Related Components

- `Sheet` - Mobile drawer
- `Tooltip` - Hover tooltips
- `ScrollArea` - Scrollable navigation
- `Button` - Nav buttons
- `Separator` - Divider

---

## 📝 Changelog

### v2.0 (Current)
- ✅ Full responsive design
- ✅ Framer Motion animations
- ✅ Tooltip integration
- ✅ Dark mode support
- ✅ Mobile Sheet drawer
- ✅ Active route highlighting
- ✅ Footer with version & logout

---

**Created**: November 3, 2025  
**Status**: ✅ Production Ready  
**Framework**: Next.js 14 + Tailwind + shadcn/ui  
**Animation**: Framer Motion  
**Test URL**: http://localhost:3000/sidebar-demo


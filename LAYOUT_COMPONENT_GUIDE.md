# 🎨 Layout Component Guide

## Tổng Quan

Component `Layout` là một layout hoàn chỉnh với **Sidebar + Header + Content Area**, được xây dựng với Tailwind CSS và shadcn/ui components.

---

## ✨ Features

### 1. **Three-Panel Layout**
```
┌────────────┬──────────────────────────┐
│            │ Header (56px)            │
│  Sidebar   ├──────────────────────────┤
│  (240px)   │                          │
│            │   Content Area           │
│  - Logo    │   (Scrollable)           │
│  - Nav     │                          │
│  - Footer  │                          │
└────────────┴──────────────────────────┘
```

### 2. **Responsive Design**
- **Desktop (≥1024px)**: Sidebar fixed, always visible
- **Mobile (<1024px)**: Sidebar hidden, opened with hamburger menu

### 3. **Navigation**
- Icons từ Lucide React
- Active tab highlighting với motion animation
- Smooth transitions khi navigate

### 4. **Header**
- Breadcrumbs navigation
- User avatar
- Theme toggle (Dark/Light mode)
- Mobile-friendly

### 5. **Content Area**
- Page transition animations (fade + slide)
- Proper padding và spacing
- Scrollable
- Motion support với Framer Motion

---

## 📦 Dependencies

### Required Packages

```bash
# Radix UI Primitives
npm install @radix-ui/react-avatar
npm install @radix-ui/react-dialog
npm install @radix-ui/react-separator

# Icons
npm install lucide-react

# Animation
npm install framer-motion

# Utils
npm install clsx tailwind-merge
npm install class-variance-authority
```

### shadcn/ui Components Used
- `Button`
- `Avatar`
- `Sheet` (Mobile sidebar)
- `Separator`
- `ThemeToggle`

---

## 🚀 Usage

### Basic Usage

```tsx
// app/layout.tsx
import { Layout } from './components/Layout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <ThemeProvider>
          <Layout>
            {children}
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### With Page Title

```tsx
// app/ideas/page.tsx
import { Layout } from '../components/Layout'

export default function IdeasPage() {
  return (
    <Layout pageTitle="Ý Tưởng">
      <div>
        <h1>Ideas Content</h1>
        {/* Your page content */}
      </div>
    </Layout>
  )
}
```

---

## 🎨 Component Structure

### Props

```typescript
interface LayoutProps {
  children: React.ReactNode  // Page content
  pageTitle?: string         // Optional page title for mobile header
}
```

### Navigation Items

```typescript
interface NavItem {
  href: string              // Route path
  label: string            // Display name
  icon: React.ElementType  // Lucide icon component
}

const navItems: NavItem[] = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/ideas', label: 'Ý tưởng', icon: Lightbulb },
  { href: '/briefs', label: 'Briefs', icon: FileText },
  { href: '/packs', label: 'Packs', icon: Package },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Cài đặt', icon: Settings },
]
```

---

## 🎯 Features Deep Dive

### 1. Sidebar

**Desktop**:
```tsx
<aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col border-r bg-card">
  <SidebarContent />
</aside>
```

**Mobile (Sheet)**:
```tsx
<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
  <SheetContent side="left" className="p-0 w-60">
    <SidebarContent onItemClick={() => setSidebarOpen(false)} />
  </SheetContent>
</Sheet>
```

**Features**:
- Logo/App name at top
- Navigation items with icons
- Active tab highlighting với `layoutId="activeIndicator"`
- Footer with status indicator
- Auto-close on mobile after click

---

### 2. Active Tab Highlighting

```tsx
const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href))

<Button variant={isActive ? 'secondary' : 'ghost'}>
  <Icon className={isActive && 'text-primary'} />
  <span>{item.label}</span>
  {isActive && (
    <motion.div
      layoutId="activeIndicator"
      className="ml-auto w-1.5 h-6 bg-primary rounded-full"
    />
  )}
</Button>
```

**Logic**:
- Exact match cho trang chủ (`/`)
- Prefix match cho other routes (`/ideas`, `/ideas/123`)
- Smooth animation khi chuyển tab

---

### 3. Breadcrumbs

```tsx
const generateBreadcrumbs = () => {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs = [{ label: 'Trang chủ', href: '/' }]
  
  paths.forEach((path, index) => {
    // Build breadcrumb chain from pathname
  })
  
  return breadcrumbs
}
```

**Examples**:
```
URL: /                    → Trang chủ
URL: /ideas              → Trang chủ > Ý tưởng
URL: /briefs/123         → Trang chủ > Briefs > #123
URL: /settings/profile   → Trang chủ > Cài đặt > Profile
```

---

### 4. Header

```tsx
<header className="sticky top-0 z-40 h-14 border-b bg-background/95 backdrop-blur">
  <div className="flex items-center justify-between">
    {/* Left: Mobile menu + Breadcrumbs */}
    <div>
      <Button onClick={() => setSidebarOpen(true)}>
        <Menu />
      </Button>
      <nav>{/* Breadcrumbs */}</nav>
    </div>
    
    {/* Right: Theme toggle + Avatar */}
    <div>
      <ThemeToggle />
      <Avatar>
        <AvatarFallback>VH</AvatarFallback>
      </Avatar>
    </div>
  </div>
</header>
```

**Features**:
- Sticky positioning
- Backdrop blur effect
- Responsive (hamburger on mobile)
- User avatar with fallback
- Theme toggle integration

---

### 5. Page Transitions

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

**Effect**: Fade + Slide animation khi chuyển trang

---

## 🎨 Styling

### CSS Classes

**Sidebar**:
```css
.sidebar {
  @apply fixed inset-y-0 w-60 border-r bg-card;
}
```

**Header**:
```css
.header {
  @apply sticky top-0 z-40 h-14 border-b;
  @apply bg-background/95 backdrop-blur;
}
```

**Content**:
```css
.content {
  @apply px-4 py-6 sm:px-6 lg:px-8;
}
```

### Theme Support

All colors use CSS variables:
- `bg-background` - Main background
- `bg-card` - Card/sidebar background
- `text-foreground` - Main text
- `text-muted-foreground` - Secondary text
- `bg-primary` - Accent color

**Dark mode works automatically** with `ThemeProvider`!

---

## 📱 Responsive Breakpoints

```css
/* Mobile first */
.sidebar { display: none; }

/* Desktop (≥1024px) */
@media (min-width: 1024px) {
  .sidebar { display: flex; }
}
```

**Behavior**:
- Mobile: Sidebar hidden, hamburger menu visible
- Desktop: Sidebar fixed, hamburger hidden

---

## 🔧 Customization

### Change Sidebar Width

```tsx
// In Layout.tsx
<aside className="lg:w-72"> {/* Change from w-60 to w-72 */}
  <SidebarContent />
</aside>

<div className="lg:pl-72"> {/* Match the width */}
  {/* Content */}
</div>
```

### Add New Nav Item

```tsx
const navItems: NavItem[] = [
  // ... existing items
  { href: '/analytics', label: 'Analytics', icon: BarChart3 }, // NEW
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
      </div>
    </div>
  </Link>
</div>
```

### Customize Avatar

```tsx
<Avatar className="h-8 w-8">
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>
    {user.initials}
  </AvatarFallback>
</Avatar>
```

---

## 🎭 Animation Variants

### Nav Item Hover

```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  <Button>Nav Item</Button>
</motion.div>
```

### Active Indicator

```tsx
<motion.div
  layoutId="activeIndicator"
  className="ml-auto w-1.5 h-6 bg-primary rounded-full"
  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
/>
```

**Effect**: Smooth morphing animation between tabs

### Page Transition

```tsx
initial={{ opacity: 0, y: 10 }}   // Start: invisible, 10px down
animate={{ opacity: 1, y: 0 }}    // End: visible, original position
exit={{ opacity: 0, y: -10 }}     // Exit: invisible, 10px up
```

---

## 🐛 Troubleshooting

### Issue: Sidebar không đóng trên mobile

**Solution**: Đảm bảo `onItemClick={() => setSidebarOpen(false)}` được pass vào `SidebarContent`

```tsx
<SidebarContent onItemClick={() => setSidebarOpen(false)} />
```

### Issue: Active tab không highlight

**Solution**: Kiểm tra `usePathname()` trả về đúng path

```tsx
const pathname = usePathname()
console.log('Current path:', pathname)
```

### Issue: Breadcrumbs không hiển thị

**Solution**: Đảm bảo có items trong navItems match với current route

### Issue: Animation lag

**Solution**: Reduce animation duration

```tsx
transition={{ duration: 0.1 }} // Faster
```

---

## ✅ Best Practices

### 1. **Consistent Navigation**
```tsx
// Keep nav items in sync with actual routes
const navItems = [
  { href: '/ideas', label: 'Ideas', icon: Lightbulb },
]

// Actual route file: app/ideas/page.tsx
```

### 2. **Mobile UX**
```tsx
// Always close mobile menu after navigation
<Link href="/ideas" onClick={onItemClick}>
```

### 3. **Accessibility**
```tsx
// Use semantic HTML
<nav>Navigation items</nav>
<main>Content</main>

// Add ARIA labels
<Button aria-label="Open menu">
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

---

## 📊 Component Tree

```
Layout
├── Sidebar (Desktop - Fixed)
│   └── SidebarContent
│       ├── Logo
│       ├── Navigation (navItems.map)
│       └── Footer
│
├── Sheet (Mobile Sidebar)
│   └── SheetContent
│       └── SidebarContent
│
└── Main Container
    ├── Header (Sticky)
    │   ├── Mobile Menu Button
    │   ├── Breadcrumbs
    │   ├── ThemeToggle
    │   └── Avatar
    │
    └── Content Area
        └── AnimatePresence
            └── motion.div
                └── {children}
```

---

## 🎯 Integration Examples

### Example 1: Simple Page

```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Your content here...</p>
    </div>
  )
}
```

**Result**: Layout automatically wraps the page with sidebar + header

### Example 2: Page với Custom Title

```tsx
// If you need custom page title (mobile)
// Pass through route layout or context
```

### Example 3: Nested Routes

```
/settings              → Shows "Trang chủ > Cài đặt"
/settings/profile     → Shows "Trang chủ > Cài đặt > Profile"
```

---

## 🚀 Performance Tips

1. **Lazy load icons**: Import only used icons
2. **Memoize callbacks**: Use `useCallback` for event handlers
3. **Optimize re-renders**: Use `React.memo` for static components
4. **Reduce motion**: Respect `prefers-reduced-motion`

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

<motion.div
  initial={prefersReducedMotion ? {} : { opacity: 0 }}
  animate={prefersReducedMotion ? {} : { opacity: 1 }}
>
```

---

## 📚 Related Components

- `ThemeProvider` - Theme management
- `ThemeToggle` - Dark/Light toggle button
- `Button` - Styled button component
- `Avatar` - User avatar component
- `Sheet` - Mobile drawer/sheet
- `Separator` - Divider line

---

**Created**: November 3, 2025  
**Status**: ✅ Production Ready  
**Framework**: Next.js 14 + Tailwind + shadcn/ui  
**Animation**: Framer Motion


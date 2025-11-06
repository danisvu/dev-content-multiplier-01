# 🚀 Sidebar Component - Quick Start

## ✅ Đã Setup Xong

Sidebar component độc lập với đầy đủ tính năng production-ready!

### 📦 Components Mới
- ✅ `Sidebar.tsx` - Main sidebar component + SidebarLayout wrapper
- ✅ `Tooltip.tsx` - Tooltip component from Radix UI
- ✅ `ScrollArea.tsx` - Scrollable area component
- ✅ `sidebar-demo/page.tsx` - Full demo & showcase page

### 🎨 Features
- ✅ **Responsive**: Sticky sidebar (desktop), Sheet drawer (mobile)
- ✅ **Active Highlighting**: Smooth animation với layoutId
- ✅ **Tooltips**: Instant tooltips khi hover icons
- ✅ **Animations**: Framer Motion cho mọi interaction
- ✅ **Dark Mode**: Full theme support
- ✅ **Logo**: Gradient logo với animated status
- ✅ **Footer**: Version info + Logout button

---

## 🧪 Test Ngay

### 1. Server đang chạy

Frontend server đang chạy trên: **http://localhost:3000**

### 2. Truy cập demo page

Mở browser: **http://localhost:3000/sidebar-demo**

### 3. Test các tính năng

#### ✅ Desktop (≥1024px):
```
✓ Sidebar hiển thị cố định bên trái (240px)
✓ Click nav items → active indicator di chuyển mượt
✓ Hover icons → tooltip hiển thị ngay
✓ Hover items → slide sang phải 4px
✓ Click logo → về trang chủ
```

#### ✅ Mobile (<1024px):
```
✓ Sidebar ẩn
✓ Hamburger menu (☰) ở góc trái trên
✓ Click hamburger → Sheet drawer slide từ trái
✓ Click nav item → Drawer tự động đóng
✓ Click overlay/X → Drawer đóng
```

#### ✅ Animations:
```
✓ Active indicator: smooth morphing
✓ Hover nav: slide animation
✓ Logo hover: scale effect
✓ Sheet: slide in/out animation
```

---

## 🎯 Apply vào App

### Cách 1: Dùng SidebarLayout (Recommended)

```tsx
// app/ideas/page.tsx
import { SidebarLayout } from '@/components/Sidebar'

export default function IdeasPage() {
  return (
    <SidebarLayout>
      <div className="p-8">
        <h1>My Ideas</h1>
        {/* Your content */}
      </div>
    </SidebarLayout>
  )
}
```

### Cách 2: Apply toàn app (Root Layout)

```tsx
// app/layout.tsx
import { Sidebar } from './components/Sidebar'
import { ThemeProvider } from './components/ThemeProvider'
import { Toaster } from './components/ui/toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Cách 3: Specific Pages Only

```tsx
// Chỉ apply cho một số trang cụ thể
// app/dashboard/layout.tsx
import { Sidebar } from '../components/Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
```

---

## 🎨 Customization

### Thêm Nav Item

```tsx
// app/components/Sidebar.tsx (line ~28)
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

### Thay Logo

```tsx
// app/components/Sidebar.tsx (line ~55)
<div className="p-6 border-b">
  <Link href="/">
    <div className="flex items-center gap-3">
      <img src="/logo.png" alt="Logo" className="w-10 h-10" />
      <div>
        <h2 className="font-bold text-lg">Your App</h2>
        <p className="text-xs text-muted-foreground">v1.0</p>
      </div>
    </div>
  </Link>
</div>
```

### Thay đổi Sidebar Width

```tsx
// app/components/Sidebar.tsx
<aside className="lg:w-72"> {/* Change from w-60 to w-72 */}
  ...
</aside>

<SheetContent className="p-0 w-72"> {/* Match width */}
  ...
</SheetContent>
```

### Custom Logout Action

```tsx
// app/components/Sidebar.tsx (line ~144)
<Button
  onClick={() => {
    // Your logout logic
    localStorage.removeItem('token')
    router.push('/login')
  }}
>
  <LogOut />
  Đăng xuất
</Button>
```

---

## 📱 Navigation Routes

Các route đã được cấu hình:

| Route | Icon | Label | Status |
|-------|------|-------|--------|
| `/ideas` | 💡 Lightbulb | Ý tưởng | ✅ |
| `/briefs` | 📄 FileText | Briefs | ✅ |
| `/drafts` | ✏️ Pen | Bản nháp | 🆕 New |
| `/settings` | ⚙️ Settings | Cài đặt | ✅ |

**Note**: Route `/drafts` chưa có page, cần tạo `app/drafts/page.tsx`

---

## 🐛 Troubleshooting

### Sidebar không hiển thị trên desktop

```bash
# Check screen width
console.log(window.innerWidth)  # Should be ≥1024
```

### Hamburger menu không hoạt động

```tsx
// Check Sheet state
<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
```

### Active tab không highlight

```tsx
// Debug pathname
const pathname = usePathname()
console.log('Current:', pathname)
```

### Tooltip không hiển thị

```tsx
// Make sure TooltipProvider is present
<TooltipProvider delayDuration={0}>
  {/* Tooltips */}
</TooltipProvider>
```

---

## 🎁 Bonus Features

### 1. Logo với Status Indicator
- Gradient background (purple → blue → cyan)
- Green dot với pulse animation
- Click để về home

### 2. Version Display
- App version: "v2.0.3"
- System status: "All systems operational"
- Green indicator dot

### 3. Logout Button
- Destructive styling (red)
- Tooltip: "Đăng xuất khỏi tài khoản"
- Hover effects

### 4. Badge Support
```tsx
{ href: '/ideas', label: 'Ý tưởng', icon: Lightbulb, badge: 12 }
```
Shows notification badge with number

---

## 📚 Documentation

Chi tiết đầy đủ: **`SIDEBAR_COMPONENT_GUIDE.md`**

---

## ✨ So sánh với Layout Component

| Feature | Layout Component | Sidebar Component |
|---------|-----------------|-------------------|
| **Sidebar** | ✅ Có | ✅ Có |
| **Header** | ✅ Có (với breadcrumbs) | ❌ Không |
| **Tooltips** | ❌ Không | ✅ Có |
| **ScrollArea** | ❌ Không | ✅ Có |
| **Footer** | ✅ Basic | ✅ Advanced |
| **Logo** | ✅ Basic | ✅ Gradient + Status |
| **Mobile** | ✅ Sheet | ✅ Sheet |
| **Animations** | ✅ Basic | ✅ Advanced |
| **Use Case** | Full layout | Sidebar only |

**Recommendation**: 
- Dùng **Layout** nếu cần header + breadcrumbs
- Dùng **Sidebar** nếu chỉ cần navigation sidebar

---

## 🚀 Next Steps

1. ✅ Test trên `/sidebar-demo`
2. ⏭️ Tạo route `/drafts` (hiện chưa có page)
3. ⏭️ Customize logo và colors
4. ⏭️ Integrate logout logic với backend
5. ⏭️ Add badge counts từ API

---

**Created**: November 3, 2025  
**Status**: 🎉 Ready to Use!  
**Test URL**: http://localhost:3000/sidebar-demo  
**Full Guide**: SIDEBAR_COMPONENT_GUIDE.md


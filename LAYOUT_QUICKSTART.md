# 🚀 Layout Component - Quick Start

## ✅ Đã Setup Xong

Layout component đã được tạo với đầy đủ tính năng:

### 📦 Components Mới
- ✅ `Layout.tsx` - Main layout với sidebar + header + content
- ✅ `Avatar.tsx` - User avatar component
- ✅ `Sheet.tsx` - Mobile drawer/sidebar
- ✅ `Separator.tsx` - Divider component

### 🎨 Features
- ✅ **Responsive**: Sidebar cố định (desktop), hamburger menu (mobile)
- ✅ **Navigation**: Active tab highlighting với smooth animation
- ✅ **Breadcrumbs**: Auto-generate từ pathname
- ✅ **Theme Toggle**: Dark/Light mode với localStorage
- ✅ **Animations**: Page transitions, hover effects
- ✅ **User Avatar**: Với fallback initials

---

## 🧪 Test Ngay

### 1. Khởi động dev server

```bash
cd frontend
npm run dev
```

### 2. Truy cập trang demo

Mở browser: **http://localhost:3000/layout-demo**

### 3. Test các tính năng

#### Desktop (≥1024px):
- ✓ Sidebar hiển thị cố định bên trái
- ✓ Click vào nav items → active highlighting
- ✓ Breadcrumbs hiển thị ở header
- ✓ Theme toggle ở góc phải trên
- ✓ Avatar hiển thị với initials "VH"

#### Mobile (<1024px):
- ✓ Sidebar ẩn
- ✓ Hamburger menu (☰) ở góc trái trên
- ✓ Click hamburger → Sheet drawer mở ra
- ✓ Click nav item → Sheet tự đóng

#### Animation:
- ✓ Chuyển trang → fade + slide effect
- ✓ Click nav item → active indicator di chuyển mượt
- ✓ Hover nav item → scale animation

---

## 🎯 Apply vào App

### Option 1: Replace AppLayout (Recommended)

```tsx
// app/layout.tsx
import { Layout } from './components/Layout'  // ← NEW
import { ThemeProvider } from './components/ThemeProvider'
import { Toaster } from './components/ui/toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Layout>  {/* ← Replace AppLayout with Layout */}
            {children}
          </Layout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Option 2: Keep Both (Test First)

```tsx
// Test trên trang cụ thể
// app/test-layout/page.tsx
import { Layout } from '../components/Layout'

export default function TestPage() {
  return (
    <Layout pageTitle="Test">
      <div>Content here...</div>
    </Layout>
  )
}
```

---

## 📱 Routes Available

Navigation items đã được cấu hình:

| Route | Label | Icon | Status |
|-------|-------|------|--------|
| `/` | Trang chủ | Home | ✅ Active |
| `/ideas` | Ý tưởng | Lightbulb | ✅ Active |
| `/briefs` | Briefs | FileText | ✅ Active |
| `/packs` | Packs | Package | ✅ Active |
| `/analytics` | Analytics | BarChart3 | 🆕 New |
| `/settings` | Cài đặt | Settings | ✅ Active |

---

## 🎨 Customization

### Thay đổi Logo

```tsx
// app/components/Layout.tsx (line ~45)
<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
  <img src="/logo.png" alt="Logo" />  {/* ← Add your logo */}
</div>
```

### Thêm Nav Item

```tsx
// app/components/Layout.tsx (line ~28)
const navItems: NavItem[] = [
  // ... existing items
  { href: '/drafts', label: 'Drafts', icon: Pen },  // ← NEW
]
```

### Change Avatar Initials

```tsx
// app/components/Layout.tsx (line ~185)
<AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
  VH  {/* ← Change to your initials */}
</AvatarFallback>
```

### Thay đổi Sidebar Width

```tsx
// app/components/Layout.tsx
<aside className="lg:w-72"> {/* ← Change from w-60 to w-72 */}
  ...
</aside>

<div className="lg:pl-72"> {/* ← Match the width */}
  ...
</div>
```

---

## 🐛 Troubleshooting

### Sidebar không hiển thị trên desktop

**Kiểm tra**: Màn hình có ≥1024px không?

```bash
# Press F12 → Console
console.log(window.innerWidth)  # Should be ≥1024
```

### Active tab không highlight

**Kiểm tra pathname**:

```tsx
// Add to Layout.tsx
console.log('Current pathname:', pathname)
```

### Mobile menu không đóng

**Solution**: Đảm bảo `onItemClick={() => setSidebarOpen(false)}` được pass

### Animation lag

**Reduce duration**:

```tsx
transition={{ duration: 0.1 }}  // Faster
```

---

## 📚 Documentation

Chi tiết đầy đủ: **`LAYOUT_COMPONENT_GUIDE.md`**

---

## ✨ Next Steps

1. ✅ Test layout trên `/layout-demo`
2. ⏭️ Replace `AppLayout` với `Layout`
3. ⏭️ Tạo route `/analytics` (hiện chưa có page)
4. ⏭️ Customize logo và avatar
5. ⏭️ Add user info (name, email) từ backend

---

**Created**: November 3, 2025  
**Status**: 🎉 Ready to Use!  
**Test URL**: http://localhost:3000/layout-demo


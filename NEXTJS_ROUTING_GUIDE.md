# 🚀 Next.js Routing Guide - App Router

## Tổng Quan

Next.js 14 sử dụng **App Router** với **file-based routing**. Mỗi folder trong `app/` directory tự động trở thành một route.

---

## 📁 Cấu Trúc Thư Mục

### Current Structure

```
app/
├── page.tsx                    → / (Trang chủ)
├── layout.tsx                  → Root layout (wrap tất cả pages)
├── globals.css                 → Global styles
│
├── ideas/
│   └── page.tsx               → /ideas (Danh sách ý tưởng)
│
├── briefs/
│   ├── page.tsx               → /briefs (Danh sách briefs)
│   └── [id]/
│       └── page.tsx           → /briefs/:id (Chi tiết brief)
│
├── packs/
│   ├── page.tsx               → /packs (Danh sách packs)
│   ├── new/
│   │   └── page.tsx           → /packs/new (Tạo pack mới)
│   └── [id]/
│       └── page.tsx           → /packs/:id (Chi tiết pack)
│
├── settings/
│   └── page.tsx               → /settings (Cài đặt)
│
└── components/
    ├── AppLayout.tsx          → Shared layout
    └── ui/                    → UI components
```

---

## 🎯 Routing Rules

### 1. **Static Routes** (Trang cố định)

**Cấu trúc**:
```
app/
└── about/
    └── page.tsx
```

**URL**: `/about`

**Example**:
```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>Về Chúng Tôi</h1>
      <p>Thông tin về ứng dụng...</p>
    </div>
  )
}
```

### 2. **Dynamic Routes** (Trang động với tham số)

**Cấu trúc**:
```
app/
└── briefs/
    └── [id]/
        └── page.tsx
```

**URL**: `/briefs/1`, `/briefs/2`, `/briefs/123`

**Example**:
```tsx
// app/briefs/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'

export default function BriefDetailPage() {
  const params = useParams()
  const briefId = params.id as string
  
  return (
    <div>
      <h1>Brief #{briefId}</h1>
    </div>
  )
}
```

### 3. **Nested Routes** (Trang lồng nhau)

**Cấu trúc**:
```
app/
└── dashboard/
    ├── page.tsx           → /dashboard
    ├── analytics/
    │   └── page.tsx       → /dashboard/analytics
    └── reports/
        └── page.tsx       → /dashboard/reports
```

### 4. **Route Groups** (Nhóm routes không ảnh hưởng URL)

**Cấu trúc**:
```
app/
├── (marketing)/
│   ├── about/
│   │   └── page.tsx       → /about (not /marketing/about)
│   └── contact/
│       └── page.tsx       → /contact
│
└── (dashboard)/
    ├── stats/
    │   └── page.tsx       → /stats
    └── settings/
        └── page.tsx       → /settings
```

**Note**: Dấu `()` không xuất hiện trong URL

---

## 📄 File Conventions

### Special Files

| File | Purpose | Example |
|------|---------|---------|
| `page.tsx` | Định nghĩa UI của route | `/app/ideas/page.tsx` |
| `layout.tsx` | Shared UI cho route và children | `/app/layout.tsx` |
| `loading.tsx` | Loading UI (Suspense boundary) | `/app/ideas/loading.tsx` |
| `error.tsx` | Error UI | `/app/ideas/error.tsx` |
| `not-found.tsx` | 404 UI | `/app/not-found.tsx` |

---

## 🛠️ Tạo Trang Mới - Step by Step

### Example 1: Trang Static (Dashboard)

#### Step 1: Tạo thư mục và file
```bash
mkdir -p app/dashboard
touch app/dashboard/page.tsx
```

#### Step 2: Viết component
```tsx
// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { PageTransition } from '../components/PageTransition'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalIdeas: 0,
    totalBriefs: 0,
    totalPacks: 0
  })

  useEffect(() => {
    // Fetch data
    fetchStats()
  }, [])

  const fetchStats = async () => {
    // API calls...
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            📊 Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ideas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalIdeas}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Briefs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalBriefs}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Packs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalPacks}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
```

#### Step 3: Thêm vào navigation
```tsx
// app/components/AppLayout.tsx
const navItems: NavItem[] = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart }, // NEW
  { href: '/ideas', label: 'Ý tưởng', icon: Lightbulb },
  { href: '/briefs', label: 'Briefs', icon: FileText },
  // ...
]
```

#### Step 4: Test
```
URL: http://localhost:3910/dashboard
```

---

### Example 2: Trang Dynamic (User Profile)

#### Step 1: Tạo cấu trúc dynamic route
```bash
mkdir -p app/users/[id]
touch app/users/[id]/page.tsx
```

#### Step 2: Implement component
```tsx
// app/users/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { PageTransition } from '../../components/PageTransition'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import { toastError } from '@/lib/toast'

const API_BASE_URL = 'http://localhost:3911/api'

interface User {
  id: number
  name: string
  email: string
  role: string
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [userId])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`)
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user:', error)
      toastError('Lỗi', 'Không thể tải thông tin user')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            User Profile
          </h1>

          <Card>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
```

#### Step 3: Test
```
URL: http://localhost:3910/users/1
URL: http://localhost:3910/users/2
URL: http://localhost:3910/users/123
```

---

### Example 3: Nested Routes (Settings với sub-pages)

#### Step 1: Tạo cấu trúc nested
```bash
mkdir -p app/settings/{profile,security,notifications}
touch app/settings/page.tsx
touch app/settings/profile/page.tsx
touch app/settings/security/page.tsx
touch app/settings/notifications/page.tsx
```

#### Step 2: Main settings page
```tsx
// app/settings/page.tsx
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '../components/ui'

export default function SettingsPage() {
  const sections = [
    { href: '/settings/profile', title: 'Profile', icon: '👤' },
    { href: '/settings/security', title: 'Security', icon: '🔒' },
    { href: '/settings/notifications', title: 'Notifications', icon: '🔔' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map(section => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:shadow-lg cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{section.icon}</span>
                  {section.title}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

#### Step 3: Sub-pages
```tsx
// app/settings/profile/page.tsx
export default function ProfileSettingsPage() {
  return (
    <div className="p-8">
      <h1>Profile Settings</h1>
      <p>Edit your profile information...</p>
    </div>
  )
}

// app/settings/security/page.tsx
export default function SecuritySettingsPage() {
  return (
    <div className="p-8">
      <h1>Security Settings</h1>
      <p>Change password, 2FA...</p>
    </div>
  )
}

// app/settings/notifications/page.tsx
export default function NotificationsSettingsPage() {
  return (
    <div className="p-8">
      <h1>Notification Settings</h1>
      <p>Email preferences...</p>
    </div>
  )
}
```

#### URLs
```
/settings                    → Main settings page
/settings/profile           → Profile settings
/settings/security          → Security settings
/settings/notifications     → Notification settings
```

---

## 🎨 Layout System

### Root Layout (Toàn ứng dụng)

```tsx
// app/layout.tsx
import { AppLayout } from './components/AppLayout'
import { ThemeProvider } from './components/ThemeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <ThemeProvider>
          <AppLayout>
            {children}  {/* Tất cả pages render ở đây */}
          </AppLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Nested Layout (Cho một group routes)

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-container">
      {/* Sidebar chỉ cho dashboard */}
      <aside className="dashboard-sidebar">
        <nav>
          <a href="/dashboard">Overview</a>
          <a href="/dashboard/analytics">Analytics</a>
          <a href="/dashboard/reports">Reports</a>
        </nav>
      </aside>
      
      {/* Content area */}
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  )
}
```

**Hierarchy**:
```
app/layout.tsx (Root)
  └── app/dashboard/layout.tsx (Dashboard)
       └── app/dashboard/analytics/page.tsx (Page)
```

---

## 🔄 Navigation

### 1. **Link Component** (Recommended)

```tsx
import Link from 'next/link'

// Static link
<Link href="/ideas">
  <button>Xem Ideas</button>
</Link>

// Dynamic link
<Link href={`/briefs/${brief.id}`}>
  <button>Xem Brief</button>
</Link>

// With query params
<Link href="/search?q=react&category=tech">
  Search
</Link>
```

### 2. **useRouter Hook**

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function MyComponent() {
  const router = useRouter()

  const handleNavigate = () => {
    router.push('/ideas')           // Navigate
    // router.back()                 // Go back
    // router.forward()              // Go forward
    // router.refresh()              // Refresh page
    // router.replace('/briefs')     // Replace (no history)
  }

  return <button onClick={handleNavigate}>Go to Ideas</button>
}
```

### 3. **Programmatic Navigation**

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function CreateBriefButton() {
  const router = useRouter()

  const handleCreate = async () => {
    // Create brief
    const response = await createBrief(...)
    
    // Navigate to detail page
    router.push(`/briefs/${response.data.id}`)
  }

  return <button onClick={handleCreate}>Create Brief</button>
}
```

---

## 📊 Data Fetching

### Client-Side (useEffect + axios)

```tsx
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      const response = await axios.get('http://localhost:3911/api/ideas')
      setIdeas(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {ideas.map(idea => (
        <div key={idea.id}>{idea.title}</div>
      ))}
    </div>
  )
}
```

### Server-Side (Server Components)

```tsx
// app/ideas/page.tsx
// No 'use client' directive = Server Component

async function getIdeas() {
  const res = await fetch('http://localhost:3911/api/ideas', {
    cache: 'no-store' // Disable caching
  })
  return res.json()
}

export default async function IdeasPage() {
  const ideas = await getIdeas()

  return (
    <div>
      {ideas.map(idea => (
        <div key={idea.id}>{idea.title}</div>
      ))}
    </div>
  )
}
```

**Pros của Server Components**:
- Faster initial load
- Better SEO
- Smaller JavaScript bundle
- Direct database access (if needed)

---

## 🎯 Common Patterns

### Pattern 1: List + Detail Pages

```
app/
└── products/
    ├── page.tsx           → /products (List)
    └── [id]/
        └── page.tsx       → /products/:id (Detail)
```

```tsx
// List page
import Link from 'next/link'

export default function ProductsPage() {
  const products = [...]

  return (
    <div>
      {products.map(product => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <div>{product.name}</div>
        </Link>
      ))}
    </div>
  )
}

// Detail page
export default function ProductDetailPage({ params }) {
  const { id } = params
  // Fetch product by id
}
```

### Pattern 2: Create + Edit Forms

```
app/
└── posts/
    ├── page.tsx           → /posts (List)
    ├── new/
    │   └── page.tsx       → /posts/new (Create)
    └── [id]/
        ├── page.tsx       → /posts/:id (View)
        └── edit/
            └── page.tsx   → /posts/:id/edit (Edit)
```

### Pattern 3: Tabs/Sections

```
app/
└── profile/
    ├── page.tsx           → /profile (Overview)
    ├── posts/
    │   └── page.tsx       → /profile/posts
    ├── followers/
    │   └── page.tsx       → /profile/followers
    └── settings/
        └── page.tsx       → /profile/settings
```

---

## 🚦 Loading & Error States

### Loading UI

```tsx
// app/ideas/loading.tsx
export default function Loading() {
  return (
    <div className="p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}
```

**Automatic**: Next.js shows this while `page.tsx` is loading

### Error UI

```tsx
// app/ideas/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="p-8">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Not Found

```tsx
// app/briefs/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h2>Brief Not Found</h2>
      <p>The brief you're looking for doesn't exist.</p>
      <Link href="/briefs">Back to Briefs</Link>
    </div>
  )
}
```

```tsx
// In page.tsx
import { notFound } from 'next/navigation'

export default async function BriefDetailPage({ params }) {
  const brief = await getBrief(params.id)
  
  if (!brief) {
    notFound() // Renders not-found.tsx
  }

  return <div>...</div>
}
```

---

## 🎨 Metadata (SEO)

### Static Metadata

```tsx
// app/ideas/page.tsx
export const metadata = {
  title: 'Ideas - Content Multiplier',
  description: 'Manage your content ideas',
}

export default function IdeasPage() {
  return <div>...</div>
}
```

### Dynamic Metadata

```tsx
// app/briefs/[id]/page.tsx
export async function generateMetadata({ params }) {
  const brief = await getBrief(params.id)
  
  return {
    title: brief.title,
    description: brief.target_audience.substring(0, 160),
  }
}

export default function BriefDetailPage({ params }) {
  return <div>...</div>
}
```

---

## ✅ Best Practices

### 1. **File Organization**

```
✅ GOOD: Clear structure
app/
└── products/
    ├── page.tsx
    ├── loading.tsx
    ├── error.tsx
    └── [id]/
        └── page.tsx

❌ BAD: Messy structure
app/
├── product-list.tsx
├── product-detail.tsx
└── products-error.tsx
```

### 2. **Component Placement**

```
✅ GOOD: Shared components in components/
app/
├── ideas/
│   └── page.tsx
└── components/
    └── IdeaCard.tsx  ← Used by multiple pages

❌ BAD: Page-specific components in components/
app/
└── components/
    └── IdeasPageSpecificComponent.tsx
```

### 3. **Use 'use client' Only When Needed**

```tsx
// Server Component (default) - NO 'use client'
export default async function IdeasPage() {
  const ideas = await getIdeas()
  return <div>...</div>
}

// Client Component - WITH 'use client'
'use client'
import { useState } from 'react'

export default function InteractivePage() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### 4. **SEO-Friendly URLs**

```
✅ GOOD:
/products/123/reviews
/blog/2024/january/my-post

❌ BAD:
/p?id=123&action=reviews
/post?date=2024-01-01&title=my-post
```

---

## 🧪 Quick Start Template

### New Page Checklist

```bash
# 1. Create directory
mkdir -p app/my-page

# 2. Create page.tsx
touch app/my-page/page.tsx

# 3. Add basic structure
```

```tsx
// app/my-page/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { PageTransition } from '../components/PageTransition'
import { Card } from '../components/ui'

export default function MyPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch API
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Page</h1>
          
          {/* Content here */}
        </div>
      </div>
    </PageTransition>
  )
}
```

```bash
# 4. Add to navigation (if needed)
# Edit app/components/AppLayout.tsx

# 5. Test
open http://localhost:3910/my-page
```

---

## 📚 Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)
- [Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)

---

**Created**: November 3, 2025  
**Next.js Version**: 14  
**Router**: App Router  
**Status**: ✅ Complete Guide


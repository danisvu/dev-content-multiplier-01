'use client'

import { Layout } from '../components/Layout'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Button,
  EmptyState,
  StatusBadge
} from '../components/ui'
import { Sparkles, Check, Info } from 'lucide-react'

export default function LayoutDemoPage() {
  return (
    <Layout pageTitle="Layout Demo">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">🎨 Layout Component Demo</h1>
          <p className="text-muted-foreground">
            Showcase của Layout component với Sidebar + Header + Content Area
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Responsive
              </CardTitle>
              <CardDescription>
                Sidebar ẩn trên mobile, hiện hamburger menu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusBadge status="approved">Desktop: Fixed Sidebar</StatusBadge>
              <StatusBadge status="review" className="ml-2">Mobile: Sheet Menu</StatusBadge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Animations
              </CardTitle>
              <CardDescription>
                Page transitions với Framer Motion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Fade + Slide page transitions</li>
                <li>✓ Active tab indicator animation</li>
                <li>✓ Hover effects trên nav items</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Features
              </CardTitle>
              <CardDescription>
                Full-featured layout system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Breadcrumbs navigation</li>
                <li>✓ Theme toggle (Dark/Light)</li>
                <li>✓ User avatar</li>
                <li>✓ Active route highlighting</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Demo */}
        <Card>
          <CardHeader>
            <CardTitle>🧭 Navigation System</CardTitle>
            <CardDescription>
              Click vào các tab ở sidebar để test navigation và active highlighting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Available Routes:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <StatusBadge status="approved">/ - Trang chủ</StatusBadge>
                <StatusBadge status="approved">/ideas - Ý tưởng</StatusBadge>
                <StatusBadge status="approved">/briefs - Briefs</StatusBadge>
                <StatusBadge status="approved">/packs - Packs</StatusBadge>
                <StatusBadge status="draft">/analytics - Analytics</StatusBadge>
                <StatusBadge status="approved">/settings - Cài đặt</StatusBadge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Current Route:</h3>
              <code className="px-3 py-2 bg-muted rounded text-sm">
                /layout-demo
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Breadcrumbs Demo */}
        <Card>
          <CardHeader>
            <CardTitle>🍞 Breadcrumbs Examples</CardTitle>
            <CardDescription>
              Breadcrumbs tự động generate từ pathname
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded">/</code>
                <span>→</span>
                <span className="text-muted-foreground">Trang chủ</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded">/ideas</code>
                <span>→</span>
                <span className="text-muted-foreground">Trang chủ &gt; Ý tưởng</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded">/briefs/123</code>
                <span>→</span>
                <span className="text-muted-foreground">Trang chủ &gt; Briefs &gt; #123</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded">/settings/profile</code>
                <span>→</span>
                <span className="text-muted-foreground">Trang chủ &gt; Cài đặt &gt; Profile</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Demo */}
        <Card>
          <CardHeader>
            <CardTitle>🌓 Theme System</CardTitle>
            <CardDescription>
              Toggle theme bằng nút Sun/Moon ở header (góc phải trên)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Theme được lưu vào <code className="bg-muted px-1 rounded">localStorage</code> 
                và tự động apply khi reload page.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">Test Light Mode</Button>
                <Button variant="default">Test Dark Mode</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State Demo */}
        <Card>
          <CardHeader>
            <CardTitle>📭 Empty State in Layout</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Sparkles}
              title="Perfect Layout Integration"
              description="Layout component hoạt động hoàn hảo với tất cả UI components khác"
              actionLabel="Explore More"
              onAction={() => alert('Layout works!')}
            />
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>💻 Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`// app/layout.tsx
import { Layout } from './components/Layout'

export default function RootLayout({ children }) {
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

// app/ideas/page.tsx
export default function IdeasPage() {
  return (
    <Layout pageTitle="Ý Tưởng">
      <div>
        <h1>My Ideas</h1>
        {/* Content */}
      </div>
    </Layout>
  )
}`}
            </pre>
          </CardContent>
        </Card>

        {/* Documentation Link */}
        <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">📚 Full Documentation</h3>
            <p className="text-muted-foreground max-w-md">
              Xem file <code className="bg-muted px-2 py-1 rounded">LAYOUT_COMPONENT_GUIDE.md</code> 
              {' '}để biết thêm chi tiết về cách sử dụng và customization.
            </p>
            <Button variant="default" size="lg">
              Read Full Guide →
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}


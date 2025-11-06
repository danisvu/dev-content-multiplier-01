'use client'

import { Sidebar, SidebarLayout } from '../components/Sidebar'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Button,
  StatusBadge
} from '../components/ui'
import { 
  Lightbulb,
  Sparkles,
  Check,
  Info,
  Zap,
  Target
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function SidebarDemoPage() {
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background">
        {/* Mobile spacing for hamburger menu */}
        <div className="h-16 lg:hidden" />
        
        <div className="container max-w-6xl mx-auto px-4 py-8 lg:py-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🎨 Sidebar Component Demo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Showcase của Sidebar component với đầy đủ tính năng: Responsive, Tooltips, Animations, Dark Mode
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Check className="w-5 h-5 text-green-500" />
                    Responsive Design
                  </CardTitle>
                  <CardDescription>
                    Tự động adapt theo kích thước màn hình
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Desktop: Sticky sidebar 240px
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Mobile: Hamburger menu với Sheet
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Auto-close sau khi click (mobile)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Smooth Animations
                  </CardTitle>
                  <CardDescription>
                    Framer Motion cho mọi interaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      Hover nav items → slide animation
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      Active indicator với layoutId
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      Sheet open/close animation
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="w-5 h-5 text-blue-500" />
                    Rich Features
                  </CardTitle>
                  <CardDescription>
                    Đầy đủ tính năng production-ready
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Tooltips khi hover icons
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Active route highlighting
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Dark/Light mode support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* How to Test Section */}
          <Card className="mb-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                🧪 Hướng Dẫn Test
              </CardTitle>
              <CardDescription>
                Thử các tính năng của Sidebar component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Desktop Testing */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  💻 Desktop (≥1024px)
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Click vào các nav items</p>
                      <p className="text-sm text-muted-foreground">
                        → Active indicator sẽ di chuyển mượt mà (màu xanh ở bên trái)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Hover lên icons</p>
                      <p className="text-sm text-muted-foreground">
                        → Tooltip hiển thị ngay lập tức với tên đầy đủ
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Hover lên nav items</p>
                      <p className="text-sm text-muted-foreground">
                        → Item sẽ slide sang phải một chút (4px)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Mobile Testing */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  📱 Mobile (&lt;1024px)
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Click hamburger menu (☰) ở góc trái trên</p>
                      <p className="text-sm text-muted-foreground">
                        → Sheet drawer slide từ trái vào với animation mượt
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Click bất kỳ nav item nào</p>
                      <p className="text-sm text-muted-foreground">
                        → Drawer tự động đóng sau khi navigate
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Click overlay hoặc nút X</p>
                      <p className="text-sm text-muted-foreground">
                        → Drawer đóng với fade out animation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Theme Testing */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  🌓 Dark Mode
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Sidebar tự động adapt theo theme hiện tại. Dùng toggle ở header để test.
                </p>
                <div className="flex gap-2">
                  <StatusBadge status="approved">Light Mode</StatusBadge>
                  <StatusBadge status="draft">Dark Mode</StatusBadge>
                  <StatusBadge status="review">Auto (System)</StatusBadge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Items */}
          <Card className="mb-10">
            <CardHeader>
              <CardTitle>🧭 Navigation Items</CardTitle>
              <CardDescription>
                Các route được cấu hình trong Sidebar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium">Ý tưởng</p>
                    <code className="text-xs text-muted-foreground">/ideas</code>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Briefs</p>
                    <code className="text-xs text-muted-foreground">/briefs</code>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Bản nháp</p>
                    <code className="text-xs text-muted-foreground">/drafts</code>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Cài đặt</p>
                    <code className="text-xs text-muted-foreground">/settings</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Example */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                💻 Usage Example
              </CardTitle>
              <CardDescription>
                Cách sử dụng Sidebar component trong app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Option 1: Dùng SidebarLayout wrapper</p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`import { SidebarLayout } from '@/components/Sidebar'

export default function MyPage() {
  return (
    <SidebarLayout>
      <div className="p-8">
        {/* Your page content */}
      </div>
    </SidebarLayout>
  )
}`}
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Option 2: Dùng Sidebar component trực tiếp</p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`import { Sidebar } from '@/components/Sidebar'

export default function MyApp() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        {/* Your content */}
      </main>
    </div>
  )
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Footer CTA */}
          <div className="mt-12 text-center p-8 border-2 border-dashed rounded-lg">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-2xl font-bold mb-2">Ready to Use! 🎉</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Sidebar component đã sẵn sàng cho production. Customize và integrate vào app của bạn!
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="default" size="lg">
                View Documentation
              </Button>
              <Button variant="outline" size="lg">
                View Source Code
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}


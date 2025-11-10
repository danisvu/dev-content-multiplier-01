'use client'

import { ThemeToggle } from '../components/ThemeToggle'
import { useTheme } from '../components/ThemeProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Sun, Moon, Monitor, Check } from 'lucide-react'

export default function ThemeDemoPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-8">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Dark/Light Mode Demo</h1>
          <p className="text-muted-foreground">
            Hệ thống theme với localStorage persistence và system preference fallback
          </p>
        </div>

        {/* Current Theme Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Trạng thái Theme hiện tại</CardTitle>
            <CardDescription>
              Theme của bạn được tự động lưu vào localStorage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {theme === 'light' ? (
                  <Sun className="h-6 w-6 text-yellow-500" />
                ) : (
                  <Moon className="h-6 w-6 text-blue-500" />
                )}
                <span className="text-2xl font-bold capitalize">{theme} Mode</span>
              </div>
              <Badge variant={theme === 'light' ? 'default' : 'secondary'} className="ml-auto">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Theme Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Chọn Theme</CardTitle>
            <CardDescription>
              Click vào một trong các nút dưới đây để thay đổi theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Light Mode Button */}
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Light Mode</div>
                  <div className="text-xs text-muted-foreground">Giao diện sáng</div>
                </div>
                {theme === 'light' && (
                  <Check className="h-4 w-4 absolute top-2 right-2" />
                )}
              </Button>

              {/* Dark Mode Button */}
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Dark Mode</div>
                  <div className="text-xs text-muted-foreground">Giao diện tối</div>
                </div>
                {theme === 'dark' && (
                  <Check className="h-4 w-4 absolute top-2 right-2" />
                )}
              </Button>
            </div>

            {/* Theme Toggle Component */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold mb-1">Quick Toggle</h4>
                  <p className="text-sm text-muted-foreground">
                    Sử dụng nút này để toggle nhanh giữa Light và Dark mode
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>✨ Tính năng</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>localStorage Persistence:</strong> Theme preference được tự động lưu và khôi phục
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>System Preference Fallback:</strong> Tự động detect system theme nếu chưa có preference
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Smooth Transitions:</strong> Animation mượt mà khi chuyển đổi theme
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Global Access:</strong> useTheme hook có thể sử dụng ở bất kỳ đâu trong app
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>ThemeToggle Component:</strong> Component có sẵn với icon animation đẹp mắt
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Usage Example */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Cách sử dụng</CardTitle>
            <CardDescription>
              Code examples để sử dụng theme trong components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Import useTheme hook:</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`import { useTheme } from '@/app/components/ThemeProvider'`}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Sử dụng trong component:</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`const { theme, setTheme, toggleTheme } = useTheme()

// Get current theme
console.log(theme) // 'light' | 'dark'

// Set theme
setTheme('dark')

// Toggle theme
toggleTheme()`}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Sử dụng ThemeToggle component:</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`import { ThemeToggle } from '@/app/components/ThemeToggle'

// Trong component
<ThemeToggle />`}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. Styling với dark mode:</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// Sử dụng dark: prefix trong Tailwind
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Nội dung
</div>`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Demo Content Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Demo 1</CardTitle>
              <CardDescription>
                Demo card với theme colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Đây là nội dung demo để xem theme áp dụng như thế nào.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Demo 2</CardTitle>
              <CardDescription>
                Một card khác để so sánh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge>Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


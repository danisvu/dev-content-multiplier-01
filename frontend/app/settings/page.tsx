'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, Save } from 'lucide-react'
import { PageTransition } from '../components/PageTransition'
import { 
  Button, 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  ThemeToggle,
  Modal
} from '../components/ui'
import { toastSuccess, toastError } from '@/lib/toast'

export default function SettingsPage() {
  const [showResetModal, setShowResetModal] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gemini')
  const [temperature, setTemperature] = useState(0.7)

  const handleSaveSettings = () => {
    // Save settings logic here
    toastSuccess('Đã lưu!', 'Cài đặt đã được cập nhật thành công.')
  }

  const handleReset = () => {
    setApiKey('')
    setModel('gemini')
    setTemperature(0.7)
    toastSuccess('Đã reset!', 'Cài đặt đã được khôi phục về mặc định.')
    setShowResetModal(false)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <SettingsIcon className="w-10 h-10" />
              Cài đặt
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý cấu hình ứng dụng và tài khoản của bạn
            </p>
          </div>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Giao diện</CardTitle>
              <CardDescription>
                Tùy chỉnh theme và hiển thị ứng dụng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Chọn theme sáng, tối hoặc theo hệ thống
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt AI</CardTitle>
              <CardDescription>
                Cấu hình API key và model AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Nhập API key của bạn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Model AI
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="gemini">Gemini (Google)</option>
                  <option value="deepseek">Deepseek</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Temperature: {temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Creative</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowResetModal(true)}>
                Reset về mặc định
              </Button>
              <Button onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </Button>
            </CardFooter>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Tài khoản</CardTitle>
              <CardDescription>
                Thông tin tài khoản và bảo mật
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">user@example.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Plan</p>
                  <p className="text-sm text-muted-foreground">Free Tier</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Đăng xuất
              </Button>
            </CardFooter>
          </Card>

          {/* Reset Confirmation Modal */}
          <Modal
            isOpen={showResetModal}
            onClose={() => setShowResetModal(false)}
            title="Reset cài đặt"
            description="Bạn có chắc chắn muốn khôi phục tất cả cài đặt về mặc định không?"
            confirmLabel="Reset"
            cancelLabel="Hủy"
            variant="destructive"
            onConfirm={handleReset}
          />
        </div>
      </div>
    </PageTransition>
  )
}


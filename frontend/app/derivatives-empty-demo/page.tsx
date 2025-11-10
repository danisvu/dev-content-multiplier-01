'use client'

import { EmptyState } from '../components/EmptyState'
import { FileText, Sparkles, Zap, Plus } from 'lucide-react'
import { Card } from '../components/ui/card'

export default function DerivativesEmptyDemoPage() {
  const handleCreateDerivative = () => {
    console.log('Create derivative clicked')
    alert('Tính năng tạo derivative sẽ được triển khai ở đây!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-8">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Derivatives Empty State Demo</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Các empty state khác nhau khi chưa có derivatives
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Default Variant - Large */}
          <Card className="p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 border-b">
              <h3 className="font-semibold">Default Variant - Large</h3>
              <p className="text-sm text-muted-foreground">Perfect for main content area</p>
            </div>
            <EmptyState
              icon={Sparkles}
              title="Chưa có derivatives nào"
              description="Tạo derivatives đầu tiên của bạn từ brief hiện tại. Chuyển đổi nội dung của bạn thành các định dạng phù hợp cho từng nền tảng mạng xã hội."
              actionLabel="Tạo Derivative Đầu Tiên"
              onAction={handleCreateDerivative}
              size="lg"
              className="border-0"
            />
          </Card>

          {/* Default Variant - Medium */}
          <Card className="p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 p-4 border-b">
              <h3 className="font-semibold">Default Variant - Medium</h3>
              <p className="text-sm text-muted-foreground">Good for cards and modals</p>
            </div>
            <EmptyState
              icon={FileText}
              title="Bắt đầu tạo nội dung"
              description="Chuyển đổi brief của bạn thành các bài đăng hấp dẫn cho Twitter, LinkedIn, Facebook và các nền tảng khác."
              actionLabel="Tạo Derivatives"
              onAction={handleCreateDerivative}
              size="md"
              className="border-0"
            />
          </Card>

          {/* Minimal Variant - Large */}
          <Card className="p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 border-b">
              <h3 className="font-semibold">Minimal Variant - Large</h3>
              <p className="text-sm text-muted-foreground">Clean and simple</p>
            </div>
            <EmptyState
              icon={Zap}
              title="Sẵn sàng nhân bản nội dung?"
              description="Sử dụng AI để tạo ra nhiều phiên bản nội dung phù hợp với từng nền tảng, tiết kiệm thời gian và công sức."
              actionLabel="Bắt Đầu Ngay"
              onAction={handleCreateDerivative}
              variant="minimal"
              size="lg"
              className="bg-transparent"
            />
          </Card>

          {/* Minimal Variant - Small */}
          <Card className="p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 p-4 border-b">
              <h3 className="font-semibold">Minimal Variant - Small</h3>
              <p className="text-sm text-muted-foreground">Compact for tight spaces</p>
            </div>
            <EmptyState
              icon={Plus}
              title="Thêm derivatives"
              description="Tạo phiên bản cho các nền tảng mới"
              actionLabel="Thêm"
              onAction={handleCreateDerivative}
              variant="minimal"
              size="sm"
              className="bg-transparent"
            />
          </Card>

          {/* Full Width Example */}
          <Card className="lg:col-span-2 p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 p-4 border-b">
              <h3 className="font-semibold">Full Width - Real Use Case</h3>
              <p className="text-sm text-muted-foreground">How it would appear in actual derivatives page</p>
            </div>
            <div className="min-h-[400px] flex items-center justify-center">
              <EmptyState
                icon={Sparkles}
                title="Chưa có derivatives nào được tạo"
                description="Brief này chưa có derivatives nào. Hãy bắt đầu bằng cách tạo phiên bản nội dung cho các nền tảng mạng xã hội như Twitter, LinkedIn, Facebook, Instagram, hoặc TikTok."
                actionLabel="Tạo Derivatives"
                onAction={handleCreateDerivative}
                size="lg"
                iconClassName="text-purple-500"
              />
            </div>
          </Card>
        </div>

        {/* Usage Example */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-bold mb-4">💡 Cách sử dụng</h2>
          <div className="space-y-3 text-sm">
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-mono text-xs mb-2">Basic usage:</p>
              <pre className="bg-background p-3 rounded overflow-x-auto">
{`<EmptyState
  icon={Sparkles}
  title="Chưa có derivatives nào"
  description="Tạo derivatives đầu tiên của bạn"
  actionLabel="Tạo Derivative"
  onAction={() => handleCreate()}
/>`}
              </pre>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-mono text-xs mb-2">With variants:</p>
              <pre className="bg-background p-3 rounded overflow-x-auto">
{`<EmptyState
  icon={Zap}
  title="No content yet"
  description="Start creating"
  actionLabel="Create"
  onAction={() => handleCreate()}
  variant="minimal"  // 'default' | 'minimal'
  size="lg"          // 'sm' | 'md' | 'lg'
/>`}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}


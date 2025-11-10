'use client'

import { ComparePreviews } from '../components/ComparePreviews'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'

export default function ComparePreviewsDemo() {
  const sampleContent = `🚀 Excited to share our latest product update!

We've just launched a revolutionary feature that will transform how you work. Check it out and let us know what you think!

#ProductLaunch #Innovation #TechNews`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Compare Previews Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Xem nội dung của bạn trên các nền tảng khác nhau
          </p>
        </div>

        {/* Content Card */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Nội dung mẫu</CardTitle>
            <CardDescription>
              Đây là nội dung sẽ được hiển thị trên tất cả các nền tảng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 font-sans">
                {sampleContent}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Previews */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
            Preview trên các nền tảng
          </h2>
          <ComparePreviews
            content={sampleContent}
            authorName="John Doe"
            authorUsername="@johndoe"
            avatarUrl=""
          />
        </div>

        {/* Custom Selection Example */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Tùy chỉnh nền tảng hiển thị</CardTitle>
            <CardDescription>
              Bạn có thể chọn hiển thị các nền tảng cụ thể
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Chỉ hiển thị Twitter và LinkedIn
              </h3>
              <ComparePreviews
                content={sampleContent}
                authorName="Jane Smith"
                authorUsername="@janesmith"
                avatarUrl=""
                showPlatforms={['twitter', 'linkedin']}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


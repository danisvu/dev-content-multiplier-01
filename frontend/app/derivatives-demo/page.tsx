'use client'

import { useState } from 'react'
import { DerivativeTabs, createDerivative, PlatformType } from '../components/DerivativeTabs'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export default function DerivativesDemoPage() {
  const [editMode, setEditMode] = useState(false)
  
  // Sample data với nội dung khác nhau cho mỗi platform
  const [derivatives, setDerivatives] = useState([
    createDerivative(
      'twitter',
      'Khám phá sức mạnh của AI trong việc tạo nội dung! 🚀\n\nVới công nghệ hiện đại, bạn có thể:\n✅ Tạo nội dung nhanh chóng\n✅ Tối ưu cho từng platform\n✅ Tiết kiệm thời gian\n\n#AI #ContentCreation #SocialMedia'
    ),
    createDerivative(
      'linkedin',
      `Cách AI đang thay đổi cách chúng ta tạo nội dung

Trong thời đại số hóa, việc tạo nội dung chất lượng cho nhiều nền tảng mạng xã hội là một thách thức lớn. Với sự trợ giúp của AI, chúng ta có thể:

📊 Phân tích xu hướng: AI giúp nhận diện các chủ đề hot và tối ưu nội dung
✍️ Tạo nội dung tự động: Từ một ý tưởng, AI có thể tạo nhiều phiên bản phù hợp với từng platform
🎯 Cá nhân hóa: Điều chỉnh tone và style cho phù hợp với đối tượng mục tiêu

Tương lai của content creation không phải là thay thế con người, mà là tăng cường khả năng sáng tạo của chúng ta.

#ArtificialIntelligence #ContentStrategy #DigitalMarketing #Innovation`
    ),
    createDerivative(
      'facebook',
      `🎉 Tin tuyệt vời cho các Content Creator! 🎉

Chúng tôi vừa ra mắt công cụ tạo nội dung tự động sử dụng AI - giúp bạn tiết kiệm hàng giờ đồng hồ trong việc tạo content cho các nền tảng khác nhau!

🌟 Tính năng nổi bật:
• Tạo nội dung tự động cho 5+ nền tảng
• Tối ưu ký tự cho từng platform
• Badge thông minh hiển thị giới hạn ký tự
• Giao diện thân thiện, dễ sử dụng

💡 Vì sao bạn nên thử?
✅ Tiết kiệm 70% thời gian tạo content
✅ Đảm bảo nội dung phù hợp với từng nền tảng
✅ Tăng hiệu quả marketing đa kênh

Hãy thử ngay và chia sẻ trải nghiệm của bạn! 👇

#ContentCreation #AI #SocialMediaMarketing #ProductivityTools`
    ),
    createDerivative(
      'instagram',
      `✨ Transform Your Content Game ✨

Tạo content cho nhiều nền tảng chưa bao giờ dễ dàng đến thế! 

🤖 AI-Powered Content Creation
📱 Optimized for Every Platform  
⚡️ Save Hours Every Week
💯 Professional Results

Với công cụ của chúng tôi, bạn có thể:
→ Tự động tạo nội dung cho Twitter, LinkedIn, Facebook, Instagram, TikTok
→ Kiểm tra giới hạn ký tự tự động
→ Chỉnh sửa và tùy chỉnh dễ dàng

Ready to level up? 🚀

#ContentCreator #SocialMediaTips #AITools #DigitalMarketing #ContentStrategy #MarketingTools #SocialMedia #CreativeTools`
    ),
    createDerivative(
      'tiktok',
      `POV: Bạn vừa tìm ra công cụ AI giúp tạo content cho 5 nền tảng cùng lúc 🤯

Before: 5 giờ viết content cho từng platform 😫
After: 30 phút có đủ content cho cả tuần 🎉

Bí quyết? AI Content Multiplier 🚀

✨ Features:
• Tự động adapt content cho từng platform
• Smart character limit checking
• Beautiful UI với dark mode
• Real-time preview

Content creators assemble! 📢
Drop "AI" để nhận link demo ⬇️

#ContentCreation #AITools #SocialMediaHacks #CreatorEconomy #TechTools #ProductivityHacks #MarketingTips #ContentStrategy #CreatorTools #DigitalMarketing`
    ),
  ])

  const handleContentChange = (platform: PlatformType, content: string) => {
    setDerivatives(prevDerivatives =>
      prevDerivatives.map(d =>
        d.platform === platform ? { ...d, content } : d
      )
    )
  }

  const addLongContent = () => {
    // Thêm nội dung dài để test vượt giới hạn
    const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20)
    setDerivatives([
      createDerivative('twitter', longText),
      createDerivative('linkedin', longText),
      createDerivative('facebook', longText),
      createDerivative('instagram', longText),
      createDerivative('tiktok', longText),
    ])
  }

  const resetContent = () => {
    setDerivatives([
      createDerivative('twitter', 'Nội dung ngắn gọn cho Twitter 🐦'),
      createDerivative('linkedin', 'Nội dung chuyên nghiệp cho LinkedIn 💼'),
      createDerivative('facebook', 'Nội dung thân thiện cho Facebook 👥'),
      createDerivative('instagram', 'Nội dung visual cho Instagram 📸'),
      createDerivative('tiktok', 'Nội dung trending cho TikTok 🎵'),
    ])
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">DerivativeTabs Component Demo</h1>
        <p className="text-muted-foreground text-lg">
          Component hiển thị nội dung cho các nền tảng mạng xã hội với character limit badges
        </p>
      </div>

      {/* Control Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Controls</CardTitle>
          <CardDescription>
            Thử nghiệm các chức năng của DerivativeTabs component
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            onClick={() => setEditMode(!editMode)}
            variant={editMode ? 'default' : 'outline'}
          >
            {editMode ? '📝 Chế độ chỉnh sửa' : '👁️ Chế độ xem'}
          </Button>
          <Button onClick={addLongContent} variant="outline">
            ➕ Test nội dung dài (vượt giới hạn)
          </Button>
          <Button onClick={resetContent} variant="outline">
            🔄 Reset về nội dung ngắn
          </Button>
        </CardContent>
      </Card>

      {/* Character Limits Reference */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Giới hạn ký tự cho từng nền tảng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="font-semibold text-blue-500">Twitter</div>
              <div className="text-2xl font-bold">280</div>
              <div className="text-sm text-muted-foreground">ký tự</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-semibold text-blue-700">LinkedIn</div>
              <div className="text-2xl font-bold">3,000</div>
              <div className="text-sm text-muted-foreground">ký tự</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-semibold text-blue-600">Facebook</div>
              <div className="text-2xl font-bold">63,206</div>
              <div className="text-sm text-muted-foreground">ký tự</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-semibold text-pink-600">Instagram</div>
              <div className="text-2xl font-bold">2,200</div>
              <div className="text-sm text-muted-foreground">ký tự</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-semibold">TikTok</div>
              <div className="text-2xl font-bold">2,200</div>
              <div className="text-sm text-muted-foreground">ký tự</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Component Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Derivatives</CardTitle>
          <CardDescription>
            Nội dung được tối ưu cho từng nền tảng mạng xã hội
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DerivativeTabs
            derivatives={derivatives}
            onContentChange={handleContentChange}
            editable={editMode}
          />
        </CardContent>
      </Card>

      {/* Features List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>✨ Tính năng</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Icon cho từng platform:</strong> Twitter, LinkedIn, Facebook, Instagram, TikTok</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Badge hiển thị số ký tự:</strong> Màu xanh khi hợp lệ, đỏ khi vượt giới hạn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Character limit checking:</strong> Kiểm tra tự động và cảnh báo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Editable mode:</strong> Cho phép chỉnh sửa nội dung trực tiếp</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Platform-specific styling:</strong> Màu sắc và theme phù hợp với từng nền tảng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Responsive design:</strong> Hoạt động tốt trên mọi kích thước màn hình</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Dark mode support:</strong> Tự động adapt với theme</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}


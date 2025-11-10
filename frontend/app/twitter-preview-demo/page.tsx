'use client'

import { useState } from 'react'
import { TwitterPreview, DEMO_AVATARS } from '../components/TwitterPreview'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function TwitterPreviewDemoPage() {
  const [content, setContent] = useState(
    `Vừa hoàn thành việc tạo nội dung cho 5+ nền tảng mạng xã hội với AI! 🚀

✨ Tự động tạo content
📊 Tối ưu cho từng platform
⚡️ Tiết kiệm 70% thời gian

#ContentCreation #AI #SocialMedia #MarketingTools`
  )

  const [userName, setUserName] = useState('Content Creator')
  const [userHandle, setUserHandle] = useState('contentpro')
  const [userAvatar, setUserAvatar] = useState(DEMO_AVATARS.business)
  const [verified, setVerified] = useState(true)
  const [timestamp, setTimestamp] = useState('2h')

  const sampleTweets = [
    {
      content: `Khám phá sức mạnh của AI trong việc tạo nội dung! 🚀

Với công nghệ hiện đại, bạn có thể:
✅ Tạo nội dung nhanh chóng
✅ Tối ưu cho từng platform
✅ Tiết kiệm thời gian

#AI #ContentCreation #SocialMedia`,
      userName: 'Tech Innovator',
      userHandle: 'techinnovator',
      verified: true,
    },
    {
      content: `Just launched our new AI-powered content tool! 🎉

Create content for multiple platforms in minutes:
• Twitter
• LinkedIn  
• Facebook
• Instagram
• TikTok

Try it now! 👇 https://example.com

#ProductLaunch #AI #ContentTools`,
      userName: 'Startup Founder',
      userHandle: 'startupfounder',
      verified: false,
    },
    {
      content: `POV: You just discovered a tool that creates content for 5 platforms at once 🤯

Before: 5 hours writing ❌
After: 30 minutes ✅

Game changer for content creators! 

What's your biggest content creation challenge? 💬`,
      userName: 'Marketing Guru',
      userHandle: 'marketingguru',
      verified: true,
    },
    {
      content: `Tips for effective social media content:

1️⃣ Know your audience
2️⃣ Be consistent
3️⃣ Use visuals
4️⃣ Engage with followers
5️⃣ Analyze and optimize

Which tip do you find most challenging? 

#SocialMediaTips #ContentStrategy`,
      userName: 'Social Media Expert',
      userHandle: 'smexpert',
      verified: false,
    },
  ]

  const loadSampleTweet = (index: number) => {
    const tweet = sampleTweets[index]
    setContent(tweet.content)
    setUserName(tweet.userName)
    setUserHandle(tweet.userHandle)
    setVerified(tweet.verified)
    setTimestamp('now')
  }

  const charCount = content.length
  const isOverLimit = charCount > 280

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">TwitterPreview Component Demo</h1>
        <p className="text-muted-foreground text-lg">
          Component hiển thị preview tweet giống giao diện Twitter thật
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customization</CardTitle>
              <CardDescription>Tùy chỉnh nội dung và thông tin người dùng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Nội dung tweet
                  <Badge variant={isOverLimit ? 'destructive' : 'success'} className="ml-2">
                    {charCount}/280
                  </Badge>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[200px] p-3 rounded-md border bg-background resize-y"
                  placeholder="Nhập nội dung tweet..."
                />
                {isOverLimit && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    ⚠️ Vượt quá giới hạn {charCount - 280} ký tự
                  </p>
                )}
              </div>

              {/* User Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tên hiển thị</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 rounded-md border bg-background"
                  placeholder="Your Name"
                />
              </div>

              {/* User Handle */}
              <div>
                <label className="text-sm font-medium mb-2 block">Username (@)</label>
                <input
                  type="text"
                  value={userHandle}
                  onChange={(e) => setUserHandle(e.target.value)}
                  className="w-full p-2 rounded-md border bg-background"
                  placeholder="yourhandle"
                />
              </div>

              {/* Timestamp */}
              <div>
                <label className="text-sm font-medium mb-2 block">Thời gian</label>
                <input
                  type="text"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="w-full p-2 rounded-md border bg-background"
                  placeholder="2h"
                />
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Avatar</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(DEMO_AVATARS).map(([key, url]) => (
                    <button
                      key={key}
                      onClick={() => setUserAvatar(url)}
                      className={`p-1 rounded-full border-2 transition-all ${
                        userAvatar === url
                          ? 'border-blue-500 scale-110'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={url}
                        alt={key}
                        className="h-12 w-12 rounded-full"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="verified" className="text-sm font-medium">
                  Verified badge (dấu tick xanh)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Sample Tweets */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Tweets</CardTitle>
              <CardDescription>Nhấp để load nội dung mẫu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {sampleTweets.map((tweet, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => loadSampleTweet(index)}
                >
                  <div>
                    <div className="font-semibold">{tweet.userName}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {tweet.content}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>Preview tweet của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <TwitterPreview
                content={content}
                userName={userName}
                userHandle={userHandle}
                userAvatar={userAvatar}
                timestamp={timestamp}
                verified={verified}
              />
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>✨ Tính năng</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Avatar tùy chỉnh:</strong> Chọn từ nhiều avatar mẫu</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Verified badge:</strong> Dấu tick xanh giống Twitter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Auto-formatting:</strong> Tự động highlight hashtags, mentions, URLs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Action buttons:</strong> Reply, Retweet, Like, Views, Share (mờ)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Character counter:</strong> Kiểm tra giới hạn 280 ký tự</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Dark mode support:</strong> Tự động adapt với theme</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Responsive design:</strong> Hoạt động tốt mọi màn hình</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Pixel-perfect:</strong> Giống 99% với Twitter thật</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


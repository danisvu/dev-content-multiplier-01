'use client'

import React, { useState } from 'react'
import { LinkedInPreview, DEMO_AVATARS } from '../components/LinkedInPreview'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export default function LinkedInPreviewDemo() {
  const [content, setContent] = useState(
    "Excited to share my latest insights on AI and content creation! 🚀\n\nIn today's digital landscape, leveraging AI tools can dramatically improve productivity and creativity. Here are 3 key takeaways:\n\n1. AI augments human creativity, it doesn't replace it\n2. Focus on quality over quantity\n3. Always maintain your authentic voice\n\nWhat are your thoughts on AI in content creation? Let me know in the comments! 👇\n\n#AI #ContentCreation #DigitalMarketing #Productivity"
  )
  const [userName, setUserName] = useState('Sarah Johnson')
  const [userTitle, setUserTitle] = useState('Content Strategy Lead at TechCorp | AI Enthusiast')
  const [timestamp, setTimestamp] = useState('2h')
  const [selectedAvatar, setSelectedAvatar] = useState<keyof typeof DEMO_AVATARS>('professional1')

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          LinkedIn Preview Component
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Xem trước nội dung post LinkedIn với profile section và engagement bar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customize Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Post Content</Label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[200px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="What do you want to talk about?"
                />
                <p className="text-xs text-gray-500">
                  Use #hashtags and @mentions for realistic formatting
                </p>
              </div>

              {/* User Name */}
              <div className="space-y-2">
                <Label htmlFor="userName">Name</Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>

              {/* User Title */}
              <div className="space-y-2">
                <Label htmlFor="userTitle">Job Title & Company</Label>
                <Input
                  id="userTitle"
                  value={userTitle}
                  onChange={(e) => setUserTitle(e.target.value)}
                  placeholder="Job Title at Company"
                />
              </div>

              {/* Timestamp */}
              <div className="space-y-2">
                <Label htmlFor="timestamp">Timestamp</Label>
                <Input
                  id="timestamp"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="e.g., 2h, 1d, 3w"
                />
              </div>

              {/* Avatar Selection */}
              <div className="space-y-2">
                <Label>Avatar</Label>
                <div className="flex gap-3 flex-wrap">
                  {Object.keys(DEMO_AVATARS).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedAvatar(key as keyof typeof DEMO_AVATARS)}
                      className={`relative h-12 w-12 rounded-full overflow-hidden border-2 transition-all ${
                        selectedAvatar === key
                          ? 'border-blue-600 ring-2 ring-blue-200 dark:ring-blue-900'
                          : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
                      }`}
                    >
                      <img
                        src={DEMO_AVATARS[key as keyof typeof DEMO_AVATARS]}
                        alt={key}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">
                💡 LinkedIn Post Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <p>• Use line breaks to improve readability</p>
              <p>• Include relevant #hashtags (3-5 is optimal)</p>
              <p>• Tag people with @mentions to increase reach</p>
              <p>• Ask questions to encourage engagement</p>
              <p>• Use emojis sparingly for visual appeal</p>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <LinkedInPreview
                content={content}
                userName={userName}
                userTitle={userTitle}
                userAvatar={DEMO_AVATARS[selectedAvatar]}
                timestamp={timestamp}
              />
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-sm">Component Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
              <div className="flex justify-between">
                <span>Character Count:</span>
                <span className="font-mono font-medium">{content.length}</span>
              </div>
              <div className="flex justify-between">
                <span>LinkedIn Limit:</span>
                <span className="font-mono font-medium">3,000</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span className={`font-mono font-medium ${content.length > 3000 ? 'text-red-600' : 'text-green-600'}`}>
                  {3000 - content.length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


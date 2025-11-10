'use client'

import { useState } from 'react'
import { EngagementMetrics } from '../components/EngagementMetrics'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Input } from '../components/ui'
import { toast } from 'sonner'
import { Plus, Sparkles, TrendingUp } from 'lucide-react'

const SAMPLE_CONTENT = {
  twitter: 'Just launched our new AI Content Multiplier! 🚀 Create derivatives for 5 platforms in minutes. Save 70% of your content creation time. #AI #ContentMarketing #Productivity',
  linkedin: 'Excited to announce our AI Content Multiplier platform! We\'ve spent 6 months building a solution that transforms how content creators work. Instead of spending hours creating platform-specific variations, creators can now generate optimized content for all major platforms instantly. This isn\'t just about automation—it\'s about empowering creators to focus on strategy. #AI #ContentMarketing #Innovation',
  facebook: 'Big news! 📢 We just launched AI Content Multiplier - the tool that\'s changing how creators work! 🎉 Create perfect content for every platform. It\'s fast, it\'s smart, and it saves you hours every week. No more juggling between apps! Try it free today and see the difference! #ContentCreation #AI #SmartTools',
  instagram: '✨ Content Creation Just Got Easier ✨ Introducing AI Content Multiplier - your new creative partner 🚀 Write once → Deploy everywhere 📱 Twitter 📱 LinkedIn 📱 Facebook 📱 Instagram 📱 TikTok Ready to level up your content game? 🎨 #ContentCreator #AITools #MarketingTips #SocialMedia #CreativeTools',
  tiktok: 'POV: You found the tool that creates content for all your platforms 🤯 Before: 5 hours per week 😫 After: 30 mins ✨ No more platform jumping. Just pure content creation magic 🚀 #ContentCreator #AITools #ProductivityHack #FYP #Viral'
}

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X', emoji: '𝕏', color: 'bg-blue-500' },
  { id: 'linkedin', name: 'LinkedIn', emoji: '💼', color: 'bg-cyan-600' },
  { id: 'facebook', name: 'Facebook', emoji: 'f', color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', emoji: '📷', color: 'bg-pink-500' },
  { id: 'tiktok', name: 'TikTok', emoji: '🎵', color: 'bg-black' }
] as const

type PlatformId = (typeof PLATFORMS)[number]['id']

export default function EngagementDemoPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformId>>(new Set(['twitter', 'linkedin']))
  const [customContent, setCustomContent] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [tone, setTone] = useState('professional')

  const togglePlatform = (platformId: PlatformId) => {
    const newSelected = new Set(selectedPlatforms)
    if (newSelected.has(platformId)) {
      newSelected.delete(platformId)
    } else {
      newSelected.add(platformId)
    }
    setSelectedPlatforms(newSelected)
  }

  const getContent = (platform: PlatformId) => {
    return customContent || SAMPLE_CONTENT[platform]
  }

  const getHashtags = () => {
    return hashtags ? hashtags.split(' ').filter(h => h.startsWith('#') || h) : []
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            Engagement Simulation Demo
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            See predicted engagement metrics for your content across different platforms. The simulation uses AI to analyze your content and predict performance.
          </p>
        </div>

        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Content Editor
            </CardTitle>
            <CardDescription>
              Enter your content and see how it performs on different platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <textarea
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                placeholder="Enter your content here... (leave blank to use sample content)"
                className="w-full h-24 p-3 border rounded-lg bg-background text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {customContent.length} characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="funny">Funny</option>
                  <option value="educational">Educational</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Hashtags (space-separated)</label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#ai #marketing #content"
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                />
              </div>
            </div>

            {/* Platform selector */}
            <div>
              <label className="text-sm font-medium mb-3 block">Select Platforms</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {PLATFORMS.map((platform) => (
                  <Button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    variant={selectedPlatforms.has(platform.id) ? 'default' : 'outline'}
                    className={`text-xs ${
                      selectedPlatforms.has(platform.id) ? platform.color : ''
                    }`}
                  >
                    {platform.emoji} {platform.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics for Selected Platforms */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Engagement Predictions</h2>
          <div className="grid gap-4">
            {Array.from(selectedPlatforms).map((platformId) => {
              const platform = PLATFORMS.find(p => p.id === platformId)!
              return (
                <div key={platformId} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{platform.emoji}</span>
                    <h3 className="text-lg font-semibold">{platform.name}</h3>
                  </div>
                  <EngagementMetrics
                    content={getContent(platformId)}
                    platform={platformId as any}
                    tone={tone}
                    hashtags={getHashtags()}
                    variant="moderate"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Information Tabs */}
        <Tabs defaultValue="features" className="space-y-4">
          <TabsList>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="factors">Analysis Factors</TabsTrigger>
            <TabsTrigger value="tips">Engagement Tips</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Simulation Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">📊 Prediction Scenarios</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li><strong>Conservative:</strong> 60% of moderate prediction</li>
                    <li><strong>Moderate:</strong> Standard engagement forecast</li>
                    <li><strong>Optimistic:</strong> 140% of moderate prediction</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">📈 Metrics Included</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Likes - Platform-specific engagement</li>
                    <li>Comments - Discussion metric</li>
                    <li>Shares - Viral potential</li>
                    <li>Views - Reach metric</li>
                    <li>Engagement Rate - Overall activity percentage</li>
                    <li>Projected Reach - Extended audience size</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">🎯 Smart Scoring</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Content Score (0-100) - Overall content quality</li>
                    <li>Sentiment Analysis - Emotion detection</li>
                    <li>Time of Day Impact - Post timing optimization</li>
                    <li>Day of Week Factor - Weekly patterns</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="factors">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Content Analysis</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li><strong>Content Length:</strong> Short (&lt;100), Medium (100-300), Long (&gt;300)</li>
                    <li><strong>Sentiment Score:</strong> Positive words boost engagement</li>
                    <li><strong>Keyword Relevance:</strong> Platform-specific keyword matching</li>
                    <li><strong>Hashtags:</strong> Each hashtag adds ~5% engagement</li>
                    <li><strong>Mentions:</strong> Each mention adds ~3% engagement</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Timing Factors</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li><strong>Time of Day:</strong> Morning/Evening best, Night worst</li>
                    <li><strong>Day of Week:</strong> Weekends see +15% more engagement</li>
                    <li><strong>Platform Optimization:</strong> Different best times per platform</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Platform Base Metrics</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="border rounded p-2">
                      <p className="font-semibold">Twitter</p>
                      <p className="text-xs text-muted-foreground">45 avg likes</p>
                    </div>
                    <div className="border rounded p-2">
                      <p className="font-semibold">LinkedIn</p>
                      <p className="text-xs text-muted-foreground">85 avg likes</p>
                    </div>
                    <div className="border rounded p-2">
                      <p className="font-semibold">Facebook</p>
                      <p className="text-xs text-muted-foreground">120 avg likes</p>
                    </div>
                    <div className="border rounded p-2">
                      <p className="font-semibold">Instagram</p>
                      <p className="text-xs text-muted-foreground">250 avg likes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips">
            <Card>
              <CardHeader>
                <CardTitle>Platform Engagement Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span>𝕏</span> Twitter
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Best time: 9 AM - 3 PM (Weekdays)</li>
                    <li>Use 1-2 relevant hashtags</li>
                    <li>Ask questions to encourage replies</li>
                    <li>Post during peak hours</li>
                    <li>Keep tweets concise and actionable</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span>💼</span> LinkedIn
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Best time: 7-9 AM, 5-6 PM (Weekdays)</li>
                    <li>Add personal insights and experience</li>
                    <li>Use 3-5 relevant hashtags</li>
                    <li>Share industry knowledge</li>
                    <li>Post career growth and milestones</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">📷 Instagram</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Best time: 11 AM-1 PM, 7-9 PM</li>
                    <li>Use 15-30 relevant hashtags</li>
                    <li>Post high-quality visuals</li>
                    <li>Write engaging captions</li>
                    <li>Use stories and reels</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">🎵 TikTok</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Best time: 6-10 AM, 7-11 PM</li>
                    <li>Follow trending sounds</li>
                    <li>Create authentic, fun content</li>
                    <li>Post 1-3 times daily</li>
                    <li>Keep videos 15-60 seconds</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <code className="bg-muted px-2 py-1 rounded">POST /api/engagement/simulate</code>
                  <p className="text-muted-foreground mt-1">Simulate engagement metrics for content</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">GET /api/engagement/best-times/:platform</code>
                  <p className="text-muted-foreground mt-1">Get optimal posting times</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">GET /api/engagement/tips/:platform</code>
                  <p className="text-muted-foreground mt-1">Get platform-specific tips</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">POST /api/engagement/content-score</code>
                  <p className="text-muted-foreground mt-1">Calculate content quality score</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">GET /api/engagement/platforms</code>
                  <p className="text-muted-foreground mt-1">Get supported platforms list</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

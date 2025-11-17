'use client'

import { useState } from 'react'
import { MultiPublishQueue, type DerivativeItem } from '../components/MultiPublishQueue'

declare global {
  interface Window {
    __multiPublishMockSetup?: boolean
  }
}
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui'
import { toast } from 'sonner'

const SAMPLE_DERIVATIVES: DerivativeItem[] = [
  {
    id: 1,
    brief_id: 1,
    platform: 'twitter',
    content: 'Just launched our new AI Content Multiplier! 🚀 Create derivatives for 5 platforms in minutes, not hours. Check it out and save 70% of your content creation time. #AI #ContentMarketing',
    character_count: 173,
    status: 'draft',
    created_at: '2024-11-10T10:00:00Z',
    updated_at: '2024-11-10T10:00:00Z'
  },
  {
    id: 2,
    brief_id: 1,
    platform: 'linkedin',
    content: `Introducing Our AI-Powered Content Multiplier

We're excited to announce a breakthrough tool for content creators and marketing teams: the AI Content Multiplier. This innovative platform transforms a single content brief into optimized derivatives for multiple social media platforms.

Key Benefits:
📊 Multi-Platform Optimization: Generate platform-specific content for Twitter, LinkedIn, Facebook, Instagram, and TikTok
⏱️ Time Efficiency: Reduce content creation time by up to 70%
🎯 Consistency: Maintain brand voice while adapting to platform-specific best practices
🔄 Batch Publishing: Publish to multiple platforms simultaneously with event tracking

How It Works:
1. Create a content brief with your core message
2. AI generates optimized derivatives for each platform
3. Review and edit as needed
4. Publish with one click and log events to your database

The future of content marketing is here. Try it today and transform your content strategy.

#AI #ContentMarketing #SocialMediaTools #MarketingTech #Innovation`,
    character_count: 892,
    status: 'draft',
    created_at: '2024-11-10T10:00:00Z',
    updated_at: '2024-11-10T10:00:00Z'
  },
  {
    id: 3,
    brief_id: 1,
    platform: 'facebook',
    content: `🎉 Big Announcement: AI Content Multiplier is Here! 🎉

We're thrilled to introduce a game-changing tool for content creators and businesses: the AI Content Multiplier!

Tired of spending hours creating content for different social media platforms? Our new tool lets you create content for Twitter, LinkedIn, Facebook, Instagram, and TikTok all at once!

🌟 What Makes It Special:
✅ Create platform-optimized content in minutes
✅ Maintains your brand voice across all channels
✅ Automatic character count optimization
✅ One-click batch publishing
✅ Full event tracking and analytics

💡 Real Numbers:
• 70% reduction in content creation time
• Consistent messaging across 5 platforms
• Professional-grade content every time
• Complete audit trail of all publications

Whether you're a solo content creator, a small business, or a large organization, the AI Content Multiplier helps you create better content, faster.

Ready to transform your content strategy? Try it now and see the difference!

👉 Learn more and get started today!

#ContentCreation #AI #SocialMediaMarketing #MarketingTools #SmallBusiness #BusinessTips`,
    character_count: 893,
    status: 'draft',
    created_at: '2024-11-10T10:00:00Z',
    updated_at: '2024-11-10T10:00:00Z'
  },
  {
    id: 4,
    brief_id: 1,
    platform: 'instagram',
    content: `✨ Content Creation Just Got Easier ✨

Introducing the AI Content Multiplier – Your New Favorite Tool 🚀

Creating content for multiple platforms is HARD. Until now.

📱 5 Platforms. 1 Brief. Infinite Possibilities.

Whether you're a content creator, marketer, or business owner, you know the struggle: crafting unique, engaging content for each social media platform is time-consuming and exhausting.

That's where we come in. 💪

🤖 AI-Powered Magic:
→ Write once, adapt everywhere
→ Perfect character counts every time
→ Professional quality, instantly
→ More time for creative strategy

⏱️ Time Savings:
Before: 5 hours of content creation
After: 30 minutes max
Saved: 4.5 hours to focus on what matters

🎯 Perfect For:
Content creators | Small businesses | Marketing teams | Agencies | Influencers

Ready to level up your content game? Join thousands of creators who've already transformed their workflows.

#ContentCreator #SocialMediaTools #AITools #MarketingTips #ContentStrategy #Productivity #CreativeTools #SocialMediaMarketing`,
    character_count: 850,
    status: 'published',
    published_at: '2024-11-09T15:30:00Z',
    created_at: '2024-11-09T10:00:00Z',
    updated_at: '2024-11-09T15:30:00Z'
  },
  {
    id: 5,
    brief_id: 1,
    platform: 'tiktok',
    content: `POV: You found a tool that creates content for all your platforms 🤯

Before: Spending hours crafting different versions
After: 30 mins, everything is ready ✨

Watch your productivity SKYROCKET 📈

Twitter ✓
LinkedIn ✓
Facebook ✓
Instagram ✓
TikTok ✓

All. At. Once. 🔥

No more platform jumping. No more repetitive writing. Just pure, optimized content creation magic.

The AI Content Multiplier isn't just a tool—it's your new superpower for content creation.

Join the revolution. Your content game will never be the same. 🚀

#ContentCreator #AITools #SocialMedia #ProductivityHack #MarketingTips #TikTokTrends #FYP`,
    character_count: 632,
    status: 'draft',
    created_at: '2024-11-10T10:00:00Z',
    updated_at: '2024-11-10T10:00:00Z'
  }
]

export default function MultiPublishQueueDemoPage() {
  const [briefId] = useState(1)
  const [mockDerivatives, setMockDerivatives] = useState<DerivativeItem[]>(SAMPLE_DERIVATIVES)
  const [publishedCount, setPublishedCount] = useState(1) // One already published

  // Mock API responses for demo
  if (typeof window !== 'undefined') {
    if (!window.__multiPublishMockSetup) {
      window.__multiPublishMockSetup = true

      // Mock fetch for derivatives
      const originalFetch = window.fetch
      window.fetch = function(this: Window, url: string | Request, options?: RequestInit) {
        const urlStr = typeof url === 'string' ? url : url.url

        // GET derivatives
        if (urlStr.includes('/api/derivatives/brief/') && !options?.method) {
          return Promise.resolve(
            new Response(JSON.stringify(mockDerivatives), {
              status: 200,
              headers: { 'content-type': 'application/json' }
            })
          )
        }

        // POST publish
        if (urlStr.includes('/api/publishing/derivatives') && options?.method === 'POST') {
          const body = JSON.parse(options.body as string)
          const ids = body.derivativeIds as number[]

          // Update mock derivatives to published
          const updated = mockDerivatives.map(d =>
            ids.includes(d.id)
              ? { ...d, status: 'published' as const, published_at: new Date().toISOString() }
              : d
          )
          setMockDerivatives(updated)
          setPublishedCount(prev => prev + ids.length)

          return Promise.resolve(
            new Response(
              JSON.stringify({
                message: `Published ${ids.length} derivatives`,
                published: updated.filter(d => ids.includes(d.id)),
                failed: [],
                summary: { total: ids.length, successCount: ids.length, failureCount: 0 }
              }),
              { status: 200, headers: { 'content-type': 'application/json' } }
            )
          )
        }

        // DELETE derivative
        if (urlStr.includes('/api/derivatives/') && options?.method === 'DELETE') {
          const id = parseInt(urlStr.split('/').pop() || '0')
          setMockDerivatives(prev => prev.filter(d => d.id !== id))
          return Promise.resolve(new Response(null, { status: 204 }))
        }

        return originalFetch.call(this, url, options)
      } as any
    }
  }

  const handlePublishComplete = (count: number) => {
    toast.success(`Published ${count} derivatives successfully!`)
  }

  const draftCount = mockDerivatives.filter(d => d.status === 'draft').length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">MultiPublishQueue Demo</h1>
          <p className="text-muted-foreground max-w-2xl">
            Select multiple derivatives to publish and log events to the database. This demo includes sample derivatives that you can publish, delete, or expand to see the full content.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Derivatives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockDerivatives.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Sample data</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Draft</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-200">{draftCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to publish</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 dark:text-green-200">{publishedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">With logged events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-1">Twitter, LinkedIn, etc.</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="queue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="queue">Publishing Queue</TabsTrigger>
            <TabsTrigger value="info">How It Works</TabsTrigger>
          </TabsList>

          <TabsContent value="queue">
            <MultiPublishQueue
              briefId={briefId}
              onPublishComplete={handlePublishComplete}
              autoLoadDerivatives={true}
            />
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Publishing Queue Features</CardTitle>
                <CardDescription>Understand what the MultiPublishQueue component offers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">📋 Core Features</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Display all derivatives for a brief</li>
                    <li>Select multiple derivatives for batch publishing</li>
                    <li>Real-time character count with platform limits</li>
                    <li>Platform-specific color coding</li>
                    <li>Expand/collapse for viewing full content</li>
                    <li>Individual deletion of derivatives</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">🔄 Publishing Workflow</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Select one or more draft derivatives</li>
                    <li>Click "Publish" button to batch publish</li>
                    <li>Events logged to database with 'derivative.published' type</li>
                    <li>Status automatically updates in the UI</li>
                    <li>Published timestamp recorded for audit trail</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">📊 Event Logging</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Event type: 'derivative.published' for individual publishes</li>
                    <li>Event type: 'publishing.batch' for batch operations</li>
                    <li>Metadata includes platform, brief ID, character count</li>
                    <li>Supports success and failure status tracking</li>
                    <li>User ID tracking for audit purposes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">🎨 Platform Support</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li><strong>Twitter:</strong> 280 character limit</li>
                    <li><strong>LinkedIn:</strong> 3,000 character limit</li>
                    <li><strong>Facebook:</strong> 63,206 character limit</li>
                    <li><strong>Instagram:</strong> 2,200 character limit</li>
                    <li><strong>TikTok:</strong> 2,200 character limit</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <code className="bg-muted px-2 py-1 rounded">GET /api/derivatives/brief/:briefId</code>
                  <p className="text-muted-foreground mt-1">Get all derivatives for a brief</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">POST /api/publishing/derivatives</code>
                  <p className="text-muted-foreground mt-1">Publish multiple derivatives and log events</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">GET /api/event-logs</code>
                  <p className="text-muted-foreground mt-1">Retrieve published event logs from database</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">DELETE /api/derivatives/:id</code>
                  <p className="text-muted-foreground mt-1">Delete a specific derivative</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

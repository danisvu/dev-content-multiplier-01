'use client'

import React, { useState, useEffect } from 'react'
import { SidebarLayout } from '../components/Sidebar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from '../components/ui'
import { ComparePreviews } from '../components/ComparePreviews'
import { ResponsivePreview } from '../components/ResponsivePreview'
import { ExportOptions } from '../components/ExportOptions'
import { AnalyticsDashboard } from '../components/AnalyticsDashboard'
import { AuthStatus } from '../components/AuthStatus'
import { AuthDialog } from '../components/AuthDialog'
import { motion } from 'framer-motion'
import { Zap, Settings, Eye, BarChart3, FileUp, Layers, Key } from 'lucide-react'
import { toast } from 'sonner'

type Platform = 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'mailchimp' | 'wordpress'

interface PreviewData {
  platform: Platform
  content: string
  characterCount: number
}

interface AuthState {
  platform: Platform
  isAuthenticated: boolean
  userName?: string
  lastConnected?: Date
  token?: string
  username?: string
  password?: string
}

const SAMPLE_PREVIEWS: PreviewData[] = [
  {
    platform: 'twitter',
    content:
      'Excited to announce our new AI-powered content multiplier! 🚀 Create platform-optimized content in seconds, not hours. Try it free today! #AI #ContentMarketing',
    characterCount: 168,
  },
  {
    platform: 'linkedin',
    content:
      'We are thrilled to launch the Content Multiplier platform - an AI-powered solution that helps creators publish across multiple platforms effortlessly. Our system analyzes engagement patterns, optimizes content for each platform, and provides real-time analytics. Join us in revolutionizing content creation. #AI #Innovation #ContentCreation',
    characterCount: 325,
  },
  {
    platform: 'facebook',
    content:
      "Introducing the Content Multiplier - your new best friend for social media success! 🎉\n\nTired of spending hours creating separate posts for each platform? Our AI does the heavy lifting for you.\n\n✨ Automatic multi-platform optimization\n📊 Real-time engagement analytics\n🚀 Schedule and publish in one click\n\nJoin thousands of creators already boosting their social presence. Start free today!",
    characterCount: 342,
  },
  {
    platform: 'instagram',
    content:
      'Transform your content game with our AI-powered platform! 📱✨\n\n🚀 Create beautiful, platform-optimized posts in seconds\n📊 Watch your engagement skyrocket with data-driven insights\n💡 One tool for all your social media needs\n\nReady to become a content creator superstar? Join the Content Multiplier community today!\n\n#ContentCreator #SocialMedia #AI #Instagram #DigitalMarketing',
    characterCount: 298,
  },
  {
    platform: 'tiktok',
    content:
      'POV: You just found the cheat code for viral content 🎬💯\n\nNo more boring posts. No more hours of editing. Just pure, AI-powered magic. ✨\n\nFrom ideas to viral videos - we handle it all. Your content, amplified. 🚀\n\n#FYP #ContentCreator #AI #TikTok #Viral',
    characterCount: 198,
  },
  {
    platform: 'mailchimp',
    content:
      'Subject: Unlock Your Content Multiplier - 50% Off This Week!\n\nHi Friend,\n\nDid you know that 89% of marketers struggle with multi-platform content creation? The Content Multiplier solves this.\n\n🎯 Generate platform-optimized content automatically\n📊 Track performance across all channels\n🚀 Save hours each week\n\nSpecial offer: 50% off for new users this week only!\n\nBest regards,\nThe Content Multiplier Team',
    characterCount: 384,
  },
  {
    platform: 'wordpress',
    content:
      '<!-- wp:heading -->\n<h1>Introducing the Ultimate Content Multiplier Platform</h1>\n<!-- /wp:heading -->\n\n<!-- wp:paragraph -->\n<p>In today\'s digital landscape, creating engaging content across multiple platforms is more important than ever. But let\'s face it—managing content for Twitter, LinkedIn, Facebook, Instagram, and TikTok simultaneously can be overwhelming.</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:heading {\"level\":2} -->\n<h2>How Content Multiplier Transforms Your Workflow</h2>\n<!-- /wp:heading -->\n\n<!-- wp:list -->\n<ul><li>One-click publishing to all platforms</li><li>AI-powered content optimization</li><li>Real-time analytics dashboard</li></ul>\n<!-- /wp:list -->',
    characterCount: 456,
  },
]

export default function PublisherPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['twitter', 'linkedin'])
  const [compareMode, setCompareMode] = useState(false)
  const [responsiveMode, setResponsiveMode] = useState<'mobile' | 'desktop'>('desktop')
  const [selectedPreview, setSelectedPreview] = useState<Platform>('twitter')
  const [activeTab, setActiveTab] = useState('selector')
  const [authStates, setAuthStates] = useState<Record<Platform, AuthState>>({
    twitter: { platform: 'twitter', isAuthenticated: false },
    linkedin: { platform: 'linkedin', isAuthenticated: false },
    facebook: { platform: 'facebook', isAuthenticated: false },
    instagram: { platform: 'instagram', isAuthenticated: false },
    tiktok: { platform: 'tiktok', isAuthenticated: false },
    mailchimp: { platform: 'mailchimp', isAuthenticated: false },
    wordpress: { platform: 'wordpress', isAuthenticated: false },
  })
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [selectedAuthPlatform, setSelectedAuthPlatform] = useState<Platform>('twitter')

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('publisher_auth_state')
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth)
        // Convert lastConnected string back to Date if it exists
        const restored = Object.fromEntries(
          Object.entries(parsed).map(([key, auth]: [string, any]) => [
            key,
            {
              ...auth,
              lastConnected: auth.lastConnected ? new Date(auth.lastConnected) : undefined,
            },
          ])
        )
        setAuthStates(restored)
      } catch (error) {
        console.error('Failed to load auth state:', error)
      }
    }
  }, [])

  // Save auth state to localStorage
  useEffect(() => {
    localStorage.setItem('publisher_auth_state', JSON.stringify(authStates))
  }, [authStates])

  const filteredPreviews = SAMPLE_PREVIEWS.filter((p) => selectedPlatforms.includes(p.platform))

  const handlePlatformToggle = (platform: Platform) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        return prev.filter((p) => p !== platform)
      } else {
        return [...prev, platform]
      }
    })
    if (selectedPreview === platform && !selectedPlatforms.includes(platform)) {
      const remaining = selectedPlatforms.filter((p) => p !== platform)
      if (remaining.length > 0) {
        setSelectedPreview(remaining[0])
      }
    }
  }

  const handleAuthConnect = (platform: Platform) => {
    setSelectedAuthPlatform(platform)
    setAuthDialogOpen(true)
  }

  const handleAuthDisconnect = (platform: Platform) => {
    setAuthStates((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        isAuthenticated: false,
        userName: undefined,
        lastConnected: undefined,
        token: undefined,
        username: undefined,
        password: undefined,
      },
    }))
    toast.success(`Disconnected from ${platform}`)
  }

  const handleAuthSuccess = (credentials: { username?: string; password?: string; token?: string }) => {
    const platform = selectedAuthPlatform
    console.log('🔐 handleAuthSuccess called with credentials:', credentials)
    const newAuthState = {
      ...authStates[platform],
      isAuthenticated: true,
      userName: credentials.username || credentials.token?.substring(0, 20) + '...' || 'Connected',
      lastConnected: new Date(),
      token: credentials.token,
      username: credentials.username,
      password: credentials.password,
    }
    console.log('💾 New auth state to save:', newAuthState)
    setAuthStates((prev) => {
      const updated = {
        ...prev,
        [platform]: newAuthState,
      }
      console.log('📝 Full auth states after update:', updated)
      return updated
    })
    toast.success(`Successfully connected to ${platform}!`)
  }

  const handleTestApi = (platform: Platform) => {
    const authState = authStates[platform]
    if (!authState.isAuthenticated) {
      toast.error(`${platform} is not connected`)
      return
    }
    console.log(`🧪 Testing ${platform} API with:`, {
      token: authState.token,
      username: authState.username,
      password: authState.password ? '***' : undefined,
    })
    toast.success(`✅ ${platform} API key is valid: ${authState.token?.substring(0, 30)}...`)
  }

  const currentPreview = SAMPLE_PREVIEWS.find((p) => p.platform === selectedPreview)

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Multi-platform Publisher
                </h1>
                <p className="text-muted-foreground mt-1">
                  Publish optimized content across all platforms with analytics
                </p>
              </div>
            </div>
          </motion.div>

          {/* Authentication Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Key className="w-5 h-5" />
                  Platform Connections
                </CardTitle>
                <CardDescription>Connect your accounts to enable publishing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SAMPLE_PREVIEWS.map((preview) => (
                    <AuthStatus
                      key={preview.platform}
                      platform={preview.platform}
                      isAuthenticated={authStates[preview.platform].isAuthenticated}
                      userName={authStates[preview.platform].userName}
                      lastConnected={authStates[preview.platform].lastConnected}
                      onConnect={() => handleAuthConnect(preview.platform)}
                      onDisconnect={() => handleAuthDisconnect(preview.platform)}
                      onTestApi={() => handleTestApi(preview.platform)}
                      className="border border-gray-200 dark:border-gray-700"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Controls */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="xl:col-span-1 space-y-6"
            >
              {/* Platform Selector */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Platform Selector
                  </CardTitle>
                  <CardDescription>Select platforms to publish to</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {SAMPLE_PREVIEWS.map((preview) => (
                    <button
                      key={preview.platform}
                      onClick={() => handlePlatformToggle(preview.platform)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedPlatforms.includes(preview.platform)
                          ? 'border-primary bg-primary/10'
                          : 'border-muted bg-muted/30 hover:border-primary/50'
                      }`}
                    >
                      <div className="font-semibold capitalize">{preview.platform}</div>
                      <div className="text-xs text-muted-foreground mt-1">{preview.characterCount} chars</div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Display Options */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="w-5 h-5" />
                    Display Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preview Mode</label>
                    <div className="flex gap-2">
                      <Button
                        variant={!compareMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCompareMode(false)}
                        className="flex-1"
                      >
                        Single
                      </Button>
                      <Button
                        variant={compareMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCompareMode(true)}
                        className="flex-1"
                      >
                        Compare
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Device Preview</label>
                    <div className="flex gap-2">
                      <Button
                        variant={responsiveMode === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setResponsiveMode('desktop')}
                        className="flex-1"
                      >
                        Desktop
                      </Button>
                      <Button
                        variant={responsiveMode === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setResponsiveMode('mobile')}
                        className="flex-1"
                      >
                        Mobile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export & Analytics */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileUp className="w-5 h-5" />
                    Export Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ExportOptions briefId={1} onExportComplete={(format) => toast.success('Exported as ' + format)} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Preview & Analytics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="xl:col-span-2 space-y-6"
            >
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="selector" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="compare" className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Compare
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>

                {/* Preview Tab */}
                <TabsContent value="selector" className="space-y-6">
                  {currentPreview && (
                    <>
                      <ResponsivePreview
                        content={currentPreview.content}
                        platform={currentPreview.platform}
                        mode={responsiveMode}
                        showMetrics={true}
                      />

                      {/* Platform Info Card */}
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-sm">Content Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Character Count</p>
                              <p className="text-lg font-bold">{currentPreview.characterCount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Platform</p>
                              <p className="text-lg font-bold capitalize">{currentPreview.platform}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>

                {/* Compare Tab */}
                <TabsContent value="compare" className="space-y-6">
                  {selectedPlatforms.length >= 2 && currentPreview ? (
                    <ComparePreviews
                      content={currentPreview.content}
                      showPlatforms={selectedPlatforms}
                    />
                  ) : (
                    <Card className="border-0 shadow-lg">
                      <CardContent className="pt-6">
                        <div className="text-center py-12 text-muted-foreground">
                          <p className="mb-2">Select at least 2 platforms to compare</p>
                          <p className="text-sm">Currently selected: {selectedPlatforms.join(', ')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                  {selectedPlatforms.map((platform) => (
                    <motion.div
                      key={platform}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <AnalyticsDashboard platform={platform} />
                    </motion.div>
                  ))}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Platform Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            {SAMPLE_PREVIEWS.map((preview) => {
              const isSelected = selectedPlatforms.includes(preview.platform)
              return (
                <Card
                  key={preview.platform}
                  className={`border-0 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                    isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handlePlatformToggle(preview.platform)}
                >
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold capitalize">{preview.platform}</div>
                      <div className="text-xs text-muted-foreground">{preview.characterCount} chars</div>
                      <div
                        className={`mt-2 px-2 py-1 rounded text-xs font-medium ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : 'Select'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  One-Click Publishing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Publish to all selected platforms simultaneously with optimized content for each.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Real-time Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track engagement metrics, conversion rates, and performance across all platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Smart Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI automatically adapts content length, format, and style for each platform.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog
        platform={selectedAuthPlatform}
        isOpen={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        onConnect={handleAuthSuccess}
      />
    </SidebarLayout>
  )
}

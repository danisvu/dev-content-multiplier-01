'use client'

import { useState, useEffect } from 'react'
import { Plus, Package, Send, Trash2, Check, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { PageTransition } from '../components/PageTransition'
import {
  Button,
  EmptyState,
  SkeletonList,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatusBadge,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui'
import { AuthDialog } from '../components/AuthDialog'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : 'http://localhost:3911/api'

interface Brief {
  id: number
  idea_id: number
  title: string
  content_plan: string
  target_audience: string
  key_points: string[]
  tone?: string
  word_count?: number
  keywords?: string[]
  status: string
  created_at: string
  updated_at: string
  idea_title?: string
}

type Platform = 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'mailchimp' | 'wordpress'

interface PublishResult {
  platform: Platform
  success: boolean
  message: string
  timestamp: Date
  details?: {
    emailsSent?: number
    campaignId?: string
    subscribers?: number
  }
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

export default function PacksPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [selectedBriefs, setSelectedBriefs] = useState<Set<number>>(new Set())
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set())
  const [publishing, setPublishing] = useState(false)
  const [publishResults, setPublishResults] = useState<PublishResult[]>([])
  const [showResults, setShowResults] = useState(false)

  // Auth state management
  const [authStates, setAuthStates] = useState<Record<Platform, AuthState>>({
    twitter: { platform: 'twitter', isAuthenticated: false },
    linkedin: { platform: 'linkedin', isAuthenticated: false },
    facebook: { platform: 'facebook', isAuthenticated: false },
    instagram: { platform: 'instagram', isAuthenticated: false },
    tiktok: { platform: 'tiktok', isAuthenticated: false },
    mailchimp: { platform: 'mailchimp', isAuthenticated: false },
    wordpress: { platform: 'wordpress', isAuthenticated: false },
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [selectedAuthPlatform, setSelectedAuthPlatform] = useState<Platform>('mailchimp')

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('publisher_auth_state')
    console.log('📂 [PACKS] Loading from localStorage:', savedAuth)
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth)
        console.log('✅ [PACKS] Parsed auth state:', parsed)
        // Convert lastConnected string back to Date if it exists
        const restored = Object.fromEntries(
          Object.entries(parsed).map(([key, auth]: [string, any]) => {
            const restoredAuth = {
              ...auth,
              lastConnected: auth.lastConnected ? new Date(auth.lastConnected) : undefined,
            }
            console.log(`🔄 [PACKS] Restoring ${key}:`, restoredAuth)
            return [key, restoredAuth]
          })
        ) as Record<Platform, AuthState>
        console.log('🎯 [PACKS] Final restored state:', restored)
        setAuthStates(restored)
      } catch (error) {
        console.error('[PACKS] Failed to load auth state:', error)
      }
    } else {
      console.log('ℹ️ [PACKS] No saved auth state found in localStorage')
    }
    setIsLoaded(true)
  }, [])

  // Save auth state to localStorage (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('💾 [PACKS] Saving auth state to localStorage:', authStates)
      localStorage.setItem('publisher_auth_state', JSON.stringify(authStates))
    }
  }, [authStates, isLoaded])

  useEffect(() => {
    fetchBriefs()
  }, [])

  const handleAuthSuccess = (credentials: { username?: string; password?: string; token?: string }) => {
    const platform = selectedAuthPlatform
    console.log('🔐 [PACKS] handleAuthSuccess called with credentials:', credentials)
    const newAuthState = {
      ...authStates[platform],
      isAuthenticated: true,
      userName: credentials.username || credentials.token?.substring(0, 20) + '...' || 'Connected',
      lastConnected: new Date(),
      token: credentials.token,
      username: credentials.username,
      password: credentials.password,
    }
    console.log('💾 [PACKS] New auth state to save:', newAuthState)
    setAuthStates((prev) => {
      const updated = {
        ...prev,
        [platform]: newAuthState,
      }
      console.log('📝 [PACKS] Full auth states after update:', updated)
      return updated
    })
    toast.success(`Successfully connected to ${platform}!`)
    setAuthDialogOpen(false)
  }

  const fetchBriefs = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/briefs`)
      setBriefs(response.data || [])
    } catch (error) {
      console.error('Error fetching briefs:', error)
      toast.error('Không thể tải danh sách briefs')
      setBriefs([])
    } finally {
      setLoading(false)
    }
  }

  const toggleBriefSelection = (briefId: number) => {
    const newSelected = new Set(selectedBriefs)
    if (newSelected.has(briefId)) {
      newSelected.delete(briefId)
    } else {
      newSelected.add(briefId)
    }
    setSelectedBriefs(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedBriefs.size === briefs.length) {
      setSelectedBriefs(new Set())
    } else {
      setSelectedBriefs(new Set(briefs.map(b => b.id)))
    }
  }

  const togglePlatform = (platform: Platform) => {
    const newPlatforms = new Set(selectedPlatforms)
    if (newPlatforms.has(platform)) {
      newPlatforms.delete(platform)
    } else {
      newPlatforms.add(platform)
    }
    setSelectedPlatforms(newPlatforms)
  }

  const handlePublish = async () => {
    if (selectedBriefs.size === 0) {
      toast.error('Vui lòng chọn ít nhất một brief')
      return
    }
    if (selectedPlatforms.size === 0) {
      toast.error('Vui lòng chọn ít nhất một platform')
      return
    }

    try {
      setPublishing(true)
      const selectedBriefIds = Array.from(selectedBriefs)
      const platformsList = Array.from(selectedPlatforms)

      // Get selected briefs data
      const selectedBriefsData = briefs.filter(b => selectedBriefIds.includes(b.id))

      // Generate results for each platform
      const results: PublishResult[] = []

      for (const platform of platformsList) {
        if (platform === 'mailchimp') {
          // Get Mailchimp API key from localStorage
          const authState = localStorage.getItem('publisher_auth_state')
          console.log('📂 [PACKS] Retrieved raw auth state:', authState)
          if (!authState) {
            results.push({
              platform,
              success: false,
              message: '❌ Mailchimp API key not found. Please connect to Mailchimp first.',
              timestamp: new Date(),
            })
            continue
          }

          try {
            const authStates = JSON.parse(authState)
            console.log('📂 [PACKS] Parsed auth states:', authStates)
            const mailchimpAuth = authStates.mailchimp
            console.log('📂 [PACKS] Mailchimp auth object:', mailchimpAuth)
            console.log('📂 [PACKS] API token value:', mailchimpAuth?.token)
            console.log('📂 [PACKS] API token length:', mailchimpAuth?.token?.length)

            if (!mailchimpAuth?.token) {
              results.push({
                platform,
                success: false,
                message: '❌ Mailchimp API key not found. Please connect to Mailchimp first.',
                timestamp: new Date(),
              })
              continue
            }

            // Prepare email content from briefs
            const emailContent = `
              <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <h1>Content Package</h1>
                  <hr />
                  ${selectedBriefsData
                    .map(
                      (brief) => `
                    <div style="margin-bottom: 30px;">
                      <h2>${brief.title}</h2>
                      <p><strong>Target Audience:</strong> ${brief.target_audience}</p>
                      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                        <h3>Content Plan</h3>
                        <p>${brief.content_plan}</p>
                      </div>
                      ${brief.key_points?.length ? `<p><strong>Key Points:</strong> ${brief.key_points.join(', ')}</p>` : ''}
                      ${brief.tone ? `<p><strong>Tone:</strong> ${brief.tone}</p>` : ''}
                    </div>
                  `
                    )
                    .join('<hr />')}
                </body>
              </html>
            `

            // Call backend Mailchimp API endpoint
            const payload = {
              apiKey: mailchimpAuth.token,
              campaignName: `Content Batch - ${new Date().toLocaleDateString()}`,
              campaignSubject: `New Content - ${selectedBriefsData.map(b => b.title).join(', ')}`,
              emailContent: emailContent,
            }
            console.log('🚀 [PACKS] Sending to backend:', {
              apiKey: payload.apiKey,
              apiKeyLength: payload.apiKey?.length,
              campaignName: payload.campaignName,
              campaignSubject: payload.campaignSubject,
            })
            const response = await axios.post(`${API_BASE_URL}/publishing/mailchimp`, payload)

            results.push({
              platform,
              success: response.data.success,
              message: response.data.message || '✅ Email campaign sent successfully',
              timestamp: new Date(),
              details: {
                campaignId: response.data.campaignId,
                emailsSent: response.data.emailsSent,
                subscribers: response.data.subscribers,
              },
            })
          } catch (error) {
            console.error('Mailchimp API error:', error)
            let errorMessage = 'Unknown error'
            if (axios.isAxiosError(error)) {
              // Extract detailed error from backend response
              errorMessage = error.response?.data?.details || error.response?.data?.error || error.message
              console.error('Backend response:', error.response?.data)
            } else if (error instanceof Error) {
              errorMessage = error.message
            }
            results.push({
              platform,
              success: false,
              message: `❌ Failed to send email campaign: ${errorMessage}`,
              timestamp: new Date(),
            })
          }
        } else {
          // Simulate other platforms
          await new Promise(resolve => setTimeout(resolve, 500))
          results.push({
            platform,
            success: true,
            message: `✅ Posted successfully on ${platform}`,
            timestamp: new Date(),
          })
        }
      }

      setPublishResults(results)
      setShowResults(true)
      const successCount = results.filter(r => r.success).length
      toast.success(`Đã đăng thành công ${successCount}/${platformsList.length} nền tảng`)

      // Clear selections
      setSelectedBriefs(new Set())
      setSelectedPlatforms(new Set())
      setShowPublishDialog(false)
    } catch (error) {
      console.error('Error publishing:', error)
      toast.error('Không thể đăng briefs')
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-10 w-96 bg-muted animate-shimmer rounded" />
              <div className="h-5 w-64 bg-muted animate-shimmer rounded" />
            </div>
            <div className="h-11 w-44 bg-muted animate-shimmer rounded" />
          </div>
          <SkeletonList count={6} type="drafts" />
        </div>
      </div>
    )
  }

  const platforms: Platform[] = ['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok', 'mailchimp', 'wordpress']

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">📦 Content Packs</h1>
              <p className="text-muted-foreground mt-2">
                Chọn briefs để đăng trên nhiều platform cùng lúc
              </p>
            </div>
            <Button onClick={() => fetchBriefs()} variant="outline">
              Làm mới
            </Button>
          </div>

          {/* Empty State */}
          {briefs.length === 0 && (
            <EmptyState
              icon={Package}
              title="Chưa có brief nào"
              description="Tạo briefs từ ideas trước, sau đó quay lại đây để đăng đến nhiều platform."
              actionLabel="Tạo brief"
              onAction={() => router.push('/briefs')}
            />
          )}

          {/* Briefs List */}
          {briefs.length > 0 && (
            <>
              {/* Selection toolbar */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedBriefs.size === briefs.length && briefs.length > 0}
                        onCheckedChange={toggleSelectAll}
                        className="w-6 h-6"
                      />
                      <span className="font-medium">
                        {selectedBriefs.size > 0
                          ? `${selectedBriefs.size}/${briefs.length} brief(s) được chọn`
                          : `Chọn briefs để đăng`}
                      </span>
                    </div>
                    <Button
                      onClick={() => setShowPublishDialog(true)}
                      disabled={selectedBriefs.size === 0}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Đăng trên {selectedBriefs.size > 0 ? 'platform' : '...'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Briefs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {briefs.map((brief) => (
                  <Card key={brief.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">{brief.title}</CardTitle>
                          <CardDescription className="mt-2">
                            Từ idea: {brief.idea_title || `#${brief.idea_id}`}
                          </CardDescription>
                        </div>
                        <Checkbox
                          checked={selectedBriefs.has(brief.id)}
                          onCheckedChange={() => toggleBriefSelection(brief.id)}
                          className="w-6 h-6 mt-1"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mục tiêu đối tượng</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{brief.target_audience}</p>
                      </div>
                      {brief.key_points && brief.key_points.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Điểm chính</p>
                          <div className="flex flex-wrap gap-2">
                            {brief.key_points.slice(0, 3).map((point, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                                {point}
                              </span>
                            ))}
                            {brief.key_points.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded">
                                +{brief.key_points.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {brief.word_count && (
                        <div className="text-xs text-gray-500">
                          📝 {brief.word_count} từ
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Link href={`/briefs/${brief.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          Xem chi tiết
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Publish Dialog */}
          <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Đăng {selectedBriefs.size} Brief(s)</DialogTitle>
                <DialogDescription>
                  Chọn các platform mà bạn muốn đăng briefs này
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Auth Status for Mailchimp */}
                {selectedPlatforms.has('mailchimp') && !authStates.mailchimp.isAuthenticated && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg space-y-3">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      ⚠️ Mailchimp Authentication Required
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      Please connect your Mailchimp account to enable email publishing.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedAuthPlatform('mailchimp')
                        setAuthDialogOpen(true)
                      }}
                      className="w-full"
                    >
                      Connect Mailchimp
                    </Button>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-sm font-medium">Chọn Platforms:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.map((platform) => (
                      <label key={platform} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <Checkbox
                          checked={selectedPlatforms.has(platform)}
                          onCheckedChange={() => togglePlatform(platform)}
                        />
                        <span className="capitalize font-medium">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 {selectedBriefs.size} brief(s) sẽ được tối ưu hóa cho {selectedPlatforms.size} platform(s)
                  </p>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPublishDialog(false)}
                  disabled={publishing}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={
                    publishing ||
                    selectedPlatforms.size === 0 ||
                    (selectedPlatforms.has('mailchimp') && !authStates.mailchimp.isAuthenticated)
                  }
                  title={
                    selectedPlatforms.has('mailchimp') && !authStates.mailchimp.isAuthenticated
                      ? 'Please connect Mailchimp first'
                      : ''
                  }
                >
                  {publishing ? 'Đang đăng...' : `Đăng (${selectedPlatforms.size})`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Results Dialog */}
          <Dialog open={showResults} onOpenChange={setShowResults}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Check className="w-6 h-6 text-green-600" />
                  Kết quả đăng bài
                </DialogTitle>
                <DialogDescription>
                  Chi tiết kết quả đăng bài trên các platform
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-4">
                {publishResults.map((result, idx) => (
                  <Card key={idx} className={`border-0 bg-gradient-to-r ${
                    result.success 
                      ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' 
                      : 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
                  }`}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {/* Platform header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {result.platform === 'mailchimp' && '📧'}
                              {result.platform === 'twitter' && '𝕏'}
                              {result.platform === 'linkedin' && '💼'}
                              {result.platform === 'facebook' && '👍'}
                              {result.platform === 'instagram' && '📷'}
                              {result.platform === 'tiktok' && '🎵'}
                              {result.platform === 'wordpress' && '📝'}
                            </div>
                            <div>
                              <p className="font-semibold capitalize text-gray-900 dark:text-gray-100">
                                {result.platform}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {result.timestamp.toLocaleTimeString('vi-VN')}
                              </p>
                            </div>
                          </div>
                          {result.success ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>

                        {/* Message */}
                        <p className={`text-sm font-medium ${
                          result.success 
                            ? 'text-green-700 dark:text-green-300' 
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          {result.message}
                        </p>

                        {/* Mailchimp specific details */}
                        {result.platform === 'mailchimp' && result.success && result.details && (
                          <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800 space-y-3">
                            <div className="bg-white dark:bg-gray-900 rounded p-3 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Campaign ID:</span>
                                <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {result.details.campaignId}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Emails gửi:</span>
                                <span className="font-semibold text-lg text-green-600 dark:text-green-400">
                                  {result.details.emailsSent?.toLocaleString('vi-VN')} email
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Subscribers:</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {result.details.subscribers?.toLocaleString('vi-VN')} người
                                </span>
                              </div>
                              <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  ✓ Email campaign đã gửi thành công đến danh sách subscribers
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <DialogFooter>
                <Button onClick={() => setShowResults(false)} className="w-full">
                  Đóng
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Auth Dialog */}
          <AuthDialog
            platform={selectedAuthPlatform}
            isOpen={authDialogOpen}
            onClose={() => setAuthDialogOpen(false)}
            onConnect={handleAuthSuccess}
          />
        </div>
      </div>
    </PageTransition>
  )
}


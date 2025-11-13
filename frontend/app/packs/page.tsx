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
import { toast } from 'sonner'

const API_BASE_URL = 'http://localhost:3911/api'

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

export default function PacksPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [selectedBriefs, setSelectedBriefs] = useState<Set<number>>(new Set())
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set())
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    fetchBriefs()
  }, [])

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

      // Simulate publishing
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success(`Đã đăng ${selectedBriefIds.length} brief(s) trên ${platformsList.join(', ')}`)

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
                  disabled={publishing || selectedPlatforms.size === 0}
                >
                  {publishing ? 'Đang đăng...' : `Đăng (${selectedPlatforms.size})`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PageTransition>
  )
}


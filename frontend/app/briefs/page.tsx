'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { FileText, Loader2, Trash2, Eye, Edit2, Calendar } from 'lucide-react'
import { PageTransition } from '../components/PageTransition'
import { 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  EmptyState,
  SkeletonList,
  DeleteDialog,
  Badge
} from '../components/ui'
import { toast, toastSuccess, toastError } from '@/lib/toast'

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

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    fetchBriefs()
  }, [])

  const fetchBriefs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/briefs`)
      setBriefs(response.data)
    } catch (error) {
      console.error('Error fetching briefs:', error)
      toastError('Lỗi', 'Không thể tải danh sách briefs')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBrief = (id: number) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      await axios.delete(`${API_BASE_URL}/briefs/${deleteId}`)
      toastSuccess('Đã xóa!', 'Brief đã được xóa thành công.')
      fetchBriefs()
    } catch (error) {
      console.error('Error deleting brief:', error)
      toastError('Lỗi', 'Không thể xóa brief.')
    } finally {
      setDeleteId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      draft: { variant: 'default', label: '📝 Draft' },
      review: { variant: 'warning', label: '👀 Review' },
      approved: { variant: 'info', label: '✓ Approved' },
      published: { variant: 'success', label: '🚀 Published' },
    }
    
    const config = statusConfig[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
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
          </div>
          <SkeletonList count={4} type="briefs" />
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <FileText className="w-10 h-10 text-blue-500" />
                Content Briefs
              </h1>
              <p className="text-muted-foreground mt-2">
                Các bản kế hoạch nội dung chi tiết được tạo bởi AI
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Tổng số</CardDescription>
                <CardTitle className="text-3xl">{briefs.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Draft</CardDescription>
                <CardTitle className="text-3xl text-gray-600">
                  {briefs.filter(b => b.status === 'draft').length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Review</CardDescription>
                <CardTitle className="text-3xl text-orange-600">
                  {briefs.filter(b => b.status === 'review').length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Published</CardDescription>
                <CardTitle className="text-3xl text-green-600">
                  {briefs.filter(b => b.status === 'published').length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Empty State */}
          {briefs.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Chưa có brief nào"
              description="Hãy chọn ý tưởng và tạo brief bằng AI từ trang Ý Tưởng."
              actionLabel="Đi tới Ý Tưởng"
              onAction={() => window.location.href = '/ideas'}
            />
          ) : (
            <>
              {/* Briefs List */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Danh sách Briefs ({briefs.length})
                </h2>
                <div className="space-y-6">
                  {briefs.map((brief) => (
                    <Card 
                      key={brief.id} 
                      className="hover:shadow-lg transition-all duration-200"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-xl">
                                {brief.title}
                              </CardTitle>
                              {getStatusBadge(brief.status)}
                            </div>
                            {brief.idea_title && (
                              <CardDescription className="flex items-center gap-2">
                                <span className="text-xs">Từ ý tưởng:</span>
                                <Badge variant="outline" className="text-xs">
                                  {brief.idea_title}
                                </Badge>
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-4">
                          {/* Target Audience */}
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              🎯 Đối tượng mục tiêu:
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {brief.target_audience}
                            </p>
                          </div>

                          {/* Content Plan Preview */}
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              📋 Kế hoạch nội dung:
                            </h4>
                            <p className={`text-sm text-muted-foreground ${expandedId === brief.id ? '' : 'line-clamp-3'}`}>
                              {brief.content_plan}
                            </p>
                            {brief.content_plan.length > 200 && (
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto text-xs mt-1"
                                onClick={() => toggleExpand(brief.id)}
                              >
                                {expandedId === brief.id ? 'Thu gọn' : 'Xem thêm'}
                              </Button>
                            )}
                          </div>

                          {/* Key Points */}
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              💡 Điểm chính:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {brief.key_points?.slice(0, 5).map((point, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {point}
                                </Badge>
                              ))}
                              {brief.key_points?.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{brief.key_points.length - 5} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Metadata Row */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                            {brief.tone && (
                              <div>
                                <span className="text-xs text-muted-foreground">Tone:</span>
                                <p className="text-sm font-medium">{brief.tone}</p>
                              </div>
                            )}
                            {brief.word_count && (
                              <div>
                                <span className="text-xs text-muted-foreground">Word Count:</span>
                                <p className="text-sm font-medium">{brief.word_count.toLocaleString()} từ</p>
                              </div>
                            )}
                            <div>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Tạo lúc:
                              </span>
                              <p className="text-sm font-medium">{formatDate(brief.created_at)}</p>
                            </div>
                          </div>

                          {/* Keywords */}
                          {brief.keywords && brief.keywords.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                🔑 Keywords:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {brief.keywords.map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => window.location.href = `/briefs/${brief.id}`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
                          onClick={() => handleDeleteBrief(brief.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Delete Confirmation Dialog */}
          <DeleteDialog
            isOpen={!!deleteId}
            onClose={() => setDeleteId(null)}
            title="Xóa brief"
            itemName={briefs.find(b => b.id === deleteId)?.title}
            onConfirm={confirmDelete}
          />
        </div>
      </div>
    </PageTransition>
  )
}

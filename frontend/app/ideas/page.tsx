'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Lightbulb, Loader2, Plus, FileText, Trash2, CheckCircle2 } from 'lucide-react'
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

interface Idea {
  id: number
  title: string
  description?: string
  rationale?: string
  persona?: string
  industry?: string
  status: string
  created_at: string
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
  const [generatingBrief, setGeneratingBrief] = useState<number | null>(null)

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ideas`)
      setIdeas(response.data)
    } catch (error) {
      console.error('Error fetching ideas:', error)
      toastError('Lỗi', 'Không thể tải danh sách ý tưởng')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (ideaId: number, newStatus: string) => {
    setUpdatingStatus(ideaId)
    try {
      await axios.patch(`${API_BASE_URL}/ideas/${ideaId}/status`, {
        status: newStatus
      })
      toastSuccess('Thành công!', `Status đã được cập nhật thành "${newStatus}"`)
      fetchIdeas()
    } catch (error) {
      console.error('Error updating status:', error)
      toastError('Lỗi', 'Không thể cập nhật status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleGenerateBrief = async (ideaId: number) => {
    setGeneratingBrief(ideaId)
    try {
      const response = await axios.post(`${API_BASE_URL}/briefs/generate`, {
        idea_id: ideaId,
        model: 'gemini',
        temperature: 0.7
      })
      
      if (response.data.success) {
        toastSuccess('Thành công!', '✨ Brief đã được tạo!')
        fetchIdeas() // Refresh để cập nhật status
      }
    } catch (error: any) {
      console.error('Error generating brief:', error)
      
      if (error.response?.status === 403) {
        toastError('Không thể tạo brief', error.response.data.hint || 'Idea phải có status "selected"')
      } else {
        toastError('Lỗi', error.response?.data?.details || 'Không thể tạo brief')
      }
    } finally {
      setGeneratingBrief(null)
    }
  }

  const handleDeleteIdea = (id: number) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      await axios.delete(`${API_BASE_URL}/ideas/${deleteId}`)
      toastSuccess('Đã xóa!', 'Ý tưởng đã được xóa thành công.')
      fetchIdeas()
    } catch (error) {
      console.error('Error deleting idea:', error)
      toastError('Lỗi', 'Không thể xóa ý tưởng.')
    } finally {
      setDeleteId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      pending: { variant: 'default', label: '⏳ Pending' },
      selected: { variant: 'success', label: '✅ Selected' },
      rejected: { variant: 'destructive', label: '❌ Rejected' },
      generated: { variant: 'info', label: '📄 Generated' },
    }
    
    const config = statusConfig[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
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
          <SkeletonList count={6} type="ideas" />
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
                <Lightbulb className="w-10 h-10 text-yellow-500" />
                Danh Sách Ý Tưởng
              </h1>
              <p className="text-muted-foreground mt-2">
                Quản lý và chọn ý tưởng để tạo brief nội dung
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Tổng số</CardDescription>
                <CardTitle className="text-3xl">{ideas.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pending</CardDescription>
                <CardTitle className="text-3xl text-gray-600">
                  {ideas.filter(i => i.status === 'pending').length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Selected</CardDescription>
                <CardTitle className="text-3xl text-green-600">
                  {ideas.filter(i => i.status === 'selected').length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Generated</CardDescription>
                <CardTitle className="text-3xl text-blue-600">
                  {ideas.filter(i => i.status === 'generated').length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Empty State */}
          {ideas.length === 0 ? (
            <EmptyState
              icon={Lightbulb}
              title="Chưa có ý tưởng nào"
              description="Hãy tạo ý tưởng đầu tiên hoặc sử dụng AI để tự động sinh ý tưởng."
              actionLabel="Về trang chủ"
              onAction={() => window.location.href = '/'}
            />
          ) : (
            <>
              {/* Ideas List */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Danh sách ({ideas.length} ý tưởng)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ideas.map((idea) => (
                    <Card key={idea.id} className="flex flex-col hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-lg line-clamp-2 flex-1">
                            {idea.title}
                          </CardTitle>
                          {getStatusBadge(idea.status)}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {idea.description || 'Không có mô tả'}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex-1 pb-2">
                        <div className="space-y-2 text-sm">
                          {idea.persona && (
                            <div>
                              <span className="font-medium">Persona:</span>{' '}
                              <Badge variant="outline">{idea.persona}</Badge>
                            </div>
                          )}
                          {idea.industry && (
                            <div>
                              <span className="font-medium">Industry:</span>{' '}
                              <Badge variant="outline">{idea.industry}</Badge>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground pt-2">
                            {formatDate(idea.created_at)}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                        {/* Status Actions */}
                        {idea.status === 'pending' && (
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full"
                            onClick={() => handleUpdateStatus(idea.id, 'selected')}
                            disabled={updatingStatus === idea.id}
                          >
                            {updatingStatus === idea.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Chọn ý tưởng này
                              </>
                            )}
                          </Button>
                        )}

                        {idea.status === 'selected' && (
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            onClick={() => handleGenerateBrief(idea.id)}
                            disabled={generatingBrief === idea.id}
                          >
                            {generatingBrief === idea.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang tạo brief...
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 mr-2" />
                                Tạo Brief với AI
                              </>
                            )}
                          </Button>
                        )}

                        {idea.status === 'generated' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => window.location.href = '/briefs'}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Xem Brief
                          </Button>
                        )}

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteIdea(idea.id)}
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
            title="Xóa ý tưởng"
            itemName={ideas.find(i => i.id === deleteId)?.title}
            onConfirm={confirmDelete}
          />
        </div>
      </div>
    </PageTransition>
  )
}

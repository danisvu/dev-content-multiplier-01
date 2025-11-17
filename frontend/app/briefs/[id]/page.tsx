'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  User,
  Briefcase,
  FileText,
  Target,
  MessageSquare,
  Hash,
  Type,
  AlignLeft
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { PageTransition } from '../../components/PageTransition'
import { 
  Button, 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  DeleteDialog,
  SkeletonList
} from '../../components/ui'
import { toastSuccess, toastError } from '@/lib/toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : 'http://localhost:3911/api'

interface BriefDetail {
  // Brief fields
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
  
  // Joined idea fields
  idea_title?: string
  idea_description?: string
  idea_rationale?: string
  idea_persona?: string
  idea_industry?: string
  idea_status?: string
  idea_created_at?: string
}

export default function BriefDetailPage() {
  const params = useParams()
  const router = useRouter()
  const briefId = params.id as string
  
  const [brief, setBrief] = useState<BriefDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showIdeaDetails, setShowIdeaDetails] = useState(true)

  useEffect(() => {
    fetchBrief()
  }, [briefId])

  const fetchBrief = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/briefs/${briefId}`)
      setBrief(response.data)
    } catch (error) {
      console.error('Error fetching brief:', error)
      toastError('Lỗi', 'Không thể tải brief')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/briefs/${briefId}`)
      toastSuccess('Đã xóa!', 'Brief đã được xóa thành công.')
      setTimeout(() => {
        router.push('/briefs')
      }, 1000)
    } catch (error) {
      console.error('Error deleting brief:', error)
      toastError('Lỗi', 'Không thể xóa brief.')
    } finally {
      setShowDeleteModal(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
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
      // Idea statuses
      pending: { variant: 'default', label: '⏳ Pending' },
      selected: { variant: 'success', label: '✅ Selected' },
      generated: { variant: 'info', label: '📄 Generated' },
    }
    
    const config = statusConfig[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="h-12 w-64 bg-muted animate-shimmer rounded" />
          <SkeletonList count={2} type="briefs" className="!grid-cols-1" />
        </div>
      </div>
    )
  }

  if (!brief) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Brief không tìm thấy</CardTitle>
            <CardDescription>
              Brief bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/briefs">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <Link href="/briefs">
                <Button variant="ghost" size="icon" className="mt-1">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{brief.title}</h1>
                  {getStatusBadge(brief.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Brief ID: {brief.id} • Tạo lúc: {formatDate(brief.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Original Idea Section */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowIdeaDetails(!showIdeaDetails)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Ý Tưởng Gốc</CardTitle>
                    <CardDescription>
                      {brief.idea_title || 'Không có thông tin'}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  {showIdeaDetails ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </CardHeader>

            {showIdeaDetails && (
              <CardContent className="space-y-4 pt-0">
                {/* Idea Description */}
                {brief.idea_description && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>Mô tả:</span>
                    </div>
                    <p className="text-muted-foreground pl-6">
                      {brief.idea_description}
                    </p>
                  </div>
                )}

                {/* Idea Rationale */}
                {brief.idea_rationale && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span>Lý do:</span>
                    </div>
                    <p className="text-muted-foreground pl-6">
                      {brief.idea_rationale}
                    </p>
                  </div>
                )}

                {/* Idea Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  {brief.idea_persona && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>Persona:</span>
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {brief.idea_persona}
                      </Badge>
                    </div>
                  )}
                  
                  {brief.idea_industry && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Briefcase className="w-3 h-3" />
                        <span>Industry:</span>
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {brief.idea_industry}
                      </Badge>
                    </div>
                  )}

                  {brief.idea_status && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Hash className="w-3 h-3" />
                        <span>Status:</span>
                      </div>
                      <div className="mt-1">
                        {getStatusBadge(brief.idea_status)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Link to Idea */}
                <div className="pt-4 border-t">
                  <Link href={`/ideas`}>
                    <Button variant="outline" size="sm">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Xem trang Ý tưởng
                    </Button>
                  </Link>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Brief Content Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-7 h-7 text-blue-500" />
              Nội Dung Brief
            </h2>

            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-red-500" />
                  Đối Tượng Mục Tiêu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {brief.target_audience}
                </p>
              </CardContent>
            </Card>

            {/* Content Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlignLeft className="w-5 h-5 text-purple-500" />
                  Kế Hoạch Nội Dung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {brief.content_plan}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Key Points */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  💡 Điểm Chính ({brief.key_points?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {brief.key_points?.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-muted-foreground flex-1 pt-0.5">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tone & Word Count */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Type className="w-5 h-5 text-green-500" />
                    Chi Tiết Viết
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {brief.tone && (
                    <div>
                      <span className="text-sm text-muted-foreground">Tone:</span>
                      <p className="font-medium mt-1">{brief.tone}</p>
                    </div>
                  )}
                  {brief.word_count && (
                    <div>
                      <span className="text-sm text-muted-foreground">Word Count:</span>
                      <p className="font-medium mt-1">
                        {brief.word_count.toLocaleString()} từ
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    🔑 Keywords SEO ({brief.keywords?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {brief.keywords?.map((keyword, idx) => (
                      <Badge key={idx} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timestamps */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Tạo lúc: {formatDate(brief.created_at)}</span>
                  </div>
                  {brief.updated_at !== brief.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Cập nhật: {formatDate(brief.updated_at)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Footer */}
          <Card>
            <CardFooter className="flex justify-between pt-6">
              <Link href="/briefs">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại danh sách
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button variant="default">
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa Brief
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Delete Confirmation Dialog */}
          <DeleteDialog
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Xóa Brief"
            itemName={brief.title}
            onConfirm={handleDelete}
          />
        </div>
      </div>
    </PageTransition>
  )
}

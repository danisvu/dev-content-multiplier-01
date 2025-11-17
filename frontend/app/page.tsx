'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Loader2, Plus, Sparkles } from 'lucide-react'
import { IdeaCard } from './components/IdeaCard'
import { IdeaDialog, IdeaFormData } from './components/IdeaDialog'
import { PageTransition } from './components/PageTransition'
import { SuccessConfetti } from './components/SuccessConfetti'
import { 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  EmptyState,
  SkeletonList,
  DeleteDialog
} from './components/ui'
import { toast, toastSuccess, toastError } from '@/lib/toast'
import { Lightbulb } from 'lucide-react'

interface Idea {
  id: number
  title: string
  description?: string
  rationale?: string
  persona?: string
  industry?: string
  status: 'draft' | 'selected' | 'archived' | 'pending' | 'rejected' | 'generated'
  created_at: string
}

interface GenerateIdeasRequest {
  persona: string
  industry: string
  model?: 'gemini' | 'deepseek'
  temperature?: number
}

interface GeneratedIdea {
  title: string
  description: string
  rationale: string
}

interface GenerateIdeasResponse {
  success: boolean
  ideas?: GeneratedIdea[]
  error?: string
}

const API_BASE_URL = 'http://localhost:3911/api'

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)

  // AI Generation states
  const [generateForm, setGenerateForm] = useState<GenerateIdeasRequest>({
    persona: '',
    industry: '',
    model: 'gemini',
    temperature: 0.7
  })
  const [generating, setGenerating] = useState(false)
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([])
  
  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Delete confirmation modal
  const [deleteId, setDeleteId] = useState<number | null>(null)

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

  const handleSaveIdea = async (data: IdeaFormData) => {
    setDialogLoading(true)
    try {
      if (editingIdea) {
        await axios.put(`${API_BASE_URL}/ideas/${editingIdea.id}`, data)
        toastSuccess('Thành công!', 'Ý tưởng đã được cập nhật.')
      } else {
        await axios.post(`${API_BASE_URL}/ideas`, data)
        toastSuccess('Thành công!', 'Ý tưởng đã được tạo.')
      }
      
      setShowConfetti(true)
      setDialogOpen(false)
      setEditingIdea(null)
      fetchIdeas()
    } catch (error) {
      console.error('Error saving idea:', error)
      toastError('Lỗi', 'Không thể lưu ý tưởng. Vui lòng thử lại.')
    } finally {
      setDialogLoading(false)
    }
  }

  const handleEditIdea = (idea: Idea) => {
    setEditingIdea(idea)
    setDialogOpen(true)
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
      toastError('Lỗi', 'Không thể xóa ý tưởng. Vui lòng thử lại.')
    } finally {
      setDeleteId(null)
    }
  }

  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!generateForm.persona.trim() || !generateForm.industry.trim()) {
      toastError('Lỗi', 'Vui lòng nhập cả persona và industry')
      return
    }

    setGenerating(true)
    setGeneratedIdeas([])

    try {
      // Health check
      try {
        await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, { timeout: 5000 })
      } catch (healthError) {
        const errorDetails = healthError instanceof Error ? healthError.message : 'Unknown error'
        throw new Error(`Server không phản hồi (${API_BASE_URL}). Chi tiết: ${errorDetails}`)
      }

      const response = await axios.post<GenerateIdeasResponse>(
        `${API_BASE_URL}/ideas/generate`,
        generateForm,
        { timeout: 60000 }
      )

      if (response.data.success && response.data.ideas) {
        setGeneratedIdeas(response.data.ideas)
        toastSuccess('Thành công!', `✨ Đã tạo ${response.data.ideas.length} ý tưởng mới!`)
        setShowConfetti(true)
        fetchIdeas()
      } else {
        toastError('Lỗi', response.data.error || 'Đã có lỗi xảy ra khi tạo ý tưởng')
      }
    } catch (error) {
      console.error('Error generating ideas:', error)

      let errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại sau.'

      if (error instanceof Error) {
        if (error.message.includes('Server không phản hồi')) {
          errorMessage = error.message
        } else if (error.message.includes('Network')) {
          errorMessage = `Lỗi mạng: ${error.message}`
        } else if (error.message.includes('timeout')) {
          errorMessage = `Hết thời gian chờ. Server đang chậm hoặc không phản hồi.`
        }
      }

      toastError('Lỗi', errorMessage)
    } finally {
      setGenerating(false)
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

  const handleOpenCreateDialog = () => {
    setEditingIdea(null)
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-10 w-96 bg-muted animate-shimmer rounded" />
              <div className="h-5 w-64 bg-muted animate-shimmer rounded" />
            </div>
            <div className="h-11 w-44 bg-muted animate-shimmer rounded" />
          </div>

          {/* Ideas Grid Skeleton */}
          <SkeletonList count={6} type="ideas" />
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      {/* Success Confetti */}
      <SuccessConfetti 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)}
        duration={3000}
      />
      
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Content Ideas Manager
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý và tạo ý tưởng nội dung với AI
            </p>
          </div>
          <Button onClick={handleOpenCreateDialog} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Tạo ý tưởng mới
          </Button>
        </div>

        {/* AI Generation Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Tự động sinh ý tưởng bằng AI
            </CardTitle>
            <CardDescription>
              Sử dụng AI để tạo ý tưởng nội dung dựa trên persona và ngành nghề
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateIdeas} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Persona <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={generateForm.persona}
                    onChange={(e) => setGenerateForm({ ...generateForm, persona: e.target.value })}
                    className="w-full px-3 py-2 border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="VD: Content Creator, Digital Marketer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={generateForm.industry}
                    onChange={(e) => setGenerateForm({ ...generateForm, industry: e.target.value })}
                    className="w-full px-3 py-2 border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="VD: Technology, Fashion, Food"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Model AI
                  </label>
                  <select
                    value={generateForm.model}
                    onChange={(e) => setGenerateForm({ ...generateForm, model: e.target.value as 'gemini' | 'deepseek' })}
                    className="w-full px-3 py-2 border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="gemini">Gemini (Google)</option>
                    <option value="deepseek">Deepseek</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Temperature: {generateForm.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={generateForm.temperature}
                    onChange={(e) => setGenerateForm({ ...generateForm, temperature: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Conservative</span>
                    <span>Creative</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={generating}
                className="w-full"
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span>Đang tạo ý tưởng...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    <span>Tạo ý tưởng với AI</span>
                  </>
                )}
              </Button>
            </form>

            {/* Generated Ideas Display */}
            {generatedIdeas.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  ✨ Ý tưởng vừa được tạo ({generatedIdeas.length} ý tưởng)
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {generatedIdeas.map((idea, index) => (
                    <div key={index} className="border border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">
                        {index + 1}. {idea.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-2">{idea.description}</p>
                      <p className="text-purple-700 dark:text-purple-400 text-xs italic">
                        <strong>Lý do:</strong> {idea.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

          {/* Ideas List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Danh sách ý tưởng ({ideas.length})
            </h2>
          </div>

          {ideas.length === 0 ? (
            <EmptyState
              icon={Lightbulb}
              title="Chưa có ý tưởng nào"
              description="Hãy tạo ý tưởng đầu tiên của bạn hoặc sử dụng AI để tự động sinh ý tưởng."
              actionLabel="Tạo ý tưởng mới"
              onAction={handleOpenCreateDialog}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onEdit={handleEditIdea}
                  onDelete={handleDeleteIdea}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Dialog */}
        <IdeaDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) {
              setEditingIdea(null)
            }
          }}
          idea={editingIdea}
          onSave={handleSaveIdea}
          isLoading={dialogLoading}
        />

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

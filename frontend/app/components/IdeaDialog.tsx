'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { MarkdownEditor } from './MarkdownEditor'
import { ContentStats } from './ContentStats'

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

interface IdeaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  idea?: Idea | null
  onSave: (data: IdeaFormData) => void
  isLoading?: boolean
}

export interface IdeaFormData {
  title: string
  description?: string
  rationale?: string
  persona?: string
  industry?: string
  status?: string
}

export function IdeaDialog({
  open,
  onOpenChange,
  idea,
  onSave,
  isLoading = false
}: IdeaDialogProps) {
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    rationale: '',
    persona: '',
    industry: '',
    status: 'pending'
  })

  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title,
        description: idea.description || '',
        rationale: idea.rationale || '',
        persona: idea.persona || '',
        industry: idea.industry || '',
        status: idea.status
      })
    } else {
      setFormData({
        title: '',
        description: '',
        rationale: '',
        persona: '',
        industry: '',
        status: 'pending'
      })
    }
  }, [idea, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {idea ? 'Chỉnh sửa ý tưởng' : 'Tạo ý tưởng mới'}
          </DialogTitle>
          <DialogDescription>
            {idea 
              ? 'Cập nhật thông tin ý tưởng của bạn'
              : 'Thêm ý tưởng mới vào danh sách của bạn'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content Stats */}
          <ContentStats
            content={`${formData.title} ${formData.description} ${formData.rationale}`}
            status={formData.status as 'draft' | 'in-progress' | 'completed'}
            sticky={false}
          />

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Nhập tiêu đề ý tưởng"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Mô tả (Markdown)
            </label>
            <MarkdownEditor
              value={formData.description || ''}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Mô tả chi tiết ý tưởng (hỗ trợ Markdown)"
              height={150}
            />
          </div>

          {/* Rationale */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Lý do (Markdown)
            </label>
            <MarkdownEditor
              value={formData.rationale || ''}
              onChange={(value) => setFormData({ ...formData, rationale: value })}
              placeholder="Tại sao ý tưởng này sẽ hiệu quả? (hỗ trợ Markdown)"
              height={120}
            />
          </div>

          {/* Persona & Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Persona
              </label>
              <input
                type="text"
                value={formData.persona}
                onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                className="w-full px-3 py-2 border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Đối tượng mục tiêu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Ngành
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Lĩnh vực/ngành"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : idea ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


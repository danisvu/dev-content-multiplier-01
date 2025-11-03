'use client'

import { useState } from 'react'
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { PageTransition } from '../../components/PageTransition'
import { SuccessConfetti } from '../../components/SuccessConfetti'
import { 
  Button, 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  SkeletonList,
  Modal,
  StatusBadge
} from '../../components/ui'
import { toastSuccess, toastError } from '@/lib/toast'

export default function NewPackPage() {
  const [generating, setGenerating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [title, setTitle] = useState('')
  const [brief, setBrief] = useState('')

  const handleGenerate = async () => {
    if (!title.trim()) {
      toastError('Lỗi', 'Vui lòng nhập tiêu đề')
      return
    }

    setGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGenerating(false)
      toastSuccess('Thành công!', 'Draft đã được tạo bởi AI')
    }, 2000)
  }

  const handlePublish = () => {
    setShowPublishModal(false)
    setShowConfetti(true)
    toastSuccess('Đã publish!', 'Content pack đã được xuất bản thành công')
    setTimeout(() => {
      window.location.href = '/packs'
    }, 2000)
  }

  return (
    <PageTransition>
      <SuccessConfetti
        show={showConfetti}
        onComplete={() => setShowConfetti(false)}
        duration={3000}
      />

      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/packs">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Tạo Content Pack Mới</h1>
                <p className="text-muted-foreground mt-1">
                  Tự động sinh nội dung đa kênh với AI
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <StatusBadge status="draft" />
              <Button 
                variant="default" 
                onClick={() => setShowPublishModal(true)}
                disabled={!title.trim()}
              >
                🚀 Publish
              </Button>
            </div>
          </div>

          {/* Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình Pack</CardTitle>
              <CardDescription>
                Nhập thông tin để AI tạo nội dung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiêu đề Pack <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="VD: Summer Campaign 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Brief nội dung
                </label>
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Mô tả ngắn gọn về nội dung bạn muốn tạo..."
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !title.trim()}
                className="w-full"
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang tạo với AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Tạo nội dung với AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Content (when generating) */}
          {generating && (
            <Card>
              <CardHeader>
                <CardTitle>AI đang tạo nội dung...</CardTitle>
              </CardHeader>
              <CardContent>
                <SkeletonList count={3} type="drafts" />
              </CardContent>
            </Card>
          )}

          {/* Publish Confirmation Modal */}
          <Modal
            isOpen={showPublishModal}
            onClose={() => setShowPublishModal(false)}
            title="Publish Content Pack"
            description="Bạn có chắc chắn muốn xuất bản pack này đến tất cả kênh không?"
            confirmLabel="Publish"
            cancelLabel="Hủy"
            onConfirm={handlePublish}
            icon={<Sparkles className="w-6 h-6" />}
          />
        </div>
      </div>
    </PageTransition>
  )
}


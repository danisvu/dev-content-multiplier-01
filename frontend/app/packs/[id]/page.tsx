'use client'

import { useState } from 'react'
import { ArrowLeft, Edit, Trash2, Download } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PageTransition } from '../../components/PageTransition'
import { SuccessConfetti } from '../../components/SuccessConfetti'
import { 
  Button, 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  SkeletonList,
  DeleteDialog,
  StatusBadge,
  Modal
} from '../../components/ui'
import { toastSuccess, toastError } from '@/lib/toast'

export default function PackDetailPage() {
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [pack, setPack] = useState({
    id: params.id,
    title: 'Sample Pack',
    description: 'Pack description here...',
    status: 'draft' as const
  })

  const handleUpdate = () => {
    toastSuccess('Đã lưu!', 'Pack đã được cập nhật.')
  }

  const handleDelete = () => {
    toastSuccess('Đã xóa!', 'Pack đã được xóa.')
    setTimeout(() => {
      window.location.href = '/packs'
    }, 1000)
  }

  const handlePublish = () => {
    setPack({ ...pack, status: 'published' })
    setShowConfetti(true)
    toastSuccess('Đã publish!', 'Pack đã được xuất bản thành công.')
    setShowPublishModal(false)
  }

  const handleExport = () => {
    toastSuccess('Đang xuất...', 'Nội dung đang được xuất ra file.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <SkeletonList count={1} type="drafts" />
        </div>
      </div>
    )
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
                <h1 className="text-3xl font-bold">{pack.title}</h1>
                <p className="text-muted-foreground mt-1">
                  Pack ID: {pack.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={pack.status} />
              {pack.status === 'draft' && (
                <Button onClick={() => setShowPublishModal(true)}>
                  🚀 Publish
                </Button>
              )}
              <Button variant="outline" size="icon" onClick={handleExport}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleUpdate}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => setShowDeleteModal(true)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Pack Content */}
          <Card>
            <CardHeader>
              <CardTitle>Pack Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {pack.description}
              </p>
            </CardContent>
          </Card>

          {/* Modals */}
          <DeleteDialog
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Xóa Pack"
            itemName={pack.title}
            onConfirm={handleDelete}
          />

          <Modal
            isOpen={showPublishModal}
            onClose={() => setShowPublishModal(false)}
            title="Publish Pack"
            description="Bạn có chắc chắn muốn xuất bản pack này không?"
            confirmLabel="Publish"
            cancelLabel="Hủy"
            onConfirm={handlePublish}
          />
        </div>
      </div>
    </PageTransition>
  )
}


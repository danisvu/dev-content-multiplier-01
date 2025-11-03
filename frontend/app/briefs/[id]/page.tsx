'use client'

import { useState } from 'react'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PageTransition } from '../../components/PageTransition'
import { 
  Button, 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  SkeletonList,
  DeleteDialog,
  StatusBadge
} from '../../components/ui'
import { toastSuccess, toastError } from '@/lib/toast'

export default function BriefDetailPage() {
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [brief, setBrief] = useState({
    id: params.id,
    title: 'Sample Brief',
    description: 'Brief description here...',
    status: 'draft' as const
  })

  const handleUpdate = () => {
    toastSuccess('Đã lưu!', 'Brief đã được cập nhật.')
  }

  const handleDelete = () => {
    toastSuccess('Đã xóa!', 'Brief đã được xóa.')
    setTimeout(() => {
      window.location.href = '/briefs'
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <SkeletonList count={1} type="briefs" />
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/briefs">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{brief.title}</h1>
                <p className="text-muted-foreground mt-1">
                  Brief ID: {brief.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={brief.status} />
              <Button variant="outline" size="icon" onClick={handleUpdate}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => setShowDeleteModal(true)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Brief Content */}
          <Card>
            <CardHeader>
              <CardTitle>Brief Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {brief.description}
              </p>
            </CardContent>
          </Card>

          {/* Delete Modal */}
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


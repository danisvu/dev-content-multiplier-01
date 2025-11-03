'use client'

import { useState } from 'react'
import { Plus, Package } from 'lucide-react'
import Link from 'next/link'
import { PageTransition } from '../components/PageTransition'
import { 
  Button, 
  EmptyState, 
  SkeletonList,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  StatusBadge
} from '../components/ui'
import { toastSuccess } from '@/lib/toast'

export default function PacksPage() {
  const [loading, setLoading] = useState(false)
  const [packs, setPacks] = useState<any[]>([])

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

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">📦 Content Packs</h1>
              <p className="text-muted-foreground mt-2">
                Tạo và quản lý gói nội dung đa kênh
              </p>
            </div>
            <Link href="/packs/new">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Tạo pack mới
              </Button>
            </Link>
          </div>

          {/* Empty State */}
          {packs.length === 0 && (
            <EmptyState
              icon={Package}
              title="Chưa có pack nào"
              description="Tạo content pack để xuất bản nội dung đến nhiều kênh cùng lúc."
              actionLabel="Tạo pack đầu tiên"
              onAction={() => window.location.href = '/packs/new'}
            />
          )}

          {/* Packs Grid (when data available) */}
          {packs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pack cards will be rendered here */}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}


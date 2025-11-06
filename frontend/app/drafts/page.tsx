'use client'

import { SidebarLayout } from '../components/Sidebar'
import { EmptyState } from '../components/ui'
import { Pen } from 'lucide-react'

export default function DraftsPage() {
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <EmptyState
          icon={Pen}
          title="Bản Nháp"
          description="Tính năng quản lý bản nháp đang được phát triển. Sẽ sớm ra mắt!"
          actionLabel="Quay lại Trang chủ"
          onAction={() => window.location.href = '/'}
        />
      </div>
    </SidebarLayout>
  )
}


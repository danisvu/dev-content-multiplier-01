'use client'

import { useState } from 'react'
import { PageTransition } from '../components/PageTransition'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  StatusBadge,
  EmptyState,
  SkeletonList,
  ThemeToggle,
  Modal,
  ConfirmDialog,
  DeleteDialog,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui'
import { toast, toastSuccess, toastError, toastInfo } from '@/lib/toast'
import { Lightbulb, FileText, Trash2, Edit } from 'lucide-react'

export default function UIComponentsDemo() {
  const [showModal, setShowModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">UI Components Library</h1>
            <p className="text-xl text-muted-foreground">
              Tất cả component UI có thể tái sử dụng trong app
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="toast" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="toast">Toast</TabsTrigger>
              <TabsTrigger value="badge">Badge</TabsTrigger>
              <TabsTrigger value="modal">Modal</TabsTrigger>
              <TabsTrigger value="empty">EmptyState</TabsTrigger>
              <TabsTrigger value="skeleton">Skeleton</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
            </TabsList>

            {/* Toast Tab */}
            <TabsContent value="toast" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Toast Notifications</CardTitle>
                  <CardDescription>
                    Hiển thị toast notification với sonner. Tự động biến mất sau 3 giây.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => toastSuccess('Thành công!', 'Hành động đã được thực hiện.')}>
                      Success Toast
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => toastError('Lỗi!', 'Có lỗi xảy ra khi thực hiện.')}
                    >
                      Error Toast
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => toastInfo('Thông tin', 'Đây là thông tin hữu ích.')}
                    >
                      Info Toast
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => toast({ 
                        title: 'Custom Toast', 
                        description: 'Toast với duration tùy chỉnh',
                        variant: 'success',
                        duration: 5000 
                      })}
                    >
                      Custom Duration (5s)
                    </Button>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm font-semibold mb-2">Usage:</p>
                    <code className="text-xs">{`import { toast, toastSuccess, toastError } from '@/lib/toast'

// Simple
toastSuccess('Success!', 'Description here')

// With custom options
toast({ 
  title: 'Title',
  description: 'Description',
  variant: 'success',
  duration: 5000 
})`}</code>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Badge Tab */}
            <TabsContent value="badge" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Badge Component</CardTitle>
                  <CardDescription>
                    Badge với nhiều variants và StatusBadge cho content status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Standard Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="info">Info</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Status Badges (với icon)</h3>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status="draft" />
                      <StatusBadge status="review" />
                      <StatusBadge status="approved" />
                      <StatusBadge status="published" />
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm font-semibold mb-2">Usage:</p>
                    <code className="text-xs whitespace-pre">{`import { Badge, StatusBadge } from '@/components/ui'

<Badge variant="success">Label</Badge>
<StatusBadge status="draft" />
<StatusBadge status="published" />`}</code>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Modal Tab */}
            <TabsContent value="modal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Modal / Dialog Components</CardTitle>
                  <CardDescription>
                    Modal, ConfirmDialog, DeleteDialog cho các hành động xác nhận
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => setShowModal(true)}>
                      Basic Modal
                    </Button>
                    <Button variant="secondary" onClick={() => setShowConfirmDialog(true)}>
                      Confirm Dialog
                    </Button>
                    <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                      Delete Dialog
                    </Button>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm font-semibold mb-2">Usage:</p>
                    <code className="text-xs whitespace-pre">{`import { Modal, ConfirmDialog, DeleteDialog } from '@/components/ui'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Tiêu đề"
  description="Mô tả"
  confirmLabel="OK"
  onConfirm={() => handleConfirm()}
/>

<DeleteDialog
  isOpen={isOpen}
  onClose={onClose}
  title="Xóa item"
  itemName="My Item"
  onConfirm={() => handleDelete()}
/>`}</code>
                  </div>
                </CardContent>
              </Card>

              {/* Modals */}
              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Basic Modal"
                description="Đây là một modal cơ bản với confirm và cancel buttons."
                confirmLabel="Xác nhận"
                cancelLabel="Hủy"
                onConfirm={async () => {
                  toastSuccess('Confirmed!', 'Bạn đã xác nhận.')
                }}
              />

              <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                title="Xác nhận hành động"
                description="Bạn có chắc chắn muốn thực hiện hành động này không?"
                confirmLabel="Tiếp tục"
                onConfirm={async () => {
                  toastInfo('Action performed', 'Hành động đã được thực hiện.')
                }}
              />

              <DeleteDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                title="Xóa item"
                itemName="Content Idea #123"
                onConfirm={async () => {
                  toastSuccess('Deleted!', 'Item đã được xóa.')
                }}
              />
            </TabsContent>

            {/* EmptyState Tab */}
            <TabsContent value="empty" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>EmptyState Component</CardTitle>
                  <CardDescription>
                    Hiển thị empty state với icon, title, description và action
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <EmptyState
                    icon={Lightbulb}
                    title="No items found"
                    description="Create your first item to get started with the application."
                    actionLabel="Create Item"
                    onAction={() => toastInfo('Action', 'Create button clicked!')}
                  />

                  <EmptyState
                    icon={FileText}
                    title="Minimal Variant"
                    description="Empty state không có border hoặc background."
                    variant="minimal"
                    size="sm"
                  />

                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm font-semibold mb-2">Usage:</p>
                    <code className="text-xs whitespace-pre">{`import { EmptyState } from '@/components/ui'
import { Lightbulb } from 'lucide-react'

<EmptyState
  icon={Lightbulb}
  title="No items"
  description="Description here"
  actionLabel="Create"
  onAction={handleCreate}
  size="md"
  variant="default"
/>`}</code>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skeleton Tab */}
            <TabsContent value="skeleton" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SkeletonList Component</CardTitle>
                  <CardDescription>
                    Loading state với shimmer animation cho Ideas, Briefs, Drafts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-3 mb-4">
                    <Button onClick={() => setLoading(!loading)}>
                      {loading ? 'Hide' : 'Show'} Skeletons
                    </Button>
                  </div>

                  {loading && (
                    <>
                      <div>
                        <h3 className="font-semibold mb-3">Ideas Skeleton</h3>
                        <SkeletonList count={3} type="ideas" />
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Briefs Skeleton</h3>
                        <SkeletonList count={3} type="briefs" />
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Drafts Skeleton</h3>
                        <SkeletonList count={3} type="drafts" />
                      </div>
                    </>
                  )}

                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm font-semibold mb-2">Usage:</p>
                    <code className="text-xs whitespace-pre">{`import { SkeletonList } from '@/components/ui'

{loading ? (
  <SkeletonList count={6} type="ideas" />
) : (
  <ItemsList items={items} />
)}`}</code>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Theme Tab */}
            <TabsContent value="theme" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ThemeToggle Component</CardTitle>
                  <CardDescription>
                    Toggle giữa Light/Dark/System theme. Lưu vào localStorage.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <p className="text-sm">Current theme toggle:</p>
                    <ThemeToggle />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Light Mode Preview</h4>
                      <p className="text-sm text-muted-foreground">Background và text tự động điều chỉnh</p>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Dark Mode Preview</h4>
                      <p className="text-sm text-muted-foreground">Tất cả component hỗ trợ dark mode</p>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm font-semibold mb-2">Usage:</p>
                    <code className="text-xs whitespace-pre">{`import { ThemeToggle } from '@/components/ui'

<ThemeToggle className="ml-auto" />`}</code>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Import Guide */}
          <Card>
            <CardHeader>
              <CardTitle>📦 Import Guide</CardTitle>
              <CardDescription>
                Tất cả components đều có thể import từ '@/components/ui'
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-lg">
                <code className="text-sm whitespace-pre">{`// Single import cho tất cả components
import { 
  Button, 
  Card,
  Badge,
  StatusBadge,
  EmptyState,
  SkeletonList,
  ThemeToggle,
  Modal,
  ConfirmDialog,
  DeleteDialog
} from '@/components/ui'

// Helper functions
import { toast, toastSuccess, toastError, toastInfo } from '@/lib/toast'`}</code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}


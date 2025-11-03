'use client'

import { 
  Lightbulb, 
  FileText, 
  PenTool, 
  Search,
  Inbox,
  Image,
  Users,
  FolderOpen,
  Database,
  AlertCircle
} from 'lucide-react'
import { EmptyState } from './EmptyState'

// Ideas Empty State
export function EmptyIdeas({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Lightbulb}
      title="Chưa có ý tưởng nào"
      description="Hãy tạo ý tưởng đầu tiên của bạn hoặc sử dụng AI để tự động sinh ý tưởng."
      actionLabel="Tạo ý tưởng mới"
      onAction={onAction}
    />
  )
}

// Briefs Empty State
export function EmptyBriefs({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="Chưa có brief nào"
      description="Tạo brief chi tiết để hướng dẫn việc tạo nội dung hiệu quả hơn."
      actionLabel="Tạo brief mới"
      onAction={onAction}
    />
  )
}

// Drafts Empty State
export function EmptyDrafts({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={PenTool}
      title="Chưa có draft nào"
      description="Bắt đầu viết nội dung mới hoặc chuyển ý tưởng thành draft."
      actionLabel="Tạo draft mới"
      onAction={onAction}
    />
  )
}

// Search Results Empty State
export function EmptySearchResults() {
  return (
    <EmptyState
      icon={Search}
      title="Không tìm thấy kết quả"
      description="Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc để tìm thấy nội dung bạn cần."
      variant="minimal"
      size="sm"
    />
  )
}

// Generic Empty State
export function EmptyInbox() {
  return (
    <EmptyState
      icon={Inbox}
      title="Inbox trống"
      description="Bạn đã xử lý hết tất cả công việc. Thật tuyệt vời!"
      variant="minimal"
    />
  )
}

// No Images
export function EmptyImages({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Image}
      title="Chưa có hình ảnh"
      description="Tải lên hình ảnh để bổ sung cho nội dung của bạn."
      actionLabel="Tải lên"
      onAction={onAction}
      size="sm"
    />
  )
}

// No Team Members
export function EmptyTeam({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="Chưa có thành viên"
      description="Mời đồng nghiệp tham gia để cộng tác cùng nhau."
      actionLabel="Mời thành viên"
      onAction={onAction}
    />
  )
}

// No Files
export function EmptyFiles({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={FolderOpen}
      title="Thư mục trống"
      description="Chưa có file nào trong thư mục này."
      actionLabel="Tải file lên"
      onAction={onAction}
      variant="minimal"
      size="sm"
    />
  )
}

// No Data
export function EmptyData() {
  return (
    <EmptyState
      icon={Database}
      title="Chưa có dữ liệu"
      description="Dữ liệu sẽ hiển thị ở đây khi có hoạt động."
      variant="minimal"
    />
  )
}

// Error State
export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Có lỗi xảy ra"
      description="Không thể tải dữ liệu. Vui lòng thử lại."
      actionLabel="Thử lại"
      onAction={onRetry}
      iconClassName="text-destructive"
      size="sm"
    />
  )
}


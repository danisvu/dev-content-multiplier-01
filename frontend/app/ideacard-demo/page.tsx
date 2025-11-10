'use client'

import { useState } from 'react'
import { IdeaCard } from '../components/IdeaCard'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Button,
  StatusBadge
} from '../components/ui'
import { Sparkles, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

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

const sampleIdeas: Idea[] = [
  {
    id: 1,
    title: "AI-Powered Content Generator",
    description: "Tạo nội dung hấp dẫn tự động với AI, tiết kiệm thời gian và tăng chất lượng",
    rationale: "Nhu cầu cao cho việc tự động hóa nội dung, xu hướng AI đang phát triển mạnh",
    persona: "Content Creator",
    industry: "Technology",
    status: "selected",
    created_at: "2025-11-03T10:00:00Z"
  },
  {
    id: 2,
    title: "Social Media Analytics Dashboard",
    description: "Dashboard phân tích toàn diện cho các nền tảng mạng xã hội",
    rationale: "Marketers cần insights real-time để tối ưu campaigns",
    persona: "Digital Marketer",
    industry: "Marketing",
    status: "draft",
    created_at: "2025-11-02T15:30:00Z"
  },
  {
    id: 3,
    title: "Video Editing Automation Tool",
    description: "Công cụ tự động cắt, ghép và tạo hiệu ứng video",
    rationale: "Video editing tốn thời gian, automation sẽ tăng productivity",
    persona: "Video Editor",
    industry: "Media",
    status: "pending",
    created_at: "2025-11-01T09:15:00Z"
  },
  {
    id: 4,
    title: "E-learning Platform for Kids",
    description: "Nền tảng học trực tuyến gamified cho trẻ em 6-12 tuổi",
    rationale: "E-learning đang bùng nổ, phụ huynh quan tâm đến giáo dục online",
    persona: "Parent",
    industry: "Education",
    status: "archived",
    created_at: "2025-10-30T14:20:00Z"
  },
  {
    id: 5,
    title: "Fitness Tracking Mobile App",
    description: "App theo dõi luyện tập, dinh dưỡng và sức khỏe toàn diện",
    rationale: "Xu hướng healthy lifestyle tăng cao, cần app toàn diện",
    persona: "Fitness Enthusiast",
    industry: "Health & Fitness",
    status: "rejected",
    created_at: "2025-10-28T11:00:00Z"
  },
  {
    id: 6,
    title: "Blockchain-based Supply Chain",
    description: "Hệ thống quản lý chuỗi cung ứng minh bạch với blockchain",
    rationale: "Supply chain cần transparency, blockchain là giải pháp tối ưu",
    persona: "Supply Chain Manager",
    industry: "Logistics",
    status: "generated",
    created_at: "2025-10-25T16:45:00Z"
  }
]

export default function IdeaCardDemoPage() {
  const [ideas, setIdeas] = useState<Idea[]>(sampleIdeas)

  const handleEdit = (idea: Idea) => {
    console.log('Edit idea:', idea)
    // Simulate edit action
  }

  const handleDelete = (id: number) => {
    console.log('Delete idea:', id)
    setIdeas(ideas.filter(i => i.id !== id))
  }

  const handleView = (idea: Idea) => {
    console.log('View idea:', idea)
    toast.info('View Detail', {
      description: `Viewing details of: ${idea.title}`
    })
  }

  const handleSelectAndCreateBrief = async (idea: Idea) => {
    console.log('Creating brief for:', idea)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update status to 'generated'
    setIdeas(ideas.map(i => 
      i.id === idea.id 
        ? { ...i, status: 'generated' as const }
        : i
    ))
  }

  const handleResetStatus = () => {
    setIdeas(sampleIdeas)
    toast.success('Reset!', {
      description: 'All idea statuses have been reset.'
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🎴 IdeaCard Component Demo
            </h1>
            <p className="text-lg text-muted-foreground">
              Showcase của IdeaCard với đầy đủ tính năng: Loading, Toasts, Animations, Status badges
            </p>
          </div>
          <Button onClick={handleResetStatus} variant="outline" size="lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Status
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">✨ Animations</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• Fade in + slide up</li>
                <li>• Hover: scale + lift</li>
                <li>• Tap feedback</li>
                <li>• Shadow transition</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">🔄 Loading States</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• Overlay với backdrop</li>
                <li>• Spinning loader</li>
                <li>• Action name display</li>
                <li>• Disabled buttons</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">🔔 Toast Notifications</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• Success toasts</li>
                <li>• Error handling</li>
                <li>• Auto-dismiss</li>
                <li>• Custom descriptions</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Status Legend */}
        <Card>
          <CardHeader>
            <CardTitle>🏷️ Status Legend</CardTitle>
            <CardDescription>
              Các trạng thái có sẵn và ý nghĩa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex flex-col gap-2">
                <StatusBadge status="draft" className="w-fit">
                  📝 Nháp
                </StatusBadge>
                <p className="text-xs text-muted-foreground">
                  Ý tưởng mới, chưa xử lý
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <StatusBadge status="approved" className="w-fit bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  ✅ Đã chọn
                </StatusBadge>
                <p className="text-xs text-muted-foreground">
                  Có thể tạo Brief
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <StatusBadge status="draft" className="w-fit bg-yellow-100 text-yellow-800">
                  ⏳ Chờ xử lý
                </StatusBadge>
                <p className="text-xs text-muted-foreground">
                  Đang review
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <StatusBadge status="review" className="w-fit bg-red-100 text-red-800">
                  ❌ Từ chối
                </StatusBadge>
                <p className="text-xs text-muted-foreground">
                  Không phù hợp
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <StatusBadge status="review" className="w-fit bg-red-100 text-red-800">
                  🗄️ Lưu trữ
                </StatusBadge>
                <p className="text-xs text-muted-foreground">
                  Archived
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <StatusBadge status="published" className="w-fit">
                  📄 Đã tạo Brief
                </StatusBadge>
                <p className="text-xs text-muted-foreground">
                  Brief generated
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Test */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              🧪 How to Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Hover over cards</h3>
              <p className="text-sm text-muted-foreground">
                → Card scales up, lifts, and shadow increases
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Click three-dot menu</h3>
              <p className="text-sm text-muted-foreground">
                → Try Edit, View, Delete actions → Toast notifications appear
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Try "Select & Create Brief"</h3>
              <p className="text-sm text-muted-foreground">
                → Only works on "Đã chọn" (blue) status cards → Shows loading spinner for 2 seconds → Changes status to "Đã tạo Brief"
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Click Reset Status button</h3>
              <p className="text-sm text-muted-foreground">
                → All cards reset to original status
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ideas Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            💡 Sample Ideas ({ideas.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onSelectAndCreateBrief={handleSelectAndCreateBrief}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>💻 Usage Example</CardTitle>
            <CardDescription>
              Cách sử dụng IdeaCard component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`import { IdeaCard } from '@/components/IdeaCard'

const idea = {
  id: 1,
  title: "AI-Powered Content Generator",
  description: "Create engaging content with AI",
  rationale: "High demand for automation",
  persona: "Content Creator",
  industry: "Technology",
  status: "selected",
  created_at: "2025-11-03T10:00:00Z"
}

export default function MyPage() {
  const handleCreateBrief = async (idea) => {
    await api.createBrief(idea.id)
    // IdeaCard handles loading & toast automatically
  }

  return (
    <IdeaCard
      idea={idea}
      onEdit={(idea) => console.log('Edit', idea)}
      onDelete={(id) => console.log('Delete', id)}
      onView={(idea) => console.log('View', idea)}
      onSelectAndCreateBrief={handleCreateBrief}
    />
  )
}`}
            </pre>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <h3 className="text-2xl font-bold mb-2">✅ Production Ready!</h3>
          <p className="text-muted-foreground mb-4">
            IdeaCard component với đầy đủ features: Loading, Toasts, Animations, Status validation
          </p>
          <Button variant="default" size="lg">
            View Documentation
          </Button>
        </div>
      </div>
    </div>
  )
}


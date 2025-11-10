'use client'

import { useState } from 'react'
import { BriefCard } from '../components/BriefCard'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Button,
  Badge
} from '../components/ui'
import { Sparkles, RefreshCw, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface Idea {
  id: number
  title: string
  persona?: string
  industry?: string
}

interface Brief {
  id: number
  idea_id: number
  title?: string
  content_plan: string
  target_audience: string
  key_points?: string[]
  tone?: string
  word_count?: number
  keywords?: string[]
  created_at: string
}

const sampleIdeas: Idea[] = [
  {
    id: 1,
    title: "AI-Powered Content Generator",
    persona: "Content Creator",
    industry: "Technology"
  },
  {
    id: 2,
    title: "Social Media Analytics Dashboard",
    persona: "Digital Marketer",
    industry: "Marketing"
  },
  {
    id: 3,
    title: "E-learning Platform for Kids",
    persona: "Parent",
    industry: "Education"
  }
]

const sampleBriefs: Brief[] = [
  {
    id: 1,
    idea_id: 1,
    title: "Complete Guide to AI Content Generation",
    target_audience: "Content creators, marketers, and business owners looking to scale their content production using AI technology",
    content_plan: "Create a comprehensive guide covering:\n\n1. Introduction to AI content generation and its benefits\n2. How AI models work (GPT, BERT, etc.)\n3. Best practices for prompting AI tools\n4. Real-world use cases and examples\n5. Common pitfalls and how to avoid them\n6. The future of AI in content creation\n\nInclude screenshots, code examples, and actionable tips throughout the guide.",
    key_points: [
      "AI can reduce content creation time by 70%",
      "Proper prompting is crucial for quality output",
      "Human editing still essential for best results",
      "AI excels at research and first drafts",
      "Ethical considerations and disclosure"
    ],
    tone: "Educational, Professional",
    word_count: 2500,
    keywords: ["AI", "content generation", "automation", "GPT", "productivity"],
    created_at: "2025-11-03T10:00:00Z"
  },
  {
    id: 2,
    idea_id: 2,
    title: "Social Media Analytics Masterclass",
    target_audience: "Digital marketers, social media managers, and small business owners who want to understand their social media performance better",
    content_plan: "Develop an in-depth masterclass covering all aspects of social media analytics:\n\nModule 1: Understanding Key Metrics (Reach, Engagement, CTR, Conversion)\nModule 2: Platform-Specific Analytics (Facebook, Instagram, Twitter, LinkedIn)\nModule 3: Tools and Software Overview (Google Analytics, Buffer, Hootsuite)\nModule 4: Creating Reports and Dashboards\nModule 5: Data-Driven Decision Making\n\nEach module includes video tutorials, quizzes, and hands-on exercises.",
    key_points: [
      "Focus on metrics that matter for business goals",
      "Cross-platform comparison strategies",
      "ROI calculation methods",
      "A/B testing best practices",
      "Predictive analytics for future campaigns"
    ],
    tone: "Instructive, Engaging",
    word_count: 3000,
    keywords: ["social media", "analytics", "metrics", "ROI", "engagement"],
    created_at: "2025-11-02T15:30:00Z"
  },
  {
    id: 3,
    idea_id: 3,
    title: "E-learning Platform Features Guide",
    target_audience: "Parents with children aged 6-12 who are interested in supplementing traditional education with interactive online learning",
    content_plan: "Short overview of platform features and benefits. Highlight gamification elements and progress tracking. Keep it simple and visual.",
    key_points: [],
    tone: "Friendly, Simple",
    word_count: 800,
    keywords: ["e-learning", "kids education", "gamification"],
    created_at: "2025-11-01T09:15:00Z"
  }
]

export default function BriefCardDemoPage() {
  const [briefs] = useState(sampleBriefs)
  const [ideas] = useState(sampleIdeas)

  const handleViewBrief = (brief: Brief) => {
    toast.info('View Brief', {
      description: `Viewing details of: ${brief.title}`
    })
  }

  const getIdeaForBrief = (brief: Brief): Idea | undefined => {
    return ideas.find(i => i.id === brief.idea_id)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📋 BriefCard Component Demo
            </h1>
            <p className="text-lg text-muted-foreground">
              Showcase của BriefCard với features: Copy to clipboard, Tooltips, Expand/Collapse, Animations
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">🎨 Rich Display</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Linked idea info</li>
                <li>• Target audience</li>
                <li>• Key points badges</li>
                <li>• Content preview</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">📋 Copy Feature</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• One-click copy</li>
                <li>• Formatted text</li>
                <li>• Toast notification</li>
                <li>• Check icon feedback</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">💡 Tooltips</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Hover key points</li>
                <li>• Full text display</li>
                <li>• Instant show</li>
                <li>• Smooth fade</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">✨ Animations</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Fade in on load</li>
                <li>• Hover lift effect</li>
                <li>• Expand/collapse</li>
                <li>• Shadow transition</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How to Test */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              🧪 How to Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Copy to Clipboard</h3>
              <p className="text-sm text-muted-foreground">
                → Click Copy icon (top-right) → Brief content copied → Toast notification appears → Icon changes to checkmark
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Hover Key Points</h3>
              <p className="text-sm text-muted-foreground">
                → Hover over key point badges → Tooltip shows full text → Instant display with no delay
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Expand Content</h3>
              <p className="text-sm text-muted-foreground">
                → Long content shows "View More" button → Click to expand → Click "View Less" to collapse
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Empty State</h3>
              <p className="text-sm text-muted-foreground">
                → Card #3 has no key points → Shows "No key points provided" message
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5. Animations</h3>
              <p className="text-sm text-muted-foreground">
                → Cards fade in on page load → Hover to see lift effect → Smooth transitions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Briefs Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Sample Briefs ({briefs.length})
            </h2>
            <div className="flex gap-2">
              <Badge variant="secondary">With Key Points</Badge>
              <Badge variant="outline">Without Key Points</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {briefs.map((brief) => (
              <BriefCard
                key={brief.id}
                brief={brief}
                idea={getIdeaForBrief(brief)}
                onView={handleViewBrief}
              />
            ))}
          </div>
        </div>

        {/* Feature Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📋 Copy Feature</CardTitle>
              <CardDescription>
                Formatted brief text được copy vào clipboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Nội dung được copy bao gồm:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Brief title</li>
                  <li>Target audience</li>
                  <li>Full content plan</li>
                  <li>All key points</li>
                  <li>Metadata (tone, word count, keywords)</li>
                  <li>Original idea information</li>
                  <li>Created date</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💡 Key Points Display</CardTitle>
              <CardDescription>
                Badges với tooltips và truncation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Features:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Truncate sau 30 ký tự</li>
                  <li>Hover → full text in tooltip</li>
                  <li>No delay tooltip display</li>
                  <li>Empty state nếu không có</li>
                  <li>Count display</li>
                  <li>Hover effect on badges</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>💻 Usage Example</CardTitle>
            <CardDescription>
              Cách sử dụng BriefCard component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`import { BriefCard } from '@/components/BriefCard'

const brief = {
  id: 1,
  idea_id: 1,
  title: "Complete Guide to AI Content",
  target_audience: "Content creators and marketers",
  content_plan: "Create comprehensive guide...",
  key_points: [
    "AI reduces creation time by 70%",
    "Proper prompting is crucial",
    "Human editing still essential"
  ],
  tone: "Educational",
  word_count: 2500,
  keywords: ["AI", "content", "automation"],
  created_at: "2025-11-03T10:00:00Z"
}

const idea = {
  id: 1,
  title: "AI-Powered Content Generator",
  persona: "Content Creator",
  industry: "Technology"
}

export default function BriefsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BriefCard
        brief={brief}
        idea={idea}
        onView={(brief) => console.log('View', brief)}
      />
    </div>
  )
}`}
            </pre>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <h3 className="text-2xl font-bold mb-2">✅ Production Ready!</h3>
          <p className="text-muted-foreground mb-4">
            BriefCard component với đầy đủ features: Copy, Tooltips, Expand/Collapse, Animations
          </p>
          <Button variant="default" size="lg">
            View Documentation
          </Button>
        </div>
      </div>
    </div>
  )
}


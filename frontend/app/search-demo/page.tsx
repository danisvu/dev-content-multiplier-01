'use client'

import { useState } from 'react'
import { DocumentSearch, Document, SearchResult } from '../components/DocumentSearch'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Badge
} from '../components/ui'
import { Search, BookOpen, Lightbulb, TrendingUp, Filter } from 'lucide-react'
import { toast } from 'sonner'

const sampleDocuments: Document[] = [
  {
    id: 1,
    title: "The Impact of AI on Modern Marketing",
    content: `Artificial Intelligence has revolutionized content creation and marketing automation. AI-powered tools now enable marketers to generate personalized content at scale, analyze customer behavior patterns, and optimize campaigns in real-time. Machine learning algorithms can predict customer preferences and automate repetitive tasks, allowing teams to focus on strategy and creativity. The integration of AI in marketing has led to significant improvements in ROI, with companies reporting up to 70% reduction in content production time while maintaining quality standards.`,
    url: "https://example.com/ai-marketing-impact",
    keywords: ["AI", "marketing", "automation", "content", "ROI"],
    uploadDate: "2025-11-01T10:00:00Z",
    author: "John Doe",
    category: "Marketing"
  },
  {
    id: 2,
    title: "SEO Best Practices and Optimization Strategies 2025",
    content: `Search engine optimization continues to evolve with algorithm updates and changing user behaviors. Modern SEO requires a holistic approach combining technical optimization, quality content creation, and user experience improvements. Key factors include mobile-first indexing, page speed optimization, semantic search understanding, and building authoritative backlinks. Content should be created with user intent in mind, focusing on providing value rather than just keyword stuffing. Local SEO has become increasingly important for businesses targeting specific geographic areas.`,
    url: "https://example.com/seo-best-practices-2025",
    keywords: ["SEO", "optimization", "search engine", "content", "ranking"],
    uploadDate: "2025-11-02T14:30:00Z",
    author: "Jane Smith",
    category: "SEO"
  },
  {
    id: 3,
    title: "Content Marketing Strategy and ROI Measurement",
    content: `Effective content marketing requires strategic planning and consistent execution. A well-defined content strategy should align with business goals, target audience needs, and available resources. Measuring ROI involves tracking multiple metrics including engagement rates, lead generation, conversion rates, and customer lifetime value. Quality content builds brand authority and drives organic traffic over time. The key to success lies in understanding your audience, creating valuable content, and distributing it through the right channels. Analytics and data-driven insights help optimize content performance and improve ROI.`,
    url: "https://example.com/content-marketing-strategy",
    keywords: ["content marketing", "strategy", "ROI", "analytics", "engagement"],
    uploadDate: "2025-11-03T09:15:00Z",
    author: "John Doe",
    category: "Marketing"
  },
  {
    id: 4,
    title: "Social Media Analytics and Engagement Metrics",
    content: `Social media platforms provide rich data for understanding audience behavior and measuring campaign effectiveness. Key metrics include reach, impressions, engagement rate, click-through rate, and conversion metrics. Advanced analytics tools use AI to predict trends and suggest optimal posting times. Understanding audience demographics and preferences helps create targeted content that resonates. Social listening tools monitor brand mentions and sentiment across platforms. Effective social media strategy combines organic content with paid advertising to maximize reach and engagement.`,
    url: "https://example.com/social-media-analytics",
    keywords: ["social media", "analytics", "engagement", "metrics", "audience"],
    uploadDate: "2025-10-30T16:45:00Z",
    author: "Mike Johnson",
    category: "Social Media"
  },
  {
    id: 5,
    title: "Email Marketing Automation and Personalization",
    content: `Email marketing remains one of the highest ROI digital marketing channels when done correctly. Automation enables sending personalized messages at scale based on user behavior, preferences, and lifecycle stage. Segmentation and targeting improve open rates and conversion rates significantly. A/B testing helps optimize subject lines, content, and call-to-actions. Modern email marketing platforms integrate with CRM systems to provide comprehensive customer insights. Personalization goes beyond using recipient names - it involves delivering relevant content based on past interactions and predicted interests.`,
    url: "https://example.com/email-marketing-automation",
    keywords: ["email marketing", "automation", "personalization", "ROI", "conversion"],
    uploadDate: "2025-10-28T11:20:00Z",
    author: "Jane Smith",
    category: "Marketing"
  }
]

export default function SearchDemoPage() {
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result)
    toast.info('Document selected', {
      description: result.title
    })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔍 Semantic Document Search + Filters
          </h1>
          <p className="text-lg text-muted-foreground">
            Tìm kiếm tài liệu theo nghĩa + Lọc theo tác giả và chủ đề
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="w-4 h-4" />
                Semantic Search
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Tìm theo nghĩa</li>
                <li>• Synonym mapping</li>
                <li>• Partial matching</li>
                <li>• Score ranking</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Relevance Score
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• 0-100 scoring</li>
                <li>• Color coding</li>
                <li>• Progress bar</li>
                <li>• Sorted results</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Snippets
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Extract matches</li>
                <li>• Context preview</li>
                <li>• Highlighted text</li>
                <li>• Max 2 snippets</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Smart Reasons
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Why matched</li>
                <li>• Synonym links</li>
                <li>• Keyword tags</li>
                <li>• Explanation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Author filter</li>
                <li>• Category filter</li>
                <li>• Active badges</li>
                <li>• Clear all</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Example Queries */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              💡 Ví dụ Query Semantic
            </CardTitle>
            <CardDescription>
              Thử các query này để test semantic search
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border">
                <p className="font-semibold mb-2 text-sm">🤖 AI & Marketing</p>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Try: <code className="bg-muted px-2 py-0.5 rounded">"trí tuệ nhân tạo giúp quảng cáo"</code></p>
                  <p className="text-xs">→ Matches "AI", "marketing", "automation"</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border">
                <p className="font-semibold mb-2 text-sm">📈 SEO & Optimization</p>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Try: <code className="bg-muted px-2 py-0.5 rounded">"tối ưu hóa công cụ tìm kiếm"</code></p>
                  <p className="text-xs">→ Matches "SEO", "search engine", "optimization"</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border">
                <p className="font-semibold mb-2 text-sm">📊 Analytics & Data</p>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Try: <code className="bg-muted px-2 py-0.5 rounded">"phân tích dữ liệu mạng xã hội"</code></p>
                  <p className="text-xs">→ Matches "analytics", "social", "metrics"</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border">
                <p className="font-semibold mb-2 text-sm">💰 ROI & Strategy</p>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Try: <code className="bg-muted px-2 py-0.5 rounded">"chiến lược nội dung lợi nhuận"</code></p>
                  <p className="text-xs">→ Matches "content", "strategy", "ROI"</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm font-semibold mb-2">✨ How It Works:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <strong>Synonym Mapping:</strong> "AI" ↔ "trí tuệ nhân tạo", "marketing" ↔ "quảng cáo"</li>
                <li>• <strong>Keyword Matching:</strong> Check document keywords</li>
                <li>• <strong>Content Scanning:</strong> Find matching sentences</li>
                <li>• <strong>Score Calculation:</strong> Weight by relevance (title {'>'}  keywords {'>'}  content)</li>
                <li>• <strong>Sort & Display:</strong> Highest score first</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="text-sm font-semibold mb-2">🔍 Filter Examples:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <strong>Tác giả "John Doe":</strong> Chỉ lấy tài liệu của John Doe (2 docs)</li>
                <li>• <strong>Chủ đề "Marketing":</strong> Chỉ lấy tài liệu về Marketing (3 docs)</li>
                <li>• <strong>John Doe + Marketing:</strong> Giao của cả 2 bộ lọc (2 docs)</li>
                <li>• <strong>Active Badges:</strong> Click badge để xóa filter riêng lẻ</li>
                <li>• <strong>Clear All:</strong> Nút "Xóa bộ lọc" để reset tất cả</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Search Component */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Document Search
            </CardTitle>
            <CardDescription>
              Tìm kiếm trong {sampleDocuments.length} tài liệu mẫu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentSearch
              documents={sampleDocuments}
              onResultClick={handleResultClick}
            />
          </CardContent>
        </Card>

        {/* Selected Result Detail */}
        {selectedResult && (
          <Card className="border-2 border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Selected Document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{selectedResult.title}</h3>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="font-semibold">
                    Score: {selectedResult.score}%
                  </Badge>
                  {selectedResult.keywords?.map((kw, i) => (
                    <Badge key={i} variant="secondary">{kw}</Badge>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-sm leading-relaxed">{selectedResult.content}</p>
              </div>
              <a
                href={selectedResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {selectedResult.url}
              </a>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <h3 className="text-2xl font-bold mb-2">✅ Semantic Search Ready!</h3>
          <p className="text-muted-foreground">
            Tìm kiếm thông minh theo nghĩa, không chỉ keyword matching
          </p>
        </div>
      </div>
    </div>
  )
}


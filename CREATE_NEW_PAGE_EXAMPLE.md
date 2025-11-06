# 📄 Ví Dụ Thực Tế: Tạo Trang "Analytics"

## Mục Tiêu

Tạo trang **Analytics** hiển thị thống kê về:
- Số lượng ideas theo status
- Số lượng briefs theo status  
- Biểu đồ theo thời gian
- Top keywords

---

## Step 1: Tạo File Structure

```bash
# Tạo thư mục
mkdir -p app/analytics

# Tạo page file
touch app/analytics/page.tsx
```

---

## Step 2: Implement Page Component

```tsx
// app/analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart3, TrendingUp, Lightbulb, FileText } from 'lucide-react'
import { PageTransition } from '../components/PageTransition'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge
} from '../components/ui'

const API_BASE_URL = 'http://localhost:3911/api'

interface Analytics {
  ideas: {
    total: number
    pending: number
    selected: number
    generated: number
  }
  briefs: {
    total: number
    draft: number
    review: number
    published: number
  }
  topKeywords: Array<{ keyword: string; count: number }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Fetch ideas
      const ideasResponse = await axios.get(`${API_BASE_URL}/ideas`)
      const ideas = ideasResponse.data

      // Fetch briefs
      const briefsResponse = await axios.get(`${API_BASE_URL}/briefs`)
      const briefs = briefsResponse.data

      // Process data
      const analyticsData: Analytics = {
        ideas: {
          total: ideas.length,
          pending: ideas.filter((i: any) => i.status === 'pending').length,
          selected: ideas.filter((i: any) => i.status === 'selected').length,
          generated: ideas.filter((i: any) => i.status === 'generated').length,
        },
        briefs: {
          total: briefs.length,
          draft: briefs.filter((b: any) => b.status === 'draft').length,
          review: briefs.filter((b: any) => b.status === 'review').length,
          published: briefs.filter((b: any) => b.status === 'published').length,
        },
        topKeywords: extractTopKeywords(briefs),
      }

      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const extractTopKeywords = (briefs: any[]) => {
    const keywordCounts: Record<string, number> = {}
    
    briefs.forEach(brief => {
      brief.keywords?.forEach((keyword: string) => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1
      })
    })

    return Object.entries(keywordCounts)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-64 bg-muted animate-pulse rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return <div className="p-8">Failed to load analytics</div>
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-purple-500" />
            <div>
              <h1 className="text-4xl font-bold">Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Thống kê và phân tích dữ liệu
              </p>
            </div>
          </div>

          {/* Ideas Stats */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              Ideas Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Total Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{analytics.ideas.total}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-gray-600">
                    {analytics.ideas.pending}
                  </p>
                  <Badge variant="default" className="mt-2">
                    {((analytics.ideas.pending / analytics.ideas.total) * 100).toFixed(0)}%
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Selected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">
                    {analytics.ideas.selected}
                  </p>
                  <Badge variant="success" className="mt-2">
                    {((analytics.ideas.selected / analytics.ideas.total) * 100).toFixed(0)}%
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Generated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-blue-600">
                    {analytics.ideas.generated}
                  </p>
                  <Badge variant="info" className="mt-2">
                    {((analytics.ideas.generated / analytics.ideas.total) * 100).toFixed(0)}%
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Briefs Stats */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-500" />
              Briefs Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Total Briefs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{analytics.briefs.total}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Draft
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-gray-600">
                    {analytics.briefs.draft}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-orange-600">
                    {analytics.briefs.review}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Published
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">
                    {analytics.briefs.published}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Top Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Top Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topKeywords.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topKeywords.map((item, idx) => (
                    <div key={item.keyword} className="flex items-center gap-4">
                      <span className="text-lg font-bold text-muted-foreground w-8">
                        #{idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.keyword}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.count} briefs
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{ 
                              width: `${(item.count / analytics.topKeywords[0].count) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Chưa có dữ liệu keywords
                </p>
              )}
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Ideas Created</span>
                    <span className="font-bold">{analytics.ideas.total}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Ideas Selected</span>
                    <span className="font-bold">{analytics.ideas.selected + analytics.ideas.generated}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full" 
                      style={{ 
                        width: `${((analytics.ideas.selected + analytics.ideas.generated) / analytics.ideas.total) * 100}%` 
                      }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Briefs Generated</span>
                    <span className="font-bold">{analytics.briefs.total}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full" 
                      style={{ 
                        width: `${(analytics.briefs.total / analytics.ideas.total) * 100}%` 
                      }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Briefs Published</span>
                    <span className="font-bold">{analytics.briefs.published}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full" 
                      style={{ 
                        width: `${(analytics.briefs.published / analytics.ideas.total) * 100}%` 
                      }} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
```

---

## Step 3: Add to Navigation

```tsx
// app/components/AppLayout.tsx
import { BarChart3 } from 'lucide-react' // Add import

const navItems: NavItem[] = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 }, // ADD THIS
  { href: '/ideas', label: 'Ý tưởng', icon: Lightbulb },
  { href: '/briefs', label: 'Briefs', icon: FileText },
  { href: '/packs', label: 'Packs', icon: Package },
  { href: '/settings', label: 'Cài đặt', icon: Settings },
]
```

---

## Step 4: Test

```bash
# Open browser
open http://localhost:3910/analytics
```

---

## Kết Quả

**URL**: `/analytics`

**Features**:
- ✅ Ideas statistics với 4 cards
- ✅ Briefs statistics với 4 cards  
- ✅ Top 10 keywords với progress bars
- ✅ Conversion funnel visualization
- ✅ Responsive design
- ✅ Loading states
- ✅ Dark mode compatible

---

## Mở Rộng

### Thêm Date Range Filter

```tsx
const [dateRange, setDateRange] = useState({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  end: new Date()
})

// Filter data by date range
const filteredIdeas = ideas.filter(idea => {
  const createdDate = new Date(idea.created_at)
  return createdDate >= dateRange.start && createdDate <= dateRange.end
})
```

### Thêm Charts

```bash
npm install recharts
```

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

<LineChart width={600} height={300} data={chartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="ideas" stroke="#8884d8" />
  <Line type="monotone" dataKey="briefs" stroke="#82ca9d" />
</LineChart>
```

---

**Trang Analytics hoàn thành!** 🎉


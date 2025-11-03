'use client'

import { PageTransition } from '../components/PageTransition'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import {
  EmptyIdeas,
  EmptyBriefs,
  EmptyDrafts,
  EmptySearchResults,
  EmptyInbox,
  EmptyImages,
  EmptyTeam,
  EmptyFiles,
  EmptyData,
  ErrorState,
} from '../components/EmptyStateVariants'
import { EmptyState } from '../components/EmptyState'
import { 
  Sparkles, 
  Lightbulb, 
  FileText, 
  PenTool,
  Settings
} from 'lucide-react'

export default function EmptyStatesDemo() {
  const handleAction = () => {
    alert('Action triggered!')
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">EmptyState Components</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive empty state variants cho mọi use case
            </p>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="prebuilt" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="prebuilt">Pre-built Variants</TabsTrigger>
              <TabsTrigger value="custom">Custom Props</TabsTrigger>
              <TabsTrigger value="sizes">Sizes & Variants</TabsTrigger>
            </TabsList>

            {/* Pre-built Variants */}
            <TabsContent value="prebuilt" className="space-y-6">
              {/* Ideas */}
              <Card>
                <CardHeader>
                  <CardTitle>EmptyIdeas</CardTitle>
                  <CardDescription>
                    Empty state cho danh sách ý tưởng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyIdeas onAction={handleAction} />
                </CardContent>
              </Card>

              {/* Briefs */}
              <Card>
                <CardHeader>
                  <CardTitle>EmptyBriefs</CardTitle>
                  <CardDescription>
                    Empty state cho danh sách briefs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyBriefs onAction={handleAction} />
                </CardContent>
              </Card>

              {/* Drafts */}
              <Card>
                <CardHeader>
                  <CardTitle>EmptyDrafts</CardTitle>
                  <CardDescription>
                    Empty state cho danh sách drafts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyDrafts onAction={handleAction} />
                </CardContent>
              </Card>

              {/* Grid of smaller variants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>EmptySearchResults</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptySearchResults />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>EmptyInbox</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyInbox />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>EmptyImages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyImages onAction={handleAction} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>EmptyTeam</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyTeam onAction={handleAction} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>EmptyFiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyFiles onAction={handleAction} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>EmptyData</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyData />
                  </CardContent>
                </Card>
              </div>

              {/* Error State */}
              <Card>
                <CardHeader>
                  <CardTitle>ErrorState</CardTitle>
                  <CardDescription>
                    Special state cho error cases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ErrorState onRetry={handleAction} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custom Props */}
            <TabsContent value="custom" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Icon</CardTitle>
                  <CardDescription>
                    Sử dụng custom icon từ lucide-react
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={Sparkles}
                    title="Custom Empty State"
                    description="Bạn có thể customize icon, title, description và action button."
                    actionLabel="Custom Action"
                    onAction={handleAction}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>No Action Button</CardTitle>
                  <CardDescription>
                    Empty state không có action
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={FileText}
                    title="Không có action"
                    description="Empty state này không có button action. Chỉ hiển thị thông tin."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Icon Color</CardTitle>
                  <CardDescription>
                    Customize icon color với iconClassName
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={Settings}
                    title="Custom Colors"
                    description="Icon có thể được customize màu sắc với iconClassName prop."
                    iconClassName="text-amber-500"
                    actionLabel="Configure"
                    onAction={handleAction}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sizes & Variants */}
            <TabsContent value="sizes" className="space-y-6">
              {/* Sizes */}
              <Card>
                <CardHeader>
                  <CardTitle>Small Size</CardTitle>
                  <CardDescription>
                    size="sm" - Compact empty state
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={Lightbulb}
                    title="Small Empty State"
                    description="Kích thước nhỏ gọn cho các container nhỏ."
                    actionLabel="Action"
                    onAction={handleAction}
                    size="sm"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medium Size (Default)</CardTitle>
                  <CardDescription>
                    size="md" - Standard empty state
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={PenTool}
                    title="Medium Empty State"
                    description="Kích thước mặc định, phù hợp cho hầu hết các trường hợp."
                    actionLabel="Action"
                    onAction={handleAction}
                    size="md"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Large Size</CardTitle>
                  <CardDescription>
                    size="lg" - Prominent empty state
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={Sparkles}
                    title="Large Empty State"
                    description="Kích thước lớn cho các trang chính hoặc khi cần nhấn mạnh empty state."
                    actionLabel="Action"
                    onAction={handleAction}
                    size="lg"
                  />
                </CardContent>
              </Card>

              {/* Variants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Default Variant</CardTitle>
                    <CardDescription>
                      variant="default" - Với border và background
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmptyState
                      icon={FileText}
                      title="Default Variant"
                      description="Có border dashed và background card."
                      variant="default"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Minimal Variant</CardTitle>
                    <CardDescription>
                      variant="minimal" - Không border
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmptyState
                      icon={FileText}
                      title="Minimal Variant"
                      description="Không có border và background, phù hợp cho inline display."
                      variant="minimal"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Props Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Props Reference</CardTitle>
              <CardDescription>
                Tất cả props có sẵn cho EmptyState component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Prop</th>
                      <th className="text-left py-2 px-4">Type</th>
                      <th className="text-left py-2 px-4">Default</th>
                      <th className="text-left py-2 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">icon</td>
                      <td className="py-2 px-4">LucideIcon</td>
                      <td className="py-2 px-4">-</td>
                      <td className="py-2 px-4">Icon component từ lucide-react</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">title</td>
                      <td className="py-2 px-4">string</td>
                      <td className="py-2 px-4">required</td>
                      <td className="py-2 px-4">Tiêu đề empty state</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">description</td>
                      <td className="py-2 px-4">string</td>
                      <td className="py-2 px-4">required</td>
                      <td className="py-2 px-4">Mô tả chi tiết (text-muted-foreground)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">actionLabel</td>
                      <td className="py-2 px-4">string</td>
                      <td className="py-2 px-4">-</td>
                      <td className="py-2 px-4">Label cho action button</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">onAction</td>
                      <td className="py-2 px-4">function</td>
                      <td className="py-2 px-4">-</td>
                      <td className="py-2 px-4">Callback khi click button</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">variant</td>
                      <td className="py-2 px-4">'default' | 'minimal'</td>
                      <td className="py-2 px-4">'default'</td>
                      <td className="py-2 px-4">Style variant</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">size</td>
                      <td className="py-2 px-4">'sm' | 'md' | 'lg'</td>
                      <td className="py-2 px-4">'md'</td>
                      <td className="py-2 px-4">Kích thước component</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-mono">className</td>
                      <td className="py-2 px-4">string</td>
                      <td className="py-2 px-4">-</td>
                      <td className="py-2 px-4">Custom className cho container</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-mono">iconClassName</td>
                      <td className="py-2 px-4">string</td>
                      <td className="py-2 px-4">-</td>
                      <td className="py-2 px-4">Custom className cho icon</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Usage Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
              <CardDescription>
                Code examples để sử dụng EmptyState
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Import:</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">{`// Base component
import { EmptyState } from '@/components/EmptyState'

// Pre-built variants
import { EmptyIdeas, EmptyBriefs, EmptyDrafts } from '@/components/EmptyStateVariants'

// Icons
import { Lightbulb } from 'lucide-react'`}</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Basic Usage:</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm whitespace-pre">{`<EmptyState
  icon={Lightbulb}
  title="No items found"
  description="Create your first item to get started."
  actionLabel="Create Item"
  onAction={() => handleCreate()}
/>`}</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Using Pre-built Variant:</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">{`<EmptyIdeas onAction={() => openCreateDialog()} />`}</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Custom Styling:</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm whitespace-pre">{`<EmptyState
  icon={Settings}
  title="Configure Settings"
  description="Customize your preferences."
  iconClassName="text-amber-500"
  className="my-8"
  size="lg"
  variant="minimal"
/>`}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}


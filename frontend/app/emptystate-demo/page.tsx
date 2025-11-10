'use client'

import { EmptyState } from '../components/ui/empty-state'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Button,
  Badge
} from '../components/ui'
import { 
  Lightbulb, 
  FileText, 
  Package, 
  Users, 
  Inbox,
  Search,
  ShoppingBag,
  MessageSquare,
  Heart,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'

export default function EmptyStateDemoPage() {
  const handleAction = (action: string) => {
    toast.success('Action triggered!', {
      description: `You clicked: ${action}`
    })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            📭 EmptyState Component Demo
          </h1>
          <p className="text-lg text-muted-foreground">
            Showcase của EmptyState với animations, dark mode, và hover effects
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">✨ Animations</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Fade-in on load</li>
                <li>• Icon bounce effect</li>
                <li>• Staggered reveals</li>
                <li>• Button hover scale</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">🎨 Variants</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Default (with border)</li>
                <li>• Minimal (no border)</li>
                <li>• 3 sizes: sm, md, lg</li>
                <li>• Custom styling</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">🌓 Dark Mode</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Auto color adapt</li>
                <li>• Icon gradient</li>
                <li>• Border colors</li>
                <li>• Text contrast</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">🎯 Flexible</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Custom icons</li>
                <li>• Optional CTA</li>
                <li>• Responsive</li>
                <li>• Reusable</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How to Test */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              🧪 How to Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold mb-1">1. Hover over CTA buttons</h3>
              <p className="text-sm text-muted-foreground">
                → Button scales up + shadow increases
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">2. Watch animations on load</h3>
              <p className="text-sm text-muted-foreground">
                → Icons bounce, content fades in with stagger
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">3. Try different sizes</h3>
              <p className="text-sm text-muted-foreground">
                → Compare sm, md, lg variants below
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">4. Toggle dark mode</h3>
              <p className="text-sm text-muted-foreground">
                → All colors and gradients adapt seamlessly
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Size Variants */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">📏 Size Variants</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <Badge className="mb-2">Small</Badge>
              <EmptyState
                icon={Inbox}
                title="No messages"
                description="Your inbox is empty"
                ctaLabel="Compose"
                onClick={() => handleAction('Compose message')}
                size="sm"
              />
            </div>
            <div>
              <Badge className="mb-2">Medium (Default)</Badge>
              <EmptyState
                icon={Lightbulb}
                title="No ideas yet"
                description="Start by creating your first idea"
                ctaLabel="Add Idea"
                onClick={() => handleAction('Add idea')}
                size="md"
              />
            </div>
            <div>
              <Badge className="mb-2">Large</Badge>
              <EmptyState
                icon={FileText}
                title="No briefs available"
                description="Generate briefs from your ideas"
                ctaLabel="Generate Brief"
                onClick={() => handleAction('Generate brief')}
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Variant Types */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">🎨 Variant Types</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Badge className="mb-2">Default (with border)</Badge>
              <EmptyState
                icon={Package}
                title="No packages"
                description="You haven't created any content packs yet"
                ctaLabel="Create Pack"
                onClick={() => handleAction('Create pack')}
                variant="default"
              />
            </div>
            <div>
              <Badge className="mb-2" variant="outline">Minimal (no border)</Badge>
              <EmptyState
                icon={Users}
                title="No team members"
                description="Invite your team to collaborate"
                ctaLabel="Invite Team"
                onClick={() => handleAction('Invite team')}
                variant="minimal"
              />
            </div>
          </div>
        </div>

        {/* Different Icons */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">🎭 Different Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EmptyState
              icon={Search}
              title="No results found"
              description="Try adjusting your search criteria"
              ctaLabel="Clear Filters"
              onClick={() => handleAction('Clear filters')}
            />
            <EmptyState
              icon={ShoppingBag}
              title="Cart is empty"
              description="Add some items to get started"
              ctaLabel="Browse Products"
              onClick={() => handleAction('Browse products')}
            />
            <EmptyState
              icon={MessageSquare}
              title="No comments yet"
              description="Be the first to comment"
              ctaLabel="Add Comment"
              onClick={() => handleAction('Add comment')}
            />
            <EmptyState
              icon={Heart}
              title="No favorites"
              description="Save your favorite items here"
              ctaLabel="Explore"
              onClick={() => handleAction('Explore')}
            />
            <EmptyState
              icon={FileText}
              title="No documents"
              description="Upload your first document"
              ctaLabel="Upload"
              onClick={() => handleAction('Upload document')}
            />
            <EmptyState
              icon={Sparkles}
              title="Getting started"
              description="Follow the tutorial to begin"
              ctaLabel="Start Tutorial"
              onClick={() => handleAction('Start tutorial')}
            />
          </div>
        </div>

        {/* Without CTA */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">📭 Without CTA Button</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmptyState
              icon={Inbox}
              title="All caught up!"
              description="You've completed all your tasks"
            />
            <EmptyState
              icon={Heart}
              title="Coming Soon"
              description="This feature will be available in the next update"
              variant="minimal"
            />
          </div>
        </div>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle>💻 Usage Examples</CardTitle>
            <CardDescription>
              Cách sử dụng EmptyState component
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Basic Usage:</p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`import { EmptyState } from '@/components/ui/empty-state'
import { Lightbulb } from 'lucide-react'

<EmptyState
  icon={Lightbulb}
  title="No ideas yet"
  description="Start by creating your first idea"
  ctaLabel="Add Idea"
  onClick={() => handleAddIdea()}
/>`}
              </pre>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">With Size and Variant:</p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`<EmptyState
  icon={Package}
  title="No packages"
  description="Create your first content pack"
  ctaLabel="Create Pack"
  onClick={handleCreate}
  size="lg"
  variant="minimal"
/>`}
              </pre>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Without CTA:</p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`<EmptyState
  icon={Heart}
  title="Coming Soon"
  description="This feature is under development"
/>`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Props Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Props</CardTitle>
            <CardDescription>
              Available props cho EmptyState component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-4 font-medium border-b pb-2">
                <div>Prop</div>
                <div>Type</div>
                <div>Description</div>
              </div>
              <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-mono text-xs">icon</div>
                <div className="text-xs text-muted-foreground">LucideIcon?</div>
                <div className="text-xs">Lucide icon component</div>
              </div>
              <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-mono text-xs">title</div>
                <div className="text-xs text-muted-foreground">string</div>
                <div className="text-xs">Heading text</div>
              </div>
              <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-mono text-xs">description</div>
                <div className="text-xs text-muted-foreground">string</div>
                <div className="text-xs">Description text</div>
              </div>
              <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-mono text-xs">ctaLabel</div>
                <div className="text-xs text-muted-foreground">string?</div>
                <div className="text-xs">CTA button text</div>
              </div>
              <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-mono text-xs">onClick</div>
                <div className="text-xs text-muted-foreground">function?</div>
                <div className="text-xs">CTA callback</div>
              </div>
              <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-mono text-xs">size</div>
                <div className="text-xs text-muted-foreground">'sm'|'md'|'lg'</div>
                <div className="text-xs">Component size</div>
              </div>
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="font-mono text-xs">variant</div>
                <div className="text-xs text-muted-foreground">'default'|'minimal'</div>
                <div className="text-xs">Border style</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <h3 className="text-2xl font-bold mb-2">✅ Production Ready!</h3>
          <p className="text-muted-foreground mb-4">
            EmptyState component với animations, dark mode, và hover effects
          </p>
          <Button variant="default" size="lg">
            View Documentation
          </Button>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { DerivativeVersionHistory, type DerivativeVersion } from '../components/DerivativeVersionHistory'

declare global {
  interface Window {
    __versionControlMockSetup?: boolean
  }
}
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui'
import { toast } from 'sonner'
import { Plus, History, RefreshCw } from 'lucide-react'

const SAMPLE_VERSIONS: DerivativeVersion[] = [
  {
    id: 1,
    derivative_id: 1,
    version_number: 1,
    content: 'Discover the power of AI-driven content creation! 🚀 Transform your social media strategy with intelligent automation. Our platform helps you create compelling content faster than ever before. #AI #Marketing',
    character_count: 187,
    change_type: 'created',
    change_summary: 'Initial version',
    changed_by: 'john_doe',
    created_at: '2024-11-08T10:00:00Z',
    is_current: false
  },
  {
    id: 2,
    derivative_id: 1,
    version_number: 2,
    content: 'Unlock AI-powered content creation! 🚀 Streamline your social media with intelligent automation. Create engaging content 3x faster. Try it free! #AI #ContentMarketing #SmallBusiness',
    character_count: 168,
    change_type: 'edited',
    change_summary: 'Shortened and improved CTA',
    change_reason: 'Better engagement metrics on shorter content',
    changed_by: 'jane_smith',
    created_at: '2024-11-08T14:30:00Z',
    is_current: false
  },
  {
    id: 3,
    derivative_id: 1,
    version_number: 3,
    content: 'Your content multiplier is here! 🤖 Generate platform-optimized posts for Twitter, LinkedIn, Facebook, Instagram & TikTok instantly. Save 70% of your content creation time. Join 1000+ creators. #AI #Automation #ContentMarketing #SocialMedia',
    character_count: 218,
    change_type: 'ai_regenerated',
    change_summary: 'AI-generated high-converting version',
    change_reason: 'Testing new AI model for better copywriting',
    changed_by: 'ai_assistant',
    created_at: '2024-11-08T16:45:00Z',
    is_current: false
  },
  {
    id: 4,
    derivative_id: 1,
    version_number: 4,
    content: 'Discover the power of AI-driven content creation! 🚀 Transform your social media strategy with intelligent automation. Our platform helps you create compelling content faster than ever before. #AI #Marketing',
    character_count: 187,
    change_type: 'rollback',
    change_summary: 'Rolled back to version 1',
    change_reason: 'Previous version performed better in testing',
    changed_by: 'john_doe',
    created_at: '2024-11-09T09:15:00Z',
    is_current: true
  }
]

export default function VersionControlDemoPage() {
  const [derivativeId] = useState(1)
  const [versions, setVersions] = useState<DerivativeVersion[]>(SAMPLE_VERSIONS)
  const [newContent, setNewContent] = useState('')
  const [changeSummary, setChangeSummary] = useState('')

  // Mock API for demo
  if (typeof window !== 'undefined') {
    if (!window.__versionControlMockSetup) {
      window.__versionControlMockSetup = true

      const originalFetch = window.fetch
      window.fetch = function(this: Window, url: string | Request, options?: RequestInit) {
        const urlStr = typeof url === 'string' ? url : url.url

        // GET versions
        if (urlStr.includes('/api/versions/') && !options?.method) {
          return Promise.resolve(
            new Response(JSON.stringify(versions), {
              status: 200,
              headers: { 'content-type': 'application/json' }
            })
          )
        }

        // POST create version
        if (urlStr.includes('/api/versions') && options?.method === 'POST') {
          const body = JSON.parse(options.body as string)
          const nextId = Math.max(...versions.map(v => v.id), 0) + 1
          const nextVersion = Math.max(...versions.map(v => v.version_number), 0) + 1

          const newVersion: DerivativeVersion = {
            id: nextId,
            derivative_id: body.derivativeId,
            version_number: nextVersion,
            content: body.content,
            character_count: body.content.length,
            change_type: body.changeType,
            change_summary: body.changeSummary,
            changed_by: 'current-user',
            created_at: new Date().toISOString(),
            is_current: true
          }

          const updated = versions.map(v => ({ ...v, is_current: false }))
          updated.push(newVersion)
          setVersions(updated)

          return Promise.resolve(
            new Response(JSON.stringify(newVersion), {
              status: 201,
              headers: { 'content-type': 'application/json' }
            })
          )
        }

        // POST rollback
        if (urlStr.includes('/api/versions/rollback') && options?.method === 'POST') {
          const body = JSON.parse(options.body as string)
          const targetVersion = versions.find(v => v.id === body.targetVersionId)

          if (!targetVersion) {
            return Promise.reject(new Error('Version not found'))
          }

          const nextId = Math.max(...versions.map(v => v.id), 0) + 1
          const nextVersion = Math.max(...versions.map(v => v.version_number), 0) + 1

          const rollbackVersion: DerivativeVersion = {
            id: nextId,
            derivative_id: targetVersion.derivative_id,
            version_number: nextVersion,
            content: targetVersion.content,
            character_count: targetVersion.content.length,
            change_type: 'rollback',
            change_summary: `Rolled back to version ${targetVersion.version_number}`,
            change_reason: `Restored from version ${targetVersion.version_number}`,
            changed_by: 'current-user',
            created_at: new Date().toISOString(),
            is_current: true
          }

          const updated = versions.map(v => ({ ...v, is_current: false }))
          updated.push(rollbackVersion)
          setVersions(updated)

          return Promise.resolve(
            new Response(JSON.stringify({ version: rollbackVersion }), {
              status: 200,
              headers: { 'content-type': 'application/json' }
            })
          )
        }

        // DELETE version
        if (urlStr.includes('/api/version/') && options?.method === 'DELETE') {
          const id = parseInt(urlStr.split('/').pop() || '0')
          setVersions(prev => prev.filter(v => v.id !== id))
          return Promise.resolve(new Response(null, { status: 204 }))
        }

        return originalFetch.call(this, url, options)
      } as any
    }
  }

  const handleCreateVersion = async () => {
    if (!newContent.trim()) {
      toast.error('Please enter content for the new version')
      return
    }

    try {
      const response = await fetch('/api/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          derivativeId: 1,
          content: newContent,
          changeType: 'edited',
          changeSummary: changeSummary || 'Content updated',
          changeReason: 'Manual edit via demo'
        })
      })

      if (!response.ok) throw new Error('Failed to create version')

      toast.success('New version created successfully!')
      setNewContent('')
      setChangeSummary('')

      // Reload versions
      const versionsResponse = await fetch(`/api/versions/${derivativeId}`)
      const updatedVersions = await versionsResponse.json()
      setVersions(updatedVersions)
    } catch (error) {
      toast.error('Failed to create version')
    }
  }

  const currentVersion = versions.find(v => v.is_current)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Version Control Demo</h1>
          <p className="text-muted-foreground max-w-2xl">
            Track, manage, and restore derivative versions. Create a complete audit trail of all content changes with rollback capability.
          </p>
        </div>

        {/* Current Version Display */}
        {currentVersion && (
          <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                <History className="w-5 h-5" />
                Current Version: v{currentVersion.version_number}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">{currentVersion.content}</p>
              <p className="text-xs text-muted-foreground">
                {currentVersion.character_count} characters • {new Date(currentVersion.created_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">Version History</TabsTrigger>
            <TabsTrigger value="create">Create New Version</TabsTrigger>
            <TabsTrigger value="info">How It Works</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <DerivativeVersionHistory
              derivativeId={derivativeId}
              platform="twitter"
              onRollback={(version) => {
                toast.success(`Restored to v${version.version_number}`)
              }}
            />
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Version
                </CardTitle>
                <CardDescription>
                  Edit the content and create a new version for tracking changes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Enter your content here..."
                    className="w-full h-24 p-3 border rounded-lg bg-background text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {newContent.length} characters
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Change Summary</label>
                  <input
                    type="text"
                    value={changeSummary}
                    onChange={(e) => setChangeSummary(e.target.value)}
                    placeholder="e.g., Improved tone, Added CTA, etc."
                    className="w-full p-2 border rounded-lg bg-background text-foreground"
                  />
                </div>

                <Button onClick={handleCreateVersion} className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Create Version
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Version Control Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">📝 Version Types</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li><strong>Created:</strong> Initial version creation</li>
                    <li><strong>Edited:</strong> Manual content modifications</li>
                    <li><strong>AI Regenerated:</strong> New content from AI generation</li>
                    <li><strong>Rollback:</strong> Restored from a previous version</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">🔄 Version Timeline</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Every change is tracked with:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Version number (automatically incrementing)</li>
                    <li>Timestamp of change</li>
                    <li>User who made the change</li>
                    <li>Change type and summary</li>
                    <li>Reason for change</li>
                    <li>Character count at that point</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">↩️ Rollback Capability</h3>
                  <p className="text-sm text-muted-foreground">
                    Restore any previous version with one click. Rolling back creates a new version entry
                    maintaining complete audit trail. Never lose content or history.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">📊 Management Features</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Delete old versions (except current)</li>
                    <li>Compare two versions side-by-side</li>
                    <li>Auto-purge old versions</li>
                    <li>Version statistics</li>
                    <li>Full audit trail with event logging</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <code className="bg-muted px-2 py-1 rounded">GET /api/versions/:derivativeId</code>
                  <p className="text-muted-foreground mt-1">Get all versions of a derivative</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">POST /api/versions</code>
                  <p className="text-muted-foreground mt-1">Create a new version</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">POST /api/versions/rollback</code>
                  <p className="text-muted-foreground mt-1">Rollback to a specific version</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">DELETE /api/version/:versionId</code>
                  <p className="text-muted-foreground mt-1">Delete a version (non-current)</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">GET /api/versions/timeline/:derivativeId</code>
                  <p className="text-muted-foreground mt-1">Get version timeline</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">POST /api/versions/compare</code>
                  <p className="text-muted-foreground mt-1">Compare two versions</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>derivative_versions table:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>id - Unique version identifier</li>
                  <li>derivative_id - Reference to derivative</li>
                  <li>version_number - Auto-incrementing version</li>
                  <li>content - The actual content text</li>
                  <li>character_count - Content length</li>
                  <li>change_summary - Brief description</li>
                  <li>change_type - created | edited | ai_regenerated | rollback</li>
                  <li>changed_by - User who made the change</li>
                  <li>change_reason - Why the change was made</li>
                  <li>is_current - Boolean flag for current version</li>
                  <li>created_at - Timestamp</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Versions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{versions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Current Version</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">v{currentVersion?.version_number || 'N/A'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Current Length</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentVersion?.character_count || 0}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

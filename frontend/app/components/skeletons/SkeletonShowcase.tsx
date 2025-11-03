'use client'

import { useState } from 'react'
import { IdeasSkeleton } from './IdeasSkeleton'
import { BriefSkeleton, BriefListSkeleton } from './BriefSkeleton'
import { DraftSkeleton, DraftListSkeleton } from './DraftSkeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export function SkeletonShowcase() {
  const [showSkeleton, setShowSkeleton] = useState(true)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Skeleton Loading States</h1>
            <p className="text-muted-foreground mt-2">
              Preview của các skeleton components với shimmer effect
            </p>
          </div>
          <Button onClick={() => setShowSkeleton(!showSkeleton)}>
            {showSkeleton ? 'Hide Skeletons' : 'Show Skeletons'}
          </Button>
        </div>

        {showSkeleton && (
          <Tabs defaultValue="ideas" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ideas">Ideas Grid</TabsTrigger>
              <TabsTrigger value="brief">Brief Detail</TabsTrigger>
              <TabsTrigger value="brief-list">Brief List</TabsTrigger>
              <TabsTrigger value="draft">Draft Editor</TabsTrigger>
            </TabsList>

            {/* Ideas Grid Skeleton */}
            <TabsContent value="ideas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>IdeasSkeleton</CardTitle>
                  <CardDescription>
                    Grid layout cho danh sách ý tưởng với card skeleton và shimmer effect
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IdeasSkeleton count={6} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Brief Detail Skeleton */}
            <TabsContent value="brief" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>BriefSkeleton</CardTitle>
                  <CardDescription>
                    Chi tiết brief với header và paragraphs shimmer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BriefSkeleton />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Brief List Skeleton */}
            <TabsContent value="brief-list" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>BriefListSkeleton</CardTitle>
                  <CardDescription>
                    Danh sách brief với compact card layout
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BriefListSkeleton count={4} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Draft Editor Skeleton */}
            <TabsContent value="draft" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>DraftSkeleton</CardTitle>
                  <CardDescription>
                    Editor placeholder với toolbar và content area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DraftSkeleton />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>DraftListSkeleton</CardTitle>
                  <CardDescription>
                    Grid danh sách draft với preview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DraftListSkeleton count={4} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Usage Examples */}
        {!showSkeleton && (
          <Card>
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
              <CardDescription>
                Cách sử dụng skeleton components trong code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Import:</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`import { IdeasSkeleton, BriefSkeleton, DraftSkeleton } from '@/components/skeletons'`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">IdeasSkeleton:</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{loading && <IdeasSkeleton count={6} />}`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">BriefSkeleton:</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{loading && <BriefSkeleton />}`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">DraftSkeleton:</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{loading && <DraftSkeleton />}`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Custom Skeleton:</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`<Skeleton shimmer className="h-4 w-full" />`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


import { Card, CardContent, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export function DraftSkeleton() {
  return (
    <div className="space-y-6">
      {/* Title Editor Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton shimmer className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton shimmer className="h-12 w-full rounded-md" />
        </CardContent>
      </Card>

      {/* Content Editor Skeleton */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton shimmer className="h-5 w-40" />
            {/* Toolbar */}
            <div className="flex gap-2">
              <Skeleton shimmer className="h-8 w-8 rounded" />
              <Skeleton shimmer className="h-8 w-8 rounded" />
              <Skeleton shimmer className="h-8 w-8 rounded" />
              <Skeleton shimmer className="h-8 w-8 rounded" />
              <Skeleton shimmer className="h-8 w-8 rounded" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Editor content area */}
          <div className="space-y-4 border rounded-md p-4 min-h-[400px]">
            {/* Heading */}
            <Skeleton shimmer className="h-7 w-2/3" />
            
            {/* Paragraphs */}
            <div className="space-y-2">
              <Skeleton shimmer className="h-4 w-full" />
              <Skeleton shimmer className="h-4 w-full" />
              <Skeleton shimmer className="h-4 w-5/6" />
            </div>

            {/* Subheading */}
            <Skeleton shimmer className="h-6 w-1/2 mt-6" />
            
            {/* More paragraphs */}
            <div className="space-y-2">
              <Skeleton shimmer className="h-4 w-full" />
              <Skeleton shimmer className="h-4 w-11/12" />
              <Skeleton shimmer className="h-4 w-4/5" />
            </div>

            {/* List items */}
            <div className="space-y-2 pl-4">
              <Skeleton shimmer className="h-4 w-10/12" />
              <Skeleton shimmer className="h-4 w-9/12" />
              <Skeleton shimmer className="h-4 w-11/12" />
            </div>

            {/* Final paragraph */}
            <div className="space-y-2 mt-6">
              <Skeleton shimmer className="h-4 w-full" />
              <Skeleton shimmer className="h-4 w-3/4" />
            </div>
          </div>

          {/* Character count */}
          <div className="mt-4 flex justify-end">
            <Skeleton shimmer className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Meta fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <Skeleton shimmer className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton shimmer className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton shimmer className="h-5 w-28" />
          </CardHeader>
          <CardContent>
            <Skeleton shimmer className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-end">
        <Skeleton shimmer className="h-10 w-24 rounded-md" />
        <Skeleton shimmer className="h-10 w-32 rounded-md" />
      </div>
    </div>
  )
}

export function DraftListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                {/* Title */}
                <Skeleton shimmer className="h-5 w-4/5" />
                {/* Preview */}
                <div className="space-y-1">
                  <Skeleton shimmer className="h-3 w-full" />
                  <Skeleton shimmer className="h-3 w-5/6" />
                  <Skeleton shimmer className="h-3 w-3/4" />
                </div>
              </div>
              {/* Status badge */}
              <Skeleton shimmer className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Skeleton shimmer className="h-3 w-32" />
              <div className="flex gap-2">
                <Skeleton shimmer className="h-8 w-8 rounded" />
                <Skeleton shimmer className="h-8 w-8 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


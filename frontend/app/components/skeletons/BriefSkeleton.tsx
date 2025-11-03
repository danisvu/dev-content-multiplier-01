import { Card, CardContent, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export function BriefSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            {/* Title */}
            <Skeleton shimmer className="h-8 w-2/3" />
            {/* Subtitle */}
            <Skeleton shimmer className="h-4 w-1/2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Meta info */}
            <div className="flex gap-4">
              <Skeleton shimmer className="h-5 w-32" />
              <Skeleton shimmer className="h-5 w-28" />
              <Skeleton shimmer className="h-5 w-36" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            {/* Section title */}
            <Skeleton shimmer className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Paragraphs */}
              <div className="space-y-2">
                <Skeleton shimmer className="h-4 w-full" />
                <Skeleton shimmer className="h-4 w-full" />
                <Skeleton shimmer className="h-4 w-5/6" />
              </div>
              <div className="space-y-2">
                <Skeleton shimmer className="h-4 w-full" />
                <Skeleton shimmer className="h-4 w-4/5" />
              </div>
              {/* Bullet points */}
              <div className="space-y-2 pl-4">
                <Skeleton shimmer className="h-3 w-11/12" />
                <Skeleton shimmer className="h-3 w-10/12" />
                <Skeleton shimmer className="h-3 w-9/12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Action buttons skeleton */}
      <div className="flex gap-3">
        <Skeleton shimmer className="h-10 w-32 rounded-md" />
        <Skeleton shimmer className="h-10 w-36 rounded-md" />
        <Skeleton shimmer className="h-10 w-28 rounded-md" />
      </div>
    </div>
  )
}

export function BriefListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                {/* Title */}
                <Skeleton shimmer className="h-6 w-3/4" />
                {/* Description */}
                <div className="space-y-1">
                  <Skeleton shimmer className="h-3 w-full" />
                  <Skeleton shimmer className="h-3 w-5/6" />
                </div>
              </div>
              {/* Status badge */}
              <Skeleton shimmer className="h-6 w-24 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Skeleton shimmer className="h-4 w-28" />
              <Skeleton shimmer className="h-4 w-32" />
              <Skeleton shimmer className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


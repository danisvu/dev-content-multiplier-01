import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

interface IdeasSkeletonProps {
  count?: number
}

export function IdeasSkeleton({ count = 6 }: IdeasSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <IdeaCardSkeleton key={index} />
      ))}
    </div>
  )
}

function IdeaCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {/* Title */}
            <Skeleton shimmer className="h-6 w-3/4" />
          </div>
          <div className="flex items-center gap-2">
            {/* Badge */}
            <Skeleton shimmer className="h-6 w-24 rounded-full" />
            {/* Menu button */}
            <Skeleton shimmer className="h-8 w-8 rounded-md" />
          </div>
        </div>
        {/* Description */}
        <div className="space-y-2 mt-2">
          <Skeleton shimmer className="h-4 w-full" />
          <Skeleton shimmer className="h-4 w-5/6" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {/* Rationale */}
        <div className="space-y-2">
          <Skeleton shimmer className="h-3 w-full" />
          <Skeleton shimmer className="h-3 w-4/5" />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-3 border-t">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 w-full">
          <Skeleton shimmer className="h-6 w-20 rounded-full" />
          <Skeleton shimmer className="h-6 w-24 rounded-full" />
        </div>

        {/* Date */}
        <div className="w-full">
          <Skeleton shimmer className="h-3 w-32" />
        </div>
      </CardFooter>
    </Card>
  )
}


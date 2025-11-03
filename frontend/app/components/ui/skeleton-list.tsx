'use client'

import { Skeleton } from './skeleton'
import { Card, CardContent, CardFooter, CardHeader } from './card'
import { cn } from '@/lib/utils'

export interface SkeletonListProps {
  count?: number
  type?: 'ideas' | 'briefs' | 'drafts' | 'default'
  className?: string
}

export function SkeletonList({ count = 6, type = 'default', className }: SkeletonListProps) {
  const skeletonItems = Array.from({ length: count }, (_, i) => i)

  return (
    <div className={cn(
      'grid gap-6',
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      className
    )}>
      {skeletonItems.map((index) => (
        <SkeletonCard key={index} type={type} />
      ))}
    </div>
  )
}

interface SkeletonCardProps {
  type: 'ideas' | 'briefs' | 'drafts' | 'default'
}

function SkeletonCard({ type }: SkeletonCardProps) {
  switch (type) {
    case 'ideas':
      return <IdeaSkeletonCard />
    case 'briefs':
      return <BriefSkeletonCard />
    case 'drafts':
      return <DraftSkeletonCard />
    default:
      return <DefaultSkeletonCard />
  }
}

function IdeaSkeletonCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-6 flex-1 animate-shimmer" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 animate-shimmer" />
            <Skeleton className="h-8 w-8 rounded-md animate-shimmer" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full animate-shimmer" />
        <Skeleton className="h-4 w-4/5 animate-shimmer" />
        <Skeleton className="h-4 w-3/5 animate-shimmer" />
        <div className="pt-2">
          <Skeleton className="h-3 w-full animate-shimmer" />
          <Skeleton className="h-3 w-2/3 animate-shimmer mt-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full animate-shimmer" />
          <Skeleton className="h-6 w-20 rounded-full animate-shimmer" />
        </div>
        <Skeleton className="h-4 w-24 animate-shimmer" />
      </CardFooter>
    </Card>
  )
}

function BriefSkeletonCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-2/3 animate-shimmer" />
          <Skeleton className="h-6 w-16 rounded-full animate-shimmer" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full animate-shimmer" />
          <Skeleton className="h-4 w-full animate-shimmer" />
          <Skeleton className="h-4 w-3/4 animate-shimmer" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 animate-shimmer" />
            <Skeleton className="h-4 w-full animate-shimmer" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 animate-shimmer" />
            <Skeleton className="h-4 w-full animate-shimmer" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center gap-2 w-full">
          <Skeleton className="h-8 w-8 rounded-full animate-shimmer" />
          <div className="flex-1">
            <Skeleton className="h-3 w-24 animate-shimmer mb-1" />
            <Skeleton className="h-3 w-32 animate-shimmer" />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

function DraftSkeletonCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <Skeleton className="h-6 flex-1 animate-shimmer" />
            <Skeleton className="h-8 w-8 rounded-md animate-shimmer" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full animate-shimmer" />
            <Skeleton className="h-5 w-20 rounded-full animate-shimmer" />
            <Skeleton className="h-5 w-24 rounded-full animate-shimmer" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full animate-shimmer" />
          <Skeleton className="h-4 w-full animate-shimmer" />
          <Skeleton className="h-4 w-5/6 animate-shimmer" />
          <Skeleton className="h-4 w-4/6 animate-shimmer" />
        </div>
        <div className="border-t pt-4">
          <Skeleton className="h-20 w-full rounded-md animate-shimmer" />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <Skeleton className="h-4 w-32 animate-shimmer" />
        <Skeleton className="h-9 w-24 rounded-md animate-shimmer" />
      </CardFooter>
    </Card>
  )
}

function DefaultSkeletonCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 animate-shimmer" />
        <Skeleton className="h-4 w-1/2 animate-shimmer mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full animate-shimmer" />
        <Skeleton className="h-4 w-full animate-shimmer" />
        <Skeleton className="h-4 w-2/3 animate-shimmer" />
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Skeleton className="h-9 w-full animate-shimmer" />
      </CardFooter>
    </Card>
  )
}


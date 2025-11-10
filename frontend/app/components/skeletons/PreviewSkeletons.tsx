'use client'

import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

// Twitter Preview Skeleton
export function TwitterPreviewSkeleton() {
  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Skeleton shimmer className="h-12 w-12 rounded-full flex-shrink-0" />
          
          <div className="flex-1 space-y-2">
            {/* Name and handle */}
            <div className="flex items-center gap-2">
              <Skeleton shimmer className="h-4 w-24" />
              <Skeleton shimmer className="h-4 w-20" />
            </div>
            {/* Timestamp */}
            <Skeleton shimmer className="h-3 w-16" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Content */}
        <div className="space-y-2">
          <Skeleton shimmer className="h-4 w-full" />
          <Skeleton shimmer className="h-4 w-full" />
          <Skeleton shimmer className="h-4 w-3/4" />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-3 border-t">
        {/* Interaction buttons */}
        <Skeleton shimmer className="h-8 w-12" />
        <Skeleton shimmer className="h-8 w-12" />
        <Skeleton shimmer className="h-8 w-12" />
        <Skeleton shimmer className="h-8 w-12" />
      </CardFooter>
    </Card>
  )
}

// LinkedIn Preview Skeleton
export function LinkedInPreviewSkeleton() {
  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Skeleton shimmer className="h-12 w-12 rounded-full flex-shrink-0" />
          
          <div className="flex-1 space-y-2">
            {/* Name and title */}
            <Skeleton shimmer className="h-4 w-32" />
            <Skeleton shimmer className="h-3 w-48" />
            {/* Timestamp */}
            <Skeleton shimmer className="h-3 w-20" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Content */}
        <div className="space-y-2">
          <Skeleton shimmer className="h-4 w-full" />
          <Skeleton shimmer className="h-4 w-full" />
          <Skeleton shimmer className="h-4 w-5/6" />
          <Skeleton shimmer className="h-4 w-4/5" />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-3 border-t">
        {/* Engagement bar */}
        <Skeleton shimmer className="h-8 w-16" />
        <Skeleton shimmer className="h-8 w-20" />
        <Skeleton shimmer className="h-8 w-18" />
        <Skeleton shimmer className="h-8 w-14" />
      </CardFooter>
    </Card>
  )
}

// Facebook Preview Skeleton
export function FacebookPreviewSkeleton() {
  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Skeleton shimmer className="h-10 w-10 rounded-full flex-shrink-0" />
          
          <div className="flex-1 space-y-2">
            {/* Name */}
            <Skeleton shimmer className="h-4 w-32" />
            {/* Timestamp */}
            <Skeleton shimmer className="h-3 w-24" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Content */}
        <div className="space-y-2">
          <Skeleton shimmer className="h-4 w-full" />
          <Skeleton shimmer className="h-4 w-full" />
          <Skeleton shimmer className="h-4 w-11/12" />
          <Skeleton shimmer className="h-4 w-4/5" />
        </div>
      </CardContent>

      <CardFooter className="space-y-3 pt-3 border-t">
        {/* Stats */}
        <div className="flex justify-between w-full text-sm">
          <Skeleton shimmer className="h-4 w-20" />
          <Skeleton shimmer className="h-4 w-32" />
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-around w-full pt-2 border-t">
          <Skeleton shimmer className="h-8 w-16" />
          <Skeleton shimmer className="h-8 w-20" />
          <Skeleton shimmer className="h-8 w-16" />
        </div>
      </CardFooter>
    </Card>
  )
}

// Instagram Preview Skeleton
export function InstagramPreviewSkeleton() {
  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <Skeleton shimmer className="h-8 w-8 rounded-full flex-shrink-0" />
            {/* Username */}
            <Skeleton shimmer className="h-4 w-24" />
          </div>
          {/* Menu */}
          <Skeleton shimmer className="h-6 w-6" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-0">
        {/* Image placeholder */}
        <Skeleton shimmer className="w-full aspect-square" />
        
        {/* Action buttons */}
        <div className="flex justify-between px-4">
          <div className="flex gap-4">
            <Skeleton shimmer className="h-6 w-6" />
            <Skeleton shimmer className="h-6 w-6" />
            <Skeleton shimmer className="h-6 w-6" />
          </div>
          <Skeleton shimmer className="h-6 w-6" />
        </div>

        {/* Caption */}
        <div className="px-4 space-y-2 pb-3">
          <Skeleton shimmer className="h-4 w-20" />
          <div className="space-y-1">
            <Skeleton shimmer className="h-3 w-full" />
            <Skeleton shimmer className="h-3 w-5/6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// TikTok Preview Skeleton
export function TikTokPreviewSkeleton() {
  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden bg-black">
      <CardContent className="relative aspect-[9/16] p-0">
        {/* Video placeholder */}
        <Skeleton shimmer className="absolute inset-0 bg-gray-800" />
        
        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Username */}
          <Skeleton shimmer className="h-4 w-32 bg-gray-700" />
          
          {/* Caption */}
          <div className="space-y-1">
            <Skeleton shimmer className="h-3 w-full bg-gray-700" />
            <Skeleton shimmer className="h-3 w-4/5 bg-gray-700" />
          </div>
        </div>

        {/* Side action buttons */}
        <div className="absolute right-2 bottom-20 space-y-4">
          <div className="flex flex-col items-center gap-1">
            <Skeleton shimmer className="h-10 w-10 rounded-full bg-gray-700" />
            <Skeleton shimmer className="h-3 w-10 bg-gray-700" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Skeleton shimmer className="h-10 w-10 rounded-full bg-gray-700" />
            <Skeleton shimmer className="h-3 w-10 bg-gray-700" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Skeleton shimmer className="h-10 w-10 rounded-full bg-gray-700" />
            <Skeleton shimmer className="h-3 w-10 bg-gray-700" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Skeleton shimmer className="h-10 w-10 rounded-full bg-gray-700" />
            <Skeleton shimmer className="h-3 w-10 bg-gray-700" />
          </div>
        </div>

        {/* Play icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton shimmer className="h-16 w-16 rounded-full bg-gray-700" />
        </div>
      </CardContent>
    </Card>
  )
}

// Grid of all preview skeletons
interface PreviewSkeletonsGridProps {
  platforms?: Array<'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok'>
}

export function PreviewSkeletonsGrid({ 
  platforms = ['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok'] 
}: PreviewSkeletonsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {platforms.includes('twitter') && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Twitter</h3>
          <TwitterPreviewSkeleton />
        </div>
      )}
      {platforms.includes('linkedin') && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">LinkedIn</h3>
          <LinkedInPreviewSkeleton />
        </div>
      )}
      {platforms.includes('facebook') && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Facebook</h3>
          <FacebookPreviewSkeleton />
        </div>
      )}
      {platforms.includes('instagram') && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Instagram</h3>
          <InstagramPreviewSkeleton />
        </div>
      )}
      {platforms.includes('tiktok') && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">TikTok</h3>
          <TikTokPreviewSkeleton />
        </div>
      )}
    </div>
  )
}


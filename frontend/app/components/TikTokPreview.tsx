'use client'

import React from 'react'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Heart, MessageCircle, Share2, Bookmark, Music } from 'lucide-react'
import { Button } from './ui/button'
import { CopyButton } from './CopyButton'
import { cn } from '@/lib/utils'

export interface TikTokPreviewProps {
  content: string
  authorName?: string
  authorUsername?: string
  avatarUrl?: string
  musicTitle?: string
  className?: string
}

export function TikTokPreview({
  content,
  authorName = 'John Doe',
  authorUsername = '@johndoe',
  avatarUrl = '',
  musicTitle = 'Original Sound',
  className
}: TikTokPreviewProps) {
  return (
    <Card className={cn('max-w-xl bg-black text-white border-gray-800', className)}>
      <CardContent className="p-0 relative">
        {/* Copy Button */}
        <div className="absolute top-4 right-4 z-10">
          <CopyButton textToCopy={content} />
        </div>

        {/* Video Placeholder */}
        <div className="w-full aspect-[9/16] bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center relative">
          <div className="text-center text-white/80">
            <svg className="w-20 h-20 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <p className="text-sm">Video Content</p>
          </div>

          {/* Bottom Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            {/* Author Info */}
            <div className="flex items-center space-x-2 mb-3">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={avatarUrl} alt={authorName} />
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                  {authorName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{authorUsername}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 h-7 px-3 bg-transparent border-white text-white hover:bg-white hover:text-black"
              >
                Follow
              </Button>
            </div>

            {/* Caption */}
            <div className="mb-3">
              <p className="text-sm whitespace-pre-wrap line-clamp-3">
                {content}
              </p>
            </div>

            {/* Music */}
            <div className="flex items-center space-x-2 text-xs">
              <Music className="h-3 w-3" />
              <p className="truncate">{musicTitle} · {authorName}</p>
            </div>
          </div>

          {/* Side Action Buttons */}
          <div className="absolute right-3 bottom-4 flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
              >
                <Heart className="h-7 w-7" />
              </Button>
              <span className="text-xs mt-1">2.4M</span>
            </div>

            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
              >
                <MessageCircle className="h-7 w-7" />
              </Button>
              <span className="text-xs mt-1">8,234</span>
            </div>

            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
              >
                <Bookmark className="h-7 w-7" />
              </Button>
              <span className="text-xs mt-1">3,891</span>
            </div>

            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
              >
                <Share2 className="h-7 w-7" />
              </Button>
              <span className="text-xs mt-1">Share</span>
            </div>

            {/* Spinning Record */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center animate-spin-slow">
                <Music className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


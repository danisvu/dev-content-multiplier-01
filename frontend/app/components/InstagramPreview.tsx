'use client'

import React from 'react'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { CopyButton } from './CopyButton'
import { cn } from '@/lib/utils'

export interface InstagramPreviewProps {
  content: string
  authorName?: string
  authorUsername?: string
  avatarUrl?: string
  timestamp?: string
  className?: string
}

export function InstagramPreview({
  content,
  authorName = 'John Doe',
  authorUsername = 'johndoe',
  avatarUrl = '',
  timestamp = '2 HOURS AGO',
  className
}: InstagramPreviewProps) {
  return (
    <Card className={cn('max-w-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800', className)}>
      <CardContent className="p-0 relative">
        {/* Copy Button */}
        <div className="absolute top-4 right-4 z-10">
          <CopyButton textToCopy={content} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                <div className="rounded-full bg-white dark:bg-gray-900 p-[2px]">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt={authorName} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xs">
                      {authorName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            <div className="ml-2">
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {authorUsername}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Image Placeholder */}
        <div className="w-full aspect-square bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900 flex items-center justify-center">
          <div className="text-center text-gray-400 dark:text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-900 dark:text-gray-100 hover:bg-transparent hover:text-gray-500"
            >
              <Heart className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-900 dark:text-gray-100 hover:bg-transparent hover:text-gray-500"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-900 dark:text-gray-100 hover:bg-transparent hover:text-gray-500"
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-900 dark:text-gray-100 hover:bg-transparent hover:text-gray-500"
          >
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>

        {/* Likes */}
        <div className="px-3 pb-2">
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            248 likes
          </p>
        </div>

        {/* Caption */}
        <div className="px-3 pb-2">
          <p className="text-sm text-gray-900 dark:text-gray-100">
            <span className="font-semibold mr-2">{authorUsername}</span>
            <span className="whitespace-pre-wrap">{content}</span>
          </p>
        </div>

        {/* Comments */}
        <div className="px-3 pb-2">
          <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            View all 42 comments
          </button>
        </div>

        {/* Timestamp */}
        <div className="px-3 pb-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase">
            {timestamp}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


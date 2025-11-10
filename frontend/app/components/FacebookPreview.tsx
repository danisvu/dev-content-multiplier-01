'use client'

import React from 'react'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { CopyButton } from './CopyButton'
import { cn } from '@/lib/utils'

export interface FacebookPreviewProps {
  content: string
  authorName?: string
  authorUsername?: string
  avatarUrl?: string
  timestamp?: string
  className?: string
}

export function FacebookPreview({
  content,
  authorName = 'John Doe',
  authorUsername = '@johndoe',
  avatarUrl = '',
  timestamp = '2h',
  className
}: FacebookPreviewProps) {
  return (
    <Card className={cn('max-w-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm', className)}>
      <CardContent className="p-0 relative">
        {/* Copy Button */}
        <div className="absolute top-4 right-4 z-10">
          <CopyButton textToCopy={content} />
        </div>

        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} alt={authorName} />
                <AvatarFallback className="bg-blue-500 text-white">
                  {authorName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  {authorName}
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{timestamp}</span>
                  <span>·</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"/>
                    <path d="M5.5 7.5l1.5 1.5 3.5-3.5"/>
                  </svg>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
            {content}
          </p>
        </div>

        {/* Engagement Stats */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-1">
              <div className="flex items-center -space-x-1">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <ThumbsUp className="h-3 w-3 text-white fill-white" />
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">124</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <span>12 comments</span>
              <span>8 shares</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-around">
            <Button
              variant="ghost"
              className="flex-1 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 h-9"
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm font-medium">Like</span>
            </Button>
            <Button
              variant="ghost"
              className="flex-1 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 h-9"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Comment</span>
            </Button>
            <Button
              variant="ghost"
              className="flex-1 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 h-9"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">Share</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


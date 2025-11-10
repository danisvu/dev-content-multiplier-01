'use client'

import React from 'react'
import { ThumbsUp, MessageSquare, Repeat2, Send } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { CopyButton } from './CopyButton'
import { cn } from '@/lib/utils'

export interface LinkedInPreviewProps {
  content: string
  userName?: string
  userTitle?: string
  userAvatar?: string
  timestamp?: string
  className?: string
}

export function LinkedInPreview({
  content,
  userName = 'Your Name',
  userTitle = 'Job Title at Company',
  userAvatar,
  timestamp = '1h',
  className
}: LinkedInPreviewProps) {
  // Format content with hashtags
  const formatContent = (text: string) => {
    const parts = text.split(/(\s+)/)
    return parts.map((part, index) => {
      // Hashtags
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            {part}
          </span>
        )
      }
      // Mentions
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            {part}
          </span>
        )
      }
      // URLs
      if (part.match(/^https?:\/\//)) {
        return (
          <span key={index} className="text-blue-600 dark:text-blue-400 hover:underline">
            {part}
          </span>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <Card className={cn('max-w-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm', className)}>
      <CardContent className="p-0 relative">
        {/* Copy Button */}
        <div className="absolute top-4 right-4 z-10">
          <CopyButton textToCopy={content} />
        </div>

        {/* Profile Section */}
        <div className="p-4 pb-3">
          <div className="flex items-start space-x-2">
            {/* Avatar */}
            <Avatar className="h-12 w-12">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                {userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white hover:underline hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                    {userName}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {userTitle}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {timestamp}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <svg 
                      className="h-3 w-3 text-gray-500" 
                      fill="currentColor" 
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 1a7 7 0 1 0 7 7 7 7 0 0 0-7-7zM3 8a5 5 0 1 1 5 5 5 5 0 0 1-5-5z"/>
                    </svg>
                  </div>
                </div>
                
                {/* More button */}
                <button 
                  className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-1 transition-colors"
                  aria-label="More options"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-3">
          <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words leading-5">
            {formatContent(content)}
          </div>
        </div>

        {/* Engagement Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-around px-2 py-1.5">
            {/* Like */}
            <button
              className="group flex items-center justify-center gap-1.5 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-1 opacity-70 cursor-default"
              aria-label="Like"
            >
              <ThumbsUp className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Like
              </span>
            </button>

            {/* Comment */}
            <button
              className="group flex items-center justify-center gap-1.5 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-1 opacity-70 cursor-default"
              aria-label="Comment"
            >
              <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Comment
              </span>
            </button>

            {/* Repost */}
            <button
              className="group flex items-center justify-center gap-1.5 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-1 opacity-70 cursor-default"
              aria-label="Repost"
            >
              <Repeat2 className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Repost
              </span>
            </button>

            {/* Send */}
            <button
              className="group flex items-center justify-center gap-1.5 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-1 opacity-70 cursor-default"
              aria-label="Send"
            >
              <Send className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Send
              </span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Preset avatars for demo
export const DEMO_AVATARS = {
  professional1: 'https://i.pravatar.cc/150?img=59',
  professional2: 'https://i.pravatar.cc/150?img=68',
  professional3: 'https://i.pravatar.cc/150?img=64',
  professional4: 'https://i.pravatar.cc/150?img=48',
  professional5: 'https://i.pravatar.cc/150?img=32',
}


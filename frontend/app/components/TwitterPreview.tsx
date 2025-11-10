'use client'

import React from 'react'
import { MessageCircle, Repeat2, Heart, Share, BarChart2 } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { CopyButton } from './CopyButton'
import { cn } from '@/lib/utils'

export interface TwitterPreviewProps {
  content: string
  userName?: string
  userHandle?: string
  userAvatar?: string
  timestamp?: string
  verified?: boolean
  className?: string
}

export function TwitterPreview({
  content,
  userName = 'Your Name',
  userHandle = 'yourhandle',
  userAvatar,
  timestamp = 'now',
  verified = false,
  className
}: TwitterPreviewProps) {
  // Extract hashtags and mentions for styling
  const formatContent = (text: string) => {
    const parts = text.split(/(\s+)/)
    return parts.map((part, index) => {
      // Hashtags
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-blue-500 hover:underline">
            {part}
          </span>
        )
      }
      // Mentions
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-blue-500 hover:underline">
            {part}
          </span>
        )
      }
      // URLs
      if (part.match(/^https?:\/\//)) {
        return (
          <span key={index} className="text-blue-500 hover:underline">
            {part}
          </span>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <Card className={cn('max-w-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800', className)}>
      <CardContent className="p-4 relative">
        {/* Copy Button */}
        <div className="absolute top-4 right-4 z-10">
          <CopyButton textToCopy={content} />
        </div>

        {/* Header */}
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <Avatar className="h-12 w-12">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-blue-500 text-white">
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Info & Content */}
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold text-gray-900 dark:text-white hover:underline">
                {userName}
              </span>
              {verified && (
                <svg
                  viewBox="0 0 22 22"
                  aria-label="Verified account"
                  role="img"
                  className="h-5 w-5 text-blue-500 fill-current"
                >
                  <g>
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                  </g>
                </svg>
              )}
              <span className="text-gray-500 dark:text-gray-400">
                @{userHandle}
              </span>
              <span className="text-gray-500 dark:text-gray-400">·</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {timestamp}
              </span>
            </div>

            {/* Tweet Content */}
            <div className="mt-2 text-gray-900 dark:text-white whitespace-pre-wrap break-words text-[15px] leading-5">
              {formatContent(content)}
            </div>

            {/* Action Buttons */}
            <div className="mt-3 flex items-center justify-between max-w-md">
              {/* Reply */}
              <button
                className="group flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors opacity-60 cursor-default"
                aria-label="Reply"
              >
                <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                  <MessageCircle className="h-[18px] w-[18px]" />
                </div>
                <span className="text-sm">0</span>
              </button>

              {/* Retweet */}
              <button
                className="group flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors opacity-60 cursor-default"
                aria-label="Retweet"
              >
                <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                  <Repeat2 className="h-[18px] w-[18px]" />
                </div>
                <span className="text-sm">0</span>
              </button>

              {/* Like */}
              <button
                className="group flex items-center space-x-2 text-gray-500 hover:text-pink-500 transition-colors opacity-60 cursor-default"
                aria-label="Like"
              >
                <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                  <Heart className="h-[18px] w-[18px]" />
                </div>
                <span className="text-sm">0</span>
              </button>

              {/* Views */}
              <button
                className="group flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors opacity-60 cursor-default"
                aria-label="Views"
              >
                <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                  <BarChart2 className="h-[18px] w-[18px]" />
                </div>
                <span className="text-sm">0</span>
              </button>

              {/* Share */}
              <button
                className="group p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors opacity-60 cursor-default"
                aria-label="Share"
              >
                <Share className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Preset avatars for demo
export const DEMO_AVATARS = {
  male1: 'https://i.pravatar.cc/150?img=12',
  male2: 'https://i.pravatar.cc/150?img=33',
  female1: 'https://i.pravatar.cc/150?img=47',
  female2: 'https://i.pravatar.cc/150?img=44',
  business: 'https://i.pravatar.cc/150?img=52',
}


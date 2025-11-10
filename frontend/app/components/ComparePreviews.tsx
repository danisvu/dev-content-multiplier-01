'use client'

import React from 'react'
import { TwitterPreview, TwitterPreviewProps } from './TwitterPreview'
import { LinkedInPreview, LinkedInPreviewProps } from './LinkedInPreview'
import { FacebookPreview, FacebookPreviewProps } from './FacebookPreview'
import { InstagramPreview, InstagramPreviewProps } from './InstagramPreview'
import { TikTokPreview, TikTokPreviewProps } from './TikTokPreview'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { cn } from '@/lib/utils'

export interface ComparePreviewsProps {
  content: string
  authorName?: string
  authorUsername?: string
  avatarUrl?: string
  className?: string
  showPlatforms?: ('twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok')[]
}

export function ComparePreviews({
  content,
  authorName = 'John Doe',
  authorUsername = '@johndoe',
  avatarUrl = '',
  className,
  showPlatforms = ['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok']
}: ComparePreviewsProps) {
  const platformComponents = {
    twitter: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Twitter</h3>
        <TwitterPreview
          content={content}
          authorName={authorName}
          authorUsername={authorUsername}
          avatarUrl={avatarUrl}
        />
      </div>
    ),
    linkedin: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">LinkedIn</h3>
        <LinkedInPreview
          content={content}
          authorName={authorName}
          authorUsername={authorUsername}
          avatarUrl={avatarUrl}
        />
      </div>
    ),
    facebook: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Facebook</h3>
        <FacebookPreview
          content={content}
          authorName={authorName}
          authorUsername={authorUsername}
          avatarUrl={avatarUrl}
        />
      </div>
    ),
    instagram: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Instagram</h3>
        <InstagramPreview
          content={content}
          authorName={authorName}
          authorUsername={authorUsername.replace('@', '')}
          avatarUrl={avatarUrl}
        />
      </div>
    ),
    tiktok: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">TikTok</h3>
        <TikTokPreview
          content={content}
          authorName={authorName}
          authorUsername={authorUsername}
          avatarUrl={avatarUrl}
        />
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {showPlatforms.map((platform) => (
          <div key={platform} className="flex justify-center">
            {platformComponents[platform]}
          </div>
        ))}
      </div>
    </div>
  )
}


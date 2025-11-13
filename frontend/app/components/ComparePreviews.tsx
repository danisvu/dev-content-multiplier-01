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
  showPlatforms?: ('twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'mailchimp' | 'wordpress')[]
}

export function ComparePreviews({
  content,
  authorName = 'John Doe',
  authorUsername = '@johndoe',
  avatarUrl = '',
  className,
  showPlatforms = ['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok', 'mailchimp', 'wordpress']
}: ComparePreviewsProps) {
  const platformComponents = {
    twitter: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Twitter</h3>
        <TwitterPreview
          content={content}
          userName={authorName}
          userHandle={authorUsername}
          userAvatar={avatarUrl}
        />
      </div>
    ),
    linkedin: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">LinkedIn</h3>
        <LinkedInPreview
          content={content}
          userName={authorName}
          userTitle={authorUsername}
          userAvatar={avatarUrl}
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
    ),
    mailchimp: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mailchimp</h3>
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="text-sm font-mono whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {content}
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300">
              📧 Email template preview
            </div>
          </CardContent>
        </Card>
      </div>
    ),
    wordpress: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">WordPress</h3>
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <div className="text-sm font-mono whitespace-pre-wrap">{content}</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded text-xs text-purple-700 dark:text-purple-300">
              📝 Blog post preview (WordPress/HTML)
            </div>
          </CardContent>
        </Card>
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


'use client'

import React, { useState } from 'react'
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram,
  Music2 // TikTok icon
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

// Platform configuration với character limits
export const PLATFORM_CONFIGS = {
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    limit: 280,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    limit: 3000,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    limit: 63206,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    limit: 2200,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
  },
  tiktok: {
    name: 'TikTok',
    icon: Music2,
    limit: 2200,
    color: 'text-black dark:text-white',
    bgColor: 'bg-gray-50 dark:bg-gray-950',
  },
} as const

export type PlatformType = keyof typeof PLATFORM_CONFIGS

interface DerivativeContent {
  platform: PlatformType
  content: string
}

interface DerivativeTabsProps {
  derivatives: DerivativeContent[]
  onContentChange?: (platform: PlatformType, content: string) => void
  editable?: boolean
  className?: string
}

export function DerivativeTabs({ 
  derivatives, 
  onContentChange,
  editable = false,
  className 
}: DerivativeTabsProps) {
  const [selectedTab, setSelectedTab] = useState<PlatformType>(derivatives[0]?.platform || 'twitter')

  const handleContentChange = (platform: PlatformType, content: string) => {
    if (onContentChange) {
      onContentChange(platform, content)
    }
  }

  const getCharacterCount = (content: string) => {
    return content.length
  }

  const isWithinLimit = (content: string, limit: number) => {
    return content.length <= limit
  }

  return (
    <div className={cn('w-full', className)}>
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as PlatformType)}>
        <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2">
          {derivatives.map((derivative) => {
            const config = PLATFORM_CONFIGS[derivative.platform]
            const Icon = config.icon
            const charCount = getCharacterCount(derivative.content)
            const withinLimit = isWithinLimit(derivative.content, config.limit)

            return (
              <TabsTrigger
                key={derivative.platform}
                value={derivative.platform}
                className="flex items-center gap-2 min-w-fit"
              >
                <Icon className={cn('h-4 w-4', config.color)} />
                <span>{config.name}</span>
                <Badge
                  variant={withinLimit ? 'success' : 'destructive'}
                  className="ml-1 text-xs"
                >
                  {charCount}/{config.limit}
                </Badge>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {derivatives.map((derivative) => {
          const config = PLATFORM_CONFIGS[derivative.platform]
          const charCount = getCharacterCount(derivative.content)
          const withinLimit = isWithinLimit(derivative.content, config.limit)

          return (
            <TabsContent
              key={derivative.platform}
              value={derivative.platform}
              className={cn(
                'mt-4 rounded-lg border p-4 min-h-[200px]',
                config.bgColor
              )}
            >
              <div className="space-y-3">
                {/* Header với icon và character count */}
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center gap-2">
                    {React.createElement(config.icon, { 
                      className: cn('h-5 w-5', config.color) 
                    })}
                    <h3 className="font-semibold text-lg">{config.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-sm font-medium',
                      withinLimit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    )}>
                      {charCount} / {config.limit} ký tự
                    </span>
                    <Badge variant={withinLimit ? 'success' : 'destructive'}>
                      {withinLimit ? '✓ Hợp lệ' : '✗ Vượt giới hạn'}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                {editable ? (
                  <textarea
                    value={derivative.content}
                    onChange={(e) => handleContentChange(derivative.platform, e.target.value)}
                    className={cn(
                      'w-full min-h-[300px] p-3 rounded-md border bg-background',
                      'focus:outline-none focus:ring-2 focus:ring-ring',
                      'resize-y',
                      !withinLimit && 'border-red-500 focus:ring-red-500'
                    )}
                    placeholder={`Nhập nội dung cho ${config.name}...`}
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap bg-background rounded-md p-4 border">
                      {derivative.content}
                    </div>
                  </div>
                )}

                {/* Character limit warning */}
                {!withinLimit && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-2 rounded-md">
                    <span className="font-semibold">⚠️ Cảnh báo:</span>
                    <span>
                      Nội dung vượt quá {charCount - config.limit} ký tự so với giới hạn của {config.name}.
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}

// Helper component để dễ dàng tạo derivatives với default values
export function createDerivative(
  platform: PlatformType, 
  content: string = ''
): DerivativeContent {
  return { platform, content }
}


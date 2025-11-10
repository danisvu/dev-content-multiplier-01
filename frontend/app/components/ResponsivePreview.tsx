'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Monitor, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'mobile' | 'desktop'

export interface ResponsivePreviewProps {
  children: React.ReactNode
  title?: string
  defaultMode?: ViewMode
  className?: string
}

export function ResponsivePreview({
  children,
  title = 'Preview',
  defaultMode = 'desktop',
  className,
}: ResponsivePreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode)

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              Mobile
            </Button>
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              Desktop
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-start min-h-[400px] bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              viewMode === 'mobile' ? 'w-full max-w-[375px]' : 'w-full',
              viewMode === 'mobile' && 'shadow-lg rounded-lg overflow-hidden'
            )}
          >
            {children}
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Viewing in <span className="font-semibold">{viewMode}</span> mode
          {viewMode === 'mobile' && ' (375px width)'}
        </div>
      </CardContent>
    </Card>
  )
}


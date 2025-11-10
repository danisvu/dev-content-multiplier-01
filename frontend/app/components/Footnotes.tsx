'use client'

import { Copy, ExternalLink } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface Source {
  id: number
  title: string
  url: string
  snippet?: string
}

interface FootnotesProps {
  sources: Source[]
  className?: string
}

export function Footnotes({ sources, className }: FootnotesProps) {
  const handleCopyUrl = async (url: string, title: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Đã copy!', {
        description: `URL của "${title}" đã được copy.`
      })
    } catch (error) {
      toast.error('Lỗi!', {
        description: 'Không thể copy URL.'
      })
    }
  }

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const truncateUrl = (url: string, maxLength = 60): string => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength - 3) + '...'
  }

  if (sources.length === 0) {
    return (
      <div className={cn('border rounded-lg p-8 text-center', className)}>
        <p className="text-sm text-muted-foreground italic">
          No sources referenced
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-lg font-semibold">
          References ({sources.length})
        </h3>
        <Badge variant="secondary">{sources.length} sources</Badge>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {sources.map((source) => (
          <AccordionItem 
            key={source.id} 
            value={`source-${source.id}`}
            id={`footnote-${source.id}`}
            className="transition-colors"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-start gap-3 text-left">
                <Badge 
                  variant="outline" 
                  className="flex-shrink-0 mt-0.5"
                >
                  [{source.id}]
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">
                    {source.title}
                  </p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate block mt-1"
                    onClick={(e) => e.stopPropagation()}
                    title={source.url}
                  >
                    {truncateUrl(source.url)}
                  </a>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent>
              <div className="pl-11 space-y-3">
                {/* Snippet */}
                {source.snippet && (
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground font-medium mb-2">
                      Retrieved Snippet:
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      "{source.snippet}"
                    </p>
                  </div>
                )}

                {/* Full URL */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    Full URL:
                  </p>
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/30 border">
                    <code className="text-xs flex-1 truncate">
                      {source.url}
                    </code>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenUrl(source.url)}
                    className="text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open Source
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyUrl(source.url, source.title)}
                    className="text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy URL
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}


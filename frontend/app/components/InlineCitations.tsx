'use client'

import { Badge } from './ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { cn } from '@/lib/utils'

export interface Source {
  id: number
  title: string
  url: string
  snippet?: string
}

interface InlineCitationsProps {
  text: string
  sources: Source[]
  className?: string
  onCitationClick?: (sourceId: number) => void
}

export function InlineCitations({
  text,
  sources,
  className,
  onCitationClick,
}: InlineCitationsProps) {
  // Parse [1], [2], etc. and replace with Badge components
  const parseCitations = () => {
    // Regex to match [1], [2], [3], etc.
    const citationRegex = /\[(\d+)\]/g
    const parts: (string | React.ReactNode)[] = []
    let lastIndex = 0
    let match

    while ((match = citationRegex.exec(text)) !== null) {
      const citationNumber = parseInt(match[1], 10)
      const source = sources.find(s => s.id === citationNumber)

      // Add text before citation
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }

      // Add citation badge
      if (source) {
        parts.push(
          <CitationBadge
            key={`citation-${citationNumber}-${match.index}`}
            source={source}
            onClick={() => {
              // Scroll to footnote
              const footnoteElement = document.getElementById(`footnote-${citationNumber}`)
              if (footnoteElement) {
                footnoteElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                // Highlight animation
                footnoteElement.classList.add('highlight-pulse')
                setTimeout(() => {
                  footnoteElement.classList.remove('highlight-pulse')
                }, 2000)
              }
              onCitationClick?.(citationNumber)
            }}
          />
        )
      } else {
        // If source not found, just show the citation as text
        parts.push(`[${citationNumber}]`)
      }

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : [text]
  }

  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)}>
      <p className="leading-relaxed whitespace-pre-wrap">
        {parseCitations()}
      </p>

      {/* Add CSS for highlight animation */}
      <style jsx>{`
        :global(.highlight-pulse) {
          animation: pulse 0.5s ease-in-out 3;
        }
        
        @keyframes pulse {
          0%, 100% {
            background-color: transparent;
          }
          50% {
            background-color: rgba(var(--primary-rgb, 59, 130, 246), 0.2);
          }
        }
      `}</style>
    </div>
  )
}

interface CitationBadgeProps {
  source: Source
  onClick: () => void
}

function CitationBadge({ source, onClick }: CitationBadgeProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-primary/10 transition-colors mx-0.5 text-xs px-1.5 py-0"
            onClick={(e) => {
              e.preventDefault()
              onClick()
            }}
          >
            [{source.id}]
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold text-sm">{source.title}</p>
            {source.snippet && (
              <p className="text-xs text-muted-foreground line-clamp-3">
                {source.snippet}
              </p>
            )}
            <p className="text-xs text-primary italic">
              Click to jump to source
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}


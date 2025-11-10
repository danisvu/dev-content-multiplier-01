'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, ChevronDown, ChevronUp, Lightbulb, Target, List, FileText } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Idea {
  id: number
  title: string
  persona?: string
  industry?: string
}

interface Brief {
  id: number
  idea_id: number
  title?: string
  content_plan: string
  target_audience: string
  key_points?: string[]
  tone?: string
  word_count?: number
  keywords?: string[]
  created_at: string
}

interface BriefCardProps {
  brief: Brief
  idea?: Idea
  className?: string
  onView?: (brief: Brief) => void
}

const MAX_CONTENT_LENGTH = 300

export function BriefCard({
  brief,
  idea,
  className,
  onView,
}: BriefCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const contentTruncated = brief.content_plan.length > MAX_CONTENT_LENGTH
  const displayContent = isExpanded || !contentTruncated
    ? brief.content_plan
    : brief.content_plan.substring(0, MAX_CONTENT_LENGTH) + '...'

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCopyBrief = async () => {
    const briefText = `
📋 BRIEF: ${brief.title || 'Content Brief'}

🎯 Target Audience:
${brief.target_audience}

📝 Content Plan:
${brief.content_plan}

💡 Key Points:
${brief.key_points?.map((point, i) => `${i + 1}. ${point}`).join('\n') || 'N/A'}

${brief.tone ? `🎨 Tone: ${brief.tone}` : ''}
${brief.word_count ? `📊 Word Count: ${brief.word_count}` : ''}
${brief.keywords ? `🔑 Keywords: ${brief.keywords.join(', ')}` : ''}

${idea ? `\n💡 Original Idea: ${idea.title} (${idea.persona || 'N/A'})` : ''}

Created: ${formatDate(brief.created_at)}
    `.trim()

    try {
      await navigator.clipboard.writeText(briefText)
      setIsCopied(true)
      
      toast.success('Đã copy!', {
        description: 'Brief content đã được copy vào clipboard.',
        duration: 3000,
      })

      setTimeout(() => setIsCopied(false), 3000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Lỗi!', {
        description: 'Không thể copy brief. Vui lòng thử lại.',
        duration: 3000,
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className={cn('h-full', className)}
    >
      <Card className="hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-300 pointer-events-none" />

        <CardHeader className="pb-3 relative z-10">
          {/* Linked Idea */}
          {idea && (
            <div className="mb-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 mt-0.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 truncate">
                    {idea.title}
                  </p>
                  {idea.persona && (
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      👤 {idea.persona}
                      {idea.industry && ` • 🏢 ${idea.industry}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-xl font-bold leading-tight">
              {brief.title || 'Content Brief'}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyBrief}
              className="h-8 w-8 flex-shrink-0"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Target Audience */}
          <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <Target className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Target Audience
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {brief.target_audience}
              </p>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="flex-1 pt-4 space-y-4 relative z-10">
          {/* Key Points */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <List className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Key Points ({brief.key_points?.length || 0})
              </h3>
            </div>
            
            {brief.key_points && brief.key_points.length > 0 ? (
              <TooltipProvider delayDuration={0}>
                <div className="flex flex-wrap gap-2">
                  {brief.key_points.map((point, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Badge 
                          variant="secondary" 
                          className="text-xs font-medium cursor-help hover:bg-primary/20 transition-colors"
                        >
                          <span className="mr-1">•</span>
                          {point.length > 30 ? point.substring(0, 30) + '...' : point}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        className="max-w-xs"
                      >
                        <p className="text-sm">{point}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            ) : (
              <div className="p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/50">
                <p className="text-sm text-muted-foreground italic text-center">
                  No key points provided
                </p>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Content Plan */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Content Plan
              </h3>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {displayContent}
              </p>
            </div>
            
            {contentTruncated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-primary hover:text-primary/80"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    View Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    View More
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Metadata */}
          {(brief.tone || brief.word_count || brief.keywords) && (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">
                {brief.tone && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground font-medium">Tone:</span>
                    <Badge variant="outline" className="text-xs">
                      {brief.tone}
                    </Badge>
                  </div>
                )}
                {brief.word_count && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground font-medium">Word Count:</span>
                    <Badge variant="outline" className="text-xs">
                      {brief.word_count} words
                    </Badge>
                  </div>
                )}
                {brief.keywords && brief.keywords.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {brief.keywords.map((keyword, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800"
                        >
                          #{keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-4 border-t bg-muted/30 relative z-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>📅 {formatDate(brief.created_at)}</span>
          </div>
          
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(brief)}
              className="text-xs"
            >
              View Details
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}


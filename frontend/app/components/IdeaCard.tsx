'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MoreVertical, Edit2, Trash2, Eye, FileText, Loader2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Idea {
  id: number
  title: string
  description?: string
  rationale?: string
  persona?: string
  industry?: string
  status: 'draft' | 'selected' | 'archived' | 'pending' | 'rejected' | 'generated'
  created_at: string
}

interface IdeaCardProps {
  idea: Idea
  onEdit?: (idea: Idea) => void
  onDelete?: (id: number) => void
  onView?: (idea: Idea) => void
  onSelectAndCreateBrief?: (idea: Idea) => void | Promise<void>
  formatDate?: (date: string) => string
}

const statusConfig = {
  draft: {
    variant: 'default' as const,
    label: 'Nháp',
    icon: '📝',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  },
  selected: {
    variant: 'default' as const,
    label: 'Đã chọn',
    icon: '✅',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  archived: {
    variant: 'destructive' as const,
    label: 'Lưu trữ',
    icon: '🗄️',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  rejected: {
    variant: 'destructive' as const,
    label: 'Từ chối',
    icon: '❌',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  pending: {
    variant: 'secondary' as const,
    label: 'Chờ xử lý',
    icon: '⏳',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  generated: {
    variant: 'default' as const,
    label: 'Đã tạo Brief',
    icon: '📄',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
}

export function IdeaCard({
  idea,
  onEdit,
  onDelete,
  onView,
  onSelectAndCreateBrief,
  formatDate,
}: IdeaCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentAction, setCurrentAction] = useState<string | null>(null)
  
  const status = (statusConfig as any)[idea.status] || statusConfig.pending
  const displayDate = formatDate
    ? formatDate(idea.created_at)
    : new Date(idea.created_at).toLocaleDateString('vi-VN')

  const canCreateBrief = idea.status === 'selected'

  const handleAction = async (
    action: string,
    callback: (() => void) | ((arg: any) => void | Promise<void>) | undefined,
    arg?: any
  ) => {
    if (!callback) return

    setIsLoading(true)
    setCurrentAction(action)

    try {
      const result = callback(arg)
      
      // Check if result is a Promise
      if (result instanceof Promise) {
        await result
      }

      // Success toast
      toast.success('Thành công!', {
        description: `${action} đã được thực hiện thành công.`,
        duration: 3000,
      })
    } catch (error) {
      console.error(`Error in ${action}:`, error)
      toast.error('Lỗi!', {
        description: `Không thể ${action.toLowerCase()}. Vui lòng thử lại.`,
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
      setCurrentAction(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className={cn(
        "hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-transparent",
        "hover:before:from-primary/5 hover:before:to-primary/10 before:transition-all before:duration-300",
        isLoading && "opacity-75 cursor-wait"
      )}>
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                {currentAction}...
              </p>
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {idea.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={status.variant}
                className={cn("shrink-0", status.color)}
              >
                <span className="mr-1">{status.icon}</span>
                {status.label}
              </Badge>
              
              {/* Dropdown Menu for Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-accent"
                    disabled={isLoading}
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {onView && (
                    <DropdownMenuItem 
                      onClick={() => handleAction('Xem chi tiết', onView, idea)}
                      disabled={isLoading}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Xem chi tiết</span>
                    </DropdownMenuItem>
                  )}
                  
                  {onEdit && (
                    <DropdownMenuItem 
                      onClick={() => handleAction('Chỉnh sửa', onEdit, idea)}
                      disabled={isLoading}
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      <span>Chỉnh sửa</span>
                    </DropdownMenuItem>
                  )}

                  {onSelectAndCreateBrief && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleAction('Tạo Brief', onSelectAndCreateBrief, idea)}
                        disabled={!canCreateBrief || isLoading}
                        className={cn(
                          "font-medium",
                          canCreateBrief 
                            ? "text-blue-600 focus:text-blue-700 dark:text-blue-400" 
                            : "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Chọn & Tạo Brief</span>
                        {!canCreateBrief && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            (Chỉ khi đã chọn)
                          </span>
                        )}
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleAction('Xóa', onDelete, idea.id)}
                        className="text-red-600 focus:text-red-700 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950"
                        disabled={isLoading}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Xóa</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {idea.description && (
            <CardDescription className="line-clamp-2 mt-2 text-sm">
              {idea.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          {idea.rationale && (
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <p className="text-xs text-purple-700 dark:text-purple-300 italic line-clamp-2">
                <strong className="font-semibold">💡 Lý do:</strong> {idea.rationale}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-3 border-t bg-muted/30">
          {/* Tags */}
          {(idea.persona || idea.industry) && (
            <div className="flex flex-wrap gap-2 w-full">
              {idea.persona && (
                <Badge variant="secondary" className="text-xs font-medium">
                  <span className="mr-1">👤</span>
                  {idea.persona}
                </Badge>
              )}
              {idea.industry && (
                <Badge variant="secondary" className="text-xs font-medium">
                  <span className="mr-1">🏢</span>
                  {idea.industry}
                </Badge>
              )}
            </div>
          )}

          {/* Date */}
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <span>📅 {displayDate}</span>
            {!canCreateBrief && idea.status !== 'generated' && (
              <span className="text-xs italic text-yellow-600 dark:text-yellow-400">
                Cần chọn để tạo Brief
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

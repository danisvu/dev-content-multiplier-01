'use client'

import { motion } from 'framer-motion'
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react'
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

interface Idea {
  id: number
  title: string
  description?: string
  rationale?: string
  persona?: string
  industry?: string
  status: string
  created_at: string
}

interface IdeaCardProps {
  idea: Idea
  onEdit?: (idea: Idea) => void
  onDelete?: (id: number) => void
  onView?: (idea: Idea) => void
  formatDate?: (date: string) => string
}

const statusConfig = {
  completed: {
    variant: 'success' as const,
    label: 'Hoàn thành',
    icon: '✅',
  },
  'in-progress': {
    variant: 'warning' as const,
    label: 'Đang làm',
    icon: '🔄',
  },
  pending: {
    variant: 'info' as const,
    label: 'Chờ xử lý',
    icon: '⏳',
  },
}

export function IdeaCard({
  idea,
  onEdit,
  onDelete,
  onView,
  formatDate,
}: IdeaCardProps) {
  const status = (statusConfig as any)[idea.status] || statusConfig.pending
  const displayDate = formatDate
    ? formatDate(idea.created_at)
    : new Date(idea.created_at).toLocaleDateString('vi-VN')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      className="h-full"
    >
      <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
        <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{idea.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={status.variant}>
              <span className="mr-1">{status.icon}</span>
              {status.label}
            </Badge>
            
            {/* Dropdown Menu for Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onView && (
                  <DropdownMenuItem onClick={() => onView(idea)}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Xem chi tiết</span>
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(idea)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    <span>Chỉnh sửa</span>
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(idea.id)}
                      className="text-red-600 focus:text-red-600"
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
          <CardDescription className="line-clamp-2 mt-2">
            {idea.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {idea.rationale && (
          <p className="text-xs text-purple-600 italic line-clamp-2">
            <strong>Lý do:</strong> {idea.rationale}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-3 border-t">
        {/* Tags */}
        {(idea.persona || idea.industry) && (
          <div className="flex flex-wrap gap-2 w-full">
            {idea.persona && (
              <Badge variant="secondary" className="text-xs">
                👤 {idea.persona}
              </Badge>
            )}
            {idea.industry && (
              <Badge variant="secondary" className="text-xs">
                🏢 {idea.industry}
              </Badge>
            )}
          </div>
        )}

        {/* Date */}
        <div className="text-xs text-slate-500 w-full">
          {displayDate}
        </div>
      </CardFooter>
    </Card>
    </motion.div>
  )
}

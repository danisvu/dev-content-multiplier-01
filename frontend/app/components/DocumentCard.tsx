'use client'

import { useState } from 'react'
import { File, ExternalLink, Trash2, Copy, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface Document {
  id: number | string
  title: string
  url: string
  uploadDate: string
  fileType?: string
  fileSize?: number
}

interface DocumentCardProps {
  document: Document
  onDelete?: (id: number | string) => void
  className?: string
}

export function DocumentCard({ document, onDelete, className }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const truncateUrl = (url: string, maxLength = 50): string => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength - 3) + '...'
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(document.url)
      toast.success('Đã copy!', {
        description: 'URL đã được copy vào clipboard.'
      })
    } catch (error) {
      toast.error('Lỗi!', {
        description: 'Không thể copy URL.'
      })
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete?.(document.id)
      toast.success('Đã xóa!', {
        description: `${document.title} đã được xóa.`
      })
    } catch (error) {
      toast.error('Lỗi!', {
        description: 'Không thể xóa document.'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenUrl = () => {
    window.open(document.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={cn('h-full', className)}
    >
      <Card className="hover:shadow-lg transition-all duration-300 h-full flex flex-col group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <File className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base leading-tight truncate">
                  {document.title}
                </CardTitle>
                {document.fileType && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {document.fileType.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa document?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc muốn xóa <strong>{document.title}</strong>? 
                    Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-3">
          {/* URL */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">URL:</p>
            <div className="flex items-center gap-2">
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate flex-1 min-w-0"
                title={document.url}
              >
                {truncateUrl(document.url)}
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-7 w-7"
                onClick={handleCopyUrl}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Upload Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Uploaded: {formatDate(document.uploadDate)}</span>
          </div>

          {/* File Size */}
          {document.fileSize && (
            <div className="text-xs text-muted-foreground">
              Size: {(document.fileSize / 1024).toFixed(2)} KB
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-auto pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleOpenUrl}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={handleCopyUrl}
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy URL
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


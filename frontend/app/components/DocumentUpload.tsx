'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, File, CheckCircle, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface DocumentUploadProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onUpload?: (file: File) => Promise<void>
  trigger?: React.ReactNode
  accept?: string
  maxSize?: number // in MB
}

export function DocumentUpload({
  open,
  onOpenChange,
  onUpload,
  trigger,
  accept = '.pdf,.doc,.docx,.txt',
  maxSize = 10,
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const validateFile = (file: File): boolean => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      toast.error('File quá lớn!', {
        description: `File không được vượt quá ${maxSize}MB. File của bạn: ${fileSizeMB.toFixed(2)}MB`
      })
      return false
    }

    // Check file type
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
    const acceptedTypes = accept.split(',').map(t => t.trim())
    if (!acceptedTypes.includes(fileExt)) {
      toast.error('Định dạng không hỗ trợ!', {
        description: `Chỉ chấp nhận: ${accept}`
      })
      return false
    }

    return true
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        toast.success('File đã chọn!', {
          description: file.name
        })
      }
    }
  }, [accept, maxSize])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        toast.success('File đã chọn!', {
          description: file.name
        })
      }
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const simulateUpload = () => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            resolve()
            return 100
          }
          return prev + 10
        })
      }, 200)
    })
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      if (onUpload) {
        await onUpload(selectedFile)
      } else {
        // Simulate upload
        await simulateUpload()
      }

      toast.success('Upload thành công!', {
        description: `${selectedFile.name} đã được upload.`
      })

      // Reset
      handleRemoveFile()
      onOpenChange?.(false)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload thất bại!', {
        description: 'Vui lòng thử lại.'
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload tài liệu để tham khảo trong bài viết của bạn. Tối đa {maxSize}MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
              isDragging
                ? 'border-primary bg-primary/5 scale-105'
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50',
              isUploading && 'pointer-events-none opacity-50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />

            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
                isDragging ? 'bg-primary/20' : 'bg-muted'
              )}>
                <Upload className={cn(
                  'w-8 h-8 transition-colors',
                  isDragging ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {isDragging ? 'Thả file ở đây' : 'Click hoặc kéo file vào đây'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {accept.split(',').join(', ')} • Tối đa {maxSize}MB
                </p>
              </div>
            </div>
          </div>

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : uploadProgress === 100 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <File className="w-5 h-5 text-primary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>

                  {/* Progress Bar */}
                  {isUploading && (
                    <div className="mt-2">
                      <Progress value={uploadProgress} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>

                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            disabled={isUploading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


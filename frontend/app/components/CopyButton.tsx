'use client'

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface CopyButtonProps {
  textToCopy: string
  className?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function CopyButton({
  textToCopy,
  className,
  variant = 'outline',
  size = 'sm'
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      toast.success('Copied to clipboard!', {
        duration: 2000,
      })

      // Reset icon after 2 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        'transition-all duration-200',
        isCopied && 'scale-110',
        className
      )}
      aria-label="Copy to clipboard"
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}


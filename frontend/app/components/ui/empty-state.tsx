'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: LucideIcon | React.ElementType
  title: string
  description: string
  ctaLabel?: string
  onClick?: () => void
  // Legacy support
  actionLabel?: string
  onAction?: () => void
  className?: string
  iconClassName?: string
  variant?: 'default' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onClick,
  // Legacy support
  actionLabel,
  onAction,
  className,
  iconClassName,
  variant = 'default',
  size = 'md',
}: EmptyStateProps) {
  // Use new prop names, fallback to legacy
  const finalCtaLabel = ctaLabel || actionLabel
  const finalOnClick = onClick || onAction
  // Size variants
  const sizeConfig = {
    sm: {
      container: 'py-8 px-4',
      iconWrapper: 'p-6',
      icon: 'w-16 h-16',
      title: 'text-lg',
      description: 'text-sm max-w-sm',
      button: 'default' as const,
    },
    md: {
      container: 'py-16 px-6',
      iconWrapper: 'p-8',
      icon: 'w-24 h-24',
      title: 'text-xl',
      description: 'text-sm max-w-md',
      button: 'lg' as const,
    },
    lg: {
      container: 'py-20 px-8',
      iconWrapper: 'p-10',
      icon: 'w-32 h-32',
      title: 'text-2xl',
      description: 'text-base max-w-lg',
      button: 'lg' as const,
    },
  }

  const config = sizeConfig[size]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center',
        variant === 'default' && 'bg-card rounded-lg border-2 border-dashed',
        config.container,
        className
      )}
    >
      {/* Icon/Illustration */}
      {Icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.1 
          }}
          className="relative mb-6"
        >
          {variant === 'default' && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
          )}
          <div 
            className={cn(
              'relative rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center',
              config.iconWrapper
            )}
          >
            <Icon 
              className={cn(
                'text-primary',
                config.icon,
                iconClassName
              )} 
              strokeWidth={1.5}
            />
          </div>
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h3 className={cn(
          'font-semibold mb-2',
          config.title
        )}>
          {title}
        </h3>
        <p className={cn(
          'text-muted-foreground text-center mb-6',
          config.description
        )}>
          {description}
        </p>
      </motion.div>

      {/* Action Button */}
      {finalOnClick && finalCtaLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={finalOnClick} 
            size={config.button}
            variant="default"
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {finalCtaLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}


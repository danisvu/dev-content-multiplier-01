import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-600 text-white hover:bg-green-600/80 dark:bg-green-700",
        warning:
          "border-transparent bg-yellow-600 text-white hover:bg-yellow-600/80 dark:bg-yellow-700",
        info:
          "border-transparent bg-blue-600 text-white hover:bg-blue-600/80 dark:bg-blue-700",
        // Status-specific variants
        draft:
          "border-transparent bg-slate-500 text-white hover:bg-slate-500/80 dark:bg-slate-600",
        review:
          "border-transparent bg-orange-500 text-white hover:bg-orange-500/80 dark:bg-orange-600",
        approved:
          "border-transparent bg-blue-600 text-white hover:bg-blue-600/80 dark:bg-blue-700",
        published:
          "border-transparent bg-green-600 text-white hover:bg-green-600/80 dark:bg-green-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

// Helper component for status badges
export type ContentStatus = "draft" | "review" | "approved" | "published"

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: ContentStatus
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const statusConfig: Record<ContentStatus, { label: string; icon: string }> = {
    draft: { label: 'Draft', icon: '📝' },
    review: { label: 'Review', icon: '👀' },
    approved: { label: 'Approved', icon: '✅' },
    published: { label: 'Published', icon: '🚀' },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={status} className={className} {...props}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  )
}


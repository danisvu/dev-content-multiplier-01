'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean | 'indeterminate'
  onCheckedChange?: (checked: boolean | 'indeterminate') => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const isChecked = checked === true
    const isIndeterminate = checked === 'indeterminate'

    return (
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          checked={isChecked}
          onChange={(e) => {
            onCheckedChange?.(e.target.checked)
            onChange?.(e)
          }}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            'relative h-4 w-4 rounded border-2 flex items-center justify-center transition-colors',
            isChecked || isIndeterminate
              ? 'bg-primary border-primary'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 hover:border-primary'
          )}
        >
          {(isChecked || isIndeterminate) && (
            <Check className="h-3 w-3 text-primary-foreground" />
          )}
        </div>
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }

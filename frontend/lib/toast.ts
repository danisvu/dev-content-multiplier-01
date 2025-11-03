import { toast as sonnerToast } from 'sonner'

interface ToastOptions {
  title: string
  description?: string
  variant?: 'success' | 'error' | 'info'
  duration?: number
}

export function toast({ title, description, variant = 'info', duration = 3000 }: ToastOptions) {
  const options = {
    description,
    duration,
  }

  switch (variant) {
    case 'success':
      return sonnerToast.success(title, options)
    case 'error':
      return sonnerToast.error(title, options)
    case 'info':
    default:
      return sonnerToast.info(title, options)
  }
}

// Export individual functions for convenience
export const toastSuccess = (title: string, description?: string, duration?: number) =>
  toast({ title, description, variant: 'success', duration })

export const toastError = (title: string, description?: string, duration?: number) =>
  toast({ title, description, variant: 'error', duration })

export const toastInfo = (title: string, description?: string, duration?: number) =>
  toast({ title, description, variant: 'info', duration })

// Re-export sonner's toast for advanced usage
export { toast as sonnerToast } from 'sonner'


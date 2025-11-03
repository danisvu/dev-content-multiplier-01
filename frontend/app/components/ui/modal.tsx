'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'
import { Button } from './button'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  variant?: 'default' | 'destructive'
  isLoading?: boolean
  icon?: React.ReactNode
  showCancel?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  onConfirm,
  onCancel,
  variant = 'default',
  isLoading = false,
  icon,
  showCancel = true,
}: ModalProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onClose()
    }
  }

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm()
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          {icon && (
            <div className={cn(
              "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full",
              variant === 'destructive' 
                ? "bg-destructive/10 text-destructive" 
                : "bg-primary/10 text-primary"
            )}>
              {icon}
            </div>
          )}
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          {showCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
          )}
          {onConfirm && (
            <Button
              type="button"
              variant={variant === 'destructive' ? 'destructive' : 'default'}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : confirmLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Confirm Dialog Variant
export interface ConfirmDialogProps extends Omit<ModalProps, 'icon' | 'variant'> {
  variant?: 'default' | 'destructive'
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <Modal
      {...props}
      icon={
        <AlertCircle className={cn(
          "h-6 w-6",
          props.variant === 'destructive' ? "text-destructive" : "text-primary"
        )} />
      }
    />
  )
}

// Delete Confirmation Dialog
export interface DeleteDialogProps extends Omit<ModalProps, 'variant' | 'icon' | 'confirmLabel'> {
  itemName?: string
}

export function DeleteDialog({ itemName, description, ...props }: DeleteDialogProps) {
  return (
    <ConfirmDialog
      {...props}
      variant="destructive"
      confirmLabel="Xóa"
      description={description || `Bạn có chắc chắn muốn xóa ${itemName ? `"${itemName}"` : 'item này'} không? Hành động này không thể hoàn tác.`}
    />
  )
}


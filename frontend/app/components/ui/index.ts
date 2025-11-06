// UI Components - Export tập trung để dễ import
// Usage: import { Button, Card, Badge } from '@/components/ui'

// Core UI Components
export { Button, type ButtonProps, buttonVariants } from './button'
export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from './card'
export { 
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog'
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './dropdown-menu'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
export { Skeleton } from './skeleton'

// Badge Components
export { 
  Badge, 
  type BadgeProps, 
  badgeVariants,
  StatusBadge,
  type StatusBadgeProps,
  type ContentStatus
} from './badge'

// Custom Components
export { Toaster } from './toast'
export { 
  EmptyState, 
  type EmptyStateProps 
} from './empty-state'
export { 
  SkeletonList, 
  type SkeletonListProps 
} from './skeleton-list'
export { 
  ThemeToggle,
  type ThemeToggleProps
} from './theme-toggle'
export { 
  Modal,
  ConfirmDialog,
  DeleteDialog,
  type ModalProps,
  type ConfirmDialogProps,
  type DeleteDialogProps
} from './modal'

// New Components
export { Avatar, AvatarImage, AvatarFallback } from './avatar'
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './sheet'
export { Separator } from './separator'
export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider 
} from './tooltip'
export { ScrollArea, ScrollBar } from './scroll-area'

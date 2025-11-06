'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Lightbulb,
  FileText,
  Pen,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  badge?: number
}

const navItems: NavItem[] = [
  { href: '/ideas', label: 'Ý tưởng', icon: Lightbulb },
  { href: '/briefs', label: 'Briefs', icon: FileText },
  { href: '/drafts', label: 'Bản nháp', icon: Pen },
  { href: '/settings', label: 'Cài đặt', icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Sidebar content component (reusable for desktop and mobile)
  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Logo / Header */}
      <div className="p-6 border-b">
        <Link href="/" onClick={onItemClick}>
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Content AI</h2>
              <p className="text-xs text-muted-foreground">Multiplier v2.0</p>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href} onClick={onItemClick}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        <Button
                          variant={active ? 'secondary' : 'ghost'}
                          className={cn(
                            'w-full justify-start gap-3 h-12 transition-all duration-200 relative group',
                            active && 'bg-primary/10 text-primary font-semibold shadow-sm hover:bg-primary/15'
                          )}
                        >
                          {/* Active indicator */}
                          {active && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                          
                          <Icon className={cn(
                            'h-5 w-5 transition-colors',
                            active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                          )} />
                          
                          <span className="flex-1 text-left">{item.label}</span>
                          
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                              {item.badge}
                            </span>
                          )}

                          {!active && (
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </Button>
                      </motion.div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </nav>
      </ScrollArea>

      <Separator />

      {/* Footer */}
      <div className="p-3 space-y-2">
        {/* App version */}
        <div className="px-3 py-2 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Version</span>
            <span className="font-mono font-semibold">2.0.3</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>

        {/* Logout button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  // Handle logout logic
                  console.log('Logout clicked')
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Đăng xuất khỏi tài khoản
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar - Sticky */}
      <aside className={cn(
        'hidden lg:block sticky top-0 h-screen w-60',
        className
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile - Hamburger Menu */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-3 left-3 z-40 lg:hidden bg-background/80 backdrop-blur-sm shadow-md"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="p-0 w-60"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SidebarContent onItemClick={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

// Wrapper component for pages that use sidebar
interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-0">
        {children}
      </main>
    </div>
  )
}


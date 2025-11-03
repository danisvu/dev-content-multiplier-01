'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight,
  Home,
  Lightbulb,
  FileText,
  Settings,
  Package
} from 'lucide-react'
import { Button } from './ui/button'
import { ThemeToggle } from './ui/theme-toggle'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/ideas', label: 'Ý tưởng', icon: Lightbulb },
  { href: '/briefs', label: 'Briefs', icon: FileText },
  { href: '/packs', label: 'Packs', icon: Package },
  { href: '/settings', label: 'Cài đặt', icon: Settings },
]

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r transition-all duration-300 ease-in-out flex flex-col shadow-sm",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h1
            className={cn(
              "font-bold text-lg transition-opacity duration-300",
              isCollapsed ? "opacity-0 w-0" : "opacity-100"
            )}
          >
            Content Ideas
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start mb-1 transition-all duration-200",
                    isActive && "bg-accent text-accent-foreground",
                    isCollapsed ? "px-2" : "px-4"
                  )}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
                  <span
                    className={cn(
                      "transition-all duration-300 overflow-hidden whitespace-nowrap",
                      isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}
                  >
                    {item.label}
                  </span>
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-2 border-t space-y-2">
          {/* Theme Toggle */}
          <div className={cn("flex", isCollapsed ? "justify-center" : "justify-start px-2")}>
            <ThemeToggle />
            {!isCollapsed && (
              <span className="ml-2 text-sm text-muted-foreground flex items-center">
                Giao diện
              </span>
            )}
          </div>
          
          {/* Collapse Button */}
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 transition-transform duration-300" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 mr-2 transition-transform duration-300" />
                <span className="transition-opacity duration-300">Thu gọn</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  )
}


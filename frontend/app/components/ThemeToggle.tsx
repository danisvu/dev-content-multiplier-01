'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { Button } from './ui/button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative"
      title={theme === 'light' ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
    >
      {/* Sun Icon - hiển thị khi light mode */}
      <Sun
        className={`h-5 w-5 transition-all ${
          theme === 'light'
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0 absolute'
        }`}
      />
      
      {/* Moon Icon - hiển thị khi dark mode */}
      <Moon
        className={`h-5 w-5 transition-all ${
          theme === 'dark'
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0 absolute'
        }`}
      />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}


'use client'

import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

interface SuccessConfettiProps {
  show: boolean
  onComplete?: () => void
  duration?: number
}

export function SuccessConfetti({ 
  show, 
  onComplete, 
  duration = 3000 
}: SuccessConfettiProps) {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })
  const [isActive, setIsActive] = useState(false)

  // Get window size
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateSize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      updateSize()
      window.addEventListener('resize', updateSize)

      return () => window.removeEventListener('resize', updateSize)
    }
  }, [])

  // Handle show/hide with timer
  useEffect(() => {
    if (show) {
      setIsActive(true)

      // Auto cleanup after duration
      const timer = setTimeout(() => {
        setIsActive(false)
        onComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    } else {
      setIsActive(false)
    }
  }, [show, duration, onComplete])

  if (!isActive || windowSize.width === 0) {
    return null
  }

  return (
    <Confetti
      width={windowSize.width}
      height={windowSize.height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.3}
      colors={[
        '#3b82f6', // blue
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#10b981', // green
        '#f59e0b', // amber
        '#ef4444', // red
      ]}
    />
  )
}


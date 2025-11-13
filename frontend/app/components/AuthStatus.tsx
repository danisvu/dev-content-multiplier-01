'use client'

import React from 'react'
import { Check, X, Lock } from 'lucide-react'
import { Badge } from './ui/badge'

export type Platform = 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'mailchimp' | 'wordpress'

export interface AuthStatusProps {
  platform: Platform
  isAuthenticated: boolean
  userName?: string
  lastConnected?: Date
  onConnect?: () => void
  onDisconnect?: () => void
  onTestApi?: () => void
  className?: string
}

export function AuthStatus({
  platform,
  isAuthenticated,
  userName,
  lastConnected,
  onConnect,
  onDisconnect,
  onTestApi,
  className = '',
}: AuthStatusProps) {
  const getPlatformColor = (platform: Platform) => {
    const colors: Record<Platform, string> = {
      twitter: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      linkedin: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      facebook: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      instagram: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      tiktok: 'bg-black text-white dark:bg-gray-900 dark:text-white',
      mailchimp: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      wordpress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    }
    return colors[platform]
  }

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${className}`}>
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Connected to {platform}
              </span>
              {userName && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Account: {userName}
                </span>
              )}
              {lastConnected && (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  Connected at {lastConnected.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-400" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Not connected
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Click to connect your {platform} account
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {isAuthenticated ? (
          <>
            <Badge className={getPlatformColor(platform)}>Connected</Badge>
            {onTestApi && (
              <button
                onClick={onTestApi}
                className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 rounded transition-colors"
                title="Test API connection"
              >
                🧪 Test
              </button>
            )}
            {onDisconnect && (
              <button
                onClick={onDisconnect}
                className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <>
            <Badge variant="outline">Disconnected</Badge>
            {onConnect && (
              <button
                onClick={onConnect}
                className="px-4 py-1 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors"
              >
                Connect
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

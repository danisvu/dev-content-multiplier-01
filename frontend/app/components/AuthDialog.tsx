'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { toast } from 'sonner'
import type { Platform } from './AuthStatus'

export interface AuthDialogProps {
  platform: Platform
  isOpen: boolean
  onClose: () => void
  onConnect: (credentials: { username?: string; password?: string; token?: string }) => void
}

const PLATFORM_AUTH_TYPES: Record<Platform, 'oauth' | 'credentials' | 'token'> = {
  twitter: 'oauth',
  linkedin: 'oauth',
  facebook: 'oauth',
  instagram: 'oauth',
  tiktok: 'oauth',
  mailchimp: 'token',
  wordpress: 'credentials',
}

const PLATFORM_DESCRIPTIONS: Record<Platform, string> = {
  twitter: 'Connect via Twitter OAuth 2.0',
  linkedin: 'Connect via LinkedIn OAuth 2.0',
  facebook: 'Connect via Facebook OAuth 2.0',
  instagram: 'Connect via Instagram OAuth 2.0',
  tiktok: 'Connect via TikTok OAuth 2.0',
  mailchimp: 'Enter your Mailchimp API Key',
  wordpress: 'Enter your WordPress site credentials',
}

export function AuthDialog({ platform, isOpen, onClose, onConnect }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')

  const authType = PLATFORM_AUTH_TYPES[platform]

  const handleConnect = async () => {
    try {
      setIsLoading(true)

      // Validate input
      if (authType === 'credentials') {
        if (!username || !password) {
          toast.error('Please enter both username and password')
          return
        }
      } else if (authType === 'token') {
        if (!token) {
          toast.error(`Please enter your ${platform} API key`)
          return
        }
        // Validate token is not empty
        const trimmedToken = token.trim()
        if (trimmedToken.length === 0) {
          toast.error(`API key cannot be empty`)
          return
        }
        // Validate format for Mailchimp (should contain hyphen for server prefix)
        if (platform === 'mailchimp' && !trimmedToken.includes('-')) {
          toast.error(`Invalid Mailchimp API key format. Expected format: key-serverprefix (e.g., abc123def456-us1)`)
          return
        }
        // Reject placeholder-like values
        if (trimmedToken.toLowerCase().includes('refresh') ||
            trimmedToken.toLowerCase().includes('should persist') ||
            trimmedToken.toLowerCase().includes('enter your')) {
          toast.error(`Please enter your actual ${platform} API key, not a placeholder`)
          return
        }
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const credentials = {
        username: authType === 'credentials' ? username : undefined,
        password: authType === 'credentials' ? password : undefined,
        token: authType === 'token' ? token.trim() : undefined,
      }

      console.log('🔑 AuthDialog - Raw token value:', token)
      console.log('🔑 AuthDialog - Token length:', token?.length)
      console.log('🔑 AuthDialog - Trimmed token:', token?.trim())
      console.log('🔑 AuthDialog - Trimmed length:', token?.trim().length)
      console.log('📤 AuthDialog sending credentials:', credentials)
      onConnect(credentials)

      // Reset form
      setUsername('')
      setPassword('')
      setToken('')
      onClose()
    } catch (error) {
      toast.error(`Failed to connect to ${platform}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuth = () => {
    // Mock OAuth flow
    toast.info(`Redirecting to ${platform} OAuth... (Demo mode)`)
    setTimeout(() => {
      const mockToken = `${platform}_token_${Date.now()}`
      console.log('📤 AuthDialog sending OAuth token:', { token: mockToken })
      onConnect({ token: mockToken })
      onClose()
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="capitalize">Connect to {platform}</DialogTitle>
          <DialogDescription>{PLATFORM_DESCRIPTIONS[platform]}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {authType === 'oauth' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You'll be redirected to {platform} to authorize your account.
              </p>
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-xs text-blue-700 dark:text-blue-300">
                  🔐 Your credentials are secure and handled by {platform}
                </span>
              </div>
            </div>
          )}

          {authType === 'token' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="token">API Key</Label>
                <Input
                  id="token"
                  placeholder={`Enter your ${platform} API key`}
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={isLoading}
                  className="mt-2"
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Find your API key in your {platform} account settings under "API Keys" or "Integrations".
              </p>
            </div>
          )}

          {authType === 'credentials' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  placeholder="Enter your username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="mt-2"
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your password is never stored. It's only used to generate an API token.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={authType === 'oauth' ? handleOAuth : handleConnect} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

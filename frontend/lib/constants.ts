// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// App Configuration
export const APP_NAME = 'Content AI Multiplier'
export const APP_DESCRIPTION = 'Generate and manage content ideas with AI'

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  USER_PREFERENCES: 'user_preferences',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  IDEAS: '/ideas',
  BRIEFS: '/briefs',
  PACKS: '/packs',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const


'use client'

import React, { useMemo } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'
import { motion } from 'framer-motion'

export interface FunnelStage {
  name: string
  value: number
  color: string
  icon?: React.ReactNode
}

export interface AnalyticsDashboardProps {
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok'
  metrics?: {
    views?: number
    engagement?: number
    clicks?: number
    conversions?: number
    shareRate?: number
    engagementRate?: number
  }
  className?: string
}

const PLATFORM_FUNNEL_DATA: Record<string, FunnelStage[]> = {
  twitter: [
    { name: 'Views', value: 5000, color: 'from-blue-500 to-blue-600' },
    { name: 'Engagement', value: 850, color: 'from-blue-400 to-cyan-500' },
    { name: 'Retweets', value: 240, color: 'from-cyan-400 to-teal-500' },
    { name: 'Followers', value: 45, color: 'from-teal-400 to-green-500' },
  ],
  linkedin: [
    { name: 'Views', value: 3200, color: 'from-indigo-500 to-indigo-600' },
    { name: 'Engagement', value: 680, color: 'from-indigo-400 to-blue-500' },
    { name: 'Comments', value: 195, color: 'from-blue-400 to-cyan-500' },
    { name: 'Shares', value: 52, color: 'from-cyan-400 to-teal-500' },
  ],
  facebook: [
    { name: 'Impressions', value: 8500, color: 'from-blue-600 to-blue-700' },
    { name: 'Engagement', value: 1620, color: 'from-blue-500 to-indigo-500' },
    { name: 'Reactions', value: 385, color: 'from-indigo-400 to-purple-500' },
    { name: 'Shares', value: 78, color: 'from-purple-400 to-pink-500' },
  ],
  instagram: [
    { name: 'Reaches', value: 12000, color: 'from-pink-500 to-rose-500' },
    { name: 'Engagement', value: 2400, color: 'from-rose-400 to-orange-500' },
    { name: 'Saves', value: 680, color: 'from-orange-400 to-amber-500' },
    { name: 'Clicks', value: 156, color: 'from-amber-400 to-yellow-500' },
  ],
  tiktok: [
    { name: 'Views', value: 25000, color: 'from-black to-gray-800' },
    { name: 'Engagement', value: 6200, color: 'from-gray-700 to-red-600' },
    { name: 'Favorites', value: 1840, color: 'from-red-500 to-pink-500' },
    { name: 'Shares', value: 425, color: 'from-pink-500 to-purple-500' },
  ],
}

export function AnalyticsDashboard({ platform, metrics, className = '' }: AnalyticsDashboardProps) {
  const funnelData = PLATFORM_FUNNEL_DATA[platform] || PLATFORM_FUNNEL_DATA.twitter

  const maxValue = funnelData[0]?.value || 1
  const percentages = funnelData.map((stage) => (stage.value / maxValue) * 100)

  const conversionRates = funnelData.map((stage, index) => {
    if (index === 0) return 100
    const previousValue = funnelData[index - 1]?.value || 1
    return ((stage.value / previousValue) * 100).toFixed(1)
  })

  return (
    <div className={className}>
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Performance Funnel</CardTitle>
              <CardDescription>
                Conversion rates and engagement pipeline for {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">+24.5%</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-6">
            {funnelData.map((stage, index) => {
              const percentage = percentages[index]
              const conversionRate = conversionRates[index]
              const isLast = index === funnelData.length - 1

              return (
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-foreground">{stage.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {stage.value.toLocaleString()} • {percentage.toFixed(0)}% of top
                      </p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <div className="text-lg font-bold text-foreground">{stage.value.toLocaleString()}</div>
                      {index > 0 && (
                        <div className="flex items-center justify-end gap-1 text-sm font-medium">
                          {conversionRate !== 'NaN' && (
                            <>
                              {parseFloat(conversionRate) >= 50 ? (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-600" />
                              )}
                              <span className={parseFloat(conversionRate) >= 50 ? 'text-green-600' : 'text-red-600'}>
                                {conversionRate}%
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                      className={`h-full rounded-lg bg-gradient-to-r ${stage.color} shadow-md flex items-center justify-between px-4 relative group`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                      {percentage > 15 && (
                        <div className="text-sm font-semibold text-white relative z-10">
                          {stage.value.toLocaleString()}
                        </div>
                      )}
                    </motion.div>

                    {percentage <= 15 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                        {percentage.toFixed(0)}%
                      </div>
                    )}
                  </div>

                  {!isLast && (
                    <div className="text-xs text-red-600 font-medium">
                      ↓ {(100 - parseFloat(conversionRate || '0')).toFixed(1)}% drop-off from previous stage
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Top Stage</p>
              <p className="text-lg font-bold">{funnelData[0]?.value.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Final Stage</p>
              <p className="text-lg font-bold">{funnelData[funnelData.length - 1]?.value.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Overall Conversion</p>
              <p className="text-lg font-bold">
                {((funnelData[funnelData.length - 1]?.value / funnelData[0]?.value) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Total Drop-off</p>
              <p className="text-lg font-bold">
                {(100 - (funnelData[funnelData.length - 1]?.value / funnelData[0]?.value) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

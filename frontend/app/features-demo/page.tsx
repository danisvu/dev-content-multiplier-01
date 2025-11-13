'use client';

import React, { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import {
  ExportOptions,
  SharePreviewLink,
  PlatformCostTracker,
} from '../components/ui';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui';

export default function FeaturesDemo() {
  const briefId = 1;
  const [activeTab, setActiveTab] = useState('export');

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Advanced Features Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore export, sharing, analytics, and cost tracking capabilities
            </p>
          </div>

          {/* Feature Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="export" className="flex items-center gap-2">
                <span>📤</span>
                <span className="hidden sm:inline">Export</span>
              </TabsTrigger>
              <TabsTrigger value="sharing" className="flex items-center gap-2">
                <span>🔗</span>
                <span className="hidden sm:inline">Sharing</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <span>📊</span>
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="costs" className="flex items-center gap-2">
                <span>💰</span>
                <span className="hidden sm:inline">Costs</span>
              </TabsTrigger>
            </TabsList>

            {/* Export Tab */}
            <TabsContent value="export" className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Export Options
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Export your derivatives in multiple formats for different use cases.
                  </p>
                </div>
                <ExportOptions briefId={briefId} />
              </div>

              {/* Export Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    📊 CSV Export
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Best for spreadsheet analysis, bulk operations, and data import/export.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    📅 ICS Export
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Import publishing schedule into Google Calendar, Outlook, or Apple Calendar.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    📦 JSON Export
                  </h3>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    Complete data export with metadata for integrations and backups.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Sharing Tab */}
            <TabsContent value="sharing" className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Share Preview Links
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create secure, shareable links for team review without requiring accounts.
                  </p>
                </div>
                <SharePreviewLink briefId={briefId} />
              </div>

              {/* Sharing Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    🔐 Security
                  </h3>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                    <li>• Password protection</li>
                    <li>• Expiration dates</li>
                    <li>• View limits</li>
                    <li>• Access tracking</li>
                  </ul>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                    📋 Permissions
                  </h3>
                  <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1">
                    <li>• Allow comments</li>
                    <li>• Allow downloads</li>
                    <li>• Preview type selection</li>
                    <li>• Revoke anytime</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Analytics Dashboard
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Track content through your publishing funnel with real-time metrics.
                  </p>
                </div>
                <AnalyticsDashboard platform="twitter" />
              </div>

              {/* Analytics Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4 border border-cyan-200 dark:border-cyan-800">
                  <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
                    📈 Funnel Tracking
                  </h3>
                  <ul className="text-sm text-cyan-800 dark:text-cyan-200 space-y-1">
                    <li>• Ideas → Briefs</li>
                    <li>• Briefs → Derivatives</li>
                    <li>• Derivatives → Published</li>
                    <li>• Conversion rates at each stage</li>
                  </ul>
                </div>

                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
                  <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">
                    🎯 Platform Performance
                  </h3>
                  <ul className="text-sm text-pink-800 dark:text-pink-200 space-y-1">
                    <li>• Per-platform metrics</li>
                    <li>• Engagement potential</li>
                    <li>• Character count analysis</li>
                    <li>• Trend visualization</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Costs Tab */}
            <TabsContent value="costs" className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Cost Tracking
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monitor API and LLM costs for each derivative and brief.
                  </p>
                </div>
                <PlatformCostTracker briefId={briefId} />
              </div>

              {/* Cost Tracking Info */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
                  💡 Cost Optimization Tips
                </h3>
                <ul className="text-sm text-emerald-800 dark:text-emerald-200 space-y-2">
                  <li>
                    <strong>Monitor by Platform:</strong> Identify which platforms have the highest
                    LLM costs
                  </li>
                  <li>
                    <strong>Track Token Usage:</strong> Use token metrics to optimize your prompts
                  </li>
                  <li>
                    <strong>Analyze Trends:</strong> Export cost reports to identify patterns over
                    time
                  </li>
                  <li>
                    <strong>Budget Planning:</strong> Use average costs per derivative for forecasting
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          {/* Integration Example */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Integration Tips
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  📤 When to Export
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>✓ Weekly content reviews</li>
                  <li>✓ Stakeholder reports</li>
                  <li>✓ Backup important content</li>
                  <li>✓ Integration with tools</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  🔗 When to Share
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>✓ Team collaboration</li>
                  <li>✓ Feedback collection</li>
                  <li>✓ Client reviews</li>
                  <li>✓ Approval workflows</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  📊 When to Analyze
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>✓ Performance reviews</li>
                  <li>✓ Strategy optimization</li>
                  <li>✓ Resource planning</li>
                  <li>✓ ROI calculation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Documentation Links */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              📚 <strong>Documentation:</strong> Check out the{' '}
              <a
                href="#"
                className="underline font-semibold hover:text-blue-800 dark:hover:text-blue-200"
              >
                Export & Analytics Guide
              </a>{' '}
              for detailed API documentation and advanced features.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

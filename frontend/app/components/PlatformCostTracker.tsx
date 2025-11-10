'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Zap,
  BarChart3,
  Download,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

export interface PlatformCostTrackerProps {
  briefId: number;
  className?: string;
}

interface DerivativeCost {
  derivative_id: number;
  platform: string;
  total_cost: number;
  cost_breakdown: {
    llm: number;
    api: number;
    other: number;
  };
  tokens_used: number;
  created_at: string;
}

interface CostSummary {
  briefId: number;
  total_cost: number;
  llm_cost: number;
  api_cost: number;
  derivative_count: number;
  average_cost_per_derivative: number;
  last_updated: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  twitter: 'bg-blue-50 border-blue-200',
  linkedin: 'bg-indigo-50 border-indigo-200',
  facebook: 'bg-purple-50 border-purple-200',
  instagram: 'bg-pink-50 border-pink-200',
  tiktok: 'bg-red-50 border-red-200',
};

const PLATFORM_TEXT_COLORS: Record<string, string> = {
  twitter: 'text-blue-700',
  linkedin: 'text-indigo-700',
  facebook: 'text-purple-700',
  instagram: 'text-pink-700',
  tiktok: 'text-red-700',
};

export function PlatformCostTracker({
  briefId,
  className = '',
}: PlatformCostTrackerProps) {
  const [costs, setCosts] = useState<DerivativeCost[]>([]);
  const [summary, setSummary] = useState<CostSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCosts();
  }, [briefId]);

  const loadCosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/costs/brief/${briefId}`);

      if (!response.ok) {
        throw new Error('Failed to load costs');
      }

      const data = await response.json();
      setCosts(data.derivatives || []);
      setSummary(data.summary);
    } catch (error) {
      console.error('Failed to load costs:', error);
      setError('Failed to load cost data');
      toast.error('Failed to load cost information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCosts = async () => {
    try {
      const response = await fetch(
        `/api/costs/export/${briefId}/csv`
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `costs-${briefId}-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Costs exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export costs');
    }
  };

  const costByPlatform = costs.reduce(
    (acc, cost) => {
      if (!acc[cost.platform]) {
        acc[cost.platform] = 0;
      }
      acc[cost.platform] += cost.total_cost;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortedPlatforms = Object.entries(costByPlatform).sort(
    (a, b) => b[1] - a[1]
  );

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 text-red-600 ${className}`}>
        <p>{error}</p>
        <button
          onClick={loadCosts}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Cost Tracking</h3>
        </div>
        <button
          onClick={loadCosts}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Refresh costs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Cost */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Cost
              </span>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              ${summary.total_cost.toFixed(4)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {summary.derivative_count} derivatives
            </p>
          </div>

          {/* LLM Cost */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                LLM Cost
              </span>
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              ${summary.llm_cost.toFixed(4)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {((summary.llm_cost / summary.total_cost) * 100).toFixed(0)}% of total
            </p>
          </div>

          {/* API Cost */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                API Cost
              </span>
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              ${summary.api_cost.toFixed(4)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {((summary.api_cost / summary.total_cost) * 100).toFixed(0)}% of total
            </p>
          </div>

          {/* Average Cost */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Avg per Derivative
              </span>
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              ${summary.average_cost_per_derivative.toFixed(4)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Per platform variant
            </p>
          </div>
        </div>
      )}

      {/* Platform Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Cost by Platform
        </h4>

        {sortedPlatforms.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No cost data available yet. Generate derivatives to track costs.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedPlatforms.map(([platform, cost]) => {
              const count = costs.filter((c) => c.platform === platform).length;
              const avgCost = cost / count;
              const percentage = summary
                ? (cost / summary.total_cost) * 100
                : 0;

              return (
                <div key={platform} className={`rounded-lg p-3 border-2 ${PLATFORM_COLORS[platform] || 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold capitalize ${PLATFORM_TEXT_COLORS[platform] || 'text-gray-700'}`}>
                        {platform}
                      </span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {count} items
                      </span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      ${cost.toFixed(4)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className={`h-full ${
                        platform === 'twitter'
                          ? 'bg-blue-500'
                          : platform === 'linkedin'
                            ? 'bg-indigo-500'
                            : platform === 'facebook'
                              ? 'bg-purple-500'
                              : platform === 'instagram'
                                ? 'bg-pink-500'
                                : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>${avgCost.toFixed(4)} avg</span>
                    <span>{percentage.toFixed(1)}% of total</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Breakdown */}
      {costs.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Detailed Cost Breakdown
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 font-semibold text-gray-900 dark:text-gray-100">
                    Platform
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-900 dark:text-gray-100">
                    Total Cost
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-900 dark:text-gray-100">
                    LLM
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-900 dark:text-gray-100">
                    API
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-900 dark:text-gray-100">
                    Tokens
                  </th>
                </tr>
              </thead>
              <tbody>
                {costs.map((cost) => (
                  <tr
                    key={cost.derivative_id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-2 px-3 text-gray-900 dark:text-gray-100">
                      <span className="capitalize font-medium">{cost.platform}</span>
                    </td>
                    <td className="text-right py-2 px-3 text-gray-900 dark:text-gray-100 font-semibold">
                      ${cost.total_cost.toFixed(4)}
                    </td>
                    <td className="text-right py-2 px-3 text-blue-600 dark:text-blue-400">
                      ${cost.cost_breakdown.llm.toFixed(4)}
                    </td>
                    <td className="text-right py-2 px-3 text-purple-600 dark:text-purple-400">
                      ${cost.cost_breakdown.api.toFixed(4)}
                    </td>
                    <td className="text-right py-2 px-3 text-gray-600 dark:text-gray-400">
                      {cost.tokens_used || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={handleExportCosts}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        <Download className="w-4 h-4" />
        Export Cost Report
      </button>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          Costs are automatically tracked when derivatives are generated using
          AI APIs. This includes LLM (large language model) tokens and additional
          API calls. Costs are updated in real-time as derivatives are created.
        </p>
      </div>
    </div>
  );
}

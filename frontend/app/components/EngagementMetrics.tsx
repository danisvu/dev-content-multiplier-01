'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from './ui';
import { toast } from 'sonner';
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp,
  Loader2,
  Zap
} from 'lucide-react';

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagement_rate: number;
  projected_reach: number;
}

export interface EngagementPrediction {
  conservative: EngagementMetrics;
  moderate: EngagementMetrics;
  optimistic: EngagementMetrics;
  factors: any;
}

interface EngagementMetricsProps {
  content: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok';
  tone?: string;
  hashtags?: string[];
  mentions?: string[];
  variant?: 'conservative' | 'moderate' | 'optimistic';
  compact?: boolean;
  className?: string;
}

const PLATFORM_COLORS: Record<string, { bg: string; text: string }> = {
  twitter: { bg: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300' },
  linkedin: { bg: 'bg-cyan-50 dark:bg-cyan-950', text: 'text-cyan-700 dark:text-cyan-300' },
  facebook: { bg: 'bg-indigo-50 dark:bg-indigo-950', text: 'text-indigo-700 dark:text-indigo-300' },
  instagram: { bg: 'bg-pink-50 dark:bg-pink-950', text: 'text-pink-700 dark:text-pink-300' },
  tiktok: { bg: 'bg-purple-50 dark:bg-purple-950', text: 'text-purple-700 dark:text-purple-300' }
};

const METRIC_ICONS = {
  likes: Heart,
  comments: MessageCircle,
  shares: Share2,
  views: Eye,
  projected_reach: TrendingUp
};

export const EngagementMetrics: React.FC<EngagementMetricsProps> = ({
  content,
  platform,
  tone,
  hashtags = [],
  mentions = [],
  variant = 'moderate',
  compact = false,
  className = ''
}) => {
  const [prediction, setPrediction] = useState<EngagementPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<'conservative' | 'moderate' | 'optimistic'>(variant);
  const [contentScore, setContentScore] = useState<number | null>(null);

  useEffect(() => {
    if (content && platform) {
      simulateEngagement();
    }
  }, [content, platform, tone, hashtags, mentions]);

  const simulateEngagement = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/engagement/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platform,
          tone,
          hashtags,
          mentions
        })
      });

      if (!response.ok) throw new Error('Failed to simulate engagement');
      const data = await response.json();
      setPrediction(data);

      // Get content score
      const scoreResponse = await fetch('/api/engagement/content-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platform,
          tone,
          hashtags,
          mentions
        })
      });

      if (scoreResponse.ok) {
        const scoreData = await scoreResponse.json();
        setContentScore(scoreData.content_score);
      }
    } catch (error) {
      console.error('Error simulating engagement:', error);
      toast.error('Failed to simulate engagement');
    } finally {
      setIsLoading(false);
    }
  };

  if (!prediction) {
    return null;
  }

  const metrics = prediction[selectedVariant];
  const colorScheme = PLATFORM_COLORS[platform];

  const metricsList = [
    { key: 'likes', label: 'Likes', value: metrics.likes, icon: Heart, color: 'text-red-500' },
    { key: 'comments', label: 'Comments', value: metrics.comments, icon: MessageCircle, color: 'text-blue-500' },
    { key: 'shares', label: 'Shares', value: metrics.shares, icon: Share2, color: 'text-green-500' },
    { key: 'views', label: 'Views', value: metrics.views, icon: Eye, color: 'text-gray-500' }
  ];

  if (compact) {
    return (
      <div className={`flex items-center gap-4 p-3 ${colorScheme.bg} rounded-lg ${className}`}>
        {metricsList.slice(0, 3).map(({ key, icon: Icon, color, value }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5"
          >
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-sm font-semibold">{value.toLocaleString()}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Engagement Prediction
            </CardTitle>
            <CardDescription>
              Simulated metrics for {platform}
              {contentScore !== null && (
                <span className="ml-2 inline-block">
                  • Content Score:{' '}
                  <span className={`font-bold ${contentScore >= 80 ? 'text-green-600' : contentScore >= 60 ? 'text-blue-600' : 'text-yellow-600'}`}>
                    {contentScore.toFixed(0)}/100
                  </span>
                </span>
              )}
            </CardDescription>
          </div>
          <Button
            onClick={simulateEngagement}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Variant selector */}
        <div className="flex gap-2">
          {(['conservative', 'moderate', 'optimistic'] as const).map(v => (
            <Button
              key={v}
              onClick={() => setSelectedVariant(v)}
              variant={selectedVariant === v ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>

        {/* Engagement metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metricsList.map(({ key, label, value, icon: Icon, color }) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg p-4 text-center ${colorScheme.bg}`}
            >
              <div className="flex justify-center mb-2">
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className="text-2xl font-bold">{value.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Additional metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
            <p className="text-3xl font-bold">{metrics.engagement_rate.toFixed(2)}%</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Projected Reach</p>
            <p className="text-3xl font-bold">{(metrics.projected_reach / 1000).toFixed(1)}K</p>
          </div>
        </div>

        {/* Analysis factors */}
        <div className="pt-4 border-t space-y-3">
          <p className="text-sm font-semibold">Analysis Factors</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {prediction.factors.content_length === 'short' ? '📝 Short' : prediction.factors.content_length === 'medium' ? '📄 Medium' : '📖 Long'}
            </Badge>
            {prediction.factors.hashtag_count > 0 && (
              <Badge variant="outline" className="text-xs">
                #{prediction.factors.hashtag_count} Hashtags
              </Badge>
            )}
            {prediction.factors.mention_count > 0 && (
              <Badge variant="outline" className="text-xs">
                @{prediction.factors.mention_count} Mentions
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              🕐 {prediction.factors.time_of_day}
            </Badge>
            <Badge variant="outline" className="text-xs">
              📅 {prediction.factors.day_of_week}
            </Badge>
          </div>
        </div>

        {/* Sentiment indicator */}
        <div className="pt-4 border-t space-y-2">
          <p className="text-sm font-semibold">Sentiment Score</p>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${prediction.factors.sentiment_score * 100}%` }}
              transition={{ duration: 0.5 }}
              className={`h-2 rounded-full ${
                prediction.factors.sentiment_score > 0.6
                  ? 'bg-green-500'
                  : prediction.factors.sentiment_score > 0.4
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {prediction.factors.sentiment_score > 0.6
              ? 'Positive sentiment detected'
              : prediction.factors.sentiment_score > 0.4
              ? 'Neutral sentiment'
              : 'Could be more positive'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementMetrics;

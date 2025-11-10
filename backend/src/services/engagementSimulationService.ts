import { query } from '../database';

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
  factors: EngagementFactors;
}

export interface EngagementFactors {
  content_length: 'short' | 'medium' | 'long';
  hashtag_count: number;
  mention_count: number;
  sentiment_score: number;
  keyword_relevance: number;
  time_of_day: string;
  day_of_week: string;
  platform: string;
}

export interface SimulationRequest {
  content: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok';
  tone?: string;
  hashtags?: string[];
  mentions?: string[];
  timestamp?: Date;
}

export class EngagementSimulationService {
  /**
   * Calculate engagement metrics based on content characteristics
   */
  async simulateEngagement(request: SimulationRequest): Promise<EngagementPrediction> {
    const factors = this.analyzeContent(request);
    const baseMetrics = this.calculateBaseMetrics(factors);

    return {
      conservative: this.applyVariance(baseMetrics, 0.6),
      moderate: baseMetrics,
      optimistic: this.applyVariance(baseMetrics, 1.4),
      factors
    };
  }

  /**
   * Analyze content characteristics
   */
  private analyzeContent(request: SimulationRequest): EngagementFactors {
    const { content, platform, tone, hashtags = [], mentions = [], timestamp = new Date() } = request;

    // Content length analysis
    const contentLength = content.length;
    let length_category: 'short' | 'medium' | 'long';
    if (contentLength < 100) {
      length_category = 'short';
    } else if (contentLength < 300) {
      length_category = 'medium';
    } else {
      length_category = 'long';
    }

    // Sentiment analysis (simple scoring)
    const sentimentScore = this.calculateSentimentScore(content, tone);

    // Keyword relevance
    const keywordRelevance = this.calculateKeywordRelevance(content, platform);

    // Time analysis
    const timeOfDay = this.getTimeOfDay(timestamp);
    const dayOfWeek = this.getDayOfWeek(timestamp);

    return {
      content_length: length_category,
      hashtag_count: hashtags.length,
      mention_count: mentions.length,
      sentiment_score: sentimentScore,
      keyword_relevance: keywordRelevance,
      time_of_day: timeOfDay,
      day_of_week: dayOfWeek,
      platform
    };
  }

  /**
   * Calculate sentiment score (0-1)
   */
  private calculateSentimentScore(content: string, tone?: string): number {
    let score = 0.5; // Neutral base

    // Positive indicators
    const positiveWords = ['great', 'awesome', 'love', 'excellent', 'amazing', 'wonderful', 'fantastic', 'best'];
    const negativeWords = ['hate', 'awful', 'bad', 'terrible', 'poor', 'worst', 'horrible'];

    const lowerContent = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;

    score += (positiveCount * 0.1) - (negativeCount * 0.1);

    // Tone adjustment
    if (tone) {
      const toneLower = tone.toLowerCase();
      if (toneLower.includes('positive') || toneLower.includes('optimistic')) {
        score += 0.15;
      } else if (toneLower.includes('negative') || toneLower.includes('critical')) {
        score -= 0.15;
      }
    }

    // Emoji influence
    const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}]/gu) || []).length;
    score += Math.min(emojiCount * 0.05, 0.2);

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Calculate keyword relevance (0-1)
   */
  private calculateKeywordRelevance(content: string, platform: string): number {
    let relevance = 0.5; // Base relevance

    const platformKeywords: Record<string, string[]> = {
      twitter: ['trending', 'viral', 'breaking', 'news', 'thread', 'thread1', '#'],
      linkedin: ['professional', 'career', 'growth', 'insights', 'thinking', 'opportunity'],
      facebook: ['family', 'friends', 'community', 'event', 'update', 'story'],
      instagram: ['aesthetic', 'lifestyle', 'creative', 'visual', 'moment', 'day'],
      tiktok: ['trend', 'challenge', 'viral', 'funny', 'entertaining', 'shortform']
    };

    const keywords = platformKeywords[platform] || [];
    const lowerContent = content.toLowerCase();

    const matchCount = keywords.filter(keyword => lowerContent.includes(keyword)).length;
    relevance += (matchCount * 0.1);

    return Math.max(0, Math.min(1, relevance));
  }

  /**
   * Get time of day category
   */
  private getTimeOfDay(timestamp: Date): string {
    const hour = timestamp.getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 21) return 'evening';
    return 'night';
  }

  /**
   * Get day of week
   */
  private getDayOfWeek(timestamp: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[timestamp.getDay()];
  }

  /**
   * Calculate base engagement metrics
   */
  private calculateBaseMetrics(factors: EngagementFactors): EngagementMetrics {
    // Platform base metrics (average expected engagement)
    const platformMetrics: Record<string, { likes: number; comments: number; shares: number; views: number }> = {
      twitter: { likes: 45, comments: 12, shares: 8, views: 2500 },
      linkedin: { likes: 85, comments: 18, shares: 15, views: 4200 },
      facebook: { likes: 120, comments: 25, shares: 20, views: 6500 },
      instagram: { likes: 250, comments: 35, shares: 5, views: 8500 },
      tiktok: { likes: 500, comments: 75, shares: 120, views: 15000 }
    };

    const base = platformMetrics[factors.platform] || platformMetrics.twitter;

    // Sentiment multiplier (0.7 to 1.3)
    const sentimentMultiplier = 0.7 + (factors.sentiment_score * 0.6);

    // Hashtag boost (each hashtag adds 5% engagement)
    const hashtagBoost = 1 + (factors.hashtag_count * 0.05);

    // Mention boost (each mention adds 3% engagement)
    const mentionBoost = 1 + (factors.mention_count * 0.03);

    // Content length factor
    const lengthFactor = factors.content_length === 'short' ? 0.8 : factors.content_length === 'medium' ? 1.0 : 0.95;

    // Time of day multiplier (best: evening/morning, worst: night)
    const timeMultiplier = {
      morning: 1.1,
      afternoon: 0.9,
      evening: 1.2,
      night: 0.7
    }[factors.time_of_day] || 1.0;

    // Day of week multiplier (weekends typically have more engagement)
    const dayMultiplier = ['Saturday', 'Sunday'].includes(factors.day_of_week) ? 1.15 : 1.0;

    // Calculate final metrics
    const multiplier = sentimentMultiplier * hashtagBoost * mentionBoost * lengthFactor * timeMultiplier * dayMultiplier;

    const likes = Math.round(base.likes * multiplier);
    const comments = Math.round(base.comments * multiplier);
    const shares = Math.round(base.shares * multiplier);
    const views = Math.round(base.views * multiplier);

    const engagement_rate = ((likes + comments + shares) / views) * 100;

    return {
      likes,
      comments,
      shares,
      views,
      engagement_rate: Math.round(engagement_rate * 100) / 100,
      projected_reach: Math.round(views * (1 + engagement_rate / 100))
    };
  }

  /**
   * Apply variance to metrics for conservative/optimistic scenarios
   */
  private applyVariance(metrics: EngagementMetrics, variance: number): EngagementMetrics {
    const factor = variance;
    return {
      likes: Math.round(metrics.likes * factor),
      comments: Math.round(metrics.comments * factor),
      shares: Math.round(metrics.shares * factor),
      views: Math.round(metrics.views * factor),
      engagement_rate: Math.round((metrics.engagement_rate * factor) * 100) / 100,
      projected_reach: Math.round(metrics.projected_reach * factor)
    };
  }

  /**
   * Get platform best posting times
   */
  getPlatformBestTimes(platform: string): Record<string, string> {
    const bestTimes: Record<string, Record<string, string>> = {
      twitter: {
        best: '9 AM - 3 PM (Weekdays)',
        worst: '11 PM - 6 AM',
        peak: 'Tuesday-Thursday'
      },
      linkedin: {
        best: '7 AM - 9 AM, 5 PM - 6 PM (Weekdays)',
        worst: 'Weekends, 12 AM - 6 AM',
        peak: 'Tuesday-Wednesday'
      },
      facebook: {
        best: '1 PM - 3 PM (Weekdays)',
        worst: 'Early morning',
        peak: 'Thursday'
      },
      instagram: {
        best: '11 AM - 1 PM, 7 PM - 9 PM',
        worst: 'Early morning',
        peak: 'Wednesday-Friday'
      },
      tiktok: {
        best: '6 AM - 10 AM, 7 PM - 11 PM',
        worst: 'Daytime',
        peak: 'Daily trends'
      }
    };

    return bestTimes[platform] || bestTimes.twitter;
  }

  /**
   * Get engagement tips for platform
   */
  getEngagementTips(platform: string): string[] {
    const tips: Record<string, string[]> = {
      twitter: [
        'Use 1-2 relevant hashtags',
        'Keep tweets concise and actionable',
        'Ask questions to encourage replies',
        'Post during peak hours (9 AM - 3 PM)',
        'Use threads for longer content',
        'Engage with replies quickly'
      ],
      linkedin: [
        'Add personal insights and experience',
        'Use professional but conversational tone',
        'Include relevant hashtags (3-5)',
        'Share industry knowledge',
        'Post career growth and milestones',
        'Engage with your network'
      ],
      facebook: [
        'Post videos and images',
        'Ask engaging questions',
        'Post during afternoon hours',
        'Encourage shares and reactions',
        'Use storytelling techniques',
        'Engage with community'
      ],
      instagram: [
        'Use 15-30 relevant hashtags',
        'Post high-quality visuals',
        'Write engaging captions',
        'Use stories and reels',
        'Post consistently',
        'Engage with comments'
      ],
      tiktok: [
        'Follow trending sounds and hashtags',
        'Create authentic, fun content',
        'Post regularly (1-3 times daily)',
        'Use trending effects and filters',
        'Keep videos 15-60 seconds',
        'Engage with comments'
      ]
    };

    return tips[platform] || tips.twitter;
  }

  /**
   * Calculate content score (0-100)
   */
  calculateContentScore(factors: EngagementFactors): number {
    let score = 50; // Base score

    // Sentiment component (0-20)
    score += factors.sentiment_score * 20;

    // Hashtag component (0-15)
    score += Math.min(factors.hashtag_count * 3, 15);

    // Mention component (0-10)
    score += Math.min(factors.mention_count * 2, 10);

    // Keyword relevance (0-15)
    score += factors.keyword_relevance * 15;

    // Content length bonus (0-10)
    if (factors.content_length === 'medium') {
      score += 10;
    } else if (factors.content_length === 'long') {
      score += 7;
    } else {
      score += 5;
    }

    // Time bonus (0-10)
    const timeBonus = { morning: 10, afternoon: 5, evening: 10, night: 0 };
    score += timeBonus[factors.time_of_day as keyof typeof timeBonus] || 0;

    // Day bonus (0-5)
    if (['Saturday', 'Sunday'].includes(factors.day_of_week)) {
      score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }
}

export const engagementSimulationService = new EngagementSimulationService();

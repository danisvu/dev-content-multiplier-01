# Engagement Simulation Guide

## Overview

The **Engagement Simulation** system predicts and displays engagement metrics (likes, comments, shares, views) for content across different social media platforms. It uses AI analysis to simulate performance based on content characteristics, sentiment, timing, and platform-specific factors.

## Architecture

### Backend Service

The `EngagementSimulationService` analyzes content and predicts engagement:

```typescript
class EngagementSimulationService {
  // Simulate engagement metrics
  async simulateEngagement(request: SimulationRequest): Promise<EngagementPrediction>

  // Get best posting times
  getPlatformBestTimes(platform: string): Record<string, string>

  // Get platform tips
  getEngagementTips(platform: string): string[]

  // Calculate content quality score
  calculateContentScore(factors: EngagementFactors): number
}
```

### Key Concepts

#### Prediction Scenarios
Three engagement predictions per content:

- **Conservative (60%)** - Lower estimate, worst-case scenario
- **Moderate (100%)** - Standard prediction, most likely
- **Optimistic (140%)** - Upper estimate, best-case scenario

#### Engagement Metrics
Each prediction includes:
- **Likes** - Primary engagement metric
- **Comments** - Discussion indicator
- **Shares** - Viral potential
- **Views** - Reach measurement
- **Engagement Rate** - (Likes + Comments + Shares) / Views × 100
- **Projected Reach** - Extended audience size

#### Analysis Factors
Content analysis considers:
- Content length (short/medium/long)
- Sentiment score (0-1)
- Hashtag count
- Mention count
- Keyword relevance
- Time of day (morning/afternoon/evening/night)
- Day of week
- Platform type

## API Endpoints

### Simulate Engagement
```http
POST /api/engagement/simulate
Content-Type: application/json

{
  "content": "Your content here...",
  "platform": "twitter",
  "tone": "professional",
  "hashtags": ["#AI", "#Marketing"],
  "mentions": ["@user1", "@user2"],
  "timestamp": "2024-11-10T15:30:00Z"
}

Response:
{
  "conservative": {
    "likes": 27,
    "comments": 7,
    "shares": 4,
    "views": 1500,
    "engagement_rate": 2.27,
    "projected_reach": 1534
  },
  "moderate": {
    "likes": 45,
    "comments": 12,
    "shares": 8,
    "views": 2500,
    "engagement_rate": 2.52,
    "projected_reach": 2563
  },
  "optimistic": {
    "likes": 63,
    "comments": 17,
    "shares": 11,
    "views": 3500,
    "engagement_rate": 2.73,
    "projected_reach": 3596
  },
  "factors": { ... }
}
```

### Get Best Posting Times
```http
GET /api/engagement/best-times/:platform

Response:
{
  "platform": "twitter",
  "best_times": {
    "best": "9 AM - 3 PM (Weekdays)",
    "worst": "11 PM - 6 AM",
    "peak": "Tuesday-Thursday"
  }
}
```

### Get Engagement Tips
```http
GET /api/engagement/tips/:platform

Response:
{
  "platform": "twitter",
  "tips": [
    "Use 1-2 relevant hashtags",
    "Keep tweets concise and actionable",
    "Ask questions to encourage replies",
    ...
  ],
  "count": 6
}
```

### Calculate Content Score
```http
POST /api/engagement/content-score
Content-Type: application/json

{
  "content": "Your content here...",
  "platform": "twitter",
  "tone": "professional",
  "hashtags": ["#AI"],
  "mentions": ["@user"]
}

Response:
{
  "content_score": 78,
  "score_level": "good",
  "factors": { ... },
  "metrics": { ... }
}
```

### Get Supported Platforms
```http
GET /api/engagement/platforms

Response:
{
  "platforms": [
    {
      "name": "twitter",
      "displayName": "Twitter/X",
      "characterLimit": 280,
      "emoji": "𝕏"
    },
    ...
  ],
  "count": 5
}
```

## Frontend Component Usage

### EngagementMetrics Component

Display predicted engagement metrics:

```tsx
import { EngagementMetrics } from '@/components/EngagementMetrics'

export default function Page() {
  return (
    <EngagementMetrics
      content="Your content here..."
      platform="twitter"
      tone="professional"
      hashtags={["#AI", "#Marketing"]}
      mentions={["@user1"]}
      variant="moderate"  // conservative | moderate | optimistic
      compact={false}      // true for compact display
    />
  )
}
```

### Component Props

```typescript
interface EngagementMetricsProps {
  content: string;                    // Content to analyze
  platform: Platform;                 // Platform type
  tone?: string;                      // Writing tone
  hashtags?: string[];                // Hashtag list
  mentions?: string[];                // Mention list
  variant?: 'conservative' | 'moderate' | 'optimistic';
  compact?: boolean;                  // Compact display
  className?: string;                 // Custom CSS
}
```

### Compact Display

For showing metrics inline:

```tsx
<EngagementMetrics
  content={content}
  platform="twitter"
  variant="moderate"
  compact={true}
/>
```

### Full Display

Shows all metrics, factors, sentiment score, and variant selector:

```tsx
<EngagementMetrics
  content={content}
  platform="twitter"
  tone={selectedTone}
  hashtags={hashtags}
  mentions={mentions}
  variant="moderate"
  compact={false}
/>
```

## Analysis Factors

### Content Length Analysis

| Length | Characters | Factor |
|--------|-----------|--------|
| Short | < 100 | 0.8x |
| Medium | 100-300 | 1.0x |
| Long | > 300 | 0.95x |

### Sentiment Scoring (0-1)

- **Base:** 0.5 (neutral)
- **+Positive words:** +0.1 per word
- **-Negative words:** -0.1 per word
- **Positive tone:** +0.15
- **Emojis:** +0.05 each (max +0.2)

### Hashtag Boost

- Each hashtag: +5% engagement
- Max with 5+ hashtags: +25%

### Mention Boost

- Each mention: +3% engagement
- Max with 5+ mentions: +15%

### Time of Day Multiplier

| Time | Multiplier |
|------|-----------|
| Morning (6 AM - 12 PM) | 1.1x |
| Afternoon (12 PM - 6 PM) | 0.9x |
| Evening (6 PM - 9 PM) | 1.2x |
| Night (9 PM - 6 AM) | 0.7x |

### Day of Week Multiplier

- Weekdays: 1.0x
- Weekends: 1.15x

## Platform Base Metrics

Default engagement expectations:

```
Twitter:
  - Likes: 45
  - Comments: 12
  - Shares: 8
  - Views: 2,500

LinkedIn:
  - Likes: 85
  - Comments: 18
  - Shares: 15
  - Views: 4,200

Facebook:
  - Likes: 120
  - Comments: 25
  - Shares: 20
  - Views: 6,500

Instagram:
  - Likes: 250
  - Comments: 35
  - Shares: 5
  - Views: 8,500

TikTok:
  - Likes: 500
  - Comments: 75
  - Shares: 120
  - Views: 15,000
```

## Content Score (0-100)

How content quality is calculated:

```
Base: 50 points

+ Sentiment (0-20): Based on sentiment score
+ Hashtags (0-15): Up to 3 points per hashtag
+ Mentions (0-10): Up to 2 points per mention
+ Keywords (0-15): Platform keyword relevance
+ Length (0-10): Optimal content length bonus
+ Time (0-10): Best posting time bonus
+ Day (0-5): Weekend bonus

Score Levels:
  80-100: Excellent
  60-79:  Good
  40-59:  Fair
  0-39:   Poor
```

## Best Posting Times by Platform

### Twitter
- **Best:** 9 AM - 3 PM (Weekdays)
- **Worst:** 11 PM - 6 AM
- **Peak:** Tuesday-Thursday

### LinkedIn
- **Best:** 7-9 AM, 5-6 PM (Weekdays)
- **Worst:** Weekends, 12 AM - 6 AM
- **Peak:** Tuesday-Wednesday

### Facebook
- **Best:** 1-3 PM (Weekdays)
- **Worst:** Early morning
- **Peak:** Thursday

### Instagram
- **Best:** 11 AM - 1 PM, 7-9 PM
- **Worst:** Early morning
- **Peak:** Wednesday-Friday

### TikTok
- **Best:** 6-10 AM, 7-11 PM
- **Worst:** Daytime
- **Peak:** Daily trends

## Engagement Tips

### Twitter
- Use 1-2 relevant hashtags
- Keep tweets concise and actionable
- Ask questions to encourage replies
- Post during peak hours (9 AM - 3 PM)
- Use threads for longer content
- Engage with replies quickly

### LinkedIn
- Add personal insights and experience
- Use professional but conversational tone
- Include 3-5 relevant hashtags
- Share industry knowledge
- Post career growth and milestones
- Engage with your network

### Facebook
- Post videos and images
- Ask engaging questions
- Post during afternoon hours
- Encourage shares and reactions
- Use storytelling techniques
- Engage with community

### Instagram
- Use 15-30 relevant hashtags
- Post high-quality visuals
- Write engaging captions
- Use stories and reels
- Post consistently
- Engage with comments

### TikTok
- Follow trending sounds and hashtags
- Create authentic, fun content
- Post 1-3 times daily
- Use trending effects and filters
- Keep videos 15-60 seconds
- Engage with comments

## Workflow Examples

### Analyze Single Content

```typescript
const simulation = await engagementService.simulateEngagement({
  content: 'Your content...',
  platform: 'twitter',
  tone: 'professional',
  hashtags: ['#AI', '#Tech'],
  mentions: ['@user']
});

console.log('Moderate prediction:', simulation.moderate);
console.log('Content score:', engagementService.calculateContentScore(simulation.factors));
```

### Compare Platforms

```typescript
const platforms = ['twitter', 'linkedin', 'facebook'];
const results = {};

for (const platform of platforms) {
  const simulation = await engagementService.simulateEngagement({
    content: sameContent,
    platform
  });
  results[platform] = simulation.moderate;
}

// Platform with highest engagement
const best = Object.entries(results).reduce((a, b) =>
  a[1].likes > b[1].likes ? a : b
);
```

### Optimize Content

```typescript
// Test different variations
const variations = [
  'Version with many hashtags',
  'Version with few hashtags',
  'Positive tone version',
  'Casual tone version'
];

const scores = await Promise.all(
  variations.map(content =>
    engagementService.simulateEngagement({
      content,
      platform: 'twitter'
    })
  )
);

// Find best performing version
const best = scores.reduce((a, b) =>
  a.moderate.engagement_rate > b.moderate.engagement_rate ? a : b
);
```

## Demo Page

Visit `/engagement-demo` to see the simulation in action:

- Edit content and see metrics update
- Test different platforms simultaneously
- Adjust tone and hashtags
- View content score
- See analysis factors
- Get platform-specific tips

## Performance

- **Simulation speed:** < 100ms per content analysis
- **No database calls** for simulation (all in-memory)
- **Scalable** - Can handle thousands of concurrent requests
- **Accurate** - Based on historical engagement patterns

## Limitations & Future Features

### Current Limitations
- Simple text-based sentiment analysis
- No historical user data
- No follower count consideration
- No real-time trend analysis

### Future Enhancements
- [ ] ML-based sentiment analysis
- [ ] User engagement history
- [ ] Trend analysis integration
- [ ] A/B testing optimization
- [ ] Real-time trending topics
- [ ] Influencer metrics
- [ ] Audience demographics
- [ ] Schedule optimization

## Related Features

- [MultiPublishQueue](./MULTIPUBLISHQUEUE_GUIDE.md) - Publish content
- [DerivativeTabs](./DERIVATIVETABS_COMPONENT_GUIDE.md) - View derivatives
- [Version Control](./VERSIONCONTROL_GUIDE.md) - Track changes

## API Quick Reference

```bash
# Simulate engagement
curl -X POST http://localhost:3911/api/engagement/simulate \
  -H "Content-Type: application/json" \
  -d '{"content": "...", "platform": "twitter"}'

# Get best times
curl http://localhost:3911/api/engagement/best-times/twitter

# Get tips
curl http://localhost:3911/api/engagement/tips/twitter

# Calculate score
curl -X POST http://localhost:3911/api/engagement/content-score \
  -H "Content-Type: application/json" \
  -d '{"content": "...", "platform": "twitter"}'

# Get platforms
curl http://localhost:3911/api/engagement/platforms
```

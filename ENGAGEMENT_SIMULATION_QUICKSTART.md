# Engagement Simulation Quick Start

See predicted engagement metrics for your content in seconds!

## 🚀 Quick Start

### 1. Add Component to Your Page

```tsx
'use client'

import { EngagementMetrics } from '@/components/EngagementMetrics'

export default function Page() {
  return (
    <EngagementMetrics
      content="Your content here..."
      platform="twitter"
      tone="professional"
    />
  )
}
```

### 2. Try the Demo

Visit **http://localhost:3000/engagement-demo** to see it in action!

Features:
- Edit content in real-time
- Select multiple platforms
- Adjust tone and hashtags
- View engagement predictions
- See content score

### 3. Call API Directly

```bash
# Get engagement prediction
curl -X POST http://localhost:3911/api/engagement/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Check out our new AI tool! 🚀",
    "platform": "twitter",
    "tone": "casual",
    "hashtags": ["#AI", "#Tech"]
  }'
```

## 📊 What You Get

**Engagement Metrics:**
- 👍 Likes - Core engagement
- 💬 Comments - Discussion
- ↗️ Shares - Viral potential
- 👁️ Views - Reach
- 📈 Engagement Rate - Activity %
- 🎯 Projected Reach - Extended audience

**Predictions:**
- 📉 Conservative (60%)
- 📊 Moderate (100%)
- 📈 Optimistic (140%)

**Analysis:**
- 💯 Content Score (0-100)
- 😊 Sentiment Analysis
- ⏰ Timing Impact
- 🎯 Platform Factors

## 💡 Common Use Cases

### Check Single Content

```tsx
<EngagementMetrics
  content={content}
  platform="twitter"
/>
```

### Show Metrics Under Preview

```tsx
<div>
  <TwitterPreview content={content} />
  <EngagementMetrics content={content} platform="twitter" compact={true} />
</div>
```

### Compare Platforms

```tsx
{['twitter', 'linkedin', 'facebook'].map(platform => (
  <EngagementMetrics
    key={platform}
    content={content}
    platform={platform as any}
  />
))}
```

### Compact Display (Inline)

```tsx
<EngagementMetrics
  content={content}
  platform="twitter"
  compact={true}  // Shows only key metrics
/>
```

## 🎯 Features

| Feature | What it does |
|---------|-------------|
| **3 Scenarios** | Conservative, Moderate, Optimistic |
| **Content Score** | 0-100 quality rating |
| **Sentiment Analysis** | Emotion detection |
| **Time Optimization** | Best posting times |
| **Platform Tips** | Specific recommendations |
| **Real-time Update** | Changes as you edit |

## 🔄 API Endpoints

```bash
# Simulate engagement
POST /api/engagement/simulate

# Get best posting times
GET /api/engagement/best-times/:platform

# Get engagement tips
GET /api/engagement/tips/:platform

# Calculate content score
POST /api/engagement/content-score

# List platforms
GET /api/engagement/platforms
```

## 📱 Platforms

- 𝕏 Twitter (280 chars) - Best: 9 AM - 3 PM
- 💼 LinkedIn (3000 chars) - Best: 7-9 AM, 5-6 PM
- f Facebook (63K chars) - Best: 1-3 PM
- 📷 Instagram (2200 chars) - Best: 11 AM - 1 PM, 7-9 PM
- 🎵 TikTok (2200 chars) - Best: 6-10 AM, 7-11 PM

## 💯 Content Score Breakdown

```
50 base points

+ Sentiment (0-20)
+ Hashtags (0-15)
+ Mentions (0-10)
+ Keywords (0-15)
+ Content Length (0-10)
+ Time of Day (0-10)
+ Day of Week (0-5)
```

**Score Levels:**
- 80-100: ✅ Excellent
- 60-79: ✅ Good
- 40-59: ⚠️ Fair
- 0-39: ❌ Poor

## 🎓 Tips for Better Engagement

### General
- Use positive, action-oriented language
- Add relevant hashtags (3-5 is optimal)
- Include calls-to-action
- Post during optimal times
- Engage with comments

### Twitter
- Keep it short and punchy
- Ask questions
- Use 1-2 hashtags max
- Post 9 AM - 3 PM

### LinkedIn
- Share insights and expertise
- Use 3-5 professional hashtags
- Post during business hours
- Engage with connections

### Instagram
- Use 15-30 hashtags
- Post high-quality visuals
- Write compelling captions
- Use stories and reels

### TikTok
- Follow trends
- Keep videos short (15-60s)
- Be authentic and fun
- Post 1-3 times daily

## 🚀 Example: Full Workflow

```tsx
'use client'

import { useState } from 'react'
import { EngagementMetrics } from '@/components/EngagementMetrics'

export default function Page() {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState<'twitter' | 'linkedin'>('twitter')
  const [hashtags, setHashtags] = useState<string[]>([])

  return (
    <div className="space-y-4">
      {/* Editor */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your content..."
        className="w-full h-24 p-3 border rounded"
      />

      {/* Platform selector */}
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value as any)}
        className="p-2 border rounded"
      >
        <option value="twitter">Twitter</option>
        <option value="linkedin">LinkedIn</option>
      </select>

      {/* Engagement metrics */}
      {content && (
        <EngagementMetrics
          content={content}
          platform={platform}
          hashtags={hashtags}
        />
      )}
    </div>
  )
}
```

## ⚠️ Important Notes

- Predictions are **estimates** based on content analysis
- Actual engagement depends on **follower base** and **audience**
- **Timing** is based on average patterns
- **Content quality** matters more than metrics
- Use as **guidance**, not as absolute predictions

## 📚 Full Documentation

See [ENGAGEMENT_SIMULATION_GUIDE.md](./ENGAGEMENT_SIMULATION_GUIDE.md) for:
- Complete API reference
- Analysis factors details
- Platform base metrics
- Content score calculation
- Workflow examples
- Advanced usage

## 🎯 Next Steps

1. ✅ Visit demo page
2. ✅ Try different content
3. ✅ Check your content score
4. ✅ Add component to your pages
5. 📊 Monitor engagement metrics

## 💬 Questions?

Check the full guide or try the demo page at `/engagement-demo`!

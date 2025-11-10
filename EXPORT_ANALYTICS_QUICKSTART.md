# Export, Sharing, Analytics & Cost Tracking - Quick Start

Get started with the new export, sharing, analytics, and cost tracking features in 5 minutes.

## Installation

All features are built-in. No additional packages needed beyond existing dependencies.

## Basic Setup

### 1. Database Migrations

First, run the new database migrations:

```bash
cd backend
npm run migrate:run
```

This creates:
- `cost_tracking` table
- `shared_previews` table
- `preview_access_logs` table

### 2. Frontend Components

Import and use the components:

```tsx
import {
  ExportOptions,
  SharePreviewLink,
  FunnelAnalyticsDashboard,
  PlatformCostTracker
} from '@/components/ui';
```

## Quick Examples

### Export Options

Export your derivatives in multiple formats:

```tsx
'use client';

import { ExportOptions } from '@/components/ui';

export default function ExportDemo() {
  return (
    <ExportOptions
      briefId={1}
      onExportComplete={(format) => {
        console.log(`Exported as ${format}`);
      }}
    />
  );
}
```

**Features:**
- 📊 CSV: For spreadsheet analysis
- 📅 ICS: For calendar imports
- 📦 JSON: Complete data with metadata

---

### Share Preview Links

Create shareable links for team review:

```tsx
'use client';

import { SharePreviewLink } from '@/components/ui';

export default function SharingDemo() {
  return (
    <SharePreviewLink
      briefId={1}
      onShareCreated={(link) => {
        const shareUrl = `http://localhost:3000/shared/${link.token}`;
        console.log('Share URL:', shareUrl);
      }}
    />
  );
}
```

**Features:**
- 🔐 Password protection
- ⏰ Expiration dates
- 👁️ View tracking
- 💬 Optional comments & downloads

---

### Funnel Analytics Dashboard

Track content from ideas to publishing:

```tsx
'use client';

import { FunnelAnalyticsDashboard } from '@/components/ui';

export default function AnalyticsDemo() {
  return (
    <FunnelAnalyticsDashboard
      platform="twitter"
      metrics={{
        views: 5000,
        engagement: 850,
        clicks: 240,
        conversions: 45
      }}
    />
  );
}
```

**Metrics Tracked:**
- 📈 Ideas → Briefs → Derivatives → Published
- 💹 Conversion rates at each stage
- 📊 Platform performance breakdown
- 📅 Creation trends over time

---

### Platform Cost Tracker

Monitor API and LLM costs:

```tsx
'use client';

import { PlatformCostTracker } from '@/components/ui';

export default function CostTrackerDemo() {
  return (
    <PlatformCostTracker
      briefId={1}
    />
  );
}
```

**Tracks:**
- 💰 Total cost per derivative
- 🤖 LLM token usage
- 📱 Cost by platform
- 📊 Average cost metrics

---

## API Quick Reference

### Export API

```bash
# Export as CSV
GET /api/exports/derivatives/1/csv

# Export as Calendar
GET /api/exports/derivatives/1/ics

# Export as JSON with metadata
GET /api/exports/derivatives/1/json?includeVersionHistory=true&includeMetadata=true

# Export version history
GET /api/exports/versions/1/csv
```

### Sharing API

```bash
# Create share link
POST /api/sharing/create
{
  "briefId": 1,
  "previewType": "full",
  "password": "secret123",
  "expiresIn": 7,
  "allowDownloads": true
}

# Access shared preview
GET /api/sharing/preview/{token}?password=secret123

# Get all share links for brief
GET /api/sharing/brief/1

# Get share link statistics
GET /api/sharing/stats/{shareLinkId}
```

### Analytics API

```bash
# Get funnel analytics
GET /api/analytics/funnel

# Get platform analytics
GET /api/analytics/platforms

# Get derivative analytics
GET /api/analytics/derivatives

# Get conversion funnel
GET /api/analytics/conversion-funnel
```

### Cost Tracking API

```bash
# Record a cost transaction
POST /api/costs/record
{
  "derivativeId": 1,
  "costType": "llm",
  "provider": "gemini",
  "costAmount": 0.0050,
  "tokensUsed": 1200
}

# Get costs for a derivative
GET /api/costs/derivative/1

# Get costs for a brief
GET /api/costs/brief/1

# Get cost summary
GET /api/costs/summary/1

# Export costs as CSV
GET /api/costs/export/1/csv
```

---

## Common Workflows

### Complete Analytics Dashboard

```tsx
'use client';

import React, { useState } from 'react';
import {
  ExportOptions,
  SharePreviewLink,
  FunnelAnalyticsDashboard,
  PlatformCostTracker
} from '@/components/ui';

export default function Dashboard() {
  const briefId = 1;
  const [tab, setTab] = useState('analytics');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Content Brief Analytics</h1>

      <div className="flex gap-2 mb-6">
        {['analytics', 'export', 'sharing', 'costs'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded capitalize transition-colors ${
              tab === t
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'analytics' && (
        <FunnelAnalyticsDashboard platform="twitter" />
      )}
      {tab === 'export' && <ExportOptions briefId={briefId} />}
      {tab === 'sharing' && <SharePreviewLink briefId={briefId} />}
      {tab === 'costs' && <PlatformCostTracker briefId={briefId} />}
    </div>
  );
}
```

### Auto-Record Costs During Generation

When generating derivatives, automatically record costs:

```typescript
// In your derivative generation service
async generateDerivatives(request: GenerateDerivativesRequest) {
  // Generate derivatives using LLM...

  // Record costs
  for (const derivative of createdDerivatives) {
    await fetch('/api/costs/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        derivativeId: derivative.id,
        costType: 'llm',
        provider: 'gemini',
        costAmount: calculateLLMCost(tokens),
        tokensUsed: tokens,
        inputTokens: inputTokens,
        outputTokens: outputTokens,
        requestMetadata: {
          model: 'gemini-1.5-pro',
          platform: derivative.platform
        }
      })
    });
  }
}
```

### Create Shareable Brief for Stakeholders

```tsx
async function shareBriefWithTeam(briefId: number) {
  const response = await fetch('/api/sharing/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      briefId,
      previewType: 'derivatives_only', // Only show final content
      expiresIn: 7, // 7 days
      allowDownloads: true,
      allowComments: true,
      createdBy: 'user@example.com'
    })
  });

  const { shareUrl } = await response.json();
  console.log('Share this link:', shareUrl);

  // Send via email or chat...
}
```

---

## Configuration

### Cost Provider Setup

Costs are automatically tracked. Configure your LLM providers:

```env
# .env
GEMINI_API_KEY=your-key
DEEPSEEK_API_KEY=your-key
```

Costs will be calculated based on:
- Token count (input + output)
- Provider pricing
- Model type

### Share Link Settings

Customize default share link behavior in your app:

```typescript
const DEFAULT_SHARE_SETTINGS = {
  expiresIn: 7 * 24 * 60, // 7 days in minutes
  allowDownloads: true,
  allowComments: false,
  maxViews: undefined, // Unlimited
};
```

---

## Troubleshooting

### Export not working?
- Ensure derivatives are created for the brief
- Check browser download permissions
- Verify briefId is correct

### Share link not loading?
- Confirm link hasn't expired
- Check view limit hasn't been exceeded
- Verify password if required
- Check browser console for errors

### Analytics showing no data?
- Create at least one brief with derivatives
- Analytics data is generated from database
- Try refreshing the page
- Check date range selection

### Costs not showing?
- Ensure cost_tracking table exists (run migrations)
- Costs recorded during derivative generation
- Check API response in browser console
- Verify derivatives were created with cost tracking

---

## Next Steps

1. **Explore the Guide**: Read [EXPORT_ANALYTICS_GUIDE.md](./EXPORT_ANALYTICS_GUIDE.md) for detailed documentation
2. **Review Examples**: Check demo routes in `frontend/app/` for full implementations
3. **Customize**: Modify component styling and behavior to match your needs
4. **Integrate**: Add components to your existing pages and workflows

---

## File Structure

```
backend/
├── migrations/
│   ├── 006_create_cost_tracking_table.sql
│   └── 007_create_shared_previews_table.sql
├── src/
│   ├── routes/
│   │   ├── exportRoutes.ts
│   │   ├── sharingRoutes.ts
│   │   ├── analyticsRoutes.ts
│   │   └── costTrackingRoutes.ts
│   └── services/
│       ├── exportService.ts
│       ├── sharingService.ts
│       ├── analyticsService.ts
│       └── costTrackingService.ts

frontend/
└── app/
    └── components/
        ├── ExportOptions.tsx
        ├── SharePreviewLink.tsx
        ├── FunnelAnalyticsDashboard.tsx
        └── PlatformCostTracker.tsx
```

---

## Support

For more details, see [EXPORT_ANALYTICS_GUIDE.md](./EXPORT_ANALYTICS_GUIDE.md) which includes:
- Complete API reference
- Component prop details
- Database schema documentation
- Advanced configuration options

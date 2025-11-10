# Export, Sharing, Analytics & Cost Tracking Guide

This guide covers the new export, team sharing, analytics dashboard, and cost tracking features added to the Content Multiplier application.

## Table of Contents

1. [Export Options](#export-options)
2. [Share Preview Links](#share-preview-links)
3. [Analytics Dashboard](#analytics-dashboard)
4. [Platform Cost Tracker](#platform-cost-tracker)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)

---

## Export Options

### Overview

The **ExportOptions** component allows users to export derivatives and version history in multiple formats:

- **CSV**: For spreadsheet analysis and bulk operations
- **ICS**: For importing publishing schedules into calendar applications
- **JSON**: Complete data export with optional metadata

### Component Usage

```tsx
import { ExportOptions } from '@/components/ui';

export default function ExportDemo() {
  const briefId = 1;

  return (
    <ExportOptions
      briefId={briefId}
      onExportStart={() => console.log('Exporting...')}
      onExportComplete={(format) => console.log(`Exported as ${format}`)}
      className="p-6"
    />
  );
}
```

### Export Formats

#### CSV Export

**Endpoint**: `GET /api/exports/derivatives/{briefId}/csv`

**Query Parameters**:
- `platforms` (optional): Comma-separated list of platforms to include
  - Example: `?platforms=twitter,linkedin,facebook`

**Response**: CSV file with columns:
- ID
- Brief ID
- Platform
- Content
- Status
- Characters
- Created
- Published

**Example**:
```csv
ID,Brief ID,Platform,Content,Status,Characters,Created,Published
1,1,twitter,"Check out our latest insights!",draft,42,2024-01-15T10:00:00Z,
```

#### ICS (Calendar) Export

**Endpoint**: `GET /api/exports/derivatives/{briefId}/ics`

**Description**: Exports only published derivatives as calendar events

**Response**: iCalendar format with:
- Event title: "Publish to {Platform} - {Brief Title}"
- Event date: Published timestamp
- Description: First 200 characters of content
- Category: Platform name

**Use Cases**:
- Import into Google Calendar, Outlook, Apple Calendar
- Share publishing schedule with team
- Plan content distribution timeline

#### JSON Export

**Endpoint**: `GET /api/exports/derivatives/{briefId}/json`

**Query Parameters**:
- `includeVersionHistory` (optional): Include version history for each derivative
- `includeMetadata` (optional): Include cost data and metrics

**Response Structure**:
```json
{
  "exportDate": "2024-01-15T10:00:00Z",
  "brief": {
    "id": 1,
    "title": "Q1 Marketing Strategy",
    "content": "...",
    "status": "completed",
    "created_at": "2024-01-10T09:00:00Z"
  },
  "derivatives": [
    {
      "id": 1,
      "platform": "twitter",
      "content": "...",
      "status": "published",
      "character_count": 280,
      "created_at": "2024-01-10T09:00:00Z",
      "published_at": "2024-01-12T14:00:00Z",
      "versions": [...],
      "cost": {...}
    }
  ]
}
```

### Version History Export

**Endpoint**: `GET /api/exports/versions/{derivativeId}/csv`

**Response**: CSV with columns:
- Version
- Type (created, edited, ai_regenerated, rollback)
- Summary
- Characters
- Changed By
- Created

---

## Share Preview Links

### Overview

The **SharePreviewLink** component enables secure sharing of briefs and derivatives with team members and external reviewers without requiring account creation.

### Component Usage

```tsx
import { SharePreviewLink } from '@/components/ui';

export default function SharingDemo() {
  const briefId = 1;

  return (
    <SharePreviewLink
      briefId={briefId}
      onShareCreated={(link) => console.log('Link created:', link)}
      className="p-6"
    />
  );
}
```

### Features

#### Preview Types

1. **Full Preview**: Includes brief, all derivatives, and version history
2. **Derivatives Only**: Only platform-specific variants
3. **Version History**: Complete version timeline for each derivative

#### Security Options

- **Password Protection**: Optional password-protected links
- **Expiration**: Links can expire after N days (1, 7, 30, 90 days)
- **View Limits**: Optional maximum view count
- **Permissions**:
  - Allow comments on shared previews
  - Allow downloads of content

#### Access Tracking

All share link accesses are logged with:
- Access timestamp
- IP address
- User agent
- Geographic location (if available)

### API Endpoints

#### Create Share Link

**Endpoint**: `POST /api/sharing/create`

**Request**:
```json
{
  "briefId": 1,
  "previewType": "full",
  "password": "optional-password",
  "expiresIn": 7,
  "maxViews": 50,
  "allowComments": true,
  "allowDownloads": true,
  "createdBy": "user@example.com"
}
```

**Response**:
```json
{
  "message": "Share link created successfully",
  "shareLink": {
    "id": 5,
    "token": "abc123def456...",
    "brief_id": 1,
    "preview_type": "full",
    "expires_at": "2024-01-22T10:00:00Z",
    "require_password": false,
    "view_count": 0,
    "allow_comments": true,
    "allow_downloads": true,
    "created_at": "2024-01-15T10:00:00Z"
  },
  "shareUrl": "http://localhost:3000/shared/abc123def456"
}
```

#### Get Shared Preview

**Endpoint**: `GET /api/sharing/preview/{token}`

**Query Parameters**:
- `password` (optional): Required if link is password-protected

**Response**:
```json
{
  "shareLink": {
    "token": "...",
    "previewType": "full",
    "requiresPassword": false,
    "allowComments": true,
    "allowDownloads": true,
    "viewCount": 3,
    "expiresAt": "2024-01-22T10:00:00Z"
  },
  "brief": {...},
  "derivatives": [...],
  "versionHistory": {...}
}
```

#### Get All Share Links for Brief

**Endpoint**: `GET /api/sharing/brief/{briefId}`

**Response**:
```json
{
  "briefId": 1,
  "shareLinks": [...]
}
```

#### Get Share Link Statistics

**Endpoint**: `GET /api/sharing/stats/{shareLinkId}`

**Response**:
```json
{
  "stats": {
    "total_views": 15,
    "unique_ips": 8,
    "countries": {
      "US": 10,
      "UK": 3,
      "CA": 2
    },
    "cities": {
      "New York": 5,
      "San Francisco": 3
    },
    "recent_accesses": [...]
  }
}
```

#### Update Share Link

**Endpoint**: `PUT /api/sharing/{shareLinkId}`

**Request**:
```json
{
  "expiresIn": 30,
  "maxViews": 100,
  "allowComments": false,
  "allowDownloads": true
}
```

#### Revoke Share Link (Expire Immediately)

**Endpoint**: `POST /api/sharing/{shareLinkId}/revoke`

#### Delete Share Link

**Endpoint**: `DELETE /api/sharing/{shareLinkId}`

---

## Analytics Dashboard

### Overview

The **AnalyticsDashboard** component provides comprehensive analytics on content creation and publishing workflow, including:

- **Funnel Analytics**: Track ideas → briefs → derivatives → published
- **Platform Analytics**: Performance metrics by platform
- **Trend Analysis**: Creation and publication trends over time
- **Conversion Rates**: Step-by-step conversion metrics

### Component Usage

```tsx
import { AnalyticsDashboard } from '@/components/ui';

export default function AnalyticsDemo() {
  return (
    <AnalyticsDashboard
      className="p-6"
    />
  );
}
```

### Key Metrics

#### KPI Cards

1. **Ideas Generated**: Total number of ideas created
2. **Briefs Created**: Number of briefs with conversion rate from ideas
3. **Derivatives**: Total derivatives with conversion rate from briefs
4. **Published**: Number of published items with conversion rate

#### Content Funnel

Visual representation of content moving through pipeline:
- Ideas → Selected for Brief
- Briefs → Derivatives Generated
- Derivatives → Scheduled/Published
- Published count

Shows drop-off at each stage.

#### Derivative Status Distribution

Pie chart showing breakdown of:
- Draft: In progress, not yet ready
- Scheduled: Queued for publishing
- Published: Live content

#### Platform Performance

For each platform (Twitter, LinkedIn, Facebook, Instagram, TikTok):
- Total derivatives
- Draft count
- Scheduled count
- Published count
- Average character count
- Engagement potential score (1-10)

#### Trend Analysis

Line chart showing daily/weekly/monthly derivative creation trend

### Time Range Options

- Last 7 days
- Last 30 days
- All time

### API Endpoints

#### Get Funnel Analytics

**Endpoint**: `GET /api/analytics/funnel`

**Query Parameters**:
- `startDate` (optional): ISO 8601 format
- `endDate` (optional): ISO 8601 format

**Response**:
```json
{
  "analytics": {
    "total_ideas": 100,
    "total_briefs": 75,
    "total_derivatives": 375,
    "total_published": 325,
    "funnel": [
      {
        "stage": "draft",
        "count": 75,
        "percentage": 75.0,
        "platform_breakdown": {
          "twitter": 15,
          "linkedin": 15,
          "facebook": 15,
          "instagram": 15,
          "tiktok": 15
        }
      },
      {
        "stage": "derivative",
        "count": 375,
        "percentage": 500.0
      },
      {
        "stage": "published",
        "count": 325,
        "percentage": 86.67
      }
    ],
    "conversion_rates": {
      "ideas_to_briefs": 75.0,
      "briefs_to_derivatives": 500.0,
      "derivatives_to_published": 86.67
    }
  }
}
```

#### Get Platform Analytics

**Endpoint**: `GET /api/analytics/platforms`

**Response**:
```json
{
  "platforms": [
    {
      "platform": "twitter",
      "total_derivatives": 75,
      "draft": 10,
      "scheduled": 5,
      "published": 60,
      "average_character_count": 240,
      "average_engagement_potential": 7.5
    },
    ...
  ]
}
```

#### Get Derivative Analytics

**Endpoint**: `GET /api/analytics/derivatives`

**Query Parameters**:
- `startDate` (optional)
- `endDate` (optional)

**Response**:
```json
{
  "analytics": {
    "total_count": 375,
    "by_status": {
      "draft": 50,
      "scheduled": 10,
      "published": 315
    },
    "by_platform": {
      "twitter": 75,
      "linkedin": 75,
      "facebook": 75,
      "instagram": 75,
      "tiktok": 75
    },
    "average_character_count": 800,
    "character_count_by_platform": {
      "twitter": 240,
      "linkedin": 1500,
      "facebook": 1000,
      "instagram": 800,
      "tiktok": 800
    },
    "creation_trend": [
      {
        "date": "2024-01-14",
        "count": 10
      },
      ...
    ]
  }
}
```

#### Get Time Series Data

**Endpoint**: `GET /api/analytics/timeseries`

**Query Parameters**:
- `groupBy`: 'day', 'week', or 'month' (default: 'day')
- `startDate` (optional)
- `endDate` (optional)

#### Get Conversion Funnel (Detailed)

**Endpoint**: `GET /api/analytics/conversion-funnel`

**Response**:
```json
{
  "funnel": {
    "steps": [
      {
        "step": 1,
        "name": "Ideas Generated",
        "count": 100,
        "drop_off": 0,
        "drop_off_percentage": 0
      },
      {
        "step": 2,
        "name": "Selected for Brief",
        "count": 75,
        "drop_off": 25,
        "drop_off_percentage": 25
      },
      ...
    ],
    "total_conversion_rate": 32.5
  }
}
```

---

## Platform Cost Tracker

### Overview

The **PlatformCostTracker** component displays costs associated with AI-powered content generation, including LLM (language model) tokens and API calls.

### Component Usage

```tsx
import { PlatformCostTracker } from '@/components/ui';

export default function CostTrackerDemo() {
  const briefId = 1;

  return (
    <PlatformCostTracker
      briefId={briefId}
      className="p-6"
    />
  );
}
```

### Cost Types

1. **LLM Cost**: Charges for language model tokens (OpenAI, Gemini, Deepseek, etc.)
   - Input tokens
   - Output tokens
   - Model type

2. **API Cost**: Additional API calls and service charges

3. **Storage Cost**: Content storage and versioning

4. **Processing Cost**: Compute resources used

### Display Features

#### Summary Cards

- **Total Cost**: Aggregated cost for all derivatives
- **LLM Cost**: Breakdown of language model costs
- **API Cost**: API-related expenses
- **Average Cost Per Derivative**: Cost per platform variant

#### Platform Breakdown

For each platform, displays:
- Platform name
- Total cost
- Number of derivatives
- Cost percentage of total
- Average cost per derivative
- Visual progress bar

#### Detailed Breakdown Table

Shows cost details for each derivative:
- Platform
- Total cost
- LLM cost
- API cost
- Tokens used

### Cost Recording

Costs are automatically recorded when derivatives are generated via AI APIs.

**Endpoint**: `POST /api/costs/record`

**Request**:
```json
{
  "derivativeId": 1,
  "costType": "llm",
  "provider": "gemini",
  "costAmount": 0.0050,
  "tokensUsed": 1200,
  "inputTokens": 400,
  "outputTokens": 800,
  "requestMetadata": {
    "model": "gemini-1.5-pro",
    "platform": "twitter",
    "temperature": 0.7
  }
}
```

### API Endpoints

#### Record Cost

**Endpoint**: `POST /api/costs/record`

#### Get Derivative Cost

**Endpoint**: `GET /api/costs/derivative/{derivativeId}`

**Response**:
```json
{
  "cost": {
    "derivative_id": 1,
    "platform": "twitter",
    "total_cost": 0.0050,
    "cost_breakdown": {
      "llm": 0.0050,
      "api": 0,
      "other": 0
    },
    "tokens_used": 1200,
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

#### Get Brief Costs

**Endpoint**: `GET /api/costs/brief/{briefId}`

**Response**:
```json
{
  "briefId": 1,
  "derivatives": [
    {
      "derivative_id": 1,
      "platform": "twitter",
      "total_cost": 0.0050,
      "cost_breakdown": {...},
      "tokens_used": 1200,
      "created_at": "2024-01-15T10:00:00Z"
    },
    ...
  ],
  "summary": {
    "total_cost": 0.0250,
    "average_cost_per_derivative": 0.0050,
    "derivative_count": 5
  }
}
```

#### Get Cost Summary

**Endpoint**: `GET /api/costs/summary/{briefId}`

**Response**:
```json
{
  "summary": {
    "brief_id": 1,
    "total_cost": 0.0250,
    "llm_cost": 0.0250,
    "api_cost": 0,
    "derivative_count": 5,
    "average_cost_per_derivative": 0.0050,
    "last_updated": "2024-01-15T10:00:00Z"
  }
}
```

#### Get Cost Statistics

**Endpoint**: `GET /api/costs/stats`

**Query Parameters**:
- `startDate` (optional)
- `endDate` (optional)
- `provider` (optional): 'gemini', 'deepseek', 'openai'
- `costType` (optional): 'llm', 'api_call', 'storage', 'processing'

#### Export Costs as CSV

**Endpoint**: `GET /api/costs/export/{briefId}/csv`

**Response**: CSV file with:
- Derivative ID
- Platform
- Total Cost
- LLM Cost
- API Cost
- Other Cost
- Tokens Used
- Created At

---

## Database Schema

### Cost Tracking Table

```sql
CREATE TABLE cost_tracking (
    id SERIAL PRIMARY KEY,
    derivative_id INTEGER NOT NULL,
    cost_type VARCHAR(50) NOT NULL,
    provider VARCHAR(50),
    cost_amount DECIMAL(10, 6),
    currency VARCHAR(3) DEFAULT 'USD',
    tokens_used INTEGER,
    input_tokens INTEGER,
    output_tokens INTEGER,
    request_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_derivative FOREIGN KEY(derivative_id) REFERENCES derivatives(id) ON DELETE CASCADE
);
```

### Shared Previews Table

```sql
CREATE TABLE shared_previews (
    id SERIAL PRIMARY KEY,
    brief_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    preview_type VARCHAR(50) DEFAULT 'full',
    expires_at TIMESTAMP WITH TIME ZONE,
    password_hash VARCHAR(255),
    require_password BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    max_views INTEGER,
    allow_comments BOOLEAN DEFAULT FALSE,
    allow_downloads BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_brief FOREIGN KEY(brief_id) REFERENCES briefs(id) ON DELETE CASCADE
);
```

### Preview Access Logs Table

```sql
CREATE TABLE preview_access_logs (
    id SERIAL PRIMARY KEY,
    shared_preview_id INTEGER NOT NULL,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    country VARCHAR(2),
    city VARCHAR(100),

    CONSTRAINT fk_shared_preview FOREIGN KEY(shared_preview_id) REFERENCES shared_previews(id) ON DELETE CASCADE
);
```

---

## Migration Notes

To enable these features, run the new database migrations:

```bash
cd backend
npm run migrate:run
```

This will create the following tables:
- `cost_tracking` (migration 006)
- `shared_previews` (migration 007)
- `preview_access_logs` (migration 007)
- `cost_summary_cache` (migration 006)

---

## Integration Examples

### Complete Feature Demo

```tsx
'use client';

import React, { useState } from 'react';
import { ExportOptions, SharePreviewLink, AnalyticsDashboard, PlatformCostTracker } from '@/components/ui';

export default function FeaturesDemo() {
  const briefId = 1;
  const [activeTab, setActiveTab] = useState<'export' | 'sharing' | 'analytics' | 'costs'>('export');

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 rounded ${activeTab === 'export' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Export
        </button>
        <button
          onClick={() => setActiveTab('sharing')}
          className={`px-4 py-2 rounded ${activeTab === 'sharing' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Sharing
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('costs')}
          className={`px-4 py-2 rounded ${activeTab === 'costs' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Costs
        </button>
      </div>

      {activeTab === 'export' && <ExportOptions briefId={briefId} />}
      {activeTab === 'sharing' && <SharePreviewLink briefId={briefId} />}
      {activeTab === 'analytics' && <AnalyticsDashboard />}
      {activeTab === 'costs' && <PlatformCostTracker briefId={briefId} />}
    </div>
  );
}
```

---

## Best Practices

### Exporting Data

- Export derivatives regularly for backup
- Use JSON format with metadata for complete data preservation
- Share CSV exports with stakeholders for analysis
- Use ICS format to coordinate publishing schedules with team

### Sharing Content

- Use password-protected links for sensitive content
- Set expiration dates for temporary access
- Monitor view counts to track engagement
- Use preview type options to limit what's shared

### Analyzing Performance

- Review funnel metrics weekly to identify bottlenecks
- Track platform performance to optimize for best-performing channels
- Monitor trend charts to spot seasonal patterns
- Use conversion rates to improve workflow

### Managing Costs

- Review costs by platform to identify expensive channels
- Track tokens used to optimize prompt engineering
- Monitor cost trends over time
- Export cost reports for budget planning

---

## Troubleshooting

### Export Issues

- Ensure derivatives have been created before exporting
- Check browser download settings if file doesn't appear
- For ICS exports, only published derivatives are included

### Sharing Issues

- Verify password is correct if link requires it
- Check link expiration date
- Confirm view limit hasn't been exceeded
- Check browser console for API errors

### Analytics Issues

- Ensure sufficient data exists (at least one brief with derivatives)
- Check date range selection
- Clear browser cache if charts don't update
- Verify user has read permissions for analytics data

### Cost Tracking

- Costs are recorded automatically during derivative generation
- Check that API keys are properly configured
- Verify cost_tracking table exists via migrations
- Monitor token counts to optimize API usage

---

## Support & Documentation

For more information:
- API Documentation: See API Endpoints sections above
- Component Props: Check TypeScript interfaces in component files
- Database Schema: Review migration files in backend/migrations/
- Examples: Check demo routes in frontend/app/

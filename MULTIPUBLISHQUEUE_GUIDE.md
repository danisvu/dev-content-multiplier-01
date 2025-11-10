# MultiPublishQueue Component Guide

## Overview

The **MultiPublishQueue** is a comprehensive feature that enables batch publishing of derivatives (platform-specific content versions) while automatically logging all publishing events to the database. It provides a user-friendly interface for selecting, reviewing, and publishing content across multiple social media platforms with full audit trail support.

## Features

### Core Capabilities
- ✅ **Batch Publishing**: Select and publish multiple derivatives at once
- ✅ **Event Logging**: Automatic logging of `derivative.published` events to the database
- ✅ **Platform Support**: Twitter, LinkedIn, Facebook, Instagram, TikTok
- ✅ **Character Limits**: Real-time display of character counts with platform-specific limits
- ✅ **Content Preview**: Expandable content preview for reviewing before publishing
- ✅ **Status Tracking**: Clear indication of draft, scheduled, and published states
- ✅ **Selective Publishing**: Choose which derivatives to publish individually or in bulk
- ✅ **Audit Trail**: Complete event history with timestamps and user information

### Platform Support with Character Limits

| Platform | Limit | Color |
|----------|-------|-------|
| Twitter | 280 chars | Blue |
| LinkedIn | 3,000 chars | Cyan |
| Facebook | 63,206 chars | Indigo |
| Instagram | 2,200 chars | Pink |
| TikTok | 2,200 chars | Purple |

## Architecture

### Database Schema

#### Derivatives Table
Stores platform-specific content variants:

```sql
CREATE TABLE derivatives (
  id SERIAL PRIMARY KEY,
  brief_id INTEGER NOT NULL,
  platform VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  character_count INTEGER,
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_brief FOREIGN KEY(brief_id) REFERENCES briefs(id) ON DELETE CASCADE,
  CONSTRAINT unique_brief_platform UNIQUE(brief_id, platform)
);
```

#### Event Logs Table
Logs all publishing and system events:

```sql
CREATE TABLE event_logs (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  user_id VARCHAR(100),
  metadata JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  status VARCHAR(50) DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Backend Services

#### DerivativeService
Handles all derivative operations:

```typescript
class DerivativeService {
  // Create or update a single derivative
  async createDerivative(input: CreateDerivativeInput): Promise<Derivative>

  // Generate derivatives from a brief using AI
  async generateDerivatives(request: GenerateDerivativesRequest): Promise<Derivative[]>

  // Publish single derivative and log event
  async publishDerivative(id: number, userId?: string): Promise<Derivative>

  // Batch publish multiple derivatives
  async publishDerivatives(ids: number[], userId?: string): Promise<{published, failed}>

  // Get derivatives by brief ID
  async getDerivativesByBrief(briefId: number): Promise<Derivative[]>

  // Update derivative content
  async updateDerivative(id: number, input: UpdateDerivativeInput): Promise<Derivative>

  // Get statistics
  async getDerivativeStats(): Promise<Record<string, any>>
}
```

#### EventLogService
Manages event logging and audit trail:

```typescript
class EventLogService {
  // Log a single event
  async logEvent(input: EventLogInput): Promise<EventLog>

  // Get events by type
  async getEventsByType(eventType: string, limit?: number): Promise<EventLog[]>

  // Get events for a specific entity
  async getEventsByEntity(entityType: string, entityId: number): Promise<EventLog[]>

  // Get events within a date range
  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<EventLog[]>

  // Get event statistics
  async getEventStats(eventType?: string): Promise<Record<string, any>>

  // Clean up old event logs
  async cleanOldEvents(daysOld?: number): Promise<number>
}
```

## API Endpoints

### Publishing Endpoints

#### Publish Multiple Derivatives
```http
POST /api/publishing/derivatives
Content-Type: application/json

{
  "derivativeIds": [1, 2, 3],
  "userId": "optional-user-id"
}

Response:
{
  "message": "Published 3/3 derivatives",
  "published": [...],
  "failed": [],
  "summary": {
    "total": 3,
    "successCount": 3,
    "failureCount": 0
  }
}
```

#### Publish Single Derivative
```http
POST /api/publishing/derivative/:id
```

### Derivative Endpoints

#### Get Derivatives by Brief
```http
GET /api/derivatives/brief/:briefId

Response: [
  {
    "id": 1,
    "brief_id": 1,
    "platform": "twitter",
    "content": "...",
    "character_count": 173,
    "status": "published",
    "published_at": "2024-11-10T15:30:00Z",
    "created_at": "2024-11-10T10:00:00Z",
    "updated_at": "2024-11-10T15:30:00Z"
  }
]
```

#### Create/Update Derivative
```http
POST /api/derivatives
Content-Type: application/json

{
  "briefId": 1,
  "platform": "twitter",
  "content": "..."
}
```

#### Generate Derivatives from Brief
```http
POST /api/derivatives/generate
Content-Type: application/json

{
  "briefId": 1,
  "platforms": ["twitter", "linkedin", "facebook"],
  "model": "gemini",
  "temperature": 0.7
}
```

#### Update Derivative
```http
PUT /api/derivatives/:id
Content-Type: application/json

{
  "content": "updated content",
  "status": "scheduled"
}
```

#### Delete Derivative
```http
DELETE /api/derivatives/:id
```

### Event Log Endpoints

#### Get Event Logs
```http
GET /api/event-logs?eventType=derivative.published&limit=50&offset=0

Response:
{
  "events": [...],
  "pagination": {
    "limit": 50,
    "offset": 0
  }
}
```

#### Get Event Statistics
```http
GET /api/event-logs/stats?eventType=derivative.published

Response:
{
  "stats": [
    {
      "event_type": "derivative.published",
      "status": "success",
      "count": 15
    }
  ]
}
```

#### Clean Old Event Logs
```http
POST /api/event-logs/cleanup
Content-Type: application/json

{
  "daysOld": 30
}
```

## Frontend Component Usage

### Basic Usage

```tsx
import { MultiPublishQueue } from '@/components/MultiPublishQueue'

export default function MyPage() {
  return (
    <MultiPublishQueue
      briefId={1}
      onPublishComplete={(count) => console.log(`Published ${count} items`)}
      autoLoadDerivatives={true}
    />
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `briefId` | `number` | - | ID of the brief containing derivatives |
| `onPublishComplete` | `(count: number) => void` | undefined | Callback when publishing completes |
| `autoLoadDerivatives` | `boolean` | true | Auto-load derivatives on mount |

### Features in UI

1. **Statistics Panel**: Shows total, draft, and published counts
2. **Select All Checkbox**: Quickly select/deselect all draft derivatives
3. **Publish Button**: Batch publish with count indicator
4. **Derivative Cards**: Display each derivative with:
   - Platform badge with color
   - Character count with limit
   - Status badge
   - Content preview (expandable)
   - Publish timestamp (if published)
   - Preview and delete buttons
5. **Empty State**: Helpful message when no derivatives exist

## Event Logging

### Event Types

#### `derivative.published`
Logged when a single derivative is published:

```typescript
{
  "event_type": "derivative.published",
  "entity_type": "derivative",
  "entity_id": 1,
  "user_id": "user-123",
  "metadata": {
    "platform": "twitter",
    "briefId": 1,
    "characterCount": 173
  },
  "status": "success"
}
```

#### `publishing.batch`
Logged for batch publishing operations:

```typescript
{
  "event_type": "publishing.batch",
  "entity_type": "derivatives",
  "user_id": "user-123",
  "metadata": {
    "total": 5,
    "published": 4,
    "failed": 1,
    "failedIds": [3],
    "publishedIds": [1, 2, 4, 5]
  },
  "status": "partial"
}
```

### Querying Events

Get all published derivatives for a brief:

```typescript
// In your backend route or service
const events = await eventLogService.getEventsByType('derivative.published');

// Get published count
const publishedDerivatives = events.filter(e => e.status === 'success');
console.log(`Total published: ${publishedDerivatives.length}`);
```

Get publishing history for audit:

```typescript
const recentPublishing = await eventLogService.getEventsByDateRange(
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  new Date()
);
```

## Workflow Example

### Step 1: Create Brief
```typescript
const brief = await briefService.createBrief({
  ideaId: 1,
  title: "AI Content Creation",
  content_plan: "Discuss benefits of AI...",
  // ... other fields
});
```

### Step 2: Generate Derivatives
```typescript
const derivatives = await derivativeService.generateDerivatives({
  briefId: brief.id,
  platforms: ['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok']
});
```

### Step 3: Display in UI
```tsx
<MultiPublishQueue briefId={brief.id} />
```

### Step 4: User Publishes
- User selects derivatives in the UI
- Clicks "Publish"
- API publishes derivatives and logs events

### Step 5: Query Results
```typescript
const publishEvents = await eventLogService.getEventsByType('derivative.published');
const successCount = publishEvents.filter(e => e.status === 'success').length;
```

## Error Handling

The component handles various error scenarios:

- **Network errors**: Shows toast notification
- **Partial failures**: Indicates success and failure counts
- **Missing derivatives**: Displays empty state
- **Invalid IDs**: Returns 400 Bad Request

### Error Recovery

```typescript
// Retry failed derivatives
const { failed } = await derivativeService.publishDerivatives(ids);

if (failed.length > 0) {
  // Show which ones failed
  console.warn(`Failed IDs: ${failed.join(', ')}`);

  // Optionally retry
  await derivativeService.publishDerivatives(failed);
}
```

## Database Migrations

Apply migrations in order:

```bash
cd backend
npm run migrate:run
```

Migrations include:
1. `001_create_ideas_table.sql` - Ideas table
2. `002_create_briefs_table.sql` - Briefs table
3. `003_create_derivatives_table.sql` - Derivatives table
4. `004_create_event_logs_table.sql` - Event logs table

## Performance Considerations

### Indexing
Event logs are indexed by:
- `event_type` - Fast filtering by event type
- `entity_type, entity_id` - Quick entity lookups
- `created_at` - Sorting and date range queries
- `status` - Success/failure filtering

### Query Optimization
- Use pagination for large datasets (`limit`, `offset`)
- Filter by date range for historical queries
- Archive old events with the cleanup endpoint

### Batch Operations
- Publishing is transactional per derivative
- Events are logged asynchronously
- Failed publishes don't block subsequent items

## Testing

### Demo Page
Visit `/multipublish-demo` to see the component in action with sample data.

### Manual Testing Checklist
- [ ] Load derivatives for a brief
- [ ] Select individual derivatives
- [ ] Use "Select All" checkbox
- [ ] Expand content preview
- [ ] Delete a derivative
- [ ] Publish single derivative
- [ ] Publish multiple derivatives
- [ ] Verify events logged in database
- [ ] Check event statistics

### Integration Testing
```typescript
// Test full workflow
const derivatives = await derivativeService.generateDerivatives({
  briefId: 1,
  platforms: ['twitter', 'linkedin']
});

const { published } = await derivativeService.publishDerivatives(
  derivatives.map(d => d.id)
);

const events = await eventLogService.getEventsByType('derivative.published');
expect(events.length).toBe(2);
```

## Troubleshooting

### Problem: Derivatives not loading
- Check if briefId is valid
- Verify derivatives exist in database
- Check network tab for API errors

### Problem: Publishing fails silently
- Check server logs for errors
- Verify database connection
- Ensure event_logs table exists

### Problem: Events not logged
- Check EventLogService is instantiated
- Verify database write permissions
- Check event_logs table schema

## Related Components

- [DerivativeTabs](./DERIVATIVETABS_COMPONENT_GUIDE.md) - Display derivatives
- [BriefCard](./BRIEFCARD_COMPONENT_GUIDE.md) - Brief management
- [IdeaCard](./IDEACARD_COMPONENT_GUIDE.md) - Idea display

## Future Enhancements

- [ ] Scheduled publishing (publish at specific time)
- [ ] Publishing history/analytics dashboard
- [ ] Bulk editing before publishing
- [ ] Custom event metadata
- [ ] Publishing templates/presets
- [ ] Social media account integration
- [ ] Direct posting to platforms

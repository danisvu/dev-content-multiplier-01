# MultiPublishQueue Quick Start

Get publishing and event logging set up in 5 minutes!

## 🚀 Quick Setup

### 1. Apply Database Migrations

```bash
cd backend
npm run migrate:run
```

This creates three new tables:
- `derivatives` - Stores platform-specific content
- `event_logs` - Logs all publishing events

### 2. Add MultiPublishQueue to Your Page

```tsx
'use client'

import { MultiPublishQueue } from '@/components/MultiPublishQueue'

export default function PublishPage() {
  return (
    <MultiPublishQueue
      briefId={1}  // ID of your brief
      onPublishComplete={(count) => console.log(`Published ${count}`)}
      autoLoadDerivatives={true}
    />
  )
}
```

### 3. Create Derivatives First

Before publishing, you need derivatives. Generate them:

```bash
# Via API
curl -X POST http://localhost:3911/api/derivatives/generate \
  -H "Content-Type: application/json" \
  -d '{
    "briefId": 1,
    "platforms": ["twitter", "linkedin", "facebook", "instagram", "tiktok"],
    "model": "gemini",
    "temperature": 0.7
  }'
```

Or via code:

```typescript
const derivatives = await derivativeService.generateDerivatives({
  briefId: 1,
  platforms: ['twitter', 'linkedin', 'facebook'],
});
```

### 4. Publish Derivatives

In the UI:
1. Open the `MultiPublishQueue` component
2. View all derivatives for the brief
3. Select derivatives to publish (checkboxes)
4. Click "Publish" button
5. Events are automatically logged to database

Or via API:

```bash
curl -X POST http://localhost:3911/api/publishing/derivatives \
  -H "Content-Type: application/json" \
  -d '{
    "derivativeIds": [1, 2, 3],
    "userId": "user-123"
  }'
```

## 📊 Check Published Events

Query the database for published derivatives:

```typescript
// Get all derivative published events
const events = await eventLogService.getEventsByType('derivative.published');

// Get stats
const stats = await eventLogService.getEventStats('derivative.published');

// Get events for a specific entity
const briefEvents = await eventLogService.getEventsByEntity('derivative', 1);
```

Or via API:

```bash
# Get published events
curl http://localhost:3911/api/event-logs?eventType=derivative.published

# Get statistics
curl http://localhost:3911/api/event-logs/stats?eventType=derivative.published
```

## 🎯 Features at a Glance

| Feature | What it does |
|---------|-------------|
| **Select Multiple** | Checkbox selection for batch operations |
| **View Details** | Click eye icon to expand content preview |
| **Character Count** | See current vs platform limit |
| **Publish** | Send selected to database with logged events |
| **Delete** | Remove derivatives before publishing |
| **Status Badges** | See draft, published, or scheduled status |

## 📱 Supported Platforms

- **Twitter** - 280 chars
- **LinkedIn** - 3,000 chars
- **Facebook** - 63,206 chars
- **Instagram** - 2,200 chars
- **TikTok** - 2,200 chars

## 🔍 Event Logging

Every publish action creates an event log entry:

```json
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
  "status": "success",
  "created_at": "2024-11-10T15:30:00Z"
}
```

Batch publishes log:

```json
{
  "event_type": "publishing.batch",
  "entity_type": "derivatives",
  "user_id": "user-123",
  "metadata": {
    "total": 5,
    "published": 5,
    "failed": 0,
    "publishedIds": [1, 2, 3, 4, 5]
  },
  "status": "success"
}
```

## 💡 Common Tasks

### Load Derivatives for a Brief
```typescript
const derivatives = await fetch(`/api/derivatives/brief/1`).then(r => r.json());
```

### Publish All Draft Derivatives
```typescript
const response = await fetch('/api/publishing/derivatives', {
  method: 'POST',
  body: JSON.stringify({
    derivativeIds: draftIds,
    userId: 'current-user'
  })
});
```

### Get Publishing Stats
```typescript
const stats = await fetch('/api/event-logs/stats?eventType=derivative.published')
  .then(r => r.json());
```

### Clean Old Events (Admin)
```bash
curl -X POST http://localhost:3911/api/event-logs/cleanup \
  -H "Content-Type: application/json" \
  -d '{"daysOld": 30}'
```

## 🧪 Try the Demo

Visit `/multipublish-demo` to see it in action with sample data!

```bash
# Start development servers
cd backend && npm run dev  # Terminal 1
cd frontend && npm run dev # Terminal 2

# Navigate to
open http://localhost:3000/multipublish-demo
```

## 📋 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/derivatives/brief/:briefId` | Get all derivatives |
| `POST` | `/api/derivatives` | Create/update derivative |
| `PUT` | `/api/derivatives/:id` | Update derivative |
| `DELETE` | `/api/derivatives/:id` | Delete derivative |
| `POST` | `/api/derivatives/generate` | Generate from brief |
| `POST` | `/api/publishing/derivatives` | Batch publish |
| `POST` | `/api/publishing/derivative/:id` | Publish single |
| `GET` | `/api/event-logs` | Get event logs |
| `GET` | `/api/event-logs/stats` | Get stats |

## ⚠️ Troubleshooting

**Q: Derivatives not showing?**
A: Make sure derivatives exist. Create them via API first.

**Q: Events not logging?**
A: Ensure event_logs table was created with migrations.

**Q: Publishing fails?**
A: Check server logs: `npm run dev` shows detailed errors.

## 🔗 Full Documentation

See [MULTIPUBLISHQUEUE_GUIDE.md](./MULTIPUBLISHQUEUE_GUIDE.md) for:
- Complete architecture
- Database schema
- Service documentation
- Advanced usage
- Error handling
- Performance tips

## Next Steps

1. ✅ Set up database migrations
2. ✅ Add component to page
3. ✅ Generate some derivatives
4. ✅ Test publishing workflow
5. 📊 Query event logs for analytics
6. 🚀 Deploy to production!

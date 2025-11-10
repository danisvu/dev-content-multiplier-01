# Version Control Quick Start

Get version tracking and rollback working in 5 minutes!

## 🚀 Quick Setup

### 1. Apply Migration

```bash
cd backend
npm run migrate:run
```

This creates the `derivative_versions` table with full indexing.

### 2. Add Component to Your Page

```tsx
'use client'

import { DerivativeVersionHistory } from '@/components/DerivativeVersionHistory'

export default function MyPage() {
  return (
    <DerivativeVersionHistory
      derivativeId={1}
      onRollback={(version) => console.log('Restored:', version)}
    />
  )
}
```

### 3. Create a Version

```bash
# Via API
curl -X POST http://localhost:3911/api/versions \
  -H "Content-Type: application/json" \
  -d '{
    "derivativeId": 1,
    "content": "Updated content here",
    "changeSummary": "Improved tone",
    "changeType": "edited",
    "changeReason": "Better engagement"
  }'
```

Or via code:

```typescript
const version = await versionControlService.createVersion({
  derivativeId: 1,
  content: 'New content...',
  changeType: 'edited',
  changeSummary: 'Updated tone',
  changeReason: 'Testing new approach'
});
```

### 4. Rollback Anytime

```bash
# Via API
curl -X POST http://localhost:3911/api/versions/rollback \
  -H "Content-Type: application/json" \
  -d '{
    "targetVersionId": 3,
    "userId": "user-123"
  }'
```

Or click the rollback button in the UI!

## 📊 View All Versions

```bash
# Get all versions
curl http://localhost:3911/api/versions/1

# Get timeline
curl http://localhost:3911/api/versions/timeline/1

# Get statistics
curl http://localhost:3911/api/versions/stats/1
```

## 🎯 Key Features at a Glance

| Feature | What it does |
|---------|-------------|
| **Timeline** | Visual history of all versions |
| **Rollback** | Restore any previous version instantly |
| **Delete** | Remove old versions (except current) |
| **Change Tracking** | Who, what, when, why |
| **Character Count** | Track content length over time |
| **Version Types** | created, edited, ai_regenerated, rollback |
| **Event Logging** | All changes logged to database |
| **Comparison** | Compare two versions |

## 🔄 Version Types

```typescript
// When derivative is created
'created'

// When user edits manually
'edited'
// With metadata:
{
  changeSummary: 'Updated tone',
  changeReason: 'Better engagement'
}

// When AI generates new content
'ai_regenerated'

// When rolling back to previous
'rollback'
// Automatically includes:
{
  changeSummary: 'Rolled back to version 2',
  changeReason: 'Previous version performed better'
}
```

## 💡 Common Tasks

### Create a new version
```typescript
await versionControlService.createVersion({
  derivativeId: 1,
  content: 'new content',
  changeType: 'edited',
  changeSummary: 'Updated tone'
});
```

### Get all versions for a derivative
```typescript
const versions = await versionControlService.getDerivativeVersions(1);
```

### Rollback to specific version
```typescript
const rolled = await versionControlService.rollbackToVersion(
  derivativeId,
  targetVersionId,
  userId
);
```

### Delete old version
```bash
curl -X DELETE http://localhost:3911/api/version/5
```

### Compare two versions
```typescript
const comparison = await versionControlService.compareVersions(
  version1Id,
  version2Id
);
console.log('Added:', comparison.added);
console.log('Removed:', comparison.removed);
```

### Purge old versions (keep only last 10)
```bash
curl -X POST http://localhost:3911/api/versions/purge/1 \
  -H "Content-Type: application/json" \
  -d '{"keepCount": 10}'
```

## 🧪 Try the Demo

Visit `/version-control-demo` to see it in action!

```bash
# Start servers
cd backend && npm run dev  # Terminal 1
cd frontend && npm run dev # Terminal 2

# Visit
open http://localhost:3000/version-control-demo
```

## 📋 API Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/versions/:derivativeId` | Get all versions |
| `GET` | `/api/version/:versionId` | Get specific version |
| `GET` | `/api/versions/timeline/:derivativeId` | Get timeline |
| `POST` | `/api/versions` | Create new version |
| `POST` | `/api/versions/rollback` | Rollback to version |
| `DELETE` | `/api/version/:versionId` | Delete version |
| `POST` | `/api/versions/compare` | Compare versions |
| `GET` | `/api/versions/stats/:derivativeId` | Get statistics |
| `POST` | `/api/versions/purge/:derivativeId` | Purge old versions |

## ⚠️ Important Notes

- **Only one current version** per derivative at a time
- **Can't delete current version** (must rollback/switch first)
- **Rollback creates new version** (maintains full history)
- **All actions logged** to event_logs for audit trail
- **Character counts tracked** at each version

## 🔍 Check Your Versions

```bash
# View all versions for derivative 1
psql -d your_db -c "SELECT id, version_number, change_type, is_current, created_at FROM derivative_versions WHERE derivative_id = 1 ORDER BY version_number DESC;"

# Get statistics
psql -d your_db -c "SELECT change_type, COUNT(*) as count FROM derivative_versions WHERE derivative_id = 1 GROUP BY change_type;"

# See rollback history
psql -d your_db -c "SELECT * FROM derivative_versions WHERE derivative_id = 1 AND change_type = 'rollback';"
```

## 🚀 Next Steps

1. ✅ Apply migrations
2. ✅ Add component to page
3. ✅ Create some versions
4. ✅ Try rollback
5. 📊 View statistics
6. 🔄 Compare versions
7. 🗑️ Clean up old versions

## 📚 Full Documentation

See [VERSIONCONTROL_GUIDE.md](./VERSIONCONTROL_GUIDE.md) for:
- Complete API reference
- Database schema details
- Service documentation
- Workflow examples
- Performance tips
- Best practices

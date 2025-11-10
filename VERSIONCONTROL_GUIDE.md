# Version Control Guide

## Overview

The **Version Control** system provides comprehensive version management for derivatives. It allows you to:
- Track all changes to derivative content
- Create snapshots at each modification
- Rollback to any previous version instantly
- Maintain a complete audit trail
- Compare different versions
- Auto-purge old versions while maintaining current

## Architecture

### Database Schema

#### derivative_versions Table
Stores all versions of derivatives with complete history:

```sql
CREATE TABLE derivative_versions (
    id SERIAL PRIMARY KEY,
    derivative_id INTEGER NOT NULL,
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    character_count INTEGER,
    change_summary VARCHAR(255),
    change_type VARCHAR(50),
    changed_by VARCHAR(100),
    change_reason TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_derivative FOREIGN KEY(derivative_id) REFERENCES derivatives(id),
    CONSTRAINT unique_version_number UNIQUE(derivative_id, version_number),
    CONSTRAINT unique_current_version UNIQUE(derivative_id, is_current) WHERE is_current = TRUE
);
```

**Key Columns:**
- `version_number` - Auto-incrementing version identifier per derivative
- `change_type` - Type of change: created, edited, ai_regenerated, rollback
- `is_current` - Only one version per derivative can be current
- `change_reason` - Why the change was made (audit trail)

### Version Control Service

The `VersionControlService` handles all version operations:

```typescript
class VersionControlService {
  // Create new version
  async createVersion(input: CreateVersionInput): Promise<DerivativeVersion>

  // Get all versions
  async getDerivativeVersions(derivativeId: number): Promise<DerivativeVersion[]>

  // Get specific version
  async getVersion(versionId: number): Promise<DerivativeVersion | null>

  // Get current version
  async getCurrentVersion(derivativeId: number): Promise<DerivativeVersion | null>

  // Rollback to specific version
  async rollbackToVersion(
    derivativeId: number,
    targetVersionId: number,
    userId?: string
  ): Promise<DerivativeVersion>

  // Compare two versions
  async compareVersions(version1Id: number, version2Id: number): Promise<VersionComparison>

  // Delete non-current version
  async deleteVersion(versionId: number, userId?: string): Promise<boolean>

  // Get version history
  async getVersionHistory(derivativeId: number, limit?: number): Promise<DerivativeVersion[]>

  // Get statistics
  async getVersionStats(derivativeId: number): Promise<Record<string, any>>

  // Purge old versions
  async purgeOldVersions(derivativeId: number, keepCount?: number): Promise<number>

  // Get timeline
  async getVersionTimeline(derivativeId: number): Promise<any[]>
}
```

## API Endpoints

### Version Management

#### Get All Versions
```http
GET /api/versions/:derivativeId

Response:
[
  {
    "id": 1,
    "derivative_id": 1,
    "version_number": 1,
    "content": "...",
    "character_count": 173,
    "change_type": "created",
    "change_summary": "Initial version",
    "changed_by": "john_doe",
    "is_current": false,
    "created_at": "2024-11-08T10:00:00Z"
  }
]
```

#### Get Specific Version
```http
GET /api/version/:versionId

Response:
{
  "id": 1,
  "derivative_id": 1,
  ...
}
```

#### Get Version Timeline
```http
GET /api/versions/timeline/:derivativeId

Response:
[
  {
    "id": 1,
    "version_number": 1,
    "change_summary": "Initial version",
    "change_type": "created",
    "changed_by": "john_doe",
    "created_at": "2024-11-08T10:00:00Z",
    "is_current": false,
    "character_count": 173
  }
]
```

### Version Operations

#### Create New Version
```http
POST /api/versions
Content-Type: application/json

{
  "derivativeId": 1,
  "content": "New content here...",
  "changeSummary": "Updated tone",
  "changeType": "edited",
  "changeReason": "Improved engagement",
  "changedBy": "user-123"
}

Response: [DerivativeVersion]
```

#### Rollback to Version
```http
POST /api/versions/rollback
Content-Type: application/json

{
  "targetVersionId": 5,
  "userId": "user-123"
}

Response:
{
  "message": "Successfully rolled back to previous version",
  "version": [DerivativeVersion with rollback type]
}
```

#### Delete Version
```http
DELETE /api/version/:versionId

Response: 204 No Content
```

**Note:** Can only delete non-current versions

#### Compare Versions
```http
POST /api/versions/compare
Content-Type: application/json

{
  "version1Id": 1,
  "version2Id": 3
}

Response:
{
  "version1": [DerivativeVersion],
  "version2": [DerivativeVersion],
  "added": "new content words...",
  "removed": "old content words...",
  "modified": true
}
```

### Statistics & Maintenance

#### Get Version Statistics
```http
GET /api/versions/stats/:derivativeId

Response:
{
  "totalVersions": 5,
  "byChangeType": [
    { "change_type": "edited", "count": 2 },
    { "change_type": "created", "count": 1 }
  ]
}
```

#### Purge Old Versions
```http
POST /api/versions/purge/:derivativeId
Content-Type: application/json

{
  "keepCount": 10
}

Response:
{
  "message": "Deleted 5 old versions, keeping last 10",
  "deletedCount": 5
}
```

## Version Types

### Created
The initial version when a derivative is first created.

### Edited
Manual content modification by a user. Includes change summary and reason.

```typescript
{
  "changeType": "edited",
  "changeSummary": "Updated tone",
  "changeReason": "Test A/B variant with more casual tone"
}
```

### AI Regenerated
Content generated by AI model. Automatically tracked.

```typescript
{
  "changeType": "ai_regenerated",
  "changeSummary": "AI-generated high-converting version",
  "changeReason": "Testing new model for better copywriting"
}
```

### Rollback
When restoring a previous version. Preserves the original version information.

```typescript
{
  "changeType": "rollback",
  "changeSummary": "Rolled back to version 2",
  "changeReason": "Previous version performed better in testing"
}
```

## Frontend Component Usage

### Basic Usage

```tsx
import { DerivativeVersionHistory } from '@/components/DerivativeVersionHistory'

export default function MyPage() {
  return (
    <DerivativeVersionHistory
      derivativeId={1}
      platform="twitter"
      onRollback={(version) => {
        console.log('Rolled back to:', version)
      }}
    />
  )
}
```

### Component Features

- **Version Timeline** - Visual timeline of all versions
- **Rollback Button** - One-click restore to any version
- **Delete Version** - Remove old versions (except current)
- **Content Preview** - Expandable preview of each version
- **Change Info** - Change type, summary, reason
- **User Info** - Who made the change and when
- **Character Count** - Track content length changes
- **Statistics** - Version count and breakdown

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `derivativeId` | `number` | - | ID of the derivative |
| `platform` | `string` | undefined | Platform name (for display) |
| `onRollback` | `(version: DerivativeVersion) => void` | undefined | Callback when rollback completes |

## Event Logging

All version operations are logged to the event_logs table:

### Version Created Event
```json
{
  "event_type": "derivative.version.created",
  "entity_type": "derivative_version",
  "entity_id": 5,
  "user_id": "user-123",
  "metadata": {
    "derivativeId": 1,
    "versionNumber": 5,
    "changeType": "edited",
    "changeSummary": "Updated tone"
  },
  "status": "success"
}
```

### Rollback Event
```json
{
  "event_type": "derivative.version.rollback",
  "entity_type": "derivative",
  "entity_id": 1,
  "user_id": "user-123",
  "metadata": {
    "fromVersionId": 5,
    "toVersionId": 7,
    "fromVersionNumber": 5,
    "toVersionNumber": 7
  },
  "status": "success"
}
```

## Workflow Examples

### Create and Modify Content

```typescript
// 1. Initial version is created automatically
const derivative = await derivativeService.createDerivative({
  briefId: 1,
  platform: 'twitter',
  content: 'Initial content...'
});

// 2. User edits content
await versionControlService.createVersion({
  derivativeId: derivative.id,
  content: 'Updated content...',
  changeType: 'edited',
  changeSummary: 'Improved headline',
  changeReason: 'Better engagement metrics'
});

// 3. View all versions
const versions = await versionControlService.getDerivativeVersions(derivative.id);
```

### A/B Testing with Versions

```typescript
// Version 1: Original
const v1 = await versionControlService.createVersion({
  derivativeId: 1,
  content: 'Original content...',
  changeType: 'created'
});

// Version 2: Variant A
const v2 = await versionControlService.createVersion({
  derivativeId: 1,
  content: 'Variant A content...',
  changeType: 'edited',
  changeSummary: 'A/B Test Variant A',
  changeReason: 'Testing more casual tone'
});

// Version 3: Variant B
const v3 = await versionControlService.createVersion({
  derivativeId: 1,
  content: 'Variant B content...',
  changeType: 'edited',
  changeSummary: 'A/B Test Variant B',
  changeReason: 'Testing professional tone'
});

// Compare variants
const comparison = await versionControlService.compareVersions(v2.id, v3.id);
console.log('Differences:', comparison);

// Restore best performer
const winner = v2; // Assume v2 performed better
await versionControlService.rollbackToVersion(1, winner.id, 'analyst');
```

### Version Cleanup

```typescript
// Keep only last 10 versions
const deletedCount = await versionControlService.purgeOldVersions(
  derivativeId,
  10
);

console.log(`Cleaned up ${deletedCount} old versions`);
```

## Database Queries

### Get all versions for a derivative
```sql
SELECT * FROM derivative_versions
WHERE derivative_id = 1
ORDER BY version_number DESC;
```

### Get current version
```sql
SELECT * FROM derivative_versions
WHERE derivative_id = 1 AND is_current = TRUE;
```

### Get version history by change type
```sql
SELECT * FROM derivative_versions
WHERE derivative_id = 1 AND change_type = 'edited'
ORDER BY created_at DESC;
```

### Count versions by type
```sql
SELECT change_type, COUNT(*) as count
FROM derivative_versions
WHERE derivative_id = 1
GROUP BY change_type;
```

## Performance Considerations

### Indexing
- `idx_derivative_versions_derivative_id` - Fast lookups by derivative
- `idx_derivative_versions_version_number` - Version number queries
- `idx_derivative_versions_is_current` - Current version lookup (single row)
- `idx_derivative_versions_created_at` - Timeline and sorting

### Optimization Tips
1. **Archive old derivatives** - Move ancient derivatives to separate table
2. **Batch purge** - Clean up versions monthly
3. **Pagination** - Load version history in pages
4. **Limit history** - Keep most recent N versions

## Limitations & Best Practices

### Current Limitations
- Simple text diff (not character-level diff)
- No branching (single timeline per derivative)
- No collaborative editing history

### Best Practices
1. **Use descriptive summaries** - Clear change descriptions
2. **Log reasons** - Always include why changes were made
3. **Regular cleanup** - Archive old versions periodically
4. **User tracking** - Always track who made changes
5. **Version naming** - Use consistent naming convention

## Related Features

- [MultiPublishQueue](./MULTIPUBLISHQUEUE_GUIDE.md) - Publish derivatives
- [DerivativeTabs](./DERIVATIVETABS_COMPONENT_GUIDE.md) - Display derivatives
- [Event Logging](./MULTIPUBLISHQUEUE_GUIDE.md#event-logging) - Audit trail

## Future Enhancements

- [ ] Advanced diff with character-level changes
- [ ] Branch management for variants
- [ ] Collaborative editing history
- [ ] Version annotations and comments
- [ ] Performance analytics per version
- [ ] Version scheduling
- [ ] A/B testing integration
- [ ] Export version history

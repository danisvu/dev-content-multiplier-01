# 🔒 Status Validation for Brief Generation

## Tổng Quan

Để đảm bảo chất lượng và kiểm soát quy trình, **chỉ các ideas có `status = 'selected'`** mới được phép generate brief bằng AI.

## 🎯 Why Status Validation?

### Lý do triển khai:
1. **Quality Control**: Chỉ những ý tưởng đã được review và chọn lọc mới đi tiếp
2. **Cost Management**: Tiết kiệm quota AI bằng cách không generate briefs cho mọi idea
3. **Workflow Control**: Đảm bảo process tuân theo các giai đoạn định sẵn
4. **Resource Optimization**: Tránh lãng phí tài nguyên cho ideas không phù hợp

### Workflow đề xuất:
```
📝 Idea Created        (status: pending)
      ↓
👀 Team Review
      ↓
✅ Idea Approved       (status: selected) ← REQUIRED for brief generation
      ↓
🤖 Generate Brief      (AI-powered)
      ↓
📄 Brief Created       (status: draft)
```

---

## 📊 Idea Status Lifecycle

### Available Statuses:

| Status | Description | Can Generate Brief? | Next Steps |
|--------|-------------|---------------------|------------|
| `pending` | Idea mới tạo, chưa review | ❌ No | Review → Select/Reject |
| `selected` | ✅ Idea đã được chọn | ✅ **YES** | Generate brief |
| `rejected` | Idea bị từ chối | ❌ No | Archive or delete |
| `generated` | Brief đã được tạo | ⚠️ No (already done) | Edit brief or regenerate |

### State Diagram:
```
      ┌──────────┐
      │ pending  │  ← New idea
      └────┬─────┘
           │
    ┌──────┴──────┐
    │   Review    │
    └──────┬──────┘
           │
     ┌─────┴─────┐
     │           │
  ┌──▼──┐    ┌──▼──────┐
  │selected│  │rejected │
  └──┬───┘    └─────────┘
     │
┌────▼────────┐
│Generate Brief│
└────┬────────┘
     │
┌────▼─────┐
│generated │
└──────────┘
```

---

## 🔧 API Endpoints

### 1. Update Idea Status

**Endpoint**: `PATCH /api/ideas/:id/status`

**Request**:
```bash
curl -X PATCH http://localhost:3911/api/ideas/52/status \
  -H "Content-Type: application/json" \
  -d '{"status": "selected"}'
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Idea status updated to 'selected'",
  "idea": {
    "id": 52,
    "title": "Building a Real-Time Vehicle Tracking System with MQTT",
    "status": "selected",
    "created_at": "2025-11-03T13:55:43.460Z",
    ...
  }
}
```

**Allowed Status Values**:
- `"pending"`
- `"selected"`
- `"rejected"`
- `"generated"`

---

### 2. Generate Brief (with Validation)

**Endpoint**: `POST /api/briefs/generate`

**Request**:
```bash
curl -X POST http://localhost:3911/api/briefs/generate \
  -H "Content-Type: application/json" \
  -d '{
    "idea_id": 52,
    "model": "gemini",
    "temperature": 0.7
  }'
```

**Success Response (201 Created)** - When status='selected':
```json
{
  "success": true,
  "message": "Brief generated successfully by AI",
  "brief": {
    "id": 2,
    "idea_id": 52,
    "title": "Real-Time Vehicle Tracking: Build with MQTT",
    "content_plan": "Detailed content plan...",
    "status": "draft",
    ...
  }
}
```

**Error Response (403 Forbidden)** - When status ≠ 'selected':
```json
{
  "error": "Invalid idea status",
  "details": "Cannot generate brief: Idea status must be 'selected'. Current status: 'pending'. Please update the idea status to 'selected' before generating a brief.",
  "required_status": "selected",
  "hint": "Update the idea status to \"selected\" before generating a brief"
}
```

**Other Error Responses**:

**404 Not Found** - Idea doesn't exist:
```json
{
  "error": "Idea not found",
  "details": "Idea with ID 999 not found"
}
```

**500 Internal Server Error** - AI or parsing error:
```json
{
  "error": "Failed to generate brief",
  "details": "Failed to parse AI-generated brief. Please try again."
}
```

---

## 💻 Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3911/api';

// Step 1: Update idea status to 'selected'
async function selectIdea(ideaId) {
  const response = await axios.patch(`${API_BASE}/ideas/${ideaId}/status`, {
    status: 'selected'
  });
  
  console.log('✅ Idea selected:', response.data.idea.title);
  return response.data.idea;
}

// Step 2: Generate brief
async function generateBrief(ideaId) {
  try {
    const response = await axios.post(`${API_BASE}/briefs/generate`, {
      idea_id: ideaId,
      model: 'gemini',
      temperature: 0.7
    });
    
    console.log('✅ Brief generated:', response.data.brief.title);
    return response.data.brief;
  } catch (error) {
    if (error.response?.status === 403) {
      console.error('❌ Error: Idea must have status="selected"');
      console.error('Hint:', error.response.data.hint);
    } else {
      console.error('❌ Error:', error.response?.data || error.message);
    }
    throw error;
  }
}

// Complete workflow
async function createBriefFromIdea(ideaId) {
  try {
    // Select the idea first
    await selectIdea(ideaId);
    
    // Then generate brief
    const brief = await generateBrief(ideaId);
    
    return brief;
  } catch (error) {
    console.error('Workflow failed:', error.message);
  }
}

// Usage
createBriefFromIdea(52);
```

---

### Python

```python
import requests

API_BASE = 'http://localhost:3911/api'

def select_idea(idea_id: int):
    """Update idea status to 'selected'"""
    response = requests.patch(
        f'{API_BASE}/ideas/{idea_id}/status',
        json={'status': 'selected'}
    )
    response.raise_for_status()
    
    print(f"✅ Idea selected: {response.json()['idea']['title']}")
    return response.json()['idea']

def generate_brief(idea_id: int):
    """Generate brief from selected idea"""
    try:
        response = requests.post(
            f'{API_BASE}/briefs/generate',
            json={
                'idea_id': idea_id,
                'model': 'gemini',
                'temperature': 0.7
            }
        )
        response.raise_for_status()
        
        brief = response.json()['brief']
        print(f"✅ Brief generated: {brief['title']}")
        return brief
        
    except requests.HTTPError as e:
        if e.response.status_code == 403:
            error_data = e.response.json()
            print(f"❌ Error: {error_data['error']}")
            print(f"Hint: {error_data['hint']}")
        raise

def create_brief_from_idea(idea_id: int):
    """Complete workflow: select idea → generate brief"""
    try:
        # Step 1: Select idea
        select_idea(idea_id)
        
        # Step 2: Generate brief
        brief = generate_brief(idea_id)
        
        return brief
    except Exception as e:
        print(f"Workflow failed: {str(e)}")

# Usage
create_brief_from_idea(52)
```

---

### Bash Script

```bash
#!/bin/bash

API_BASE="http://localhost:3911/api"
IDEA_ID=52

# Step 1: Update status to 'selected'
echo "📝 Selecting idea ${IDEA_ID}..."
curl -X PATCH "${API_BASE}/ideas/${IDEA_ID}/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "selected"}' \
  | json_pp

# Step 2: Generate brief
echo -e "\n🤖 Generating brief..."
curl -X POST "${API_BASE}/briefs/generate" \
  -H "Content-Type: application/json" \
  -d "{\"idea_id\": ${IDEA_ID}, \"model\": \"gemini\"}" \
  | json_pp
```

---

## 🧪 Testing

### Run Validation Test Script

```bash
./test-brief-validation.sh
```

**What it tests**:
1. ✅ Attempts to generate brief with non-selected status (expects 403)
2. ✅ Updates idea status to 'selected'
3. ✅ Generates brief successfully with selected status

### Manual Testing

```bash
# Test 1: Try with non-selected idea
curl -X POST http://localhost:3911/api/briefs/generate \
  -H "Content-Type: application/json" \
  -d '{"idea_id": 1}'
# Expected: 403 Forbidden

# Test 2: Select the idea
curl -X PATCH http://localhost:3911/api/ideas/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "selected"}'
# Expected: 200 OK

# Test 3: Try again with selected idea
curl -X POST http://localhost:3911/api/briefs/generate \
  -H "Content-Type: application/json" \
  -d '{"idea_id": 1}'
# Expected: 201 Created
```

---

## 🔄 Common Workflows

### Workflow 1: Single Idea → Brief

```
1. Create idea           → POST /api/ideas
2. Review idea           (manual)
3. Select idea           → PATCH /api/ideas/:id/status {"status": "selected"}
4. Generate brief        → POST /api/briefs/generate
5. Review/edit brief     → PUT /api/briefs/:id
6. Publish brief         → PATCH /api/briefs/:id/status
```

### Workflow 2: Bulk Idea Selection

```bash
# Get all pending ideas
curl http://localhost:3911/api/ideas | jq '.[] | select(.status=="pending")'

# Select multiple ideas
for id in 1 2 3 5 7; do
  curl -X PATCH "http://localhost:3911/api/ideas/$id/status" \
    -H "Content-Type: application/json" \
    -d '{"status": "selected"}'
done

# Generate briefs for all selected ideas
for id in 1 2 3 5 7; do
  curl -X POST "http://localhost:3911/api/briefs/generate" \
    -H "Content-Type: application/json" \
    -d "{\"idea_id\": $id}"
done
```

### Workflow 3: Regenerate Brief

```
1. Update idea status back to 'selected'
   → PATCH /api/ideas/:id/status {"status": "selected"}
   
2. Delete old brief (optional)
   → DELETE /api/briefs/:brief_id
   
3. Generate new brief
   → POST /api/briefs/generate
```

---

## ⚠️ Important Notes

### 1. Status is CASE-SENSITIVE
```javascript
✅ Good: {"status": "selected"}
❌ Bad:  {"status": "Selected"}
❌ Bad:  {"status": "SELECTED"}
```

### 2. Status Must be Exact
```javascript
✅ Good: "selected"
❌ Bad:  "select"
❌ Bad:  "approved"
❌ Bad:  "ready"
```

### 3. Already Generated Ideas
If an idea has `status = "generated"`, you'll get 403. To regenerate:
```bash
# Option 1: Change status back to 'selected'
curl -X PATCH http://localhost:3911/api/ideas/52/status \
  -d '{"status": "selected"}'

# Option 2: Keep status, delete old brief, then regenerate
curl -X DELETE http://localhost:3911/api/briefs/2
```

### 4. Validation Runs BEFORE AI Call
The status check happens **before** calling the AI API, so:
- ✅ No wasted AI quota on invalid requests
- ✅ Fast error response (no 10-30s wait)
- ✅ Clear error message with solution

---

## 🐛 Troubleshooting

### Error: "Invalid idea status"

**Cause**: Idea status is not 'selected'

**Solution**:
```bash
# Check current status
curl http://localhost:3911/api/ideas/52

# Update to 'selected'
curl -X PATCH http://localhost:3911/api/ideas/52/status \
  -H "Content-Type: application/json" \
  -d '{"status": "selected"}'
```

### Error: "Idea not found"

**Cause**: Invalid idea_id

**Solution**:
```bash
# List all ideas
curl http://localhost:3911/api/ideas

# Use a valid ID
curl -X POST http://localhost:3911/api/briefs/generate \
  -d '{"idea_id": <valid_id>}'
```

### Can't Update Status

**Cause**: Malformed request or server error

**Solutions**:
- Check Content-Type header: `application/json`
- Verify JSON syntax
- Check server logs
- Ensure database is running

---

## 📊 Monitoring & Analytics

### Check Status Distribution

```bash
# Get status counts
curl http://localhost:3911/api/ideas | \
  jq 'group_by(.status) | map({status: .[0].status, count: length})'
```

**Example Output**:
```json
[
  {"status": "pending", "count": 25},
  {"status": "selected", "count": 8},
  {"status": "rejected", "count": 3},
  {"status": "generated", "count": 12}
]
```

### Find Ideas Ready for Brief Generation

```bash
# Get all 'selected' ideas that don't have briefs yet
curl http://localhost:3911/api/ideas | \
  jq '.[] | select(.status=="selected")'
```

---

## 🎯 Best Practices

1. **Always Review Before Selecting**
   - Don't automatically select all ideas
   - Have a review process
   - Document selection criteria

2. **Use Bulk Operations Carefully**
   - Test with 1-2 ideas first
   - Monitor AI quota usage
   - Handle errors gracefully

3. **Track Status Changes**
   - Log who changed status and when
   - Keep audit trail (future enhancement)
   - Document rejection reasons

4. **Manage AI Costs**
   - Only select high-quality ideas
   - Set daily/weekly generation limits
   - Monitor API usage

5. **Handle Edge Cases**
   - What if brief generation fails mid-process?
   - What if AI returns invalid data?
   - What if user wants to regenerate?

---

## 🔮 Future Enhancements

Potential improvements:
- [ ] Add `updated_by` field to track who changed status
- [ ] Add `status_updated_at` timestamp
- [ ] Email notification when idea is selected
- [ ] Batch status update endpoint
- [ ] Status change history/audit log
- [ ] Approval workflow (multi-level)
- [ ] Automatic status progression (e.g., generated → review)
- [ ] Role-based permissions (who can select ideas)

---

## 📚 Related Documentation

- [Brief Generation Guide](./BRIEF_GENERATION_GUIDE.md) - How to use brief generation
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [README](./README.md) - Project overview

---

**Updated**: November 3, 2025  
**Status**: ✅ Production Ready  
**Tested**: ✅ All validation tests passing


# Briefs API Documentation

API endpoints cho quản lý bản kế hoạch nội dung (content briefs).

## Database Schema

### Bảng `briefs`

```sql
CREATE TABLE briefs (
    id SERIAL PRIMARY KEY,
    idea_id INTEGER NOT NULL,              -- Liên kết với bảng ideas
    title VARCHAR(255) NOT NULL,           -- Tiêu đề của brief
    content_plan TEXT NOT NULL,            -- Nội dung kế hoạch chi tiết
    target_audience TEXT,                  -- Đối tượng người đọc mục tiêu
    key_points TEXT[],                     -- Các điểm chính cần đề cập
    tone VARCHAR(100),                     -- Giọng điệu (formal, casual, etc.)
    word_count INTEGER,                    -- Số lượng từ mục tiêu
    keywords TEXT[],                       -- Từ khóa SEO
    references TEXT,                       -- Tài liệu tham khảo
    status VARCHAR(50) DEFAULT 'draft',    -- Trạng thái (draft/review/approved/published)
    created_at TIMESTAMP,                  -- Thời gian tạo
    updated_at TIMESTAMP,                  -- Thời gian cập nhật
    
    FOREIGN KEY(idea_id) REFERENCES ideas(id) ON DELETE CASCADE
);
```

## API Endpoints

Base URL: `http://localhost:3911/api`

### 1. Get All Briefs

**GET** `/briefs`

Lấy danh sách tất cả briefs.

**Response:**
```json
[
  {
    "id": 1,
    "idea_id": 5,
    "idea_title": "10 Tips for Remote Work",
    "title": "Remote Work Guide Brief",
    "content_plan": "A comprehensive guide covering...",
    "target_audience": "Remote workers and digital nomads",
    "key_points": ["Productivity", "Communication", "Work-life balance"],
    "tone": "professional",
    "word_count": 1500,
    "keywords": ["remote work", "productivity", "work from home"],
    "references": "https://example.com/source",
    "status": "draft",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  }
]
```

### 2. Get Brief by ID

**GET** `/briefs/:id`

Lấy thông tin chi tiết một brief.

**Parameters:**
- `id` (path) - ID của brief

**Response:**
```json
{
  "id": 1,
  "idea_id": 5,
  "idea_title": "10 Tips for Remote Work",
  "idea_description": "Ideas for remote workers...",
  "title": "Remote Work Guide Brief",
  "content_plan": "A comprehensive guide covering...",
  "target_audience": "Remote workers and digital nomads",
  "key_points": ["Productivity", "Communication", "Work-life balance"],
  "tone": "professional",
  "word_count": 1500,
  "keywords": ["remote work", "productivity"],
  "references": "https://example.com/source",
  "status": "draft",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

### 3. Get Briefs by Idea ID

**GET** `/briefs/idea/:ideaId`

Lấy tất cả briefs liên kết với một idea.

**Parameters:**
- `ideaId` (path) - ID của idea

**Response:**
```json
[
  {
    "id": 1,
    "idea_id": 5,
    "title": "Remote Work Guide Brief",
    ...
  },
  {
    "id": 2,
    "idea_id": 5,
    "title": "Remote Work Checklist Brief",
    ...
  }
]
```

### 4. Get Briefs by Status

**GET** `/briefs/status/:status`

Lấy briefs theo trạng thái.

**Parameters:**
- `status` (path) - Trạng thái: `draft`, `review`, `approved`, `published`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Remote Work Guide Brief",
    "status": "draft",
    ...
  }
]
```

### 5. Get Brief Statistics

**GET** `/briefs/stats`

Lấy thống kê về briefs.

**Response:**
```json
{
  "total_briefs": "25",
  "draft_count": "10",
  "review_count": "8",
  "approved_count": "5",
  "published_count": "2"
}
```

### 6. Create New Brief

**POST** `/briefs`

Tạo brief mới.

**Request Body:**
```json
{
  "idea_id": 5,
  "title": "Remote Work Guide Brief",
  "content_plan": "A comprehensive guide that will cover...",
  "target_audience": "Remote workers and digital nomads aged 25-45",
  "key_points": [
    "Setting up productive workspace",
    "Communication best practices",
    "Managing work-life balance"
  ],
  "tone": "professional",
  "word_count": 1500,
  "keywords": ["remote work", "productivity", "work from home"],
  "references": "https://example.com/research",
  "status": "draft"
}
```

**Required Fields:**
- `idea_id` - ID của ý tưởng liên kết
- `title` - Tiêu đề brief
- `content_plan` - Nội dung kế hoạch

**Optional Fields:**
- `target_audience` - Đối tượng mục tiêu
- `key_points` - Mảng các điểm chính
- `tone` - Giọng điệu
- `word_count` - Số lượng từ
- `keywords` - Mảng từ khóa
- `references` - Tài liệu tham khảo
- `status` - Trạng thái (mặc định: `draft`)

**Response:**
```json
{
  "id": 1,
  "idea_id": 5,
  "title": "Remote Work Guide Brief",
  "content_plan": "A comprehensive guide that will cover...",
  ...
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

### 7. Update Brief

**PUT** `/briefs/:id`

Cập nhật brief.

**Parameters:**
- `id` (path) - ID của brief

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "review",
  "word_count": 2000,
  "key_points": [
    "New point 1",
    "New point 2"
  ]
}
```

**Note:** Chỉ cần gửi các trường cần update.

**Response:**
```json
{
  "id": 1,
  "title": "Updated Title",
  "status": "review",
  ...
  "updated_at": "2025-01-15T11:30:00Z"
}
```

### 8. Delete Brief

**DELETE** `/briefs/:id`

Xóa brief.

**Parameters:**
- `id` (path) - ID của brief

**Response:**
```json
{
  "message": "Brief deleted successfully",
  "id": 1
}
```

## Status Values

Các giá trị cho trường `status`:
- `draft` - Đang soạn thảo
- `review` - Đang xem xét
- `approved` - Đã phê duyệt
- `published` - Đã xuất bản

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields",
  "required": ["idea_id", "title", "content_plan"]
}
```

### 404 Not Found
```json
{
  "error": "Brief not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create brief",
  "details": "Database connection error"
}
```

## Usage Examples

### Create Brief with cURL

```bash
curl -X POST http://localhost:3911/api/briefs \
  -H "Content-Type: application/json" \
  -d '{
    "idea_id": 5,
    "title": "Remote Work Guide",
    "content_plan": "Comprehensive guide for remote workers...",
    "target_audience": "Remote workers",
    "key_points": ["Productivity", "Communication"],
    "tone": "professional",
    "word_count": 1500
  }'
```

### Update Brief Status

```bash
curl -X PUT http://localhost:3911/api/briefs/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

### Get Briefs for Specific Idea

```bash
curl http://localhost:3911/api/briefs/idea/5
```

## Database Relationships

- Mỗi `brief` phải liên kết với một `idea` thông qua `idea_id`
- Khi xóa một `idea`, tất cả `briefs` liên quan sẽ tự động bị xóa (CASCADE)
- Field `updated_at` tự động cập nhật khi có thay đổi (trigger)

## Indexes

Các indexes được tạo để tối ưu query performance:
- `idx_briefs_idea_id` - Trên cột `idea_id`
- `idx_briefs_status` - Trên cột `status`
- `idx_briefs_created_at` - Trên cột `created_at`


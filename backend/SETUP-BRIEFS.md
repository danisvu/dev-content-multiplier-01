# Hướng Dẫn Setup Bảng Briefs

Tài liệu hướng dẫn chi tiết để setup bảng `briefs` cho hệ thống quản lý kế hoạch nội dung.

## 📋 Tổng Quan

Bảng `briefs` được thiết kế để lưu trữ các bản kế hoạch nội dung chi tiết. Mỗi brief liên kết với một ý tưởng (`idea`) và chứa đầy đủ thông tin cần thiết để tạo nội dung.

## 🗂️ Cấu Trúc Database

### Bảng `briefs`

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | SERIAL PRIMARY KEY | ID tự động tăng |
| `idea_id` | INTEGER | Foreign key đến bảng ideas |
| `title` | VARCHAR(255) | Tiêu đề brief |
| `content_plan` | TEXT | Nội dung kế hoạch chi tiết |
| `target_audience` | TEXT | Đối tượng người đọc mục tiêu |
| `key_points` | TEXT[] | Các điểm chính (array) |
| `tone` | VARCHAR(100) | Giọng điệu viết |
| `word_count` | INTEGER | Số lượng từ mục tiêu |
| `keywords` | TEXT[] | Từ khóa SEO (array) |
| `references` | TEXT | Tài liệu tham khảo |
| `status` | VARCHAR(50) | Trạng thái (draft/review/approved/published) |
| `created_at` | TIMESTAMP | Thời gian tạo |
| `updated_at` | TIMESTAMP | Thời gian cập nhật (auto-update) |

### Relationships

- **Foreign Key**: `idea_id` → `ideas(id)` với `ON DELETE CASCADE`
- Khi xóa idea, tất cả briefs liên quan sẽ tự động bị xóa

### Indexes

- `idx_briefs_idea_id` - Tìm kiếm theo idea_id
- `idx_briefs_status` - Lọc theo status
- `idx_briefs_created_at` - Sắp xếp theo thời gian

## 🚀 Cài Đặt

### Bước 1: Chạy Migration

```bash
cd backend
npm run migrate:run
```

Migration sẽ tự động:
- ✅ Tạo bảng `briefs`
- ✅ Tạo foreign key constraint
- ✅ Tạo các indexes
- ✅ Tạo trigger auto-update `updated_at`
- ✅ Thêm comments cho documentation

### Bước 2: Verify Database

Kiểm tra bảng đã được tạo:

```sql
-- Xem cấu trúc bảng
\d briefs

-- Xem indexes
\di briefs*

-- Test insert
INSERT INTO briefs (idea_id, title, content_plan)
VALUES (1, 'Test Brief', 'This is a test content plan');

-- Test query
SELECT * FROM briefs;
```

### Bước 3: Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

Server sẽ chạy tại: `http://localhost:3911`

## 📡 API Endpoints

Backend đã tích hợp đầy đủ CRUD operations:

### Create Brief
```http
POST /api/briefs
Content-Type: application/json

{
  "idea_id": 1,
  "title": "My First Brief",
  "content_plan": "Detailed content plan...",
  "target_audience": "Tech enthusiasts",
  "key_points": ["Point 1", "Point 2"],
  "tone": "professional",
  "word_count": 1500
}
```

### Get All Briefs
```http
GET /api/briefs
```

### Get Brief by ID
```http
GET /api/briefs/1
```

### Get Briefs by Idea
```http
GET /api/briefs/idea/1
```

### Update Brief
```http
PUT /api/briefs/1
Content-Type: application/json

{
  "status": "approved",
  "word_count": 2000
}
```

### Delete Brief
```http
DELETE /api/briefs/1
```

### Get Statistics
```http
GET /api/briefs/stats
```

Xem chi tiết tại: `backend/BRIEFS-API.md`

## 🧪 Testing

### Test với cURL

```bash
# Create brief
curl -X POST http://localhost:3911/api/briefs \
  -H "Content-Type: application/json" \
  -d '{
    "idea_id": 1,
    "title": "Test Brief",
    "content_plan": "This is a test",
    "target_audience": "Developers",
    "key_points": ["Testing", "API"]
  }'

# Get all briefs
curl http://localhost:3911/api/briefs

# Get by ID
curl http://localhost:3911/api/briefs/1

# Update
curl -X PUT http://localhost:3911/api/briefs/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'

# Delete
curl -X DELETE http://localhost:3911/api/briefs/1
```

### Test với Postman

Import collection:
1. Open Postman
2. Import → Raw text
3. Paste content từ `BRIEFS-API.md`
4. Test các endpoints

## 📁 Files Created

### Backend Files

```
backend/
├── migrations/
│   └── 002_create_briefs_table.sql      # Database migration
├── src/
│   ├── types.ts                          # TypeScript types (updated)
│   ├── server.ts                         # Server với brief routes (updated)
│   ├── services/
│   │   └── briefService.ts               # Business logic
│   └── routes/
│       └── briefRoutes.ts                # API endpoints
├── scripts/
│   └── run-migrations.js                 # Migration runner script
├── BRIEFS-API.md                         # API documentation
└── SETUP-BRIEFS.md                       # This file
```

## 🔧 Troubleshooting

### Migration Fails

**Problem**: Error running migration

**Solution**:
```bash
# Check database connection
psql $DATABASE_URL

# Verify env variables
cat .env | grep DATABASE_URL

# Run migration manually
psql $DATABASE_URL < migrations/002_create_briefs_table.sql
```

### Foreign Key Error

**Problem**: `violates foreign key constraint`

**Solution**: Đảm bảo `idea_id` tồn tại trong bảng `ideas`:
```sql
-- Check if idea exists
SELECT * FROM ideas WHERE id = 1;

-- If not, create one first
INSERT INTO ideas (title, description) 
VALUES ('Test Idea', 'Test description');
```

### Server Won't Start

**Problem**: `Cannot find module './routes/briefRoutes'`

**Solution**:
```bash
# Rebuild TypeScript
npm run build

# Start dev server
npm run dev
```

## 🎯 Workflow Example

### 1. Tạo Idea trước
```bash
curl -X POST http://localhost:3911/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "10 Tips for Remote Work",
    "description": "Helpful tips for remote workers",
    "persona": "Remote Worker",
    "industry": "Technology"
  }'
```

Response: `{ "id": 5, ... }`

### 2. Tạo Brief từ Idea
```bash
curl -X POST http://localhost:3911/api/briefs \
  -H "Content-Type: application/json" \
  -d '{
    "idea_id": 5,
    "title": "Remote Work Guide Brief",
    "content_plan": "Comprehensive guide covering workspace setup, communication, productivity hacks...",
    "target_audience": "Remote workers, digital nomads, freelancers aged 25-45",
    "key_points": [
      "Home office setup best practices",
      "Effective communication tools",
      "Time management strategies",
      "Work-life balance tips"
    ],
    "tone": "professional yet friendly",
    "word_count": 1500,
    "keywords": ["remote work", "productivity", "work from home", "digital nomad"],
    "references": "https://example.com/research"
  }'
```

### 3. Update Status
```bash
# Draft → Review
curl -X PUT http://localhost:3911/api/briefs/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "review"}'

# Review → Approved
curl -X PUT http://localhost:3911/api/briefs/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'

# Approved → Published
curl -X PUT http://localhost:3911/api/briefs/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'
```

### 4. Lấy Statistics
```bash
curl http://localhost:3911/api/briefs/stats
```

Response:
```json
{
  "total_briefs": "10",
  "draft_count": "4",
  "review_count": "3",
  "approved_count": "2",
  "published_count": "1"
}
```

## 🎨 Frontend Integration

### Fetch Briefs

```typescript
// Get all briefs
const response = await fetch('http://localhost:3911/api/briefs');
const briefs = await response.json();

// Get briefs for specific idea
const ideaBriefs = await fetch(`http://localhost:3911/api/briefs/idea/${ideaId}`);
const data = await ideaBriefs.json();
```

### Create Brief

```typescript
const newBrief = {
  idea_id: 5,
  title: 'My Brief',
  content_plan: 'Detailed plan...',
  target_audience: 'Developers',
  key_points: ['Point 1', 'Point 2'],
  tone: 'professional',
  word_count: 1500
};

const response = await fetch('http://localhost:3911/api/briefs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newBrief)
});

const created = await response.json();
```

## 📊 Database Backup

Backup bảng briefs:

```bash
# Backup schema + data
pg_dump $DATABASE_URL -t briefs > briefs_backup.sql

# Restore
psql $DATABASE_URL < briefs_backup.sql
```

## 🔐 Security Notes

- ✅ Foreign key constraints ngăn orphan records
- ✅ CASCADE delete tự động cleanup
- ✅ Input validation trong API routes
- ✅ TypeScript types đảm bảo type safety
- ✅ Indexes tối ưu query performance

## 📖 Additional Resources

- **API Documentation**: `backend/BRIEFS-API.md`
- **Migration File**: `backend/migrations/002_create_briefs_table.sql`
- **Service Layer**: `backend/src/services/briefService.ts`
- **API Routes**: `backend/src/routes/briefRoutes.ts`
- **TypeScript Types**: `backend/src/types.ts`

## ✅ Checklist

- [ ] Database migration chạy thành công
- [ ] Bảng `briefs` đã được tạo
- [ ] Foreign key constraint hoạt động
- [ ] Indexes đã được tạo
- [ ] Backend server khởi động OK
- [ ] API endpoints phản hồi đúng
- [ ] Test CRUD operations thành công
- [ ] Frontend có thể kết nối API

---

**Created**: 2025-01-15  
**Version**: 1.0.0  
**Author**: Content Multiplier Team


# 🗄️ Database Relationships Guide

## Tổng Quan

Project Content Multiplier sử dụng **Foreign Key Constraints** để tạo mối quan hệ giữa các bảng trong PostgreSQL.

---

## 📊 Relationship Diagram

```
┌──────────────────┐            ┌──────────────────┐
│     ideas        │            │     briefs       │
├──────────────────┤            ├──────────────────┤
│ id (PK)          │◄───────────┤ idea_id (FK)     │
│ title            │   1 : N    │ id (PK)          │
│ description      │            │ title            │
│ persona          │            │ content_plan     │
│ industry         │            │ target_audience  │
│ status           │            │ key_points       │
│ created_at       │            │ status           │
└──────────────────┘            │ created_at       │
                                └──────────────────┘

    1 Idea → N Briefs
```

**Relationship Type**: One-to-Many (1:N)
- Một `idea` có thể có nhiều `briefs`
- Một `brief` chỉ thuộc về một `idea`

---

## 🔑 Foreign Key Implementation

### Migration File

**File**: `backend/migrations/002_create_briefs_table.sql`

```sql
CREATE TABLE IF NOT EXISTS briefs (
    id SERIAL PRIMARY KEY,
    idea_id INTEGER NOT NULL,           -- Foreign key column
    title VARCHAR(255) NOT NULL,
    content_plan TEXT NOT NULL,
    -- ... other columns ...
    
    -- Foreign key constraint
    CONSTRAINT fk_idea
        FOREIGN KEY(idea_id) 
        REFERENCES ideas(id)
        ON DELETE CASCADE
);
```

### Giải Thích Từng Phần:

#### 1. **Foreign Key Column**
```sql
idea_id INTEGER NOT NULL
```
- Cột `idea_id` trong bảng `briefs`
- Kiểu `INTEGER` giống với `id` trong bảng `ideas`
- `NOT NULL`: Bắt buộc phải có (brief phải thuộc về một idea)

#### 2. **Foreign Key Constraint**
```sql
CONSTRAINT fk_idea
    FOREIGN KEY(idea_id) 
    REFERENCES ideas(id)
```
- **`CONSTRAINT fk_idea`**: Đặt tên cho constraint (để dễ manage)
- **`FOREIGN KEY(idea_id)`**: Khai báo cột là foreign key
- **`REFERENCES ideas(id)`**: Tham chiếu đến cột `id` của bảng `ideas`

#### 3. **ON DELETE CASCADE**
```sql
ON DELETE CASCADE
```
- Khi xóa một `idea`, tự động xóa tất cả `briefs` liên quan
- Đảm bảo data integrity (không có briefs "mồ côi")

---

## 🛡️ Data Integrity Rules

### Constraint Enforcement

PostgreSQL **tự động kiểm tra** các quy tắc:

#### ✅ **Valid Operations**

```sql
-- 1. Insert brief với idea_id hợp lệ
INSERT INTO briefs (idea_id, title, content_plan)
VALUES (52, 'Brief Title', 'Plan...');
✓ SUCCESS (idea_id=52 tồn tại trong ideas table)

-- 2. Delete idea và cascade delete briefs
DELETE FROM ideas WHERE id = 52;
✓ SUCCESS (tự động xóa tất cả briefs có idea_id=52)

-- 3. Query với JOIN
SELECT b.*, i.title as idea_title
FROM briefs b
JOIN ideas i ON b.idea_id = i.id;
✓ SUCCESS (relationship được enforce bởi FK)
```

#### ❌ **Invalid Operations** 

```sql
-- 1. Insert brief với idea_id không tồn tại
INSERT INTO briefs (idea_id, title, content_plan)
VALUES (999, 'Brief Title', 'Plan...');
❌ ERROR: violates foreign key constraint "fk_idea"

-- 2. Insert brief với idea_id = NULL
INSERT INTO briefs (idea_id, title, content_plan)
VALUES (NULL, 'Brief Title', 'Plan...');
❌ ERROR: null value violates not-null constraint

-- 3. Update idea_id sang ID không tồn tại
UPDATE briefs SET idea_id = 999 WHERE id = 1;
❌ ERROR: violates foreign key constraint "fk_idea"
```

---

## 📈 Performance Optimization

### Indexes

**File**: `backend/migrations/002_create_briefs_table.sql`

```sql
-- Index trên foreign key column
CREATE INDEX IF NOT EXISTS idx_briefs_idea_id ON briefs(idea_id);

-- Index khác cho query performance
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at);
```

### Why Index on Foreign Key?

**Benefits**:
1. ⚡ **Faster JOINs**: Tăng tốc query với JOIN
2. 🔍 **Faster Lookups**: Query briefs theo idea_id nhanh hơn
3. 🗑️ **Faster Cascades**: Delete cascade hiệu quả hơn

**Example Query Performance**:
```sql
-- Without index: Sequential scan (slow)
-- With index: Index scan (fast)
SELECT * FROM briefs WHERE idea_id = 52;
```

---

## 🔄 Common Query Patterns

### 1. **Get Briefs with Idea Info**

```sql
SELECT 
  b.*,
  i.title as idea_title,
  i.description as idea_description,
  i.persona as idea_persona
FROM briefs b
LEFT JOIN ideas i ON b.idea_id = i.id
WHERE b.id = $1;
```

**Used in**: `GET /api/briefs/:id`

### 2. **Get All Briefs of an Idea**

```sql
SELECT * FROM briefs
WHERE idea_id = $1
ORDER BY created_at DESC;
```

**Used in**: `GET /api/briefs/idea/:ideaId`

### 3. **Get Ideas with Brief Count**

```sql
SELECT 
  i.*,
  COUNT(b.id) as brief_count
FROM ideas i
LEFT JOIN briefs b ON b.idea_id = i.id
GROUP BY i.id
ORDER BY i.created_at DESC;
```

**Used in**: Future feature (dashboard statistics)

### 4. **Get Ideas Without Briefs**

```sql
SELECT i.*
FROM ideas i
LEFT JOIN briefs b ON b.idea_id = i.id
WHERE b.id IS NULL;
```

**Used in**: Finding ideas ready for brief generation

---

## 🧪 Testing Relationship

### Test Script

```bash
#!/bin/bash

echo "🧪 Testing Database Relationships..."

# Connect to database
PSQL="docker-compose exec postgres psql -U postgres -d content_ideas"

echo "1. Insert test idea..."
$PSQL -c "INSERT INTO ideas (title, description, status) 
          VALUES ('Test Idea', 'Test description', 'pending') 
          RETURNING id;"

echo "2. Get idea ID (assume ID=100)..."

echo "3. Insert brief with valid idea_id..."
$PSQL -c "INSERT INTO briefs (idea_id, title, content_plan, target_audience) 
          VALUES (100, 'Test Brief', 'Plan...', 'Audience...')
          RETURNING id;"

echo "4. Try insert brief with invalid idea_id..."
$PSQL -c "INSERT INTO briefs (idea_id, title, content_plan, target_audience) 
          VALUES (999, 'Invalid Brief', 'Plan...', 'Audience...');" 
# Expected: ERROR

echo "5. Test JOIN query..."
$PSQL -c "SELECT b.id, b.title, i.title as idea_title 
          FROM briefs b 
          JOIN ideas i ON b.idea_id = i.id 
          WHERE b.idea_id = 100;"

echo "6. Test CASCADE DELETE..."
$PSQL -c "DELETE FROM ideas WHERE id = 100;"
# This should also delete the brief

echo "7. Verify brief is deleted..."
$PSQL -c "SELECT COUNT(*) FROM briefs WHERE idea_id = 100;"
# Expected: 0

echo "✅ Tests completed!"
```

### Run Test

```bash
chmod +x test-database-relationships.sh
./test-database-relationships.sh
```

---

## 📋 Check Existing Relationships

### View Foreign Key Constraints

```sql
-- Method 1: Using \d command
\d briefs

-- Method 2: Query pg_catalog
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'briefs';
```

**Expected Output**:
```
 constraint_name | table_name | column_name | foreign_table_name | foreign_column_name | delete_rule 
-----------------+------------+-------------+--------------------+---------------------+-------------
 fk_idea         | briefs     | idea_id     | ideas              | id                  | CASCADE
```

---

## 🔧 Modify Relationships

### Add Foreign Key (if not exists)

```sql
-- Add constraint
ALTER TABLE briefs
ADD CONSTRAINT fk_idea
    FOREIGN KEY (idea_id)
    REFERENCES ideas(id)
    ON DELETE CASCADE;

-- Add index
CREATE INDEX idx_briefs_idea_id ON briefs(idea_id);
```

### Remove Foreign Key

```sql
-- Drop constraint
ALTER TABLE briefs
DROP CONSTRAINT IF EXISTS fk_idea;

-- Drop index
DROP INDEX IF EXISTS idx_briefs_idea_id;
```

### Change Delete Behavior

```sql
-- Drop old constraint
ALTER TABLE briefs DROP CONSTRAINT fk_idea;

-- Add new constraint with different behavior
ALTER TABLE briefs
ADD CONSTRAINT fk_idea
    FOREIGN KEY (idea_id)
    REFERENCES ideas(id)
    ON DELETE SET NULL;  -- or RESTRICT, NO ACTION
```

**Options**:
- `CASCADE`: Xóa related records
- `SET NULL`: Set foreign key = NULL
- `RESTRICT`: Prevent delete if has related records
- `NO ACTION`: Similar to RESTRICT

---

## 🎯 Best Practices

### 1. **Always Use Foreign Keys**
```sql
✅ GOOD: WITH foreign key constraint
CREATE TABLE briefs (
    idea_id INTEGER NOT NULL REFERENCES ideas(id)
);

❌ BAD: WITHOUT constraint (just convention)
CREATE TABLE briefs (
    idea_id INTEGER NOT NULL
);
```

### 2. **Name Constraints Descriptively**
```sql
✅ GOOD: Descriptive name
CONSTRAINT fk_briefs_idea_id

❌ BAD: Generic name
CONSTRAINT fk1
```

### 3. **Choose Appropriate Delete Behavior**

| Scenario | Recommended |
|----------|-------------|
| Brief không có ý nghĩa nếu idea bị xóa | `CASCADE` |
| Brief vẫn có giá trị sau khi idea xóa | `SET NULL` |
| Prevent accidental deletes | `RESTRICT` |

### 4. **Index Foreign Key Columns**
```sql
-- Always create index for performance
CREATE INDEX idx_briefs_idea_id ON briefs(idea_id);
```

### 5. **Use NOT NULL for Required Relationships**
```sql
-- Brief MUST belong to an idea
idea_id INTEGER NOT NULL
```

---

## 📊 Current Database State

### Tables Overview

```
ideas (1)
  ↓
  └─ briefs (N)

Relationship: 1:N (One-to-Many)
Delete Rule: CASCADE
Indexed: YES
```

### Verify Relationship

```bash
# Check constraint exists
docker-compose exec postgres psql -U postgres -d content_ideas \
  -c "\d briefs"

# Count briefs per idea
docker-compose exec postgres psql -U postgres -d content_ideas \
  -c "SELECT idea_id, COUNT(*) as brief_count 
      FROM briefs 
      GROUP BY idea_id;"

# Find orphan briefs (should be 0 with FK)
docker-compose exec postgres psql -U postgres -d content_ideas \
  -c "SELECT b.* 
      FROM briefs b 
      LEFT JOIN ideas i ON b.idea_id = i.id 
      WHERE i.id IS NULL;"
```

---

## 🆕 Adding New Relationships

### Future Tables (Example)

```sql
-- drafts table (briefs → drafts: 1:N)
CREATE TABLE drafts (
    id SERIAL PRIMARY KEY,
    brief_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    
    CONSTRAINT fk_brief
        FOREIGN KEY (brief_id)
        REFERENCES briefs(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_drafts_brief_id ON drafts(brief_id);

-- Relationship chain:
-- ideas → briefs → drafts
```

---

## 🐛 Common Issues

### Issue 1: Cannot Delete Idea

**Error**:
```
ERROR: update or delete on table "ideas" violates foreign key constraint "fk_idea" on table "briefs"
```

**Cause**: Trying to delete idea that has briefs (without CASCADE)

**Solution**: 
- Add `ON DELETE CASCADE` to constraint
- Or delete briefs first

### Issue 2: Cannot Insert Brief

**Error**:
```
ERROR: insert or update on table "briefs" violates foreign key constraint "fk_idea"
```

**Cause**: `idea_id` không tồn tại trong bảng `ideas`

**Solution**:
```sql
-- Check if idea exists
SELECT id FROM ideas WHERE id = 52;

-- If not, create idea first
INSERT INTO ideas (...) VALUES (...);
```

### Issue 3: Slow JOIN Queries

**Symptoms**: Queries with JOIN chạy chậm

**Solution**:
```sql
-- Add index on foreign key
CREATE INDEX idx_briefs_idea_id ON briefs(idea_id);

-- Verify index is used
EXPLAIN ANALYZE 
SELECT * FROM briefs b
JOIN ideas i ON b.idea_id = i.id;
```

---

## 📚 Additional Resources

### PostgreSQL Documentation
- [Foreign Key Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)
- [Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [Table Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

### Project Files
- `backend/migrations/001_create_ideas_table.sql` - Ideas table
- `backend/migrations/002_create_briefs_table.sql` - Briefs table with FK
- `backend/src/services/briefService.ts` - JOIN queries

---

## ✅ Summary

**Current Implementation**:
- ✅ Foreign Key constraint: `briefs.idea_id → ideas.id`
- ✅ Delete behavior: `CASCADE` (tự động xóa briefs khi xóa idea)
- ✅ Index: `idx_briefs_idea_id` cho performance
- ✅ NOT NULL: Brief phải thuộc về một idea
- ✅ Working: Đã test và hoạt động tốt

**Benefits**:
- 🛡️ Data integrity enforcement
- ⚡ Fast JOIN queries
- 🔗 Clear relationships
- 🗑️ Automatic cleanup (CASCADE)
- 📊 Easy to query and analyze

---

**Created**: November 3, 2025  
**Status**: ✅ Production Ready  
**Database**: PostgreSQL 15  
**Relationship Type**: One-to-Many (1:N)


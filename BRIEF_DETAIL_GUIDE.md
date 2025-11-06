# 📄 Brief Detail Page Guide

## Tổng Quan

Trang chi tiết Brief (`/briefs/[id]`) hiển thị **đầy đủ thông tin** của:
1. **Ý tưởng gốc** mà brief được tạo ra từ đó
2. **Nội dung brief** chi tiết được AI generate

---

## 🎯 Layout Structure

```
┌──────────────────────────────────────────────┐
│ [◄ Back] Brief Title          [✏️] [🗑]    │
├──────────────────────────────────────────────┤
│                                               │
│ ┌─────────────────────────────────────────┐ │
│ │ 💡 Ý TƯỞNG GỐC                 [▼]      │ │
│ │ ─────────────────────────────────────   │ │
│ │ Title: Original Idea Title              │ │
│ │                                          │ │
│ │ 📝 Mô tả: [idea description]           │ │
│ │ 💬 Lý do: [idea rationale]             │ │
│ │                                          │ │
│ │ Persona | Industry | Status             │ │
│ │ [Xem trang Ý tưởng]                    │ │
│ └─────────────────────────────────────────┘ │
│                                               │
│ 📋 NỘI DUNG BRIEF                            │
│ ───────────────────                          │
│                                               │
│ ┌─────────────────────────────────────────┐ │
│ │ 🎯 Đối Tượng Mục Tiêu                   │ │
│ │ [target audience text]                   │ │
│ └─────────────────────────────────────────┘ │
│                                               │
│ ┌─────────────────────────────────────────┐ │
│ │ 📋 Kế Hoạch Nội Dung                    │ │
│ │ [detailed content plan]                  │ │
│ └─────────────────────────────────────────┘ │
│                                               │
│ ┌─────────────────────────────────────────┐ │
│ │ 💡 Điểm Chính (8)                       │ │
│ │ 1. [Point 1]                            │ │
│ │ 2. [Point 2]                            │ │
│ │ ...                                      │ │
│ └─────────────────────────────────────────┘ │
│                                               │
│ [Chi Tiết Viết]  [Keywords SEO]            │
│                                               │
│ [Timestamps]                                 │
│                                               │
│ [◄ Quay lại]           [Chỉnh sửa Brief]   │
└──────────────────────────────────────────────┘
```

---

## 📊 Data Structure

### API Response

```typescript
interface BriefDetail {
  // Brief fields
  id: number
  idea_id: number
  title: string
  content_plan: string
  target_audience: string
  key_points: string[]
  tone?: string
  word_count?: number
  keywords?: string[]
  status: string
  created_at: string
  updated_at: string
  
  // Joined idea fields (from LEFT JOIN)
  idea_title?: string
  idea_description?: string
  idea_rationale?: string
  idea_persona?: string
  idea_industry?: string
  idea_status?: string
  idea_created_at?: string
}
```

### Backend Query

```sql
SELECT 
  b.*,
  i.title as idea_title,
  i.description as idea_description,
  i.rationale as idea_rationale,
  i.persona as idea_persona,
  i.industry as idea_industry,
  i.status as idea_status,
  i.created_at as idea_created_at
FROM briefs b
LEFT JOIN ideas i ON b.idea_id = i.id
WHERE b.id = $1
```

---

## 🎨 Component Sections

### 1. Header

**Features**:
- Back button → `/briefs`
- Brief title + status badge
- Brief ID + created date
- Action buttons: Edit, Delete

```tsx
<div className="flex items-start justify-between">
  <Link href="/briefs">
    <Button variant="ghost" size="icon">
      <ArrowLeft />
    </Button>
  </Link>
  <h1>{brief.title}</h1>
  <StatusBadge status={brief.status} />
  <Button variant="outline"><Edit /></Button>
  <Button variant="destructive"><Trash2 /></Button>
</div>
```

---

### 2. Ý Tưởng Gốc Section

**Design**:
- Highlighted card với gradient border
- Collapsible (expand/collapse)
- Lightbulb icon
- Link to Ideas page

**Content**:
- ✅ Idea Title
- ✅ Idea Description  
- ✅ Idea Rationale
- ✅ Persona badge
- ✅ Industry badge
- ✅ Status badge
- ✅ Created date

**Interaction**:
```tsx
const [showIdeaDetails, setShowIdeaDetails] = useState(true)

<CardHeader onClick={() => setShowIdeaDetails(!showIdeaDetails)}>
  <Lightbulb /> Ý Tưởng Gốc
  {showIdeaDetails ? <ChevronUp /> : <ChevronDown />}
</CardHeader>
```

---

### 3. Target Audience Card

```tsx
<Card>
  <CardHeader>
    <Target /> Đối Tượng Mục Tiêu
  </CardHeader>
  <CardContent>
    <p>{brief.target_audience}</p>
  </CardContent>
</Card>
```

**Icons**: 🎯 Target icon (red)

---

### 4. Content Plan Card

```tsx
<Card>
  <CardHeader>
    <AlignLeft /> Kế Hoạch Nội Dung
  </CardHeader>
  <CardContent>
    <p className="whitespace-pre-line">
      {brief.content_plan}
    </p>
  </CardContent>
</Card>
```

**Styling**:
- `whitespace-pre-line` để giữ line breaks
- Prose styling cho typography
- Leading-relaxed cho dễ đọc

---

### 5. Key Points Card

```tsx
<Card>
  <CardHeader>
    💡 Điểm Chính ({brief.key_points.length})
  </CardHeader>
  <CardContent>
    <ul>
      {brief.key_points.map((point, idx) => (
        <li>
          <span className="badge">{idx + 1}</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </CardContent>
</Card>
```

**Design**:
- Numbered badges (1, 2, 3, ...)
- Flex layout với gap
- Each point on separate line

---

### 6. Metadata Grid (2 columns)

**Left Card - Chi Tiết Viết**:
- Tone
- Word Count

**Right Card - Keywords SEO**:
- Keyword badges
- Wrap layout

```tsx
<div className="grid md:grid-cols-2 gap-6">
  <Card>
    <Type /> Chi Tiết Viết
    <div>Tone: {brief.tone}</div>
    <div>Word Count: {brief.word_count}</div>
  </Card>
  
  <Card>
    🔑 Keywords SEO ({keywords.length})
    <div className="flex flex-wrap gap-2">
      {keywords.map(kw => <Badge>{kw}</Badge>)}
    </div>
  </Card>
</div>
```

---

### 7. Timestamps Card

```tsx
<Card>
  <Calendar /> Tạo lúc: {formatDate(created_at)}
  {updated_at !== created_at && (
    <Calendar /> Cập nhật: {formatDate(updated_at)}
  )}
</Card>
```

---

### 8. Actions Footer

```tsx
<CardFooter className="flex justify-between">
  <Button variant="outline">
    <ArrowLeft /> Quay lại danh sách
  </Button>
  <Button variant="default">
    <Edit /> Chỉnh sửa Brief
  </Button>
</CardFooter>
```

---

## 🎭 UI/UX Features

### Collapsible Idea Section

**Why**: 
- Giảm clutter
- User có thể focus vào brief content
- Nhưng vẫn có thể xem idea context khi cần

**Default State**: Expanded (`showIdeaDetails = true`)

**Animation**: Smooth transition với Tailwind

---

### Status Badges

| Status | Badge | Color |
|--------|-------|-------|
| **Brief Statuses** |
| `draft` | 📝 Draft | Gray |
| `review` | 👀 Review | Orange |
| `approved` | ✓ Approved | Blue |
| `published` | 🚀 Published | Green |
| **Idea Statuses** |
| `pending` | ⏳ Pending | Gray |
| `selected` | ✅ Selected | Green |
| `generated` | 📄 Generated | Blue |

---

### Icons Guide

| Section | Icon | Color |
|---------|------|-------|
| Idea | `Lightbulb` | Yellow |
| Target Audience | `Target` | Red |
| Content Plan | `AlignLeft` | Purple |
| Key Points | `💡` | - |
| Tone/Word Count | `Type` | Green |
| Keywords | `🔑` | - |
| Timestamps | `Calendar` | Muted |

---

## 🔄 User Flows

### Flow 1: View Brief Detail

```
1. Từ /briefs
   → Click [👁 Xem chi tiết]
   ↓
2. Navigate to /briefs/[id]
   → Loading skeleton
   → Fetch brief data
   ↓
3. Page loaded
   → Ý tưởng gốc (expanded)
   → Brief content sections
   → Actions footer
```

### Flow 2: Navigate Back to Idea

```
1. Xem brief detail
   ↓
2. Trong "Ý Tưởng Gốc" section
   → Click [💡 Xem trang Ý tưởng]
   ↓
3. Navigate to /ideas
   → Scroll to find original idea
```

### Flow 3: Delete Brief

```
1. Click [🗑 Delete button]
   ↓
2. Confirmation dialog
   → "Bạn có chắc chắn muốn xóa..."
   ↓
3. Confirm
   → API call DELETE /briefs/:id
   → Toast success
   → Redirect to /briefs
```

---

## 📱 Responsive Design

### Desktop (≥1024px)
- Max-width: 5xl (896px)
- Metadata grid: 2 columns
- Full content visible

### Tablet (768px - 1024px)
- Max-width: 4xl
- Metadata grid: 2 columns
- Adjusted padding

### Mobile (<768px)
- Full width with padding
- Metadata grid: 1 column
- Stacked layout
- Smaller font sizes

---

## 🎨 Styling Details

### Color Scheme

**Light Mode**:
- Background: `bg-background` (white)
- Card: `bg-card` (white/gray-50)
- Text: `text-foreground` (gray-900)
- Muted: `text-muted-foreground` (gray-600)

**Dark Mode**:
- Background: `bg-background` (gray-950)
- Card: `bg-card` (gray-900)
- Text: `text-foreground` (gray-50)
- Muted: `text-muted-foreground` (gray-400)

### Idea Section Highlight

```css
border-2 border-primary/20
bg-gradient-to-br from-primary/5 to-background
```

**Effect**: Subtle gradient để distinguish từ brief content

---

## 🚀 API Integration

### Fetch Brief

```typescript
const fetchBrief = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/briefs/${briefId}`)
    setBrief(response.data)
  } catch (error) {
    toastError('Lỗi', 'Không thể tải brief')
  } finally {
    setLoading(false)
  }
}
```

### Delete Brief

```typescript
const handleDelete = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/briefs/${briefId}`)
    toastSuccess('Đã xóa!', 'Brief đã được xóa thành công.')
    router.push('/briefs')
  } catch (error) {
    toastError('Lỗi', 'Không thể xóa brief.')
  }
}
```

---

## 💡 Pro Tips

### 1. Pre-line for Content Plan

```tsx
<p className="whitespace-pre-line">
  {brief.content_plan}
</p>
```

**Why**: AI thường trả về text với `\n`, cần preserve line breaks

### 2. Numbered List Styling

```tsx
<span className="badge">{idx + 1}</span>
```

**Design**: Circular badge với số thứ tự

### 3. Conditional Rendering

```tsx
{brief.idea_description && (
  <div>...</div>
)}
```

**Why**: Không phải lúc nào cũng có đầy đủ idea fields

### 4. Date Formatting

```typescript
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
```

**Output**: "3 tháng 11, 2025 14:30"

---

## 🔍 Troubleshooting

### Brief Not Found

**Symptoms**: Blank page hoặc "Brief không tìm thấy"

**Solutions**:
```bash
# Check brief exists
curl http://localhost:3911/api/briefs/2

# Check briefs list
curl http://localhost:3911/api/briefs
```

### Missing Idea Fields

**Symptoms**: Idea section hiển thị "Không có thông tin"

**Cause**: Idea đã bị xóa hoặc LEFT JOIN trả về NULL

**Solution**: Conditional rendering cho từng field

### Loading Forever

**Symptoms**: Skeleton không bao giờ biến mất

**Solutions**:
- Check network tab
- Verify API endpoint
- Check CORS
- Verify backend running

---

## 🎯 Future Enhancements

### Planned Features:
- [ ] Edit brief inline
- [ ] Version history
- [ ] Export to PDF/Markdown
- [ ] Share link
- [ ] Comments/feedback
- [ ] Collaborate với team
- [ ] AI regenerate sections
- [ ] Preview as article

### UI Improvements:
- [ ] Smooth scroll to sections
- [ ] Print-friendly layout
- [ ] Copy to clipboard buttons
- [ ] Syntax highlighting for code
- [ ] Rich text editor
- [ ] Drag-to-reorder key points

---

## 📚 Related Pages

- **Ideas List** (`/ideas`) - Xem tất cả ý tưởng
- **Briefs List** (`/briefs`) - Danh sách briefs
- **Home** (`/`) - Trang chủ với AI generation

---

## 🧪 Testing

### Manual Test Checklist:

```bash
# 1. Create a brief (if needed)
curl -X PATCH http://localhost:3911/api/ideas/52/status \
  -d '{"status": "selected"}'

curl -X POST http://localhost:3911/api/briefs/generate \
  -d '{"idea_id": 52, "model": "gemini"}'

# 2. Open detail page
open http://localhost:3910/briefs/2

# 3. Check sections:
✓ Header with title & badges
✓ Ý tưởng gốc (collapsible)
✓ Target Audience
✓ Content Plan
✓ Key Points
✓ Metadata grid
✓ Timestamps
✓ Actions footer

# 4. Test interactions:
✓ Collapse/expand idea section
✓ Click "Xem trang Ý tưởng"
✓ Click "Chỉnh sửa Brief"
✓ Click "Delete" → Confirm
✓ Back button
```

---

## 📖 Code Reference

**File**: `frontend/app/briefs/[id]/page.tsx`

**Key Functions**:
- `fetchBrief()` - Load data from API
- `handleDelete()` - Delete brief
- `formatDate()` - Format timestamps
- `getStatusBadge()` - Render status badges

**Components Used**:
- `PageTransition` - Smooth enter animation
- `Card`, `CardHeader`, `CardContent`, `CardFooter`
- `Badge` - Status and metadata tags
- `DeleteDialog` - Confirmation modal
- `SkeletonList` - Loading state

---

**Created**: November 3, 2025  
**Status**: ✅ Production Ready  
**Features**: Full idea + brief display  
**Responsive**: Mobile, Tablet, Desktop


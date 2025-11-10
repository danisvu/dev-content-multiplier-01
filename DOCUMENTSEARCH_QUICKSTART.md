# 🔍 DocumentSearch - Quick Start

## ⚡ 5-Minute Setup

### 1. Import Component

```tsx
import { DocumentSearch, Document, SearchResult } from '@/components/DocumentSearch'
```

### 2. Prepare Documents

```tsx
const documents: Document[] = [
  {
    id: 1,
    title: "The Impact of AI on Modern Marketing",
    content: "Artificial Intelligence has revolutionized content creation and marketing automation...",
    url: "https://example.com/ai-marketing",
    keywords: ["AI", "marketing", "automation", "content"],
    uploadDate: "2025-11-01T10:00:00Z",
    author: "John Doe",        // Optional: for author filter
    category: "Marketing"       // Optional: for category filter
  },
  {
    id: 2,
    title: "SEO Best Practices 2025",
    content: "Search engine optimization continues to evolve with algorithm updates...",
    url: "https://example.com/seo-best-practices",
    keywords: ["SEO", "optimization", "search engine"],
    uploadDate: "2025-11-02T14:30:00Z",
    author: "Jane Smith",
    category: "SEO"
  }
]
```

### 3. Use Component

```tsx
export default function MyPage() {
  const handleResultClick = (result: SearchResult) => {
    console.log('Selected:', result)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Document Search</h1>
      <DocumentSearch
        documents={documents}
        onResultClick={handleResultClick}
      />
    </div>
  )
}
```

---

## 🎯 Example Queries

### Vietnamese Semantic Search

```
Query: "trí tuệ nhân tạo giúp quảng cáo"
→ Matches: Documents about "AI", "marketing", "automation"
```

```
Query: "tối ưu hóa công cụ tìm kiếm"
→ Matches: Documents about "SEO", "search engine", "optimization"
```

```
Query: "chiến lược nội dung lợi nhuận"
→ Matches: Documents about "content", "strategy", "ROI"
```

### English Semantic Search

```
Query: "artificial intelligence advertising"
→ Matches: Documents about "AI", "marketing"
```

```
Query: "search engine ranking"
→ Matches: Documents about "SEO", "optimization"
```

---

## 📦 Props Summary

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `documents` | `Document[]` | ✅ Yes | - | Array of documents to search |
| `onResultClick` | `(result: SearchResult) => void` | ❌ No | - | Callback when result is clicked |
| `placeholder` | `string` | ❌ No | Default text | Custom placeholder for search input |
| `className` | `string` | ❌ No | - | Additional CSS classes |
| `enableFilters` | `boolean` | ❌ No | `true` | Show/hide author and category filters |

---

## 🎨 Customization

### Custom Placeholder

```tsx
<DocumentSearch
  documents={documents}
  placeholder="Tìm kiếm theo nội dung, ví dụ: 'AI trong marketing'"
/>
```

### Custom Styling

```tsx
<DocumentSearch
  documents={documents}
  className="max-w-4xl mx-auto"
/>
```

### Using Filters

**Filters are enabled by default** if documents have `author` or `category` fields.

```tsx
// Enable filters (default)
<DocumentSearch
  documents={documents}
  enableFilters={true}
/>

// Disable filters
<DocumentSearch
  documents={documents}
  enableFilters={false}
/>
```

**Filter Features:**
- 📝 **Author Filter**: Dropdown with all unique authors
- 📁 **Category Filter**: Dropdown with all unique categories
- 🏷️ **Active Badges**: Click to remove individual filters
- 🗑️ **Clear All**: Reset all filters at once
- 📊 **Count Display**: Shows filtered/total documents

### Full Example with State

```tsx
'use client'

import { useState } from 'react'
import { DocumentSearch, SearchResult } from '@/components/DocumentSearch'

export default function SearchPage() {
  const [selected, setSelected] = useState<SearchResult | null>(null)

  return (
    <div>
      <DocumentSearch
        documents={myDocs}
        onResultClick={setSelected}
      />
      
      {selected && (
        <div className="mt-6 p-6 border rounded-lg">
          <h2 className="text-2xl font-bold">{selected.title}</h2>
          <p className="text-sm text-muted-foreground">
            Relevance Score: {selected.score}%
          </p>
          <p className="mt-4">{selected.content}</p>
        </div>
      )}
    </div>
  )
}
```

---

## 🧠 How It Works

1. **User enters query**: "trí tuệ nhân tạo trong marketing"
2. **Component analyzes**:
   - Direct keyword matches
   - Synonym matches (AI ↔ trí tuệ nhân tạo)
   - Partial phrase matches
3. **Calculates scores**: 0-100 for each document
4. **Filters results**: Only show score > 10
5. **Sorts by relevance**: Highest score first
6. **Displays results**: With snippets, badges, and reasons

---

## 🔍 Filter Examples

### Filter by Author

```tsx
// Select "John Doe" from author dropdown
// → Only shows documents by John Doe
// → Updates search to only scan filtered documents
```

**Result**: `Showing 2 of 5 documents`

### Filter by Category

```tsx
// Select "Marketing" from category dropdown
// → Only shows Marketing documents
// → Search results limited to this category
```

**Result**: `Showing 3 of 5 documents`

### Combined Filters

```tsx
// Select "John Doe" + "Marketing"
// → Shows documents that match BOTH filters
// → Intersection of author AND category
```

**Result**: `Showing 2 of 5 documents`

### Clear Filters

**Option 1**: Click "Xóa bộ lọc" button (clears all)  
**Option 2**: Click individual badge with X icon  
**Option 3**: Select "Tất cả..." in dropdown  

---

## 🧪 Test It Now

**Visit**: `/search-demo`

Try these example queries:
- "trí tuệ nhân tạo giúp quảng cáo"
- "tối ưu hóa công cụ tìm kiếm"
- "phân tích dữ liệu mạng xã hội"
- "chiến lược nội dung lợi nhuận"

---

## 📚 Key Features

✅ **Semantic Search** - Find by meaning, not just keywords  
✅ **Synonym Mapping** - Vietnamese + English synonyms  
✅ **Relevance Scoring** - 0-100 with color coding  
✅ **Matched Snippets** - Show relevant content excerpts  
✅ **Keyword Badges** - Visual keyword highlighting  
✅ **Author Filter** - Filter documents by author  
✅ **Category Filter** - Filter documents by category/topic  
✅ **Active Filter Badges** - Click to remove individual filters  
✅ **Responsive UI** - Works on all devices  
✅ **Dark Mode** - Full theme support  
✅ **Animations** - Smooth Framer Motion transitions  

---

## 🔗 Related Components

- `DocumentUpload` - Upload documents
- `DocumentCard` - Display document info
- `InlineCitations` - Parse inline citations
- `Footnotes` - Display references

---

## 📖 Full Documentation

See [DOCUMENTSEARCH_COMPONENT_GUIDE.md](./DOCUMENTSEARCH_COMPONENT_GUIDE.md) for:
- Detailed API reference
- Advanced customization
- Scoring algorithm
- Performance optimization
- Troubleshooting

---

## 🆘 Need Help?

**Common Issues**:

1. **No results found?**
   - Check document `content` is not empty
   - Add more `keywords` to documents
   - Try broader queries
   - **Check filters** - you might have filtered out all relevant docs

2. **Low scores?**
   - Add synonyms in `calculateSimilarity()`
   - Increase matching weights
   - Use longer, more descriptive queries

3. **Slow search?**
   - Reduce document count
   - Implement pagination
   - Consider server-side search

4. **Filters not showing?**
   - Check if documents have `author` or `category` fields
   - Ensure `enableFilters={true}` (default)
   - Check if there's more than one unique author/category

5. **Filter count wrong?**
   - Filters show count for **original** documents, not filtered
   - Active filter section shows **filtered/total** count
   - This is intentional to help users understand dataset

---

**Ready to use! 🚀**

For demo and examples, visit: `/search-demo`


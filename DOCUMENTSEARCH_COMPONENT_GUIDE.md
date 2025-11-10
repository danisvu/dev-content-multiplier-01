# 🔍 DocumentSearch Component Guide

## Tổng Quan

`DocumentSearch` là một **semantic search component** cho phép tìm kiếm tài liệu theo nghĩa, không chỉ khớp từ khóa chính xác. Component này sử dụng **synonym mapping** và **similarity scoring** để tìm các tài liệu liên quan nhất với query của người dùng.

---

## 🎯 Tính Năng Chính

### 1. **Semantic Search**
- Tìm kiếm theo nghĩa, không chỉ khớp từ khóa chính xác
- Synonym mapping: "AI" ↔ "trí tuệ nhân tạo", "marketing" ↔ "quảng cáo"
- Partial matching: khớp một phần cụm từ
- Case-insensitive search

### 2. **Relevance Scoring (0-100)**
- **Title matching**: +15 points per word
- **Content matching**: +5 points per word
- **Semantic synonym**: +10 points per match
- **Keyword matching**: +8 points per keyword
- **Partial phrase**: +3 points per part

### 3. **Search Results**
- **Score badge** với color coding:
  - 🟢 **Rất liên quan**: ≥70%
  - 🟡 **Liên quan**: 40-69%
  - 🟠 **Có thể liên quan**: 10-39%
- **Progress bar** hiển thị score
- **Relevance reason**: giải thích tại sao tài liệu này được match
- **Matched snippets**: đoạn trích liên quan (max 2)
- **Keywords badges**: hiển thị keywords của tài liệu
- **Sorted by score**: kết quả cao nhất trước

### 4. **UI/UX Features**
- Search bar với icon và clear button
- Loading skeleton animation
- Empty state khi không có kết quả
- Click result để view details
- Toast notifications
- Responsive design
- Dark mode support
- Framer Motion animations

---

## 📦 Props Interface

```typescript
export interface Document {
  id: number | string
  title: string
  content: string
  url: string
  keywords?: string[]
  uploadDate: string
}

export interface SearchResult extends Document {
  score: number // 0-100
  matchedSnippets: string[]
  relevanceReason: string
}

interface DocumentSearchProps {
  documents: Document[] // Array of documents to search
  onResultClick?: (result: SearchResult) => void // Callback when result clicked
  placeholder?: string // Custom placeholder text
  className?: string // Additional CSS classes
}
```

---

## 🚀 Cách Sử Dụng

### Basic Usage

```tsx
import { DocumentSearch, Document } from '@/components/DocumentSearch'

const documents: Document[] = [
  {
    id: 1,
    title: "The Impact of AI on Modern Marketing",
    content: "Artificial Intelligence has revolutionized content creation...",
    url: "https://example.com/ai-marketing",
    keywords: ["AI", "marketing", "automation"],
    uploadDate: "2025-11-01T10:00:00Z"
  },
  // ... more documents
]

export default function MyPage() {
  return (
    <DocumentSearch
      documents={documents}
      onResultClick={(result) => console.log('Selected:', result)}
    />
  )
}
```

### With Custom Placeholder

```tsx
<DocumentSearch
  documents={documents}
  placeholder="Tìm kiếm tài liệu, ví dụ: 'AI trong marketing'"
  onResultClick={handleResultClick}
/>
```

### Full Example with State Management

```tsx
'use client'

import { useState } from 'react'
import { DocumentSearch, Document, SearchResult } from '@/components/DocumentSearch'
import { Card, CardContent } from '@/components/ui'

const myDocuments: Document[] = [...]

export default function SearchPage() {
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result)
    // Navigate to detail page or show modal
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Document Search</h1>
      
      <DocumentSearch
        documents={myDocuments}
        onResultClick={handleResultClick}
      />

      {selectedResult && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">{selectedResult.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Score: {selectedResult.score}%
            </p>
            <p>{selectedResult.content}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

---

## 🧠 Semantic Search Logic

### Synonym Mapping

Component đã định nghĩa các synonyms cho Vietnamese context:

```typescript
const synonyms: Record<string, string[]> = {
  'ai': ['trí tuệ nhân tạo', 'artificial intelligence', 'machine learning'],
  'marketing': ['quảng cáo', 'tiếp thị', 'pr', 'branding'],
  'seo': ['tối ưu hóa', 'optimization', 'search engine'],
  'content': ['nội dung', 'bài viết', 'article', 'blog'],
  'social': ['mạng xã hội', 'facebook', 'instagram', 'twitter'],
  'analytics': ['phân tích', 'analysis', 'data', 'insights'],
  'strategy': ['chiến lược', 'kế hoạch', 'planning'],
  'automation': ['tự động hóa', 'automatic', 'tự động'],
  'roi': ['lợi nhuận', 'return', 'profit', 'doanh thu'],
  'engagement': ['tương tác', 'interaction', 'participation'],
}
```

### Scoring Algorithm

1. **Direct keyword matching**
   - Query word in title: +15 points
   - Query word in content: +5 points

2. **Semantic synonym matching**
   - Query contains key → document contains synonym: +10 points
   - Query contains synonym → document contains key: +10 points

3. **Keyword matching**
   - Document keyword matches query word: +8 points

4. **Partial phrase matching**
   - Query parts (>3 chars) in content: +3 points each

5. **Minimum threshold**
   - Only show results with score > 10

---

## 💡 Example Queries

### 1. AI & Marketing
```
Query: "trí tuệ nhân tạo giúp quảng cáo"
Matches: "AI", "marketing", "automation"
```

### 2. SEO & Optimization
```
Query: "tối ưu hóa công cụ tìm kiếm"
Matches: "SEO", "search engine", "optimization"
```

### 3. Analytics & Data
```
Query: "phân tích dữ liệu mạng xã hội"
Matches: "analytics", "social", "metrics"
```

### 4. ROI & Strategy
```
Query: "chiến lược nội dung lợi nhuận"
Matches: "content", "strategy", "ROI"
```

---

## 🎨 UI Components Used

- `Input` - Search input field
- `Button` - Search and clear buttons
- `Card` - Result cards
- `Badge` - Score and keyword badges
- `Progress` - Score progress bar
- `Framer Motion` - Animations (fade, slide)
- `Lucide Icons` - Search, Loader, FileText, TrendingUp, X

---

## 🔧 Customization

### Extend Synonym Mapping

Thêm synonyms mới trong `calculateSimilarity()`:

```typescript
const synonyms: Record<string, string[]> = {
  // ... existing synonyms
  'video': ['clip', 'phim', 'movie', 'recording'],
  'design': ['thiết kế', 'layout', 'ui', 'ux'],
}
```

### Adjust Scoring Weights

Thay đổi điểm số trong `calculateSimilarity()`:

```typescript
// Title matching (default: +15)
if (titleWords.includes(word)) {
  score += 20 // Increase weight for title matches
}

// Semantic synonym (default: +10)
if (titleLower.includes(syn) || contentLower.includes(syn)) {
  score += 15 // Higher weight for semantic matches
}
```

### Custom Result Card UI

Wrap `DocumentSearch` và custom CSS:

```tsx
<div className="my-custom-search">
  <DocumentSearch
    documents={documents}
    className="custom-search-wrapper"
  />
</div>

<style>
.my-custom-search .card {
  /* Custom card styles */
}
</style>
```

---

## 🧪 Testing

### Demo Page

Visit `/search-demo` to test the component với:
- 5 sample documents
- Example queries
- Feature highlights
- Selected result display

### Test Scenarios

1. **Exact keyword match**: "AI marketing"
2. **Synonym match**: "trí tuệ nhân tạo quảng cáo"
3. **Partial match**: "tối ưu hóa"
4. **No match**: "xyz123"
5. **Empty query**: "" (should show error toast)

---

## 📊 Performance

- **Search time**: ~800ms (simulated delay)
- **Score calculation**: O(n * m) where n = documents, m = query words
- **Results limit**: No limit (all matching docs)
- **Minimum score**: 10 (filters low relevance)

---

## ♿ Accessibility

- **Keyboard navigation**: Enter to search, Tab to navigate
- **ARIA labels**: Clear button, search button
- **Focus management**: Auto-focus on search input
- **Screen reader**: Progress and result announcements

---

## 🌐 i18n Support

Current: **Vietnamese + English**

To add more languages:

1. Update `synonyms` mapping
2. Translate UI labels
3. Adjust text splitting logic (for non-Latin scripts)

---

## 📝 Best Practices

### 1. Document Preparation
```typescript
// Good: Rich metadata
const doc: Document = {
  id: 1,
  title: "Clear descriptive title",
  content: "Detailed content with keywords...",
  keywords: ["key1", "key2", "key3"],
  url: "https://...",
  uploadDate: "2025-11-01T10:00:00Z"
}

// Bad: Sparse data
const doc: Document = {
  id: 1,
  title: "Doc",
  content: "...",
  url: "...",
  uploadDate: "..."
}
```

### 2. Query Optimization
```typescript
// Good: Descriptive queries
"trí tuệ nhân tạo trong marketing hiện đại"
"chiến lược SEO tối ưu cho 2025"

// Bad: Too short or generic
"ai"
"marketing"
"tìm kiếm"
```

### 3. Result Handling
```typescript
const handleResultClick = (result: SearchResult) => {
  // Log for analytics
  console.log('Search result clicked:', {
    query: currentQuery,
    resultId: result.id,
    score: result.score
  })
  
  // Navigate or show detail
  router.push(`/documents/${result.id}`)
}
```

---

## 🆘 Troubleshooting

### Issue: Low Scores for Relevant Documents

**Solution**: 
- Add more keywords to documents
- Expand synonym mapping
- Reduce minimum score threshold

### Issue: Too Many Results

**Solution**:
- Increase minimum score threshold (e.g., > 20)
- Limit results display (e.g., top 10)

### Issue: Search Too Slow

**Solution**:
- Implement pagination
- Use Web Workers for calculation
- Index documents with search engine (Elasticsearch, Algolia)

---

## 🚀 Advanced Features (Future)

- [ ] Fuzzy matching (typo tolerance)
- [ ] Ngram tokenization
- [ ] TF-IDF scoring
- [ ] Vector embeddings (AI-powered)
- [ ] Multi-language support
- [ ] Search history
- [ ] Autocomplete suggestions
- [ ] Filter by date/category
- [ ] Export search results

---

## 📚 References

- [Semantic Search Explained](https://en.wikipedia.org/wiki/Semantic_search)
- [TF-IDF Algorithm](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## 🤝 Contributing

To improve the search algorithm:

1. Fork the project
2. Update `calculateSimilarity()` in `DocumentSearch.tsx`
3. Test with diverse queries
4. Submit PR with examples

---

## 📄 License

MIT License - Free to use and modify

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS, shadcn/ui**


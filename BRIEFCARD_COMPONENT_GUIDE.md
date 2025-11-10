# 📋 BriefCard Component - Complete Guide

## Tổng Quan

Component **BriefCard** hiển thị thông tin chi tiết của một content brief với đầy đủ tính năng: **Copy to clipboard, Tooltips, Expand/Collapse content, Animations**.

---

## ✨ Features

### 1. **Information Display**
- **Linked Idea**: Title, Persona, Industry (styled box)
- **Target Audience**: Dedicated section với icon
- **Key Points**: Badge list với tooltips
- **Content Plan**: Expandable text (300 chars limit)
- **Metadata**: Tone, Word Count, Keywords
- **Created Date**: Formatted Vietnamese date

### 2. **Copy to Clipboard**
- One-click copy button (top-right)
- Formatted text with all brief details
- Toast notification on success/error
- Icon changes to checkmark for 3s
- Includes original idea information

### 3. **Key Points Features**
- Display as badges
- Truncate after 30 characters
- Tooltips show full text on hover
- Instant tooltip display (no delay)
- Empty state: "No key points provided"
- Count display in header

### 4. **Content Expansion**
- Truncate content > 300 chars
- "View More" button to expand
- "View Less" button to collapse
- Smooth transition
- Whitespace preserved

### 5. **Animations**
- **Entry**: Fade in + slide up (0.5s)
- **Hover**: Lift up 4px
- **Gradient overlay**: Subtle on hover
- **Shadow**: Increase to xl on hover

### 6. **Styling**
- Color-coded sections (yellow, blue, purple, green)
- Responsive layout
- Dark mode support
- Proper typography
- Icon integration

---

## 📦 Props

```typescript
interface BriefCardProps {
  brief: Brief            // Required: Brief object
  idea?: Idea            // Optional: Linked idea object
  className?: string     // Optional: Additional classes
  onView?: (brief: Brief) => void  // Optional: View callback
}

interface Brief {
  id: number
  idea_id: number
  title?: string
  content_plan: string
  target_audience: string
  key_points?: string[]
  tone?: string
  word_count?: number
  keywords?: string[]
  created_at: string
}

interface Idea {
  id: number
  title: string
  persona?: string
  industry?: string
}
```

---

## 🚀 Usage

### Basic Usage

```tsx
import { BriefCard } from '@/components/BriefCard'

const brief = {
  id: 1,
  idea_id: 1,
  title: "Complete Guide to AI Content",
  target_audience: "Content creators and marketers",
  content_plan: "Create a comprehensive guide...",
  key_points: ["Point 1", "Point 2", "Point 3"],
  tone: "Educational",
  word_count: 2500,
  keywords: ["AI", "content"],
  created_at: "2025-11-03T10:00:00Z"
}

const idea = {
  id: 1,
  title: "AI-Powered Content Generator",
  persona: "Content Creator",
  industry: "Technology"
}

export default function Page() {
  return (
    <BriefCard
      brief={brief}
      idea={idea}
      onView={(brief) => console.log('View', brief)}
    />
  )
}
```

### In Grid Layout

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {briefs.map((brief) => (
    <BriefCard
      key={brief.id}
      brief={brief}
      idea={findIdeaById(brief.idea_id)}
      onView={handleView}
    />
  ))}
</div>
```

### Without Idea Info

```tsx
<BriefCard
  brief={brief}
  // No idea prop - linked idea section won't show
  onView={handleView}
/>
```

### With Custom Class

```tsx
<BriefCard
  brief={brief}
  idea={idea}
  className="max-w-2xl mx-auto"
/>
```

---

## 🎨 Sections Breakdown

### 1. Linked Idea (Optional)

```tsx
{idea && (
  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
    <Lightbulb icon + idea.title + persona + industry
  </div>
)}
```

**Colors**: Yellow theme (light/dark mode adaptive)

### 2. Target Audience

```tsx
<div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
  <Target icon + "Target Audience" + brief.target_audience
</div>
```

**Colors**: Blue theme

### 3. Key Points

```tsx
<div>
  <List icon + "Key Points (count)"
  {brief.key_points?.map(point => (
    <Tooltip>
      <Badge>{point truncated}</Badge>
      <TooltipContent>{point full}</TooltipContent>
    </Tooltip>
  ))}
</div>
```

**Features**:
- Badges với secondary variant
- Hover effect (bg-primary/20)
- Tooltip với full text
- Empty state if no points

### 4. Content Plan

```tsx
<div>
  <FileText icon + "Content Plan"
  <p>{displayContent}</p>
  {contentTruncated && (
    <Button onClick={toggleExpand}>
      View More / View Less
    </Button>
  )}
</div>
```

**Logic**:
- Truncate > 300 chars
- Preserve whitespace (whitespace-pre-wrap)
- Smooth expand/collapse

### 5. Metadata (Optional)

```tsx
{(brief.tone || brief.word_count || brief.keywords) && (
  <div>
    <Badge>{tone}</Badge>
    <Badge>{word_count} words</Badge>
    {keywords.map(kw => <Badge>#{kw}</Badge>)}
  </div>
)}
```

**Colors**: Green theme for keywords

---

## 🎯 Copy Feature Details

### Formatted Text Output

```text
📋 BRIEF: {title}

🎯 Target Audience:
{target_audience}

📝 Content Plan:
{content_plan}

💡 Key Points:
1. {point 1}
2. {point 2}
...

🎨 Tone: {tone}
📊 Word Count: {word_count}
🔑 Keywords: {keywords}

💡 Original Idea: {idea.title} ({idea.persona})

Created: {date}
```

### Copy Implementation

```typescript
const handleCopyBrief = async () => {
  const briefText = `...` // Formatted text
  
  try {
    await navigator.clipboard.writeText(briefText)
    setIsCopied(true)
    
    toast.success('Đã copy!', {
      description: 'Brief content đã được copy vào clipboard.'
    })
    
    setTimeout(() => setIsCopied(false), 3000)
  } catch (error) {
    toast.error('Lỗi!', {
      description: 'Không thể copy brief.'
    })
  }
}
```

**Features**:
- Async clipboard API
- Toast notifications
- Icon feedback (Copy → Check)
- Auto-reset after 3s
- Error handling

---

## 💡 Tooltips Implementation

```tsx
<TooltipProvider delayDuration={0}>
  {brief.key_points.map(point => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className="cursor-help">
          {point.length > 30 ? point.substring(0, 30) + '...' : point}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {point}
      </TooltipContent>
    </Tooltip>
  ))}
</TooltipProvider>
```

**Features**:
- `delayDuration={0}` - Instant display
- `cursor-help` - Indicate hoverable
- `max-w-xs` - Limit tooltip width
- Side: top positioning

---

## 🎭 Animation Details

### Entry Animation

```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: 'easeOut' }}
```

**Effect**: Fade in + slide up from 20px

### Hover Animation

```typescript
whileHover={{ y: -4 }}
```

**Effect**: Lift up 4px

### Gradient Overlay

```tsx
<div className="absolute inset-0 group-hover:from-primary/5 group-hover:to-primary/10" />
```

**Effect**: Subtle gradient on card hover

### Shadow Transition

```css
hover:shadow-xl transition-all duration-300
```

**Effect**: Smooth shadow increase

---

## 🐛 Troubleshooting

### Issue: Copy không hoạt động

**Solution**: Kiểm tra browser clipboard API support

```typescript
if (!navigator.clipboard) {
  // Fallback method
  const textarea = document.createElement('textarea')
  textarea.value = briefText
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}
```

### Issue: Tooltips không hiển thị

**Solution**: Đảm bảo có `TooltipProvider` wrapper

```tsx
<TooltipProvider delayDuration={0}>
  {/* Tooltips here */}
</TooltipProvider>
```

### Issue: Content không expand

**Solution**: Check state management

```typescript
const [isExpanded, setIsExpanded] = useState(false)
const contentTruncated = brief.content_plan.length > 300

{contentTruncated && (
  <Button onClick={() => setIsExpanded(!isExpanded)}>
    {isExpanded ? 'View Less' : 'View More'}
  </Button>
)}
```

### Issue: Toast không hiển thị

**Solution**: Đảm bảo có `Toaster` component

```tsx
// app/layout.tsx
import { Toaster } from './components/ui/toast'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

---

## ✅ Best Practices

### 1. **Data Validation**

```typescript
// Always provide fallbacks
const displayTitle = brief.title || 'Content Brief'
const hasKeyPoints = brief.key_points && brief.key_points.length > 0
```

### 2. **Long Content Handling**

```typescript
// Truncate intelligently
const MAX_LENGTH = 300
const displayContent = content.length > MAX_LENGTH
  ? content.substring(0, MAX_LENGTH) + '...'
  : content
```

### 3. **Error Handling**

```typescript
try {
  await navigator.clipboard.writeText(text)
  toast.success('Success')
} catch (error) {
  console.error('Copy failed:', error)
  toast.error('Failed to copy')
}
```

### 4. **Accessibility**

```tsx
<Button aria-label="Copy brief to clipboard">
  <Copy />
</Button>

<Badge className="cursor-help" aria-describedby="tooltip">
  Key Point
</Badge>
```

---

## 📊 Component Structure

```
BriefCard
├── motion.div (Entry + Hover animation)
│   └── Card
│       ├── Gradient Overlay
│       ├── CardHeader
│       │   ├── Linked Idea (yellow box)
│       │   ├── Title + Copy Button
│       │   └── Target Audience (blue box)
│       ├── Separator
│       ├── CardContent
│       │   ├── Key Points (tooltips)
│       │   ├── Separator
│       │   ├── Content Plan (expandable)
│       │   ├── Separator (optional)
│       │   └── Metadata (optional)
│       └── CardFooter
│           ├── Created Date
│           └── View Details Button
```

---

## 🎨 Color Scheme

| Section | Light Mode | Dark Mode |
|---------|-----------|-----------|
| **Linked Idea** | `bg-yellow-50` | `bg-yellow-950/30` |
| **Target Audience** | `bg-blue-50` | `bg-blue-950/30` |
| **Key Points** | `secondary` | `secondary` |
| **Keywords** | `bg-green-50` | `bg-green-950/30` |
| **Gradient Overlay** | `primary/5 → primary/10` | `primary/5 → primary/10` |

---

## 📚 Related Components

- `Card` - Base card component
- `Badge` - Tags and labels
- `Tooltip` - Hover information
- `Button` - Actions
- `Separator` - Visual dividers

---

## 📝 Changelog

### v1.0 (Current)
- ✅ Full brief information display
- ✅ Copy to clipboard feature
- ✅ Tooltips for key points
- ✅ Expand/collapse long content
- ✅ Linked idea integration
- ✅ Metadata display (tone, word count, keywords)
- ✅ Empty states
- ✅ Animations (fade-in, hover)
- ✅ Dark mode support
- ✅ Toast notifications

---

**Created**: November 3, 2025  
**Status**: ✅ Production Ready  
**Framework**: Next.js 14 + Tailwind + shadcn/ui  
**Animation**: Framer Motion  
**Notifications**: Sonner


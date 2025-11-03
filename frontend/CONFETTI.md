# Success Confetti 🎉

## Overview

Success confetti animation được trigger tự động khi có các hành động thành công trong ứng dụng.

## Installation

```bash
npm install react-confetti
```

## Features

- ✅ **Auto trigger** khi success actions
- ✅ **Auto cleanup** sau 3 giây
- ✅ **Responsive** với window resize
- ✅ **Customizable** colors và particles
- ✅ **Non-blocking** UI experience
- ✅ **Performance optimized** với recycle: false

## Configuration

```tsx
<SuccessConfetti 
  show={showConfetti}
  onComplete={() => setShowConfetti(false)}
  duration={3000}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | boolean | - | Trigger confetti animation |
| `onComplete` | function | - | Callback khi animation kết thúc |
| `duration` | number | 3000 | Duration in milliseconds (3 seconds) |

### Default Settings

- **Particles**: 500 pieces
- **Gravity**: 0.3
- **Recycle**: false (one-time animation)
- **Colors**: 6 vibrant colors
  - Blue (#3b82f6)
  - Purple (#8b5cf6)
  - Pink (#ec4899)
  - Green (#10b981)
  - Amber (#f59e0b)
  - Red (#ef4444)

## Usage

### 1. Import Component

```tsx
import { SuccessConfetti } from '@/components/SuccessConfetti'
```

### 2. Add State

```tsx
const [showConfetti, setShowConfetti] = useState(false)
```

### 3. Add Component to JSX

```tsx
return (
  <>
    <SuccessConfetti 
      show={showConfetti}
      onComplete={() => setShowConfetti(false)}
      duration={3000}
    />
    
    {/* Your content */}
  </>
)
```

### 4. Trigger on Success

```tsx
const handleSuccess = async () => {
  try {
    await someAction()
    
    // Trigger confetti
    setShowConfetti(true)
    
    // Show success message
    setSuccessMessage('Action completed!')
  } catch (error) {
    // Handle error
  }
}
```

## When Confetti Triggers

Confetti tự động hiện trong các trường hợp:

### 1. Create Idea Success
```tsx
const handleSaveIdea = async (data) => {
  await axios.post('/api/ideas', data)
  setShowConfetti(true) // ✨ Confetti!
}
```

### 2. Update Idea Success
```tsx
const handleUpdateIdea = async (id, data) => {
  await axios.put(`/api/ideas/${id}`, data)
  setShowConfetti(true) // ✨ Confetti!
}
```

### 3. AI Generate Success
```tsx
const handleGenerateIdeas = async () => {
  const response = await axios.post('/api/ideas/generate', data)
  if (response.data.success) {
    setShowConfetti(true) // ✨ Confetti!
  }
}
```

## Examples

### Basic Usage

```tsx
import { useState } from 'react'
import { SuccessConfetti } from '@/components/SuccessConfetti'
import { Button } from '@/components/ui/button'

export default function MyPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  return (
    <>
      <SuccessConfetti 
        show={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
      
      <Button onClick={() => setShowConfetti(true)}>
        Celebrate!
      </Button>
    </>
  )
}
```

### With Async Action

```tsx
const handleSubmit = async () => {
  try {
    setLoading(true)
    
    await submitForm(data)
    
    // Success!
    setShowConfetti(true)
    setSuccessMessage('Form submitted successfully!')
    
  } catch (error) {
    setErrorMessage('Something went wrong')
  } finally {
    setLoading(false)
  }
}
```

### Custom Duration

```tsx
<SuccessConfetti 
  show={showConfetti}
  onComplete={() => {
    setShowConfetti(false)
    console.log('Confetti completed!')
  }}
  duration={5000} // 5 seconds
/>
```

## Demo Pages

### Interactive Demo
```
http://localhost:3910/confetti-demo
```

Features:
- ✅ Trigger button
- ✅ Counter tracking
- ✅ Configuration details
- ✅ Usage examples
- ✅ Implementation guide

### Main App
```
http://localhost:3910/
```

Try these actions to see confetti:
1. Create a new idea
2. Update an existing idea
3. Generate ideas with AI

## Customization

### Change Colors

Modify the `colors` array in `SuccessConfetti.tsx`:

```tsx
colors={[
  '#your-color-1',
  '#your-color-2',
  '#your-color-3',
  // ... more colors
]}
```

### Change Particle Count

```tsx
numberOfPieces={1000} // More particles
```

### Change Gravity

```tsx
gravity={0.5} // Faster fall
gravity={0.1} // Slower fall
```

### Enable Recycle (Continuous)

```tsx
recycle={true} // Keeps generating (not recommended)
```

## Performance Tips

✅ **Do's:**
- Keep `recycle={false}` for one-time animation
- Use reasonable `numberOfPieces` (300-700)
- Auto cleanup after duration
- Trigger only on significant success actions

⚠️ **Don'ts:**
- Don't use `recycle={true}` for too long
- Don't trigger too frequently
- Don't use excessive particle count (>1000)
- Don't forget to cleanup (`onComplete`)

## Browser Support

- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 79+
- Mobile browsers (iOS Safari 10+, Chrome Android)

## Troubleshooting

### Confetti not showing?

1. Check `show` prop is `true`
2. Check window size is detected
3. Check z-index and positioning
4. Check if component is mounted

### Confetti not stopping?

1. Ensure `onComplete` callback is set
2. Ensure `recycle={false}`
3. Check `duration` prop is set
4. Check state is being updated in `onComplete`

### Performance issues?

1. Reduce `numberOfPieces`
2. Increase `gravity` for faster fall
3. Reduce `duration`
4. Check for multiple instances

## Resources

- [react-confetti GitHub](https://github.com/alampros/react-confetti)
- [Demo Page](/confetti-demo)
- [Main App](/)


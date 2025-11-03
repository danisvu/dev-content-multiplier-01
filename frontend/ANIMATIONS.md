# Framer Motion Animations

## Đã cài đặt

Tất cả animations đã được tích hợp vào ứng dụng với framer-motion.

## Demo Pages

- **Main App**: [http://localhost:3910/](http://localhost:3910/) - Xem page transitions và card hover
- **Animations Demo**: [http://localhost:3910/animations-demo](http://localhost:3910/animations-demo) - Interactive showcase
- **Skeletons Demo**: [http://localhost:3910/skeletons-demo](http://localhost:3910/skeletons-demo) - Loading states

## Animations Available

### 1. Page Enter (fade-in + slide-up)
```tsx
<PageTransition>
  {children}
</PageTransition>
```
- **Duration**: 0.4s
- **Effect**: Fade from 0 → 1, slide from y:20 → y:0
- **Ease**: easeOut

### 2. Card Hover (scale-105)
```tsx
<motion.div whileHover={{ scale: 1.05 }}>
  <Card>...</Card>
</motion.div>
```
- **Duration**: 0.2s
- **Effect**: Scale 100% → 105%
- **Ease**: easeInOut

### 3. Button Tap (scale-95)
```tsx
<Button>Click me</Button>
```
- **Duration**: 0.1s
- **Effect**: Scale 100% → 95%
- **Ease**: easeInOut
- **Note**: Tự động áp dụng cho tất cả Button components

## Animation Variants

### Import
```tsx
import {
  pageVariants,
  cardHoverVariants,
  fadeInVariants,
  slideInLeftVariants,
  slideInRightVariants,
  scaleInVariants,
  bounceVariants,
  containerVariants,
  itemVariants,
} from '@/lib/animations'
```

### Usage Examples

#### Fade In
```tsx
<motion.div
  variants={fadeInVariants}
  initial="initial"
  animate="animate"
>
  Content
</motion.div>
```

#### Slide In Left
```tsx
<motion.div
  variants={slideInLeftVariants}
  initial="initial"
  animate="animate"
>
  Content
</motion.div>
```

#### Slide In Right
```tsx
<motion.div
  variants={slideInRightVariants}
  initial="initial"
  animate="animate"
>
  Content
</motion.div>
```

#### Scale In
```tsx
<motion.div
  variants={scaleInVariants}
  initial="initial"
  animate="animate"
>
  Content
</motion.div>
```

#### Spring Bounce
```tsx
<motion.div
  variants={bounceVariants}
  initial="initial"
  animate="animate"
>
  Content
</motion.div>
```

#### Stagger Children
```tsx
<motion.div
  variants={containerVariants}
  initial="initial"
  animate="animate"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Custom Animations

### Quick whileHover
```tsx
<motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
  Hover me
</motion.div>
```

### Quick whileTap
```tsx
<motion.button whileTap={{ scale: 0.9 }}>
  Click me
</motion.button>
```

### Custom Variants
```tsx
const customVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
}

<motion.div
  variants={customVariants}
  initial="hidden"
  animate="visible"
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## Components với Built-in Animations

### Button
```tsx
<Button>Auto tap feedback</Button>
<Button disableAnimation>No animation</Button>
```

### IdeaCard
```tsx
<IdeaCard idea={idea} />
// Auto: fade-in + hover scale
```

### PageTransition
```tsx
<PageTransition>
  <YourPageContent />
</PageTransition>
```

## Performance Tips

✅ **Do's:**
- Use `transform` properties (scale, translate, rotate)
- Keep durations short (0.1-0.4s)
- Use `will-change` for complex animations
- Limit number of animated elements
- Use hardware-accelerated properties

⚠️ **Don'ts:**
- Avoid animating `width`, `height`, `top`, `left`
- Don't animate expensive properties (blur, box-shadow)
- Don't nest too many animated components
- Don't animate during scroll (use IntersectionObserver)

## Accessibility

### Respect Reduced Motion
```tsx
import { useReducedMotion } from 'framer-motion'

const shouldReduceMotion = useReducedMotion()

<motion.div
  initial={shouldReduceMotion ? false : { opacity: 0 }}
  animate={shouldReduceMotion ? false : { opacity: 1 }}
>
  Content
</motion.div>
```

### Button Disable Animation
```tsx
<Button disableAnimation>No feedback</Button>
```

## Browser Support

- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 79+
- Mobile browsers (iOS Safari 10+, Chrome Android)

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Best Practices](https://web.dev/animations/)
- [Reduced Motion](https://web.dev/prefers-reduced-motion/)


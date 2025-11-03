'use client'

import { motion } from 'framer-motion'
import { 
  pageVariants, 
  cardHoverVariants, 
  fadeInVariants,
  slideInLeftVariants,
  slideInRightVariants,
  scaleInVariants,
  bounceVariants,
  containerVariants,
  itemVariants
} from '@/lib/animations'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { PageTransition } from '../components/PageTransition'

export default function AnimationsDemo() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">Framer Motion Animations</h1>
            <p className="text-xl text-muted-foreground">
              Interactive demo của tất cả animations trong ứng dụng
            </p>
          </div>

          {/* Page Enter Animation */}
          <Card>
            <CardHeader>
              <CardTitle>1. Page Enter Animation</CardTitle>
              <CardDescription>
                Fade-in + slide-up animation khi page load (0.4s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-md">
                <code className="text-sm">
                  {`initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: 'easeOut' }}`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Card Hover Animation */}
          <Card>
            <CardHeader>
              <CardTitle>2. Card Hover Animation</CardTitle>
              <CardDescription>
                Scale-105 transition khi hover (0.2s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="cursor-pointer">
                      <CardHeader>
                        <CardTitle>Hover me! #{i}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Card này sẽ scale lên 105% khi hover
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="bg-muted/50 p-4 rounded-md">
                <code className="text-sm">
                  {`whileHover={{ scale: 1.05 }}
transition={{ duration: 0.2 }}`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Button Tap Animation */}
          <Card>
            <CardHeader>
              <CardTitle>3. Button Tap Animation</CardTitle>
              <CardDescription>
                Scale-95 feedback khi click (0.1s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap mb-4">
                <Button>Default Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="bg-muted/50 p-4 rounded-md">
                <code className="text-sm">
                  {`whileTap={{ scale: 0.95 }}
transition={{ duration: 0.1 }}`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Other Animations */}
          <Card>
            <CardHeader>
              <CardTitle>4. Additional Animations</CardTitle>
              <CardDescription>
                Các animation variants khác có sẵn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fade In */}
              <div>
                <h3 className="font-semibold mb-2">Fade In</h3>
                <motion.div
                  variants={fadeInVariants}
                  initial="initial"
                  animate="animate"
                  className="bg-primary text-primary-foreground p-4 rounded-md"
                >
                  Fade in animation
                </motion.div>
              </div>

              {/* Slide In Left */}
              <div>
                <h3 className="font-semibold mb-2">Slide In Left</h3>
                <motion.div
                  variants={slideInLeftVariants}
                  initial="initial"
                  animate="animate"
                  className="bg-secondary text-secondary-foreground p-4 rounded-md"
                >
                  Slide from left animation
                </motion.div>
              </div>

              {/* Slide In Right */}
              <div>
                <h3 className="font-semibold mb-2">Slide In Right</h3>
                <motion.div
                  variants={slideInRightVariants}
                  initial="initial"
                  animate="animate"
                  className="bg-accent text-accent-foreground p-4 rounded-md"
                >
                  Slide from right animation
                </motion.div>
              </div>

              {/* Scale In */}
              <div>
                <h3 className="font-semibold mb-2">Scale In</h3>
                <motion.div
                  variants={scaleInVariants}
                  initial="initial"
                  animate="animate"
                  className="bg-muted p-4 rounded-md"
                >
                  Scale in animation
                </motion.div>
              </div>

              {/* Bounce */}
              <div>
                <h3 className="font-semibold mb-2">Spring Bounce</h3>
                <motion.div
                  variants={bounceVariants}
                  initial="initial"
                  animate="animate"
                  className="bg-destructive text-destructive-foreground p-4 rounded-md"
                >
                  Spring bounce animation
                </motion.div>
              </div>

              {/* Stagger Children */}
              <div>
                <h3 className="font-semibold mb-2">Stagger Children</h3>
                <motion.div
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="bg-primary text-primary-foreground p-4 rounded-md text-center"
                    >
                      Item {i}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Guide */}
          <Card>
            <CardHeader>
              <CardTitle>5. Usage Guide</CardTitle>
              <CardDescription>
                Cách sử dụng animations trong components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Import:</h3>
                <div className="bg-muted/50 p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">{`import { motion } from 'framer-motion'
import { pageVariants, cardHoverVariants } from '@/lib/animations'
import { PageTransition } from '@/components/PageTransition'`}</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Page Transition:</h3>
                <div className="bg-muted/50 p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">{`<PageTransition>
  {children}
</PageTransition>`}</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Card Hover:</h3>
                <div className="bg-muted/50 p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">{`<motion.div whileHover={{ scale: 1.05 }}>
  <Card>...</Card>
</motion.div>`}</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Button (Built-in):</h3>
                <div className="bg-muted/50 p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">{`<Button>Click me</Button>
// Tap feedback tự động được áp dụng`}</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Tips */}
          <Card>
            <CardHeader>
              <CardTitle>6. Performance Tips</CardTitle>
              <CardDescription>
                Best practices khi sử dụng animations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✅ Sử dụng transform (scale, translate) thay vì width/height</li>
                <li>✅ Giữ duration ngắn (0.1-0.4s) cho better UX</li>
                <li>✅ Use ease-out cho entrance, ease-in cho exit</li>
                <li>✅ Limit số lượng animated elements trên screen</li>
                <li>✅ Use will-change CSS property khi cần</li>
                <li>⚠️ Tránh animate expensive properties (blur, box-shadow)</li>
                <li>⚠️ Disable animations cho users prefer reduced motion</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}


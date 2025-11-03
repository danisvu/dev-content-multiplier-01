'use client'

import { useState } from 'react'
import { SuccessConfetti } from '../components/SuccessConfetti'
import { PageTransition } from '../components/PageTransition'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Sparkles, PartyPopper, Rocket } from 'lucide-react'

export default function ConfettiDemo() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [triggerCount, setTriggerCount] = useState(0)

  const handleTrigger = () => {
    setShowConfetti(true)
    setTriggerCount(prev => prev + 1)
  }

  return (
    <PageTransition>
      {/* Confetti */}
      <SuccessConfetti 
        show={showConfetti}
        onComplete={() => setShowConfetti(false)}
        duration={3000}
      />

      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-5xl font-bold">Success Confetti</h1>
            <p className="text-xl text-muted-foreground">
              Interactive demo của confetti animation
            </p>
          </div>

          {/* Main Demo Card */}
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Trigger Confetti</CardTitle>
              <CardDescription>
                Click button bên dưới để xem confetti animation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trigger Button */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleTrigger}
                  disabled={showConfetti}
                  className="text-lg px-8 py-6"
                >
                  <PartyPopper className="w-6 h-6 mr-2" />
                  {showConfetti ? 'Confetti Running...' : 'Celebrate! 🎊'}
                </Button>
              </div>

              {/* Stats */}
              <div className="bg-muted rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {triggerCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Times triggered
                </div>
              </div>

              {/* Status */}
              {showConfetti && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    Confetti Active - Auto cleanup in 3 seconds
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Confetti animation configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-semibold">Duration:</span>
                    <span className="text-muted-foreground">3 seconds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-semibold">Pieces:</span>
                    <span className="text-muted-foreground">500 particles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="font-semibold">Gravity:</span>
                    <span className="text-muted-foreground">0.3</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                    <span className="font-semibold">Recycle:</span>
                    <span className="text-muted-foreground">No (one-time)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-semibold">Auto Cleanup:</span>
                    <span className="text-muted-foreground">Yes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="font-semibold">Colors:</span>
                    <span className="text-muted-foreground">6 vibrant colors</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Card */}
          <Card>
            <CardHeader>
              <CardTitle>When Confetti Triggers</CardTitle>
              <CardDescription>
                Confetti sẽ tự động hiện trong các trường hợp sau
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Rocket className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-semibold">Create Idea Success</div>
                    <div className="text-sm text-muted-foreground">
                      Khi tạo ý tưởng mới thành công
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-semibold">Update Idea Success</div>
                    <div className="text-sm text-muted-foreground">
                      Khi cập nhật ý tưởng thành công
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <PartyPopper className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-semibold">AI Generate Success</div>
                    <div className="text-sm text-muted-foreground">
                      Khi AI tạo ý tưởng thành công
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Example */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation</CardTitle>
              <CardDescription>
                Cách sử dụng SuccessConfetti component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Import:</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">{`import { SuccessConfetti } from '@/components/SuccessConfetti'`}</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">State:</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">{`const [showConfetti, setShowConfetti] = useState(false)`}</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Usage:</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm whitespace-pre">{`<SuccessConfetti 
  show={showConfetti}
  onComplete={() => setShowConfetti(false)}
  duration={3000}
/>`}</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Trigger:</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">{`// On success action
setShowConfetti(true)
// Auto cleanup sau 3 giây`}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}


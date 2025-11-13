import { ResponsivePreview } from '../components/ResponsivePreview'
import { TwitterPreview } from '../components/TwitterPreview'
import { LinkedInPreview } from '../components/LinkedInPreview'
import { FacebookPreview } from '../components/FacebookPreview'
import { InstagramPreview } from '../components/InstagramPreview'
import { TikTokPreview } from '../components/TikTokPreview'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function ResponsivePreviewDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Responsive Preview Demo</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Toggle between mobile and desktop views to see how your content looks on different devices.
        </p>

        <div className="space-y-8">
          <ResponsivePreview title="Twitter Preview" defaultMode="desktop">
            <TwitterPreview
              content="Just launched our new feature! 🚀 Check it out and let us know what you think. #ProductLaunch #Innovation"
              username="YourBrand"
              handle="@yourbrand"
              timestamp="2h"
            />
          </ResponsivePreview>

          <ResponsivePreview title="LinkedIn Preview" defaultMode="desktop">
            <LinkedInPreview
              content="Excited to announce our latest product update! After months of hard work and valuable feedback from our community, we're rolling out new features that will transform how you work. Read more in the comments below. #ProductUpdate #Innovation"
              name="Your Brand"
              headline="Leading the Future of Innovation"
              timestamp="3h"
            />
          </ResponsivePreview>

          <ResponsivePreview title="Facebook Preview" defaultMode="desktop">
            <FacebookPreview
              content="We're thrilled to share some exciting news with our community! Stay tuned for more updates coming soon. 🎉"
              username="Your Brand Page"
              timestamp="5h"
            />
          </ResponsivePreview>

          <ResponsivePreview title="Instagram Preview" defaultMode="mobile">
            <InstagramPreview
              content="Behind the scenes of our latest project! Swipe to see more. ✨"
              username="yourbrand"
            />
          </ResponsivePreview>

          <ResponsivePreview title="TikTok Preview" defaultMode="mobile">
            <TikTokPreview
              content="Watch how we made this happen! #BehindTheScenes #Creative"
              username="@yourbrand"
              description="Creating magic one frame at a time ✨"
              musicTitle="Original Sound - yourbrand"
            />
          </ResponsivePreview>
        </div>
      </div>
    </div>
  )
}



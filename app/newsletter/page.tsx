import type { Metadata } from 'next'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'

export const metadata: Metadata = {
  title: 'Newsletter Subscription | Vibrant Insights',
  description: 'Subscribe to the Vibrant Insights newsletter. Get the latest articles, tech trends, and exclusive content delivered to your inbox.',
  keywords: ['newsletter', 'subscribe', 'tech updates', 'weekly digest', 'email subscription'],
  openGraph: {
    title: 'Subscribe to Our Newsletter | Vibrant Insights',
    description: 'Stay updated with the latest in tech and design. Subscribe now.',
    url: 'https://vibrantinsights.com/newsletter',
  },
}

export default function NewsletterPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Subscribe to our Newsletter</h1>
          <p className="text-xl text-muted-foreground">
            Get the latest updates, articles, and resources delivered straight to your inbox.
          </p>
        </div>

        <NewsletterForm />
        
        <p className="text-sm text-muted-foreground mt-8">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  )
}


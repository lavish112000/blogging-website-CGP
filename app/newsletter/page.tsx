import type { Metadata } from 'next'

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

        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mt-8">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Subscribe
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  )
}

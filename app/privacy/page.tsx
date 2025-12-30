import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Tech-Knowlogia',
  description: 'Read the Privacy Policy of Tech-Knowlogia. We value your privacy and are committed to protecting your personal data.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our company and our users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
          <p className="text-muted-foreground">
            We do not sell your personal information. We may share limited information with service providers that help us operate the site (for example, analytics and advertising partners) and as required for legal reasons or to protect rights and safety.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Cookies, Analytics, and Advertising</h2>
          <p className="text-muted-foreground">
            We may use cookies and similar technologies to understand how visitors use our site, improve performance, and support advertising.
          </p>
          <p className="text-muted-foreground">
            We use Google services such as Google Analytics and Google AdSense. These services may collect information such as your IP address, device and browser information, and interactions with pages and ads. Google and other third parties may place and read cookies on your browser or use web beacons/identifiers to collect information as a result of ad serving and analytics measurement.
          </p>
          <p className="text-muted-foreground">
            Learn more about how Google uses data: <a href="https://policies.google.com/technologies/partner-sites" rel="noreferrer noopener" target="_blank">How Google uses data when you use our partners’ sites or apps</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Your Choices</h2>
          <p className="text-muted-foreground">
            You can control non-essential cookies through the consent prompt on our site (where available). You can also manage cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Security</h2>
          <p className="text-muted-foreground">
            We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.
          </p>
        </section>
      </div>
    </div>
  )
}

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
            We do not share your personal information with companies, organizations, or individuals outside of our company except in the following cases: with your consent, for legal reasons, or to protect rights and safety.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Security</h2>
          <p className="text-muted-foreground">
            We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.
          </p>
        </section>
      </div>
    </div>
  )
}

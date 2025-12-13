import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Tech-Knowlogia',
  description: 'Review the Terms and Conditions for using Tech-Knowlogia. Understand your rights and responsibilities as a user.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Terms & Conditions</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground">
            Welcome to our website. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-muted-foreground">
            Permission is granted to temporarily download one copy of the materials (information or software) on this website for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p className="text-muted-foreground">
            The materials on this website are provided on an &apos;as is&apos; basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
          <p className="text-muted-foreground">
            In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.
          </p>
        </section>
      </div>
    </div>
  )
}

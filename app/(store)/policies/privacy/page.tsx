import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Understand how we collect, store, and protect your customer information.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" eyebrow="Policies" description="How we handle and safeguard your personal customer data." />
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">1. Collection of Information</h2>
          <p>
            We collect personal information when you interact with our storefront, create an account, purchase products, or contact support. This includes name, email, phone number, shipping address, and demo payment method.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">2. How We Use Your Data</h2>
          <p>
            Your information is used to process orders, manage customer accounts, coordinate delivery with courier partners, and send promotional newsletters (if opted in). We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">3. Session Security</h2>
          <p>
            We use secure HTTP-only cookies and JSON Web Tokens (JWT) for user authentication sessions. This ensures that session tokens cannot be read by cross-site scripting (XSS) client scripts, keeping your credentials safe.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">4. Policy Changes</h2>
          <p>
            We reserve the right to modify this privacy policy at any time. Changes will take effect immediately upon their publication on this page.
          </p>
        </section>
      </div>
    </>
  )
}

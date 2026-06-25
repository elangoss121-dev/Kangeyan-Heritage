import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Review our terms, user agreements, and online shop conditions.',
}

export default function TermsPolicyPage() {
  return (
    <>
      <PageHero title="Terms of Service" eyebrow="Policies" description="The rules, guidelines, and agreements governing your use of our website." />
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">1. User Agreement</h2>
          <p>
            By visiting our website and purchasing products from us, you engage in our &quot;Service&quot; and agree to be bound by the following terms and conditions, including those additional terms and policies referenced herein.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">2. Store Terms</h2>
          <p>
            You may not use our products for any illegal or unauthorized purpose. You must not transmit any worms or viruses or any code of a destructive nature. A breach or violation of any of the Terms will result in an immediate termination of your account services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">3. Accuracy of Pricing &amp; Products</h2>
          <p>
            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue a product variant or service. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">4. Governing Law</h2>
          <p>
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Tamil Nadu, India, with jurisdiction in Tirupur.
          </p>
        </section>
      </div>
    </>
  )
}

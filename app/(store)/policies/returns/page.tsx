import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'Read our terms regarding returns, replacements, and refund cancellations.',
}

export default function ReturnsPolicyPage() {
  return (
    <>
      <PageHero title="Returns &amp; Refunds" eyebrow="Policies" description="Our transparent terms for returns, cancellations, and product exchanges." />
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">1. Return Eligibility</h2>
          <p>
            Due to the consumable nature of food items (oils, jaggery, traditional foods), we do not accept returns once a product has been opened and used, unless the product arrived damaged, leaked, or has a manufacturing defect.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">2. Damaged or Leaking Items</h2>
          <p>
            If your package arrived damaged or leaked during transit:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Take a clear photo of the leaked bottle, shipping box, and label.</li>
            <li>WhatsApp the details to <strong>+91 98765 43210</strong> or email us at <strong>hello@kangeyanheritage.com</strong> within 24 hours of delivery.</li>
            <li>We will verify and dispatch a replacement bottle or issue a full refund for the damaged item within 48 hours of claim.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">3. Cancellation Terms</h2>
          <p>
            You can cancel your order at any time before it has been dispatched from our store (usually within 12 hours of placing the order). Once an order has been dispatched and a tracking number has been generated, it cannot be cancelled. Refunds for cancelled pre-dispatch orders will be processed back to the original payment source within 3 to 5 business days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">4. Contact Us</h2>
          <p>
            If you have any queries about refunds, contact our billing team at:
            <br />
            Email: billing@kangeyanheritage.com
            <br />
            Phone: +91 98765 43210
          </p>
        </section>
      </div>
    </>
  )
}

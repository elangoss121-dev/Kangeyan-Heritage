import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Learn about our shipping rates, delivery timelines, and transit details.',
}

export default function ShippingPolicyPage() {
  return (
    <>
      <PageHero title="Shipping Policy" eyebrow="Policies" description="How we pack and deliver our heritage foods to your doorstep." />
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16 prose prose-neutral dark:prose-invert space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">1. Shipping Charges</h2>
          <p>
            We offer free standard shipping on all orders above ₹999 across India. For orders below ₹999, a flat shipping fee of ₹60 is applied for deliveries within Tamil Nadu, and ₹100 for all other states.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">2. Processing &amp; Dispatch Times</h2>
          <p>
            All orders are processed and packed within 24 to 48 hours of confirmation. Orders placed on Sundays or public holidays are processed on the next business working day. Once packed, your package is handed over to our verified logistics partners (such as Delhivery, Professional Couriers, or India Post).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">3. Estimated Delivery Times</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Within Tamil Nadu:</strong> 2 - 3 business days</li>
            <li><strong>South India (Karnataka, Kerala, Andhra Pradesh, Telangana):</strong> 3 - 5 business days</li>
            <li><strong>Rest of India (Maharashtra, Delhi, Gujarat, etc.):</strong> 5 - 7 business days</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground">4. Transit Damage &amp; Leakage Protection</h2>
          <p>
            Oils are liquid gold, and we wrap them with extra care. We use food-grade, leak-proof bottles, capped securely and sealed in heavy cardboard boxes. In the rare event of transit leakage or container damage, please send a photograph of the damaged package within 24 hours of delivery to our WhatsApp line (+91 98765 43210) or email us at hello@kangeyanheritage.com. We will ship a replacement package immediately.
          </p>
        </section>
      </div>
    </>
  )
}

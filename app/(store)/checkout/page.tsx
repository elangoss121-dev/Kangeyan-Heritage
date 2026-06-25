import type { Metadata } from 'next'
import { CheckoutFlow } from '@/components/checkout/checkout-flow'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Securely complete your Kangeyan Heritage order.',
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="mb-8 font-serif text-3xl text-foreground md:text-4xl">
        Checkout
      </h1>
      <CheckoutFlow />
    </div>
  )
}

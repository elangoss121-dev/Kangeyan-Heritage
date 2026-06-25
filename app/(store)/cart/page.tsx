import type { Metadata } from 'next'
import { CartView } from '@/components/cart/cart-view'

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review the items in your cart before checkout.',
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="mb-8 font-serif text-3xl text-foreground md:text-4xl">
        Shopping Cart
      </h1>
      <CartView />
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CheckCircle2, Truck, CreditCard, MapPin, ArrowRight, ShoppingBag } from 'lucide-react'
import { getOrderByNumber } from '@/lib/orders'
import { formatINR } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Thank you for your order from Kangeyan Heritage.',
}

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { orderNumber } = await params
  const order = await getOrderByNumber(orderNumber)

  if (!order) {
    notFound()
  }

  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
    dateStyle: 'long',
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
          <CheckCircle2 className="size-10" />
        </div>
        <h1 className="mt-5 font-serif text-3xl font-bold text-foreground md:text-4xl">
          Thank you for your order!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your order has been placed successfully and is being processed.
        </p>
        <p className="mt-1.5 text-sm font-semibold text-primary">
          Order Number: {order.orderNumber}
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left side: details */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-lg font-bold text-foreground">Order Items</h2>
            <ul className="mt-4 divide-y divide-border">
              {order.items.map((item) => (
                <li key={item.sku} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 text-sm">
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <p className="text-muted-foreground">{item.size} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium tabular-nums text-foreground">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Delivery address */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <MapPin className="size-4 text-primary" />
                <h3>Delivery Address</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">{order.address.fullName}</span>
                <br />
                {order.address.line1}
                {order.address.line2 ? `, ${order.address.line2}` : ''}
                <br />
                {order.address.city}, {order.address.state} - {order.address.pincode}
                <br />
                Phone: {order.address.phone}
              </p>
            </div>

            {/* Payment & Shipping info */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <CreditCard className="size-4 text-primary" />
                    <h3>Payment Method</h3>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (demo)'}
                    <span className="ml-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary capitalize">
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Truck className="size-4 text-primary" />
                    <h3>Shipping Method</h3>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Standard Shipping (Free above ₹999)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Summary */}
        <aside className="h-fit space-y-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-lg font-bold text-foreground">Summary</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium text-foreground tabular-nums">{formatINR(order.subtotal)}</dd>
            </div>
            {order.shipping > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-medium text-foreground tabular-nums">{formatINR(order.shipping)}</dd>
              </div>
            ) : (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-medium text-emerald-600 dark:text-emerald-400">Free</dd>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <dt className="font-serif text-base font-bold text-foreground">Total Paid</dt>
              <dd className="font-serif text-lg font-bold text-foreground tabular-nums">
                {formatINR(order.total)}
              </dd>
            </div>
          </dl>

          <div className="space-y-2">
            <Button className="w-full rounded-full" render={<Link href="/account" />}>
              Go to Account Dashboard
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="ghost" className="w-full" render={<Link href="/shop" />}>
              <ShoppingBag className="size-4" />
              Continue Shopping
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

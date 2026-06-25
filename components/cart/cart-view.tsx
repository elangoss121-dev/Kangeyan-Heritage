'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  formatINR,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from '@/lib/format'
import { useState } from 'react'

export function CartView() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()
  const [promo, setPromo] = useState('')
  const [applied, setApplied] = useState<{ code: string; off: number } | null>(
    null,
  )

  const discount = applied ? Math.round(subtotal * applied.off) : 0
  const afterDiscount = subtotal - discount
  const shipping =
    afterDiscount >= FREE_SHIPPING_THRESHOLD || afterDiscount === 0
      ? 0
      : SHIPPING_FEE
  const total = afterDiscount + shipping

  function applyPromo() {
    const code = promo.trim().toUpperCase()
    if (code === 'HERITAGE10') {
      setApplied({ code, off: 0.1 })
    } else if (code === 'FIRST5') {
      setApplied({ code, off: 0.05 })
    } else {
      setApplied(null)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-9 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif text-2xl text-foreground">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground">
            Discover our range of wood-pressed oils and natural foods.
          </p>
        </div>
        <Button size="lg" className="rounded-full" render={<Link href="/shop" />}>
          Browse Products
          <ArrowRight className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.sku}
            className="flex gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <Link
              href={`/product/${item.slug}`}
              className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-secondary"
            >
              <Image
                src={item.image || '/placeholder.svg'}
                alt={item.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.size}</p>
                </div>
                <button
                  onClick={() => removeItem(item.sku)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center rounded-full border border-border">
                  <button
                    onClick={() =>
                      updateQuantity(item.sku, item.quantity - 1)
                    }
                    className="flex size-8 items-center justify-center text-foreground transition-colors hover:text-primary"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.sku, item.quantity + 1)
                    }
                    className="flex size-8 items-center justify-center text-foreground transition-colors hover:text-primary"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <span className="font-medium text-foreground tabular-nums">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <aside className="h-fit space-y-5 rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-serif text-xl text-foreground">Order Summary</h2>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code"
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={applyPromo}>
            Apply
          </Button>
        </div>
        {applied && (
          <p className="text-sm text-primary">
            Code {applied.code} applied — {applied.off * 100}% off
          </p>
        )}

        <Separator />

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-medium tabular-nums">{formatINR(subtotal)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-primary">
              <dt>Discount</dt>
              <dd className="tabular-nums">-{formatINR(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="font-medium tabular-nums">
              {shipping === 0 ? 'Free' : formatINR(shipping)}
            </dd>
          </div>
        </dl>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-serif text-lg text-foreground">Total</span>
          <span className="font-serif text-xl text-foreground tabular-nums">
            {formatINR(total)}
          </span>
        </div>

        <Button
          size="lg"
          className="w-full rounded-full"
          render={<Link href="/checkout" />}
        >
          Proceed to Checkout
          <ArrowRight className="size-4" />
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          render={<Link href="/shop" />}
        >
          Continue Shopping
        </Button>
      </aside>
    </div>
  )
}

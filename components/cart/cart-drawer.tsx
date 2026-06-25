'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from './cart-provider'
import { formatINR, FREE_SHIPPING_THRESHOLD } from '@/lib/format'

export function CartDrawer() {
  const { items, isOpen, setOpen, updateQuantity, removeItem, subtotal } =
    useCart()

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2 font-serif">
            <ShoppingBag className="size-5 text-primary" />
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button onClick={() => setOpen(false)} render={<Link href="/shop" />}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {remaining > 0 ? (
                <p className="rounded-lg bg-accent/60 px-3 py-2 text-center text-sm text-accent-foreground">
                  Add {formatINR(remaining)} more for free shipping
                </p>
              ) : (
                <p className="rounded-lg bg-olive/15 px-3 py-2 text-center text-sm text-foreground">
                  You have unlocked free shipping!
                </p>
              )}
              {items.map((item) => (
                <div key={item.sku} className="flex gap-3">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border bg-card">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-medium leading-tight">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.size}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="grid size-7 place-items-center text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            updateQuantity(item.sku, item.quantity - 1)
                          }
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="grid size-7 place-items-center text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            updateQuantity(item.sku, item.quantity + 1)
                          }
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    className="self-start text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.sku)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <SheetFooter className="border-t">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">{formatINR(subtotal)}</span>
              </div>
              <Separator className="mb-3" />
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  onClick={() => setOpen(false)}
                  render={<Link href="/checkout" />}
                >
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  render={<Link href="/cart" />}
                >
                  View Cart
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

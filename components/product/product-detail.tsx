'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, ShoppingBag, Star, Check, Truck, Leaf, ShieldCheck, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-provider'
import { useWishlist } from '@/components/wishlist/wishlist-context'
import { formatINR } from '@/lib/format'
import { CATEGORY_LABELS, type Product } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, setOpen, subtotal } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [variantIdx, setVariantIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const wishlisted = isWishlisted(product.slug)
  const gallery = product.gallery?.length ? product.gallery : [product.image]
  const [activeImage, setActiveImage] = useState(gallery[0])
  const variant = product.variants[variantIdx]
  const hasDiscount = variant.mrp && variant.mrp > variant.price

  function handleAdd(openDrawer: boolean) {
    addItem({
      slug: product.slug,
      name: product.name,
      image: product.image,
      size: variant.size,
      sku: variant.sku,
      price: variant.price,
      quantity: qty,
    })
    toast.success('Added to cart', {
      description: `${product.name} (${variant.size}) × ${qty}`,
    })
    if (openDrawer) setOpen(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-secondary/40">
            <Image
              src={activeImage || '/placeholder.svg'}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6"
            />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(g)}
                  className={cn(
                    'relative size-20 overflow-hidden rounded-xl border bg-secondary/40',
                    activeImage === g ? 'border-primary' : 'border-border',
                  )}
                >
                  <Image
                    src={g || '/placeholder.svg'}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-sm font-medium uppercase tracking-wide text-primary">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl">
            {product.name}
          </h1>
          {product.tamilName && (
            <p className="mt-1 text-lg text-muted-foreground">
              {product.tamilName}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'size-4',
                    i < Math.round(product.rating)
                      ? 'fill-gold text-gold'
                      : 'text-border',
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">
              {product.rating}
            </span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="mt-4 leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>

          {/* Price */}
          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-bold text-foreground">
              {formatINR(variant.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatINR(variant.mrp ?? 0)}
                </span>
                <span className="mb-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  Save {formatINR((variant.mrp ?? 0) - variant.price)}
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Inclusive of all taxes
          </p>

          {/* Variants */}
          <div className="mt-6">
            <p className="text-sm font-medium text-foreground">Size</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button
                  key={v.sku}
                  type="button"
                  onClick={() => setVariantIdx(i)}
                  className={cn(
                    'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                    variantIdx === i
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-foreground/70 hover:border-primary/40',
                  )}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          {/* Bundle Suggestion Box */}
          <div className="mt-6 border border-dashed border-primary/40 bg-muted/20 p-4 rounded-2xl">
            <h4 className="font-serif text-sm font-semibold text-foreground">Better together</h4>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-secondary border border-border">
                  <Image
                    src="/products/groundnut-oil.png"
                    alt="Cold Pressed Groundnut Oil 500ml"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <span className="text-xs font-bold text-muted-foreground">+</span>
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-secondary border border-border">
                  <Image
                    src="/products/coconut-oil.png"
                    alt="Cold Pressed Coconut Oil 500ml"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground line-through">₹460</p>
                <p className="font-serif text-sm font-bold text-foreground">
                  Bundle: <span className="text-primary">₹420</span>
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold">Save ₹40</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3.5 w-full rounded-full text-xs font-semibold h-8"
              onClick={() => {
                addItem({
                  slug: 'cold-pressed-groundnut-oil',
                  name: 'Cold Pressed Groundnut Oil',
                  image: '/products/groundnut-oil.png',
                  size: '500 ml',
                  sku: 'KH-GN-500',
                  price: 200,
                  quantity: 1,
                })
                addItem({
                  slug: 'cold-pressed-coconut-oil',
                  name: 'Cold Pressed Coconut Oil',
                  image: '/products/coconut-oil.png',
                  size: '500 ml',
                  sku: 'KH-CO-500',
                  price: 220,
                  quantity: 1,
                })
                toast.success('Bundle added to cart!', {
                  description: 'Groundnut Oil 500ml & Coconut Oil 500ml added.',
                })
                setOpen(true)
              }}
            >
              Add bundle to cart
            </Button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="mt-6 w-full space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className={cn(subtotal >= 999 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')}>
                {subtotal === 0
                  ? 'Add items to unlock free shipping'
                  : subtotal >= 999
                  ? "You've unlocked free shipping!"
                  : `Add ${formatINR(999 - subtotal)} more to get free shipping above ₹999`}
              </span>
              <span className="text-muted-foreground font-medium">
                {subtotal === 0 ? '0%' : subtotal >= 999 ? '100%' : `${Math.round(Math.min(100, (subtotal / 999) * 100))}%`}
              </span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden border border-border/30">
              <div
                className={cn(
                  'h-full transition-all duration-500 rounded-full',
                  subtotal >= 999 ? 'bg-emerald-500' : 'bg-primary',
                )}
                style={{ width: `${subtotal === 0 ? 0 : Math.min(100, (subtotal / 999) * 100)}%` }}
              />
            </div>
          </div>

          {/* Quantity + Add */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-10 place-items-center text-foreground/70 hover:text-foreground"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="grid size-10 place-items-center text-foreground/70 hover:text-foreground"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 rounded-full sm:flex-none"
              disabled={!product.inStock}
              onClick={() => handleAdd(false)}
            >
              <ShoppingBag className="size-4" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-full sm:flex-none"
              disabled={!product.inStock}
              onClick={() => handleAdd(true)}
            >
              Buy Now
            </Button>
            <Button
              size="icon"
              variant="outline"
              className={cn(
                'rounded-full size-11 shrink-0',
                wishlisted
                  ? 'border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
              onClick={() => toggleWishlist(product.slug)}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('size-4.5', wishlisted && 'fill-destructive')} />
            </Button>
          </div>

          {/* Trust row */}
          <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-border bg-card p-4">
            <TrustItem icon={Leaf} label="100% Chemical Free" />
            <TrustItem icon={Truck} label="Doorstep Delivery" />
            <TrustItem icon={ShieldCheck} label="FSSAI Certified" />
          </div>

          {/* Highlights */}
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {product.highlights.map((h) => (
              <li
                key={h}
                className="flex items-center gap-2 text-sm text-foreground/80"
              >
                <Check className="size-4 shrink-0 text-primary" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Description & benefits */}
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            About this product
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
        {product.benefits && product.benefits.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Why you&apos;ll love it
            </h2>
            <div className="mt-4 grid gap-4">
              {product.benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <h3 className="font-semibold text-foreground">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TrustItem({
  icon: Icon,
  label,
}: {
  icon: typeof Leaf
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <Icon className="size-5 text-primary" />
      <span className="text-xs font-medium text-foreground/80">{label}</span>
    </div>
  )
}

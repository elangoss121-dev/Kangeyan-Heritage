'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-provider'
import { useWishlist } from '@/components/wishlist/wishlist-context'
import { formatINR } from '@/lib/format'
import { CATEGORY_LABELS, type Product } from '@/lib/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const v = product.variants[0]
  const hasDiscount = v.mrp && v.mrp > v.price
  const wishlisted = isWishlisted(product.slug)

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-secondary/40"
      >
        {hasDiscount && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
            Save {formatINR((v.mrp ?? 0) - v.price)}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist(product.slug)
          }}
          className={cn(
            'absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/80 shadow-xs backdrop-blur-xs transition-colors hover:bg-background',
            wishlisted ? 'text-destructive' : 'text-muted-foreground hover:text-foreground',
          )}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={cn('size-4', wishlisted && 'fill-destructive')} />
        </button>
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-primary/80">
          {CATEGORY_LABELS[product.category]}
        </span>
        <Link href={`/product/${product.slug}`} className="mt-1">
          <h3 className="font-serif text-base font-semibold leading-snug text-foreground text-pretty">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Star className="size-3.5 fill-gold text-gold" />
          <span className="text-xs font-medium text-foreground">
            {product.rating}
          </span>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{v.size}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-foreground">
                {formatINR(v.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatINR(v.mrp ?? 0)}
                </span>
              )}
            </div>
          </div>
          <Button
            size="icon"
            className="rounded-full"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => {
              addItem({
                slug: product.slug,
                name: product.name,
                image: product.image,
                size: v.size,
                sku: v.sku,
                price: v.price,
                quantity: 1,
              })
              toast.success('Added to cart', { description: product.name })
            }}
          >
            <ShoppingBag className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

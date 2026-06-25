import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/product-card'
import { getFeaturedProducts } from '@/lib/products'

export async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  return (
    <section className="bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              Bestsellers
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Loved by Families
            </h2>
          </div>
          <Button
            variant="outline"
            className="rounded-full"
            render={<Link href="/shop" />}
          >
            View All
            <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

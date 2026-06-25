import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import {
  getAllProducts,
  getProductBySlug,
} from '@/lib/products'
import { ProductDetail } from '@/components/product/product-detail'
import { ProductCard } from '@/components/product/product-card'
import { CATEGORY_LABELS } from '@/lib/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found' }
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { images: [product.image] },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const all = await getAllProducts()
  const related = all
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4)

  return (
    <>
      <nav className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 pt-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        <ChevronRight className="size-3.5" />
        <Link
          href={`/shop/${product.category}`}
          className="hover:text-primary"
        >
          {CATEGORY_LABELS[product.category]}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            You may also like
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16 border-t border-border pt-12">
        <h2 className="font-serif text-2xl font-bold text-foreground">What customers say</h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Rating Breakdown Chart */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-foreground leading-none">4.8</span>
              <span className="text-sm text-muted-foreground">out of 5</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#F59E0B]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-base leading-none">★</span>
              ))}
              <span className="text-xs text-muted-foreground ml-1.5">(124 reviews)</span>
            </div>
            <div className="space-y-2 pt-2">
              <RatingBar star="5★" percent={78} />
              <RatingBar star="4★" percent={15} />
              <RatingBar star="3★" percent={4} />
              <RatingBar star="2★" percent={2} />
              <RatingBar star="1★" percent={1} />
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <ReviewCard
                name="Lakshmi Narayanan"
                city="Chennai"
                rating={5}
                date="June 12, 2026"
                text="The groundnut oil tastes exactly like what my grandmother used to make. Pure aroma and you can feel the difference in cooking."
              />
              <ReviewCard
                name="Priya Subramaniam"
                city="Coimbatore"
                rating={5}
                date="June 15, 2026"
                text="Switched to their coconut oil for both cooking and hair care. Quality is outstanding and delivery was quick."
              />
              <ReviewCard
                name="Karthik Raja"
                city="Bengaluru"
                rating={5}
                date="June 18, 2026"
                text="The palm jaggery sesame oil is a rare find. Authentic taste and completely chemical free. Highly recommend."
              />
              <ReviewCard
                name="Ramesh Kumar"
                city="Tirupur"
                rating={5}
                date="June 22, 2026"
                text="Excellent products and fast shipping. Fully satisfied with the wood-pressed oil quality and taste. Highly recommend to everyone."
              />
            </div>
            <div className="text-center pt-2">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-input bg-transparent px-6 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                Load more reviews
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function RatingBar({ star, percent }: { star: string; percent: number }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-5 text-muted-foreground font-semibold">{star}</span>
      <div className="relative flex-1 h-2 bg-secondary rounded-full overflow-hidden border border-border/20">
        <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-8 text-right text-muted-foreground font-medium">{percent}%</span>
    </div>
  )
}

function ReviewCard({
  name,
  city,
  rating,
  date,
  text,
}: {
  name: string
  city: string
  rating: number
  date: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-foreground text-sm">{name}</h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">{city}</p>
        </div>
        <span className="text-[10px] text-muted-foreground">{date}</span>
      </div>
      <div className="flex gap-0.5 text-[#F59E0B]">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-sm leading-none">
            {i < rating ? '★' : '☆'}
          </span>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'
import { ProductCard } from '@/components/product/product-card'
import { CATEGORY_LABELS, type Category, type Product } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating'

const SORT_LABELS: Record<SortKey, string> = {
  featured: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  rating: 'Top Rated',
}

export function ShopBrowser({
  products,
  initialCategory = 'all',
  lockCategory = false,
}: {
  products: Product[]
  initialCategory?: Category | 'all'
  lockCategory?: boolean
}) {
  const [category, setCategory] = useState<Category | 'all'>(initialCategory)
  const [sort, setSort] = useState<SortKey>('featured')

  const categories = useMemo(() => {
    const present = Array.from(new Set(products.map((p) => p.category)))
    return present
  }, [products])

  const filtered = useMemo(() => {
    let list =
      category === 'all'
        ? products
        : products.filter((p) => p.category === category)
    list = [...list]
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.variants[0].price - b.variants[0].price)
        break
      case 'price-desc':
        list.sort((a, b) => b.variants[0].price - a.variants[0].price)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured))
    }
    return list
  }, [products, category, sort])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {!lockCategory && (
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={category === 'all'}
              onClick={() => setCategory('all')}
            >
              All Products
            </FilterChip>
            {categories.map((c) => (
              <FilterChip
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
              >
                {CATEGORY_LABELS[c]}
              </FilterChip>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-sm text-muted-foreground">
            {filtered.length} items
          </span>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {SORT_LABELS[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No products found in this category yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

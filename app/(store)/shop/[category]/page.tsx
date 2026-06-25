import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProducts } from '@/lib/products'
import { PageHero } from '@/components/layout/page-hero'
import { ShopBrowser } from '@/components/shop/shop-browser'
import { CATEGORY_LABELS, type Category } from '@/lib/types'

const VALID: Category[] = ['cold-pressed-oils', 'jaggery', 'spices', 'grains']

const CATEGORY_INTRO: Record<Category, string> = {
  'cold-pressed-oils':
    'Wood pressed in traditional chekku at low temperatures to preserve nutrients, aroma and flavour.',
  jaggery:
    'Unrefined, chemical-free sweeteners made from sugarcane and palm, the way nature intended.',
  spices: 'Sun-dried and stone-ground spices sourced from trusted farms.',
  grains: 'Naturally grown grains and millets, free from polishing and chemicals.',
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  return params.then(({ category }) => {
    const label = CATEGORY_LABELS[category as Category] ?? 'Shop'
    return { title: label }
  })
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  if (!VALID.includes(category as Category)) notFound()
  const cat = category as Category
  const products = await getAllProducts()

  return (
    <>
      <PageHero
        eyebrow="Our Range"
        title={CATEGORY_LABELS[cat]}
        description={CATEGORY_INTRO[cat]}
      />
      <ShopBrowser products={products} initialCategory={cat} lockCategory />
    </>
  )
}

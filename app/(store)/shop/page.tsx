import type { Metadata } from 'next'
import { getAllProducts } from '@/lib/products'
import { PageHero } from '@/components/layout/page-hero'
import { ShopBrowser } from '@/components/shop/shop-browser'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Browse our full range of cold pressed oils, organic jaggery and traditional foods from Tamil Nadu.',
}

export default async function ShopPage() {
  const products = await getAllProducts()
  return (
    <>
      <PageHero
        eyebrow="Our Range"
        title="Shop Pure Heritage Foods"
        description="Wood pressed oils and organic foods, made the traditional way. No chemicals, no shortcuts."
      />
      <ShopBrowser products={products} />
    </>
  )
}

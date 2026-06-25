import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getAllProducts, createProduct } from '@/lib/products'

async function checkAdmin() {
  const user = await getCurrentUser()
  return user && user.role === 'admin'
}

export async function GET() {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const products = await getAllProducts()
    return NextResponse.json({ products })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      tamilName,
      slug,
      category,
      shortDescription,
      description,
      highlights,
      image,
      gallery,
      variants,
      featured,
      inStock,
      benefits,
    } = body

    if (!name?.trim() || !slug?.trim() || !category || !variants?.length) {
      return NextResponse.json(
        { error: 'Name, Slug, Category, and at least one Variant are required' },
        { status: 400 },
      )
    }

    const newProd = await createProduct({
      name: name.trim(),
      tamilName: tamilName?.trim() || '',
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      category,
      shortDescription: shortDescription?.trim() || '',
      description: description?.trim() || '',
      highlights: Array.isArray(highlights) ? highlights : [],
      image: image?.trim() || '/placeholder.svg',
      gallery: Array.isArray(gallery) ? gallery : [],
      variants: variants.map((v: any) => ({
        size: v.size?.trim() || '',
        price: Number(v.price) || 0,
        mrp: v.mrp ? Number(v.mrp) : undefined,
        sku: v.sku?.trim() || '',
      })),
      rating: 5.0,
      reviewCount: 0,
      featured: !!featured,
      inStock: !!inStock,
      benefits: Array.isArray(benefits) ? benefits : [],
    })

    return NextResponse.json({ product: newProd }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

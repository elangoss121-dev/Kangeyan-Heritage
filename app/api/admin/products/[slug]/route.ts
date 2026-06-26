import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { updateProduct, deleteProduct } from '@/lib/products'
import { validateCategory } from '@/lib/validation'

async function checkAdmin() {
  const user = await getCurrentUser()
  return user && user.role === 'admin'
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const body = await request.json()

    // Filter fields to avoid security injection
    const updates: Parameters<typeof updateProduct>[1] = {}
    if (typeof body.name === 'string') updates.name = body.name.trim()
    if (typeof body.tamilName === 'string') updates.tamilName = body.tamilName.trim()
    if (typeof body.category === 'string') {
      if (!validateCategory(body.category)) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
      }
      updates.category = body.category
    }
    if (typeof body.shortDescription === 'string') updates.shortDescription = body.shortDescription.trim()
    if (typeof body.description === 'string') updates.description = body.description.trim()
    if (typeof body.image === 'string') updates.image = body.image.trim()
    if (Array.isArray(body.highlights)) updates.highlights = body.highlights
    if (Array.isArray(body.gallery)) updates.gallery = body.gallery
    if (Array.isArray(body.benefits)) updates.benefits = body.benefits
    if (typeof body.featured === 'boolean') updates.featured = body.featured
    if (typeof body.inStock === 'boolean') updates.inStock = body.inStock
    if (Array.isArray(body.variants)) {
      updates.variants = body.variants.map((v: any) => ({
        size: v.size?.trim() || '',
        price: Number(v.price) || 0,
        mrp: v.mrp ? Number(v.mrp) : undefined,
        sku: v.sku?.trim() || '',
      }))
    }

    const updated = await updateProduct(slug, updates)
    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product: updated })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const deleted = await deleteProduct(slug)

    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/products'

export async function GET() {
  try {
    const products = await getAllProducts()
    return NextResponse.json({ products })
  } catch (err) {
    console.log('[v0] products GET error:', (err as Error).message)
    return NextResponse.json(
      { error: 'Failed to retrieve products' },
      { status: 500 },
    )
  }
}

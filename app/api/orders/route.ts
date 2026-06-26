import { NextResponse } from 'next/server'
import { createOrder, generateOrderNumber } from '@/lib/orders'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/format'
import { getProductBySlug } from '@/lib/products'
import { validateAddress, validateEmail } from '@/lib/validation'
import type { CartItem, Order } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items: CartItem[]
      address: any
      email: string
      paymentMethod: 'cod' | 'online'
    }

    const { items, address, email, paymentMethod } = body

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const addressValidation = validateAddress(address)
    if (!addressValidation.valid) {
      return NextResponse.json(
        { error: addressValidation.error || 'Invalid shipping address' },
        { status: 400 }
      )
    }

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Validate items and their prices against database registry
    let verifiedItems: CartItem[] = []
    try {
      verifiedItems = await Promise.all(
        items.map(async (item) => {
          const product = await getProductBySlug(item.slug)
          if (!product) {
            throw new Error(`Product not found: ${item.slug}`)
          }
          const variant = product.variants?.find(
            (v) => v.size === item.size && v.sku === item.sku
          )
          if (!variant) {
            throw new Error(`Invalid variant for product: ${item.slug}`)
          }
          if (!Number.isInteger(item.quantity) || item.quantity < 1) {
            throw new Error(`Invalid quantity for: ${item.slug}`)
          }
          if (item.price !== undefined && item.price !== variant.price) {
            throw new Error(`Price mismatch for: ${item.slug}`)
          }
          return {
            slug: product.slug,
            name: product.name,
            image: product.image,
            size: variant.size,
            sku: variant.sku,
            price: variant.price,
            quantity: item.quantity,
          }
        })
      )
    } catch (err) {
      return NextResponse.json(
        { error: (err as Error).message },
        { status: 400 }
      )
    }

    const subtotal = verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
    const total = subtotal + shipping

    const order: Omit<Order, '_id'> = {
      orderNumber: generateOrderNumber(),
      email: email.trim().toLowerCase(),
      items: verifiedItems,
      address,
      subtotal,
      shipping,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }

    const created = await createOrder(order)
    return NextResponse.json({ order: created }, { status: 201 })
  } catch (err) {
    console.error('[v0] order POST error:', err)
    return NextResponse.json(
      { error: 'Failed to place order' },
      { status: 500 },
    )
  }
}

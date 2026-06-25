import { NextResponse } from 'next/server'
import { createOrder, generateOrderNumber } from '@/lib/orders'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/format'
import type { Address, CartItem, Order } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items: CartItem[]
      address: Address
      email: string
      paymentMethod: 'cod' | 'online'
    }

    const { items, address, email, paymentMethod } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    if (!address?.fullName || !address?.phone || !address?.pincode) {
      return NextResponse.json(
        { error: 'Incomplete shipping address' },
        { status: 400 },
      )
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
    const total = subtotal + shipping

    const order: Omit<Order, '_id'> = {
      orderNumber: generateOrderNumber(),
      email,
      items,
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
    console.log('[v0] order POST error:', (err as Error).message)
    return NextResponse.json(
      { error: 'Failed to place order' },
      { status: 500 },
    )
  }
}

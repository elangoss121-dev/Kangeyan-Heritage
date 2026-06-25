import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { updateOrder } from '@/lib/orders'

async function checkAdmin() {
  const user = await getCurrentUser()
  return user && user.role === 'admin'
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderNumber } = await params
    const body = await request.json()
    const { status, paymentStatus } = body

    const updates: Parameters<typeof updateOrder>[1] = {}
    if (typeof status === 'string') updates.status = status as any
    if (typeof paymentStatus === 'string') updates.paymentStatus = paymentStatus as any

    const updated = await updateOrder(orderNumber, updates)
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order: updated })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

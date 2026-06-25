import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getOrdersByEmail } from '@/lib/orders'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await getOrdersByEmail(user.email)
    return NextResponse.json({ orders })
  } catch (err) {
    console.log('[v0] auth orders GET error:', (err as Error).message)
    return NextResponse.json(
      { error: 'Failed to retrieve orders' },
      { status: 500 },
    )
  }
}

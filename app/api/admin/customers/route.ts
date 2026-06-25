import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getAllCustomers } from '@/lib/users'

async function checkAdmin() {
  const user = await getCurrentUser()
  return user && user.role === 'admin'
}

export async function GET() {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const customers = await getAllCustomers()
    return NextResponse.json({ customers })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

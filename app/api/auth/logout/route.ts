import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'

export async function POST() {
  try {
    await clearSessionCookie()
    return NextResponse.json({ success: true, message: 'Logged out successfully' })
  } catch (err) {
    console.log('[v0] logout API error:', (err as Error).message)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}

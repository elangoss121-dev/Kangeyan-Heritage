import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '@/lib/users'
import { setSessionCookie } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      )
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 },
      )
    }

    const matches = await bcrypt.compare(password, user.passwordHash)
    if (!matches) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 },
      )
    }

    // Set cookie
    await setSessionCookie({
      userId: user._id || user.email,
      email: user.email,
      role: user.role,
    })

    // Return user without password
    const { passwordHash: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch (err) {
    console.log('[v0] login API error:', (err as Error).message)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 },
    )
  }
}

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createUser, getUserByEmail } from '@/lib/users'
import { setSessionCookie } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, phone } = body

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 },
      )
    }

    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = await createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'customer',
      phone: phone?.trim() || '',
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
    })

    // Sign session JWT and set cookie
    await setSessionCookie({
      userId: newUser._id || newUser.email,
      email: newUser.email,
      role: newUser.role,
    })

    // Return user without password
    const { passwordHash: _, ...safeUser } = newUser
    return NextResponse.json({ user: safeUser }, { status: 201 })
  } catch (err) {
    console.log('[v0] register API error:', (err as Error).message)
    return NextResponse.json(
      { error: 'Failed to register account' },
      { status: 500 },
    )
  }
}

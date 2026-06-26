import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { updateUser } from '@/lib/users'
import { validateAddress } from '@/lib/validation'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { passwordHash: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch (err) {
    console.log('[v0] me GET error:', (err as Error).message)
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone, addresses } = body

    const updates: Parameters<typeof updateUser>[1] = {}
    if (typeof name === 'string') updates.name = name.trim()
    if (typeof phone === 'string') updates.phone = phone.trim()
    
    if (addresses !== undefined) {
      if (!Array.isArray(addresses)) {
        return NextResponse.json({ error: 'Addresses must be an array' }, { status: 400 })
      }
      for (let i = 0; i < addresses.length; i++) {
        const addressCheck = validateAddress(addresses[i])
        if (!addressCheck.valid) {
          return NextResponse.json(
            { error: `Address #${i + 1}: ${addressCheck.error || 'Invalid address format'}` },
            { status: 400 }
          )
        }
      }
      updates.addresses = addresses
    }

    const updated = await updateUser(user._id || user.email, updates)
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update user profile' }, { status: 400 })
    }

    const { passwordHash: _, ...safeUser } = updated
    return NextResponse.json({ user: safeUser })
  } catch (err) {
    console.log('[v0] me PUT error:', (err as Error).message)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

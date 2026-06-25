import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { updateUser } from '@/lib/users'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { slug, action } = body

    if (!slug || (action !== 'add' && action !== 'remove')) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const currentWishlist = user.wishlist || []
    let updatedWishlist = [...currentWishlist]

    if (action === 'add') {
      if (!updatedWishlist.includes(slug)) {
        updatedWishlist.push(slug)
      }
    } else {
      updatedWishlist = updatedWishlist.filter((s) => s !== slug)
    }

    const updated = await updateUser(user._id || user.email, {
      wishlist: updatedWishlist,
    })

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 400 })
    }

    return NextResponse.json({ wishlist: updated.wishlist || [] })
  } catch (err) {
    console.log('[v0] wishlist POST error:', (err as Error).message)
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 })
  }
}

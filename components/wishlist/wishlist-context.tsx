'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'

interface WishlistContextValue {
  wishlist: string[]
  isWishlisted: (slug: string) => boolean
  toggleWishlist: (slug: string) => Promise<void>
  syncWishlist: (slugs: string[]) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)
const STORAGE_KEY = 'kh_wishlist_v1'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage initially
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setWishlist(JSON.parse(raw))
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  // Sync to localStorage
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
  }, [wishlist, hydrated])

  const isWishlisted = (slug: string) => wishlist.includes(slug)

  const toggleWishlist = async (slug: string) => {
    let updated: string[] = []
    const isAdding = !wishlist.includes(slug)

    if (isAdding) {
      updated = [...wishlist, slug]
      toast.success('Added to wishlist')
    } else {
      updated = wishlist.filter((s) => s !== slug)
      toast.info('Removed from wishlist')
    }

    setWishlist(updated)

    // Attempt to sync with API if logged in
    try {
      const res = await fetch('/api/auth/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action: isAdding ? 'add' : 'remove' }),
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data.wishlist) {
          setWishlist(data.wishlist)
        }
      }
    } catch {
      // Quietly ignore sync issues if unauthenticated or offline
    }
  }

  const syncWishlist = (slugs: string[]) => {
    setWishlist(slugs)
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, isWishlisted, toggleWishlist, syncWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

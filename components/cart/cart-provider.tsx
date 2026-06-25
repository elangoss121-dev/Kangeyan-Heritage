'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem } from '@/lib/types'

interface CartContextValue {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (item: CartItem) => void
  removeItem: (sku: string) => void
  updateQuantity: (sku: string, quantity: number) => void
  clear: () => void
  isOpen: boolean
  setOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'kh_cart_v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.sku === item.sku)
      if (existing) {
        return prev.map((p) =>
          p.sku === item.sku
            ? { ...p, quantity: p.quantity + item.quantity }
            : p,
        )
      }
      return [...prev, item]
    })
    setOpen(true)
  }

  const removeItem = (sku: string) =>
    setItems((prev) => prev.filter((p) => p.sku !== sku))

  const updateQuantity = (sku: string, quantity: number) =>
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((p) => p.sku !== sku)
        : prev.map((p) => (p.sku === sku ? { ...p, quantity } : p)),
    )

  const clear = () => setItems([])

  const { count, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.count += item.quantity
        acc.subtotal += item.price * item.quantity
        return acc
      },
      { count: 0, subtotal: 0 },
    )
  }, [items])

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    isOpen,
    setOpen,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

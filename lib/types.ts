export type Category =
  | 'cold-pressed-oils'
  | 'jaggery'
  | 'spices'
  | 'grains'

export interface ProductVariant {
  size: string
  price: number
  mrp?: number
  sku: string
}

export interface Product {
  _id?: string
  slug: string
  name: string
  tamilName?: string
  category: Category
  shortDescription: string
  description: string
  highlights: string[]
  image: string
  gallery?: string[]
  variants: ProductVariant[]
  rating: number
  reviewCount: number
  featured: boolean
  inStock: boolean
  benefits?: { title: string; description: string }[]
  createdAt?: string
}

export interface CartItem {
  slug: string
  name: string
  image: string
  size: string
  sku: string
  price: number
  quantity: number
}

export interface Address {
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Order {
  _id?: string
  orderNumber: string
  userId?: string
  email: string
  items: CartItem[]
  address: Address
  subtotal: number
  shipping: number
  total: number
  paymentMethod: 'cod' | 'online'
  paymentStatus: 'pending' | 'paid' | 'failed'
  status: OrderStatus
  createdAt: string
}

export interface User {
  _id?: string
  name: string
  email: string
  passwordHash: string
  role: 'customer' | 'admin'
  phone?: string
  addresses?: Address[]
  wishlist?: string[]
  createdAt: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  'cold-pressed-oils': 'Cold Pressed Oils',
  jaggery: 'Jaggery',
  spices: 'Spices',
  grains: 'Grains',
}

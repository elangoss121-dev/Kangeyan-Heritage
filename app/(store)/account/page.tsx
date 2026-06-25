'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  LogOut,
  MapPin,
  Plus,
  Trash2,
  Lock,
  Mail,
  Loader2,
  ChevronDown,
  ChevronUp,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { formatINR } from '@/lib/format'
import { useWishlist } from '@/components/wishlist/wishlist-context'
import { useCart } from '@/components/cart/cart-provider'
import type { User, Order, Address, Product } from '@/lib/types'
import { cn } from '@/lib/utils'

const INDIAN_STATES = [
  'Tamil Nadu',
  'Kerala',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Delhi',
  'Other',
]

export default function AccountPage() {
  const router = useRouter()
  const { wishlist, toggleWishlist, syncWishlist } = useWishlist()
  const { addItem } = useCart()

  // Authentication & session states
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  // Dashboard tabs
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile')

  // Data states
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})

  // Form states: Auth
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [authSubmitting, setAuthSubmitting] = useState(false)

  // Form states: Profile edit
  const [profileName, setProfileName] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [profileSubmitting, setProfileSubmitting] = useState(false)

  // Form states: Address
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
  })
  const [addressSubmitting, setAddressSubmitting] = useState(false)

  // Load user session and supporting data
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          setProfileName(data.user.name)
          setProfilePhone(data.user.phone || '')
          if (data.user.wishlist) {
            syncWishlist(data.user.wishlist)
          }
          // Fetch orders and products in parallel
          fetchOrders()
          fetchProducts()
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  async function fetchOrders() {
    try {
      const res = await fetch('/api/auth/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Actions: Authentication
  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setAuthSubmitting(true)

    const url = authMode === 'login' ? '/api/auth/login' : '/api/auth/register'
    const payload =
      authMode === 'login'
        ? { email, password }
        : { name, email, password, phone }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      setUser(data.user)
      setProfileName(data.user.name)
      setProfilePhone(data.user.phone || '')
      if (data.user.wishlist) {
        syncWishlist(data.user.wishlist)
      }
      toast.success(authMode === 'login' ? 'Welcome back!' : 'Account registered successfully!')
      fetchOrders()
      fetchProducts()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setAuthSubmitting(false)
    }
  }

  async function handleLogout() {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        setUser(null)
        syncWishlist([])
        toast.info('Logged out successfully.')
        router.push('/')
      }
    } catch {
      toast.error('Logout failed.')
    }
  }

  // Actions: Update profile details
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileSubmitting(true)
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileName, phone: profilePhone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update profile')
      setUser(data.user)
      toast.success('Profile details updated!')
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setProfileSubmitting(false)
    }
  }

  // Actions: Add address
  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault()
    if (!newAddress.fullName.trim() || !newAddress.phone.trim() || !newAddress.line1.trim()) {
      toast.error('Please complete all required fields.')
      return
    }
    setAddressSubmitting(true)

    const updatedAddresses = [...(user?.addresses || []), newAddress]

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add address')
      setUser(data.user)
      setShowAddressForm(false)
      setNewAddress({
        fullName: '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: 'Tamil Nadu',
        pincode: '',
      })
      toast.success('Address added successfully!')
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setAddressSubmitting(false)
    }
  }

  // Actions: Remove address
  async function handleRemoveAddress(index: number) {
    if (!user) return
    const updatedAddresses = (user.addresses || []).filter((_, i) => i !== index)
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUser(data.user)
      toast.info('Address removed.')
    } catch (err) {
      toast.error('Failed to remove address.')
    }
  }

  // Toggle order details expander
  function toggleOrderExpand(orderNum: string) {
    setExpandedOrders((prev) => ({ ...prev, [orderNum]: !prev[orderNum] }))
  }

  // Get products filtered for wishlist
  const wishlistedItems = products.filter((p) => wishlist.includes(p.slug))

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading account details...</p>
      </div>
    )
  }

  // Unauthenticated view: Login & Register Forms
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 md:py-24">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={cn(
                'flex-1 pb-3 text-center font-serif text-lg font-semibold border-b-2 transition-colors',
                authMode === 'login' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={cn(
                'flex-1 pb-3 text-center font-serif text-lg font-semibold border-b-2 transition-colors',
                authMode === 'register' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-name">Full Name *</Label>
                  <Input
                    id="reg-name"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-phone">Phone Number</Label>
                  <Input
                    id="reg-phone"
                    placeholder="10-digit phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="auth-email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="auth-email"
                  required
                  type="email"
                  className="pl-9"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="auth-password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="auth-password"
                  required
                  type="password"
                  className="pl-9"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" disabled={authSubmitting} className="w-full rounded-full mt-2">
              {authSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Please wait...
                </>
              ) : authMode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {authMode === 'login' && (
            <div className="mt-6 text-center text-xs text-muted-foreground space-y-1">
              <p>Demo Customer: <span className="font-semibold text-foreground">customer@kangeyanheritage.com</span> / <span className="font-semibold text-foreground">customerpassword</span></p>
              <p>Demo Admin: <span className="font-semibold text-foreground">admin@kangeyanheritage.com</span> / <span className="font-semibold text-foreground">adminpassword</span></p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Authenticated Customer Dashboard View
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {/* Welcome header */}
      <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            My Account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, <span className="font-semibold text-foreground">{user.name}</span> ({user.email})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.role === 'admin' && (
            <Button variant="outline" className="rounded-full gap-2 border-primary/40 text-primary hover:bg-primary/5" render={<Link href="/admin" />}>
              <Settings className="size-4" />
              Admin Panel
            </Button>
          )}
          <Button variant="ghost" onClick={handleLogout} className="rounded-full gap-2 text-destructive hover:bg-destructive/5 hover:text-destructive">
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Navigation Sidebar */}
        <aside className="flex flex-row flex-wrap gap-1 border-b border-border/60 pb-4 lg:flex-col lg:border-b-0 lg:pb-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === 'profile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <UserIcon className="size-4.5" />
            Profile &amp; Addresses
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === 'orders' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <ShoppingBag className="size-4.5" />
            My Orders
            {orders.length > 0 && (
              <span className={cn('ml-auto rounded-full px-2 py-0.5 text-xs font-bold', activeTab === 'orders' ? 'bg-primary-foreground text-primary' : 'bg-muted text-muted-foreground')}>
                {orders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === 'wishlist' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <Heart className="size-4.5" />
            My Wishlist
            {wishlist.length > 0 && (
              <span className={cn('ml-auto rounded-full px-2 py-0.5 text-xs font-bold', activeTab === 'wishlist' ? 'bg-primary-foreground text-primary' : 'bg-muted text-muted-foreground')}>
                {wishlist.length}
              </span>
            )}
          </button>
        </aside>

        {/* Tab content */}
        <main className="space-y-6">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile details form */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-lg font-bold text-foreground">Personal Details</h2>
                <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input
                      id="profile-name"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-email">Email Address</Label>
                    <Input id="profile-email" disabled value={user.email} className="bg-muted text-muted-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-phone">Phone Number</Label>
                    <Input
                      id="profile-phone"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={profileSubmitting} className="rounded-full">
                    {profileSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </div>

              {/* Addresses manager */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-lg font-bold text-foreground">Saved Addresses</h2>
                    <Button size="sm" variant="outline" className="rounded-full gap-1" onClick={() => setShowAddressForm(!showAddressForm)}>
                      <Plus className="size-3.5" />
                      Add New
                    </Button>
                  </div>

                  {/* Add address form */}
                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="mt-4 rounded-xl border border-border/80 bg-accent/20 p-4 space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">New Shipping Address</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1 sm:col-span-2">
                          <Label className="text-xs">Full Name *</Label>
                          <Input
                            size={30}
                            required
                            className="h-8 text-xs"
                            value={newAddress.fullName}
                            onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Phone *</Label>
                          <Input
                            required
                            className="h-8 text-xs"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Pincode (6 digits) *</Label>
                          <Input
                            required
                            className="h-8 text-xs"
                            value={newAddress.pincode}
                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <Label className="text-xs">Address Line 1 *</Label>
                          <Input
                            required
                            className="h-8 text-xs"
                            placeholder="House No, Street"
                            value={newAddress.line1}
                            onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <Label className="text-xs">Address Line 2</Label>
                          <Input
                            className="h-8 text-xs"
                            placeholder="Area, Landmark"
                            value={newAddress.line2}
                            onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">City *</Label>
                          <Input
                            required
                            className="h-8 text-xs"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">State *</Label>
                          <select
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 text-xs shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {INDIAN_STATES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <Button type="button" size="sm" variant="ghost" className="rounded-full" onClick={() => setShowAddressForm(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={addressSubmitting} className="rounded-full">
                          {addressSubmitting ? 'Saving...' : 'Save Address'}
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* List addresses */}
                  <div className="mt-4 space-y-3">
                    {!user.addresses?.length ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No shipping addresses saved yet.</p>
                    ) : (
                      user.addresses.map((addr, idx) => (
                        <div key={idx} className="flex items-start justify-between rounded-xl border border-border p-4 text-sm bg-card hover:bg-accent/5">
                          <div>
                            <p className="font-semibold text-foreground">{addr.fullName}</p>
                            <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                              {addr.line1}
                              {addr.line2 ? `, ${addr.line2}` : ''}
                              <br />
                              {addr.city}, {addr.state} - {addr.pincode}
                              <br />
                              Phone: {addr.phone}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveAddress(idx)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            aria-label="Delete address"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-14 text-center">
                  <ShoppingBag className="size-10 text-muted-foreground" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground">No orders yet</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Explore our shop and place your first order.</p>
                  </div>
                  <Button className="rounded-full" render={<Link href="/shop" />}>
                    Shop Now
                  </Button>
                </div>
              ) : (
                orders.map((ord) => {
                  const expanded = expandedOrders[ord.orderNumber] || false
                  const dateVal = new Date(ord.createdAt).toLocaleDateString('en-IN', {
                    dateStyle: 'medium',
                  })
                  return (
                    <div key={ord.orderNumber} className="rounded-2xl border border-border bg-card overflow-hidden">
                      <div
                        onClick={() => toggleOrderExpand(ord.orderNumber)}
                        className="flex flex-wrap items-center justify-between gap-4 p-5 cursor-pointer hover:bg-accent/10 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground text-sm">Order {ord.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">Placed on {dateVal}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right space-y-0.5">
                            <p className="font-serif font-bold text-foreground">{formatINR(ord.total)}</p>
                            <p className="text-[10px] text-muted-foreground">{ord.items.reduce((s, i) => s + i.quantity, 0)} items</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
                                ord.status === 'delivered' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400',
                                ord.status === 'cancelled' && 'bg-destructive/10 text-destructive',
                                ord.status !== 'delivered' && ord.status !== 'cancelled' && 'bg-primary/10 text-primary',
                              )}
                            >
                              {ord.status}
                            </span>
                            {expanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                          </div>
                        </div>
                      </div>

                      {expanded && (
                        <div className="border-t border-border bg-accent/5 p-5 space-y-4">
                          {/* Items list */}
                          <ul className="divide-y divide-border/60">
                            {ord.items.map((item) => (
                              <li key={item.sku} className="flex gap-4 py-3 first:pt-0 last:pb-0 text-sm">
                                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-secondary">
                                  <Image
                                    src={item.image || '/placeholder.svg'}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Link href={`/product/${item.slug}`} className="font-medium text-foreground hover:text-primary">
                                    {item.name}
                                  </Link>
                                  <p className="text-xs text-muted-foreground mt-0.5">{item.size} × {item.quantity}</p>
                                </div>
                                <span className="font-medium tabular-nums text-foreground">{formatINR(item.price * item.quantity)}</span>
                              </li>
                            ))}
                          </ul>

                          <Separator />

                          {/* Invoice stats & details */}
                          <div className="grid gap-6 sm:grid-cols-2 text-xs">
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Delivery Address</h4>
                              <p className="text-muted-foreground leading-relaxed">
                                <span className="font-medium text-foreground">{ord.address.fullName}</span>
                                <br />
                                {ord.address.line1}
                                {ord.address.line2 ? `, ${ord.address.line2}` : ''}
                                <br />
                                {ord.address.city}, {ord.address.state} - {ord.address.pincode}
                                <br />
                                Phone: {ord.address.phone}
                              </p>
                            </div>
                            <div className="space-y-1.5 text-right sm:ml-auto w-full max-w-[240px]">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium tabular-nums">{formatINR(ord.subtotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-medium tabular-nums">{ord.shipping === 0 ? 'Free' : formatINR(ord.shipping)}</span>
                              </div>
                              <div className="flex justify-between font-serif font-bold text-sm text-foreground pt-1 border-t border-border">
                                <span>Total Paid</span>
                                <span className="tabular-nums">{formatINR(ord.total)}</span>
                              </div>
                              <div className="pt-2 text-[10px] text-muted-foreground">
                                Payment Method: <span className="font-semibold text-foreground uppercase">{ord.paymentMethod}</span> ({ord.paymentStatus})
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-14 text-center">
                  <Heart className="size-10 text-muted-foreground" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground">Your wishlist is empty</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Save products you love to your wishlist.</p>
                  </div>
                  <Button className="rounded-full" render={<Link href="/shop" />}>
                    Explore Products
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {wishlistedItems.map((p) => {
                    const firstVariant = p.variants[0]
                    return (
                      <div key={p.slug} className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden">
                        <Link href={`/product/${p.slug}`} className="relative aspect-square overflow-hidden bg-secondary/40">
                          <Image
                            src={p.image || '/placeholder.svg'}
                            alt={p.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                        <button
                          onClick={() => toggleWishlist(p.slug)}
                          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/80 text-destructive border border-border/40 backdrop-blur-xs shadow-xs hover:bg-background transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <div className="flex flex-1 flex-col p-4">
                          <Link href={`/product/${p.slug}`} className="font-serif text-sm font-semibold text-foreground line-clamp-1 hover:text-primary">
                            {p.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">{firstVariant.size}</p>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="font-serif font-bold text-foreground">{formatINR(firstVariant.price)}</span>
                            <Button
                              size="sm"
                              className="rounded-full text-xs h-7 px-3"
                              onClick={() => {
                                addItem({
                                  slug: p.slug,
                                  name: p.name,
                                  image: p.image,
                                  size: firstVariant.size,
                                  sku: firstVariant.sku,
                                  price: firstVariant.price,
                                  quantity: 1,
                                })
                                toast.success('Added to cart', { description: p.name })
                              }}
                            >
                              <Plus className="size-3 mr-1" />
                              Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

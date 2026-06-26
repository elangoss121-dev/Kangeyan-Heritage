'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { User, Order, Product } from '@/lib/types'
import { cn } from '@/lib/utils'

// Modular sub-components
import { AdminLogin } from '@/components/admin/admin-login'
import { DashboardOverview } from '@/components/admin/dashboard-overview'
import { ProductsTab } from '@/components/admin/products-tab'
import { OrdersTab } from '@/components/admin/orders-tab'
import { CustomersTab } from '@/components/admin/customers-tab'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authSubmitting, setAuthSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers'>('dashboard')

  // Loaded database items
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<User[]>([])

  // Load admin session
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          if (data.user?.role === 'admin') {
            setUser(data.user)
            fetchData()
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [])

  async function fetchData() {
    try {
      const [prodRes, ordRes, custRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/customers'),
      ])

      if (prodRes.ok) {
        const prodData = await prodRes.json()
        setProducts(prodData.products || [])
      }
      if (ordRes.ok) {
        const ordData = await ordRes.json()
        setOrders(ordData.orders || [])
      }
      if (custRes.ok) {
        const custData = await custRes.json()
        setCustomers(custData.customers || [])
      }
    } catch (err) {
      console.error('Error fetching admin data', err)
    }
  }

  // Admin login action
  async function handleLogin(email: string, password: string) {
    setAuthSubmitting(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      if (data.user.role !== 'admin') {
        await fetch('/api/auth/logout', { method: 'POST' })
        throw new Error('Access denied. Admin role required.')
      }
      setUser(data.user)
      toast.success('Logged in successfully as Admin!')
      fetchData()
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
        toast.info('Logged out from admin panel.')
        router.push('/')
      }
    } catch {
      toast.error('Logout failed.')
    }
  }

  // Actions: Update order status
  async function handleOrderStateChange(orderNum: string, field: 'status' | 'paymentStatus', value: string) {
    try {
      const res = await fetch(`/api/admin/orders/${orderNum}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrders(orders.map((o) => (o.orderNumber === orderNum ? data.order : o)))
      toast.success(`Order ${field} updated to "${value}"`)
    } catch (err) {
      toast.error('Failed to update order state.')
    }
  }

  // Metrics calculators
  const totalSales = orders.filter((o) => o.status !== 'cancelled' && o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length
  const outOfStockProducts = products.filter((p) => !p.inStock).length

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-paper">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Checking administrator credentials...</p>
      </div>
    )
  }

  // Admin login screen
  if (!user) {
    return <AdminLogin onSubmit={handleLogin} submitting={authSubmitting} />
  }

  // Admin Dashboard Main Frame
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      {/* Top navbar */}
      <header className="border-b border-border/80 bg-card px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-xl font-bold tracking-wide text-foreground">
              Kangeyan Heritage <span className="font-sans text-xs font-semibold uppercase bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">Admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mr-2">
              View Storefront
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full text-destructive hover:bg-destructive/5 hover:text-destructive">
              <LogOut className="size-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 lg:grid lg:grid-cols-[220px_1fr]">
        {/* Sidebar Nav */}
        <aside className="flex flex-row flex-wrap gap-1 border-b border-border/60 pb-4 lg:flex-col lg:border-b-0 lg:pb-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors text-left',
              activeTab === 'dashboard' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground',
            )}
          >
            <LayoutDashboard className="size-4.5" />
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors text-left',
              activeTab === 'products' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground',
            )}
          >
            <Package className="size-4.5" />
            Products CRUD
            {products.length > 0 && (
              <span className={cn('ml-auto rounded-full px-2 py-0.5 text-xs font-bold', activeTab === 'products' ? 'bg-primary-foreground text-primary' : 'bg-card text-muted-foreground')}>
                {products.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors text-left',
              activeTab === 'orders' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground',
            )}
          >
            <ShoppingBag className="size-4.5" />
            Orders Panel
            {pendingOrders > 0 && (
              <span className="ml-auto rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {pendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors text-left',
              activeTab === 'customers' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground',
            )}
          >
            <Users className="size-4.5" />
            Customers List
          </button>
        </aside>

        {/* Dashboard Main Area */}
        <main className="space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              totalSales={totalSales}
              ordersCount={orders.length}
              pendingOrders={pendingOrders}
              productsCount={products.length}
              outOfStockProducts={outOfStockProducts}
              customersCount={customers.length}
              recentOrders={orders}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              onOrderStateChange={handleOrderStateChange}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersTab
              customers={customers}
              orders={orders}
            />
          )}
        </main>
      </div>
    </div>
  )
}

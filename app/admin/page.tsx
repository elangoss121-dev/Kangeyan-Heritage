'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  ArrowLeft,
  Loader2,
  Lock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  IndianRupee,
  Search,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { formatINR } from '@/lib/format'
import type { User, Order, Product, Category, ProductVariant } from '@/lib/types'
import { cn } from '@/lib/utils'

const CATEGORIES: Category[] = ['cold-pressed-oils', 'jaggery', 'spices', 'grains']

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed']

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Auth form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authSubmitting, setAuthSubmitting] = useState(false)

  // Admin section navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers'>('dashboard')

  // Loaded database items
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<User[]>([])

  // Modal forms & CRUD states
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: '',
    tamilName: '',
    slug: '',
    category: 'cold-pressed-oils' as Category,
    shortDescription: '',
    description: '',
    highlights: '',
    image: '',
    gallery: '',
    featured: false,
    inStock: true,
    variants: [{ size: '', price: 0, mrp: 0, sku: '' }] as { size: string; price: number; mrp?: number; sku: string }[],
    benefits: [{ title: '', description: '' }] as { title: string; description: string }[],
  })
  const [productSubmitting, setProductSubmitting] = useState(false)

  // Search filter states
  const [productSearch, setProductSearch] = useState('')
  const [orderSearch, setOrderSearch] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')

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
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
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
        // Logout if not admin
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

  // Actions: Create / Edit product
  function openAddProduct() {
    setEditingProduct(null)
    setProductForm({
      name: '',
      tamilName: '',
      slug: '',
      category: 'cold-pressed-oils',
      shortDescription: '',
      description: '',
      highlights: '',
      image: '',
      gallery: '',
      featured: false,
      inStock: true,
      variants: [{ size: '', price: 0, mrp: 0, sku: '' }],
      benefits: [{ title: '', description: '' }],
    })
    setShowProductForm(true)
  }

  function openEditProduct(p: Product) {
    setEditingProduct(p)
    setProductForm({
      name: p.name,
      tamilName: p.tamilName || '',
      slug: p.slug,
      category: p.category,
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      highlights: p.highlights?.join('\n') || '',
      image: p.image || '',
      gallery: p.gallery?.join('\n') || '',
      featured: p.featured,
      inStock: p.inStock,
      variants: p.variants.map((v) => ({ ...v, mrp: v.mrp || 0 })),
      benefits: p.benefits?.length ? p.benefits : [{ title: '', description: '' }],
    })
    setShowProductForm(true)
  }

  async function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProductSubmitting(true)

    // Form validation
    const parsedVariants = productForm.variants.filter((v) => v.size.trim() && v.price > 0)
    if (parsedVariants.length === 0) {
      toast.error('At least one valid variant with size and price is required.')
      setProductSubmitting(false)
      return
    }

    const payload = {
      ...productForm,
      highlights: productForm.highlights.split('\n').map((h) => h.trim()).filter(Boolean),
      gallery: productForm.gallery.split('\n').map((g) => g.trim()).filter(Boolean),
      variants: parsedVariants,
      benefits: productForm.benefits.filter((b) => b.title.trim()),
    }

    const url = editingProduct ? `/api/admin/products/${editingProduct.slug}` : '/api/admin/products'
    const method = editingProduct ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save product')

      toast.success(editingProduct ? 'Product updated!' : 'Product added successfully!')
      setShowProductForm(false)
      fetchData()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setProductSubmitting(false)
    }
  }

  async function handleDeleteProduct(slug: string) {
    if (!confirm('Are you sure you want to delete this product? This action is permanent.')) return
    try {
      const res = await fetch(`/api/admin/products/${slug}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      toast.info('Product deleted successfully.')
      fetchData()
    } catch (err) {
      toast.error('Failed to delete product.')
    }
  }

  // Helpers: Variants form array modifiers
  function addVariantField() {
    setProductForm({
      ...productForm,
      variants: [...productForm.variants, { size: '', price: 0, mrp: 0, sku: '' }],
    })
  }
  function removeVariantField(idx: number) {
    setProductForm({
      ...productForm,
      variants: productForm.variants.filter((_, i) => i !== idx),
    })
  }
  function updateVariantField(idx: number, field: keyof ProductVariant, val: any) {
    const updated = productForm.variants.map((v, i) =>
      i === idx ? { ...v, [field]: val } : v,
    )
    setProductForm({ ...productForm, variants: updated })
  }

  // Helpers: Benefits form array modifiers
  function addBenefitField() {
    setProductForm({
      ...productForm,
      benefits: [...productForm.benefits, { title: '', description: '' }],
    })
  }
  function removeBenefitField(idx: number) {
    setProductForm({
      ...productForm,
      benefits: productForm.benefits.filter((_, i) => i !== idx),
    })
  }
  function updateBenefitField(idx: number, field: 'title' | 'description', val: string) {
    const updated = productForm.benefits.map((b, i) =>
      i === idx ? { ...b, [field]: val } : b,
    )
    setProductForm({ ...productForm, benefits: updated })
  }

  // Metrics calculators
  const totalSales = orders.filter((o) => o.status !== 'cancelled' && o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length
  const outOfStockProducts = products.filter((p) => !p.inStock).length

  // Filters
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.slug.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.variants.some((v) => v.sku.toLowerCase().includes(productSearch.toLowerCase())),
  )

  const filteredOrders = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.address.fullName.toLowerCase().includes(orderSearch.toLowerCase()),
  )

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.phone && c.phone.includes(customerSearch)),
  )

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Checking administrator credentials...</p>
      </div>
    )
  }

  // Admin login screen
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-md md:p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="size-6" />
            </div>
            <h1 className="mt-4 font-serif text-2xl font-bold text-foreground">
              Heritage Admin Access
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Only authorized administrators can log in here.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                required
                type="email"
                placeholder="admin@kangeyanheritage.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={authSubmitting} className="w-full rounded-full mt-2">
              {authSubmitting ? 'Authenticating...' : 'Sign In to Panel'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="size-3" />
              Back to storefront
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Admin Dashboard Main Frame
  return (
    <div className="flex min-h-screen flex-col bg-paper">
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
              'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === 'dashboard' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground',
            )}
          >
            <LayoutDashboard className="size-4.5" />
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
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
              'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
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
              'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === 'customers' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground',
            )}
          >
            <Users className="size-4.5" />
            Customers List
          </button>
        </aside>

        {/* Dashboard Main Area */}
        <main className="space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metrics cards grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Total Revenue" value={formatINR(totalSales)} icon={<IndianRupee className="size-5 text-emerald-600" />} />
                <MetricCard title="Total Orders" value={orders.length} subtext={`${pendingOrders} processing`} icon={<ShoppingBag className="size-5 text-primary" />} />
                <MetricCard title="Products" value={products.length} subtext={`${outOfStockProducts} out of stock`} icon={<Package className="size-5 text-indigo-600" />} />
                <MetricCard title="Customers" value={customers.length} icon={<Users className="size-5 text-amber-600" />} />
              </div>

              {/* Recent orders */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-lg font-bold text-foreground mb-4">Recent Sales</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/80 text-muted-foreground text-xs uppercase">
                        <th className="pb-3">Order #</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.orderNumber} className="hover:bg-accent/5">
                          <td className="py-3.5 font-medium">{ord.orderNumber}</td>
                          <td className="py-3.5 text-muted-foreground">{ord.email}</td>
                          <td className="py-3.5 capitalize">
                            <span className="inline-block rounded-full bg-accent px-2 py-0.5 text-xs text-foreground font-semibold">
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3.5 capitalize">
                            <span className={cn('inline-block rounded-full px-2 py-0.5 text-xs font-semibold', ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}>
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3.5 text-right font-semibold">{formatINR(ord.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search product, SKU..."
                    className="pl-9"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                <Button onClick={openAddProduct} className="rounded-full gap-1.5 self-start">
                  <Plus className="size-4" />
                  Add Product
                </Button>
              </div>

              {/* Product Form Drawer/Modal Overlay */}
              {showProductForm && (
                <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
                  <h2 className="font-serif text-lg font-bold text-foreground">
                    {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
                  </h2>
                  <form onSubmit={handleProductSubmit} className="space-y-4 text-sm">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label>Product Name *</Label>
                        <Input
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="e.g. Cold Pressed Groundnut Oil"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Tamil Name</Label>
                        <Input
                          value={productForm.tamilName}
                          onChange={(e) => setProductForm({ ...productForm, tamilName: e.target.value })}
                          placeholder="e.g. செக்கு கடலை எண்ணெய்"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Slug (Url Path) *</Label>
                        <Input
                          required
                          value={productForm.slug}
                          disabled={!!editingProduct}
                          onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                          placeholder="e.g. cold-pressed-groundnut-oil"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Category *</Label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value as Category })}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Short Description *</Label>
                      <Input
                        required
                        value={productForm.shortDescription}
                        onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                        placeholder="1-sentence snippet"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Detailed Description</Label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Detailed specifications, history..."
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label>Image URL (Primary)</Label>
                        <Input
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          placeholder="/products/filename.png"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Gallery Images (One URL per line)</Label>
                        <textarea
                          value={productForm.gallery}
                          onChange={(e) => setProductForm({ ...productForm, gallery: e.target.value })}
                          className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs outline-none focus-visible:ring-2"
                          placeholder="/products/filename1.png&#10;/products/filename2.png"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Highlights / Bullet Points (One per line)</Label>
                      <textarea
                        value={productForm.highlights}
                        onChange={(e) => setProductForm({ ...productForm, highlights: e.target.value })}
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs outline-none focus-visible:ring-2"
                        placeholder="Wood pressed (Marachekku)&#10;100% chemical free"
                      />
                    </div>

                    {/* Stock & Feature toggles */}
                    <div className="flex gap-6 items-center py-2">
                      <label className="flex items-center gap-2 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                          className="size-4 rounded-sm border-border text-primary focus:ring-primary"
                        />
                        Featured Product
                      </label>
                      <label className="flex items-center gap-2 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.inStock}
                          onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                          className="size-4 rounded-sm border-border text-primary focus:ring-primary"
                        />
                        In Stock &amp; Available
                      </label>
                    </div>

                    <Separator />

                    {/* Variants list (Size, Price, SKU) */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-foreground">Pricing &amp; Sizes</h3>
                        <Button type="button" size="sm" variant="outline" onClick={addVariantField} className="rounded-full gap-1 h-7">
                          <Plus className="size-3" /> Add Size
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {productForm.variants.map((v, i) => (
                          <div key={i} className="flex flex-wrap items-center gap-3 border-b border-border/40 pb-2 sm:border-b-0 sm:pb-0">
                            <div className="flex-1 min-w-[100px]">
                              <Input
                                placeholder="Size (e.g. 1 L)"
                                required
                                value={v.size}
                                onChange={(e) => updateVariantField(i, 'size', e.target.value)}
                              />
                            </div>
                            <div className="w-[100px]">
                              <Input
                                type="number"
                                placeholder="Price"
                                required
                                value={v.price || ''}
                                onChange={(e) => updateVariantField(i, 'price', Number(e.target.value))}
                              />
                            </div>
                            <div className="w-[100px]">
                              <Input
                                type="number"
                                placeholder="MRP"
                                value={v.mrp || ''}
                                onChange={(e) => updateVariantField(i, 'mrp', Number(e.target.value) || undefined)}
                              />
                            </div>
                            <div className="flex-1 min-w-[120px]">
                              <Input
                                placeholder="SKU"
                                required
                                value={v.sku}
                                onChange={(e) => updateVariantField(i, 'sku', e.target.value)}
                              />
                            </div>
                            {productForm.variants.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeVariantField(i)}
                                className="text-muted-foreground hover:text-destructive transition-colors p-2"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Benefits (Title, description) */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-foreground">Why You'll Love It (Benefits)</h3>
                        <Button type="button" size="sm" variant="outline" onClick={addBenefitField} className="rounded-full gap-1 h-7">
                          <Plus className="size-3" /> Add Benefit
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {productForm.benefits.map((b, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-secondary/20 rounded-xl">
                            <div className="flex-1 space-y-2">
                              <Input
                                placeholder="Title (e.g. Heart Friendly)"
                                value={b.title}
                                onChange={(e) => updateBenefitField(i, 'title', e.target.value)}
                              />
                              <Input
                                placeholder="Description (e.g. Naturally rich in good fats.)"
                                value={b.description}
                                onChange={(e) => updateBenefitField(i, 'description', e.target.value)}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeBenefitField(i)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-2 pt-3"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="ghost" onClick={() => setShowProductForm(false)} className="rounded-full">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={productSubmitting} className="rounded-full">
                        {productSubmitting ? 'Saving...' : 'Save Product Details'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Product Listing */}
              <div className="rounded-2xl border border-border bg-card p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/80 text-muted-foreground text-xs uppercase">
                        <th className="pb-3">Product</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">SKU / Sizes</th>
                        <th className="pb-3">In Stock</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredProducts.map((p) => (
                        <tr key={p.slug} className="hover:bg-accent/5">
                          <td className="py-4 flex items-center gap-3">
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-secondary">
                              <Image
                                src={p.image || '/placeholder.svg'}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground leading-snug">{p.name}</p>
                              {p.tamilName && <p className="text-xs text-muted-foreground mt-0.5">{p.tamilName}</p>}
                            </div>
                          </td>
                          <td className="py-4 text-xs font-semibold capitalize text-muted-foreground">{p.category.replace(/-/g, ' ')}</td>
                          <td className="py-4">
                            <div className="flex flex-col gap-0.5 text-xs text-foreground">
                              {p.variants.map((v) => (
                                <span key={v.sku}>
                                  {v.size} — <span className="font-semibold">{formatINR(v.price)}</span> ({v.sku})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4">
                            {p.inStock ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                <CheckCircle className="size-3.5" /> Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                                <XCircle className="size-3.5" /> Out
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full size-8"
                                onClick={() => openEditProduct(p)}
                                aria-label="Edit product"
                              >
                                <Edit2 className="size-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full size-8 text-destructive hover:bg-destructive/5 hover:text-destructive"
                                onClick={() => handleDeleteProduct(p.slug)}
                                aria-label="Delete product"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search order number, email..."
                  className="pl-9"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/80 text-muted-foreground text-xs uppercase">
                        <th className="pb-3">Order #</th>
                        <th className="pb-3">Customer Info</th>
                        <th className="pb-3">Delivery Address</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.orderNumber} className="hover:bg-accent/5 align-top">
                          <td className="py-4 font-semibold">{ord.orderNumber}</td>
                          <td className="py-4 max-w-[200px]">
                            <p className="font-medium text-foreground">{ord.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {ord.items.map((i) => `${i.name} (${i.size} × ${i.quantity})`).join(', ')}
                            </p>
                          </td>
                          <td className="py-4 text-xs text-muted-foreground leading-relaxed max-w-[220px]">
                            <span className="font-semibold text-foreground">{ord.address.fullName}</span> ({ord.address.phone})
                            <br />
                            {ord.address.line1}, {ord.address.city}, {ord.address.state} - {ord.address.pincode}
                          </td>
                          <td className="py-4">
                            <select
                              value={ord.status}
                              onChange={(e) => handleOrderStateChange(ord.orderNumber, 'status', e.target.value)}
                              className="h-8 rounded-md border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring capitalize"
                            >
                              {STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col gap-1">
                              <select
                                value={ord.paymentStatus}
                                onChange={(e) => handleOrderStateChange(ord.orderNumber, 'paymentStatus', e.target.value)}
                                className={cn(
                                  'h-8 rounded-md border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring capitalize',
                                  ord.paymentStatus === 'paid' && 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400',
                                  ord.paymentStatus === 'failed' && 'text-destructive bg-destructive/5',
                                )}
                              >
                                {PAYMENT_STATUSES.map((pst) => (
                                  <option key={pst} value={pst}>
                                    {pst}
                                  </option>
                                ))}
                              </select>
                              <span className="text-[10px] text-muted-foreground uppercase text-center">{ord.paymentMethod}</span>
                            </div>
                          </td>
                          <td className="py-4 text-right font-semibold">{formatINR(ord.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS LIST */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customer name, email..."
                  className="pl-9"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/80 text-muted-foreground text-xs uppercase">
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Contact</th>
                        <th className="pb-3">Addresses</th>
                        <th className="pb-3">Register Date</th>
                        <th className="pb-3 text-center">Orders Placed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredCustomers.map((cust) => {
                        const count = orders.filter((o) => o.email === cust.email).length
                        const dateString = cust.createdAt
                          ? new Date(cust.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                          : 'Pre-seeded'
                        return (
                          <tr key={cust.email} className="hover:bg-accent/5 align-top">
                            <td className="py-4">
                              <p className="font-semibold text-foreground">{cust.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{cust.role}</p>
                            </td>
                            <td className="py-4">
                              <p className="font-medium text-foreground">{cust.email}</p>
                              {cust.phone && <p className="text-xs text-muted-foreground mt-1">{cust.phone}</p>}
                            </td>
                            <td className="py-4 max-w-[280px]">
                              {!cust.addresses?.length ? (
                                <span className="text-xs text-muted-foreground italic">No addresses saved</span>
                              ) : (
                                <div className="space-y-2">
                                  {cust.addresses.map((a, i) => (
                                    <p key={i} className="text-xs text-muted-foreground border-l border-primary/20 pl-2 leading-relaxed">
                                      <span className="font-medium text-foreground">{a.fullName}</span>: {a.line1}, {a.city} - {a.pincode}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="py-4 text-xs text-muted-foreground">{dateString}</td>
                            <td className="py-4 text-center font-bold text-foreground">{count}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Stats Widget Card helper
function MetricCard({ title, value, subtext, icon }: { title: string; value: React.ReactNode; subtext?: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        <p className="font-serif text-2xl font-bold text-foreground leading-none pt-0.5">{value}</p>
        {subtext && <p className="text-[10px] text-muted-foreground pt-0.5">{subtext}</p>}
      </div>
      <div className="size-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
        {icon}
      </div>
    </div>
  )
}

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import { Plus, Search, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { formatINR } from '@/lib/format'
import type { Product, Category, ProductVariant } from '@/lib/types'

interface ProductsTabProps {
  products: Product[]
  onRefresh: () => void
}

const CATEGORIES: Category[] = ['cold-pressed-oils', 'jaggery', 'spices', 'grains']

export function ProductsTab({ products, onRefresh }: ProductsTabProps) {
  const [productSearch, setProductSearch] = useState('')
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productSubmitting, setProductSubmitting] = useState(false)

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

  // Open add modal
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

  // Open edit modal
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

  // Submit product create/update
  async function handleProductSubmit(e: FormEvent) {
    e.preventDefault()
    setProductSubmitting(true)

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
      onRefresh()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setProductSubmitting(false)
    }
  }

  // Delete product
  async function handleDeleteProduct(slug: string) {
    if (!confirm('Are you sure you want to delete this product? This action is permanent.')) return
    try {
      const res = await fetch(`/api/admin/products/${slug}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      toast.info('Product deleted successfully.')
      onRefresh()
    } catch (err) {
      toast.error('Failed to delete product.')
    }
  }

  // Variants array modifiers
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

  // Benefits array modifiers
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.slug.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.variants.some((v) => v.sku.toLowerCase().includes(productSearch.toLowerCase()))
  )

  return (
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
  )
}

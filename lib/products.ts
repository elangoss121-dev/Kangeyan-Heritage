import 'server-only'
import { getDb, isDbConfigured } from './mongodb'
import { SEED_PRODUCTS } from './seed-data'
import type { Category, Product } from './types'

const COLLECTION = 'products'

// Mutable in-memory fallback for local development CRUD
let memoryProducts: Product[] = [...SEED_PRODUCTS]

function serialize<T extends { _id?: unknown }>(doc: T): T {
  return { ...doc, _id: doc._id ? String(doc._id) : undefined }
}

/**
 * Ensures the products collection is seeded once. Safe to call repeatedly.
 */
export async function ensureSeeded(): Promise<void> {
  if (!isDbConfigured()) return
  try {
    const db = await getDb()
    const col = db.collection(COLLECTION)
    const count = await col.countDocuments()
    if (count === 0) {
      await col.insertMany(
        memoryProducts.map((p) => ({ ...p, createdAt: new Date().toISOString() })),
      )
    }
  } catch (err) {
    console.log('[v0] ensureSeeded failed, using fallback data:', (err as Error).message)
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isDbConfigured()) return memoryProducts
  try {
    await ensureSeeded()
    const db = await getDb()
    const docs = await db.collection(COLLECTION).find({}).toArray()
    if (docs.length === 0) return memoryProducts
    return docs.map((d) => serialize(d as unknown as Product))
  } catch (err) {
    console.log('[v0] getAllProducts fallback:', (err as Error).message)
    return memoryProducts
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isDbConfigured()) {
    return memoryProducts.find((p) => p.slug === slug) ?? null
  }
  try {
    const db = await getDb()
    const doc = await db.collection(COLLECTION).findOne({ slug })
    if (!doc) return memoryProducts.find((p) => p.slug === slug) ?? null
    return serialize(doc as unknown as Product)
  } catch (err) {
    console.log('[v0] getProductBySlug fallback:', (err as Error).message)
    return memoryProducts.find((p) => p.slug === slug) ?? null
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getAllProducts()
  return all.filter((p) => p.featured)
}

export async function getProductsByCategory(
  category: Category,
): Promise<Product[]> {
  const all = await getAllProducts()
  return all.filter((p) => p.category === category)
}

/* ADMIN CRUD OPERATIONS */

export async function createProduct(product: Omit<Product, '_id'>): Promise<Product> {
  const newProduct: Product = {
    ...product,
    createdAt: new Date().toISOString(),
  }

  if (isDbConfigured()) {
    try {
      const db = await getDb()
      const result = await db.collection(COLLECTION).insertOne(newProduct)
      return { ...newProduct, _id: String(result.insertedId) }
    } catch (err) {
      console.log('[v0] createProduct db error, falling back to memory:', (err as Error).message)
    }
  }

  memoryProducts = [newProduct, ...memoryProducts]
  return newProduct
}

export async function updateProduct(
  slug: string,
  updates: Partial<Omit<Product, '_id' | 'slug' | 'createdAt'>>,
): Promise<Product | null> {
  if (isDbConfigured()) {
    try {
      const db = await getDb()
      const result = await db
        .collection(COLLECTION)
        .findOneAndUpdate(
          { slug },
          { $set: updates },
          { returnDocument: 'after' },
        )
      if (result) return serialize(result as unknown as Product)
    } catch (err) {
      console.log('[v0] updateProduct db error:', (err as Error).message)
    }
  }

  // Memory fallback update
  const index = memoryProducts.findIndex((p) => p.slug === slug)
  if (index !== -1) {
    const updated = { ...memoryProducts[index], ...updates }
    memoryProducts[index] = updated
    return updated
  }
  return null
}

export async function deleteProduct(slug: string): Promise<boolean> {
  if (isDbConfigured()) {
    try {
      const db = await getDb()
      const result = await db.collection(COLLECTION).deleteOne({ slug })
      return result.deletedCount > 0
    } catch (err) {
      console.log('[v0] deleteProduct db error:', (err as Error).message)
    }
  }

  // Memory fallback delete
  const initialLen = memoryProducts.length
  memoryProducts = memoryProducts.filter((p) => p.slug !== slug)
  return memoryProducts.length < initialLen
}

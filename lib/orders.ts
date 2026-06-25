import 'server-only'
import { getDb, isDbConfigured } from './mongodb'
import type { Order } from './types'

const COLLECTION = 'orders'

// In-memory fallback so checkout works even without a live database.
const memoryOrders = new Map<string, Order>()

export function generateOrderNumber(): string {
  const now = new Date()
  const y = now.getFullYear().toString().slice(-2)
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `KH${y}${(now.getMonth() + 1).toString().padStart(2, '0')}${rand}`
}

export async function createOrder(
  order: Omit<Order, '_id'>,
): Promise<Order> {
  if (isDbConfigured()) {
    try {
      const db = await getDb()
      const result = await db.collection(COLLECTION).insertOne(order)
      return { ...order, _id: String(result.insertedId) }
    } catch (err) {
      console.log('[v0] createOrder fallback to memory:', (err as Error).message)
    }
  }
  memoryOrders.set(order.orderNumber, order)
  return { ...order, _id: order.orderNumber }
}

export async function getOrderByNumber(
  orderNumber: string,
): Promise<Order | null> {
  if (isDbConfigured()) {
    try {
      const db = await getDb()
      const doc = await db.collection(COLLECTION).findOne({ orderNumber })
      if (doc) return { ...(doc as unknown as Order), _id: String(doc._id) }
    } catch (err) {
      console.log('[v0] getOrderByNumber fallback:', (err as Error).message)
    }
  }
  return memoryOrders.get(orderNumber) ?? null
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  if (isDbConfigured()) {
    try {
      const db = await getDb()
      const docs = await db
        .collection(COLLECTION)
        .find({ email })
        .sort({ createdAt: -1 })
        .toArray()
      return docs.map((d) => ({ ...(d as unknown as Order), _id: String(d._id) }))
    } catch (err) {
      console.log('[v0] getOrdersByEmail fallback:', (err as Error).message)
    }
  }
  return Array.from(memoryOrders.values())
    .filter((o) => o.email === email)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getAllOrders(): Promise<Order[]> {
  if (isDbConfigured()) {
    try {
      const db = await getDb()
      const docs = await db
        .collection(COLLECTION)
        .find({})
        .sort({ createdAt: -1 })
        .toArray()
      return docs.map((d) => ({ ...(d as unknown as Order), _id: String(d._id) }))
    } catch (err) {
      console.log('[v0] getAllOrders fallback:', (err as Error).message)
    }
  }
  return Array.from(memoryOrders.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )
}

export async function updateOrder(
  orderNumber: string,
  updates: Partial<Omit<Order, '_id' | 'orderNumber' | 'createdAt'>>,
): Promise<Order | null> {
  if (isDbConfigured()) {
    try {
      const db = await getDb()
      const result = await db
        .collection(COLLECTION)
        .findOneAndUpdate(
          { orderNumber },
          { $set: updates },
          { returnDocument: 'after' },
        )
      if (result) return { ...(result as unknown as Order), _id: String(result._id) }
    } catch (err) {
      console.log('[v0] updateOrder db error:', (err as Error).message)
    }
  }

  // Memory fallback update
  const order = memoryOrders.get(orderNumber)
  if (order) {
    const updated = { ...order, ...updates }
    memoryOrders.set(orderNumber, updated)
    return updated
  }
  return null
}

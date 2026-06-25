import 'server-only'
import bcrypt from 'bcryptjs'
import { getDb, isDbConfigured } from './mongodb'
import type { User } from './types'

const COLLECTION = 'users'

// In-memory persistent users registry fallback
const memoryUsers = new Map<string, User>()

// Pre-seed demo accounts
const DEMO_ADMIN: User = {
  name: 'Heritage Admin',
  email: 'admin@kangeyanheritage.com',
  passwordHash: bcrypt.hashSync('adminpassword', 10),
  role: 'admin',
  phone: '9876543210',
  createdAt: new Date().toISOString(),
}

const DEMO_CUSTOMER: User = {
  name: 'Sivakumar',
  email: 'customer@kangeyanheritage.com',
  passwordHash: bcrypt.hashSync('customerpassword', 10),
  role: 'customer',
  phone: '9876543211',
  addresses: [
    {
      fullName: 'Sivakumar K',
      phone: '9876543211',
      line1: '123 Heritage Lane',
      line2: 'Near Kangeyam Town',
      city: 'Tirupur',
      state: 'Tamil Nadu',
      pincode: '638111',
    },
  ],
  wishlist: ['cold-pressed-groundnut-oil'],
  createdAt: new Date().toISOString(),
}

memoryUsers.set(DEMO_ADMIN.email, DEMO_ADMIN)
memoryUsers.set(DEMO_CUSTOMER.email, DEMO_CUSTOMER)

function serialize<T extends { _id?: unknown }>(doc: T): T {
  return { ...doc, _id: doc._id ? String(doc._id) : undefined }
}

/**
 * Ensures the admin and customer demo accounts are seeded in database once.
 */
export async function ensureUsersSeeded(): Promise<void> {
  if (!isDbConfigured()) return
  try {
    const db = await getDb()
    const col = db.collection(COLLECTION)
    const count = await col.countDocuments()
    if (count === 0) {
      await col.insertMany([
        { ...DEMO_ADMIN, _id: undefined },
        { ...DEMO_CUSTOMER, _id: undefined },
      ])
    }
  } catch (err) {
    console.log('[v0] ensureUsersSeeded failed:', (err as Error).message)
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const normEmail = email.toLowerCase().trim()
  if (isDbConfigured()) {
    try {
      await ensureUsersSeeded()
      const db = await getDb()
      const doc = await db.collection(COLLECTION).findOne({ email: normEmail })
      if (doc) return serialize(doc as unknown as User)
    } catch (err) {
      console.log('[v0] getUserByEmail db error:', (err as Error).message)
    }
  }
  return memoryUsers.get(normEmail) ?? null
}

export async function getUserById(id: string): Promise<User | null> {
  if (isDbConfigured()) {
    try {
      const { ObjectId } = await import('mongodb')
      const db = await getDb()
      const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })
      if (doc) return serialize(doc as unknown as User)
    } catch (err) {
      console.log('[v0] getUserById db error:', (err as Error).message)
    }
  }
  
  // In-memory fallback lookup (matches email as user ID or matches mock ID)
  for (const user of memoryUsers.values()) {
    if (user._id === id || user.email === id) {
      return user
    }
  }
  return memoryUsers.get(id) ?? null
}

export async function createUser(user: Omit<User, '_id'>): Promise<User> {
  const normEmail = user.email.toLowerCase().trim()
  const newUser = { ...user, email: normEmail }

  if (isDbConfigured()) {
    try {
      const db = await getDb()
      const result = await db.collection(COLLECTION).insertOne(newUser)
      return { ...newUser, _id: String(result.insertedId) }
    } catch (err) {
      console.log('[v0] createUser db error, falling back to memory:', (err as Error).message)
    }
  }

  const inMemUser = { ...newUser, _id: normEmail }
  memoryUsers.set(normEmail, inMemUser)
  return inMemUser
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, '_id' | 'email' | 'createdAt'>>,
): Promise<User | null> {
  if (isDbConfigured()) {
    try {
      const { ObjectId } = await import('mongodb')
      const db = await getDb()
      const result = await db
        .collection(COLLECTION)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updates },
          { returnDocument: 'after' },
        )
      if (result) return serialize(result as unknown as User)
    } catch (err) {
      console.log('[v0] updateUser db error:', (err as Error).message)
    }
  }

  // Memory fallback updates
  const memoryUser = await getUserById(id)
  if (memoryUser) {
    const updated = { ...memoryUser, ...updates }
    memoryUsers.set(memoryUser.email, updated)
    return updated
  }
  return null
}

export async function getAllCustomers(): Promise<User[]> {
  if (isDbConfigured()) {
    try {
      await ensureUsersSeeded()
      const db = await getDb()
      const docs = await db.collection(COLLECTION).find({ role: 'customer' }).toArray()
      return docs.map((d) => serialize(d as unknown as User))
    } catch (err) {
      console.log('[v0] getAllCustomers error:', (err as Error).message)
    }
  }
  return Array.from(memoryUsers.values()).filter((u) => u.role === 'customer')
}

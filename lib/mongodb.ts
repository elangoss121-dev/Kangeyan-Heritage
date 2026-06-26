import { MongoClient, type Db, type MongoClientOptions } from 'mongodb'

const uri = process.env.MONGODB_URI
const DB_NAME = process.env.MONGODB_DB || 'kangeyan_heritage'

const clientOptions: MongoClientOptions = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  retryWrites: true,
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

/**
 * Returns true when a Mongo connection string is configured.
 * The app gracefully falls back to bundled seed data when this is false,
 * so the storefront always renders.
 */
export function isDbConfigured(): boolean {
  if (!uri) return false
  // If a recent connection attempt failed, treat the DB as unavailable for a
  // short cooldown window so we serve seed data fast instead of retrying Atlas
  // (and flooding logs) on every single request.
  if (Date.now() < dbUnavailableUntil) return false
  return true
}

let dbUnavailableUntil = 0
const DB_COOLDOWN_MS = 5_000

function markDbUnavailable(): void {
  dbUnavailableUntil = Date.now() + DB_COOLDOWN_MS
  clientPromise = null
  if (process.env.NODE_ENV === 'development') {
    global._mongoClientPromise = undefined
  }
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, clientOptions)
      global._mongoClientPromise = client.connect().catch((err) => {
        global._mongoClientPromise = undefined
        throw err
      })
    }
    return global._mongoClientPromise
  }
  if (!clientPromise) {
    client = new MongoClient(uri, clientOptions)
    clientPromise = client.connect().catch((err) => {
      clientPromise = null
      throw err
    })
  }
  return clientPromise
}

let indexesCreated = false

async function ensureIndexes(db: Db) {
  if (indexesCreated) return
  indexesCreated = true
  try {
    await Promise.all([
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('products').createIndex({ slug: 1 }, { unique: true }),
      db.collection('products').createIndex({ category: 1 }),
      db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true }),
      db.collection('orders').createIndex({ email: 1, createdAt: -1 }),
    ])
  } catch (err) {
    console.error('[mongodb] Failed to create database indexes:', err)
    indexesCreated = false
  }
}

export async function getDb(): Promise<Db> {
  try {
    const c = await getClientPromise()
    const db = c.db(DB_NAME)
    ensureIndexes(db).catch((err) => {
      console.error('[mongodb] ensureIndexes background error:', err)
    })
    return db
  } catch (err) {
    markDbUnavailable()
    throw err
  }
}

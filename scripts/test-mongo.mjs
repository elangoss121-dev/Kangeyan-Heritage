// Quick MongoDB connection test
// Run with: node scripts/test-mongo.mjs

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse .env.local manually (no dotenv needed)
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local')
    const lines = readFileSync(envPath, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const key = trimmed.slice(0, idx).trim()
      const value = trimmed.slice(idx + 1).trim()
      process.env[key] = value
    }
  } catch {
    console.error('Could not read .env.local')
  }
}

loadEnv()

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'kangeyan_heritage'

if (!uri || uri.includes('YOUR_USER') || uri.includes('YOUR_PASSWORD')) {
  console.log('\nMONGODB_URI is not configured in .env.local')
  console.log('Please set a real MongoDB Atlas connection string.\n')
  process.exit(1)
}

console.log('\nTesting MongoDB connection...')
console.log('URI: ' + uri.replace(/:([^@]+)@/, ':****@'))
console.log('DB:  ' + dbName + '\n')

try {
  const { MongoClient } = await import('mongodb')
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  })

  await client.connect()
  const db = client.db(dbName)

  await db.command({ ping: 1 })
  console.log('SUCCESS: MongoDB connection is working!\n')

  const collections = await db.listCollections().toArray()
  const names = collections.map(c => c.name)
  console.log('Collections in "' + dbName + '": ' + (names.length === 0 ? '(none yet)' : names.join(', ')))

  for (const name of ['orders', 'products', 'users']) {
    if (names.includes(name)) {
      const count = await db.collection(name).countDocuments()
      console.log('  - ' + name + ': ' + count + ' documents')
    } else {
      console.log('  - ' + name + ': collection not created yet')
    }
  }

  await client.close()
  console.log('\nAll checks passed. MongoDB is working correctly!\n')
} catch (err) {
  console.error('\nMongoDB connection FAILED!')
  console.error('Error: ' + err.message + '\n')
  if (err.message.includes('ENOTFOUND') || err.message.includes('querySrv')) {
    console.error('Check that the cluster hostname in MONGODB_URI is correct.')
  } else if (err.message.includes('Authentication failed')) {
    console.error('Check your username and password in MONGODB_URI.')
  } else if (err.message.includes('timed out')) {
    console.error('Check that your IP is whitelisted in MongoDB Atlas Network Access.')
  }
  process.exit(1)
}

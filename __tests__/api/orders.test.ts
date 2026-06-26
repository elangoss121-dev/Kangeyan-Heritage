import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../../app/api/orders/route'
import { getProductBySlug } from '../../lib/products'
import { createOrder } from '../../lib/orders'

vi.mock('../../lib/products', () => ({
  getProductBySlug: vi.fn(),
}))

vi.mock('../../lib/orders', () => ({
  createOrder: vi.fn((order) => Promise.resolve({ ...order, _id: 'mock-order-id' })),
  generateOrderNumber: () => 'KH26069999',
}))

const mockProduct = {
  slug: 'cold-pressed-groundnut-oil',
  name: 'Cold Pressed Groundnut Oil',
  image: '/products/groundnut-oil.png',
  variants: [
    { size: '1 litre', price: 410, mrp: 480, sku: 'KH-GN-1L' }
  ]
}

describe('POST /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const validAddress = {
    fullName: 'Sivakumar K',
    phone: '9876543210',
    line1: '123 Heritage Lane',
    city: 'Tirupur',
    state: 'Tamil Nadu',
    pincode: '638111'
  }

  it('should place a valid order and return 201', async () => {
    vi.mocked(getProductBySlug).mockResolvedValue(mockProduct as any)

    const payload = {
      email: 'customer@gmail.com',
      address: validAddress,
      items: [
        {
          slug: 'cold-pressed-groundnut-oil',
          name: 'Cold Pressed Groundnut Oil',
          image: '/products/groundnut-oil.png',
          size: '1 litre',
          sku: 'KH-GN-1L',
          price: 410,
          quantity: 2
        }
      ],
      paymentMethod: 'cod'
    }

    const request = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    const response = await POST(request)
    expect(response.status).toBe(201)

    const data = await response.json()
    expect(data.order).toBeDefined()
    expect(data.order.subtotal).toBe(820)
    expect(data.order.shipping).toBe(60) // subtotal is 820, threshold is 999
    expect(data.order.total).toBe(880)
    expect(createOrder).toHaveBeenCalledTimes(1)
  })

  it('should block price manipulation by using the database registry price', async () => {
    vi.mocked(getProductBySlug).mockResolvedValue(mockProduct as any)

    const payload = {
      email: 'customer@gmail.com',
      address: validAddress,
      items: [
        {
          slug: 'cold-pressed-groundnut-oil',
          name: 'Cold Pressed Groundnut Oil',
          image: '/products/groundnut-oil.png',
          size: '1 litre',
          sku: 'KH-GN-1L',
          price: 1, // Manipulated price! Real is 410
          quantity: 2
        }
      ],
      paymentMethod: 'cod'
    }

    const request = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    const response = await POST(request)
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain('Price mismatch')
    expect(createOrder).not.toHaveBeenCalled()
  })

  it('should return 400 for non-existent product slug', async () => {
    vi.mocked(getProductBySlug).mockResolvedValue(null)

    const payload = {
      email: 'customer@gmail.com',
      address: validAddress,
      items: [
        {
          slug: 'fake-slug',
          name: 'Fake product',
          image: '/products/fake.png',
          size: '1 litre',
          sku: 'KH-GN-1L',
          price: 100,
          quantity: 1
        }
      ],
      paymentMethod: 'cod'
    }

    const request = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    const response = await POST(request)
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain('Product not found')
  })

  it('should return 400 for invalid address structure', async () => {
    const payload = {
      email: 'customer@gmail.com',
      address: { ...validAddress, phone: '123' }, // Invalid phone number!
      items: [
        {
          slug: 'cold-pressed-groundnut-oil',
          name: 'Cold Pressed Groundnut Oil',
          image: '/products/groundnut-oil.png',
          size: '1 litre',
          sku: 'KH-GN-1L',
          price: 410,
          quantity: 1
        }
      ],
      paymentMethod: 'cod'
    }

    const request = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    const response = await POST(request)
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain('Phone must be a valid 10-digit')
  })

  it('should return 400 for negative or float quantities', async () => {
    vi.mocked(getProductBySlug).mockResolvedValue(mockProduct as any)

    const payload = {
      email: 'customer@gmail.com',
      address: validAddress,
      items: [
        {
          slug: 'cold-pressed-groundnut-oil',
          name: 'Cold Pressed Groundnut Oil',
          image: '/products/groundnut-oil.png',
          size: '1 litre',
          sku: 'KH-GN-1L',
          price: 410,
          quantity: -5 // Invalid quantity
        }
      ],
      paymentMethod: 'cod'
    }

    const request = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    const response = await POST(request)
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain('Invalid quantity')
  })
})

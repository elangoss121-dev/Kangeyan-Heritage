import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { resolveJwtSecret } from '../../lib/auth'

describe('resolveJwtSecret', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore process.env
    process.env = originalEnv
  })

  it('should return fallback secret in development mode when secret is missing', () => {
    process.env.NODE_ENV = 'development'
    delete process.env.JWT_SECRET
    const secret = resolveJwtSecret()
    expect(secret).toBe('dev-only-insecure-secret')
  })

  it('should return the custom secret in development mode when configured', () => {
    process.env.NODE_ENV = 'development'
    process.env.JWT_SECRET = 'custom-dev-secret'
    const secret = resolveJwtSecret()
    expect(secret).toBe('custom-dev-secret')
  })

  it('should throw error in production mode when JWT_SECRET is missing', () => {
    process.env.NODE_ENV = 'production'
    delete process.env.JWT_SECRET
    expect(() => resolveJwtSecret()).toThrowError(/JWT_SECRET is missing/)
  })

  it('should throw error in production mode when JWT_SECRET is the fallback key', () => {
    process.env.NODE_ENV = 'production'
    process.env.JWT_SECRET = 'dev-only-insecure-secret'
    expect(() => resolveJwtSecret()).toThrowError(/JWT_SECRET is missing or set to the dev fallback/)
  })

  it('should throw error in production mode when JWT_SECRET is identical to NEXTAUTH_SECRET', () => {
    process.env.NODE_ENV = 'production'
    process.env.JWT_SECRET = 'identical-secret-key-123456789'
    process.env.NEXTAUTH_SECRET = 'identical-secret-key-123456789'
    expect(() => resolveJwtSecret()).toThrowError(/must be different values/)
  })

  it('should return valid secret in production mode when JWT_SECRET is valid and different from NEXTAUTH_SECRET', () => {
    process.env.NODE_ENV = 'production'
    process.env.JWT_SECRET = 'strong-jwt-secret-key-999'
    process.env.NEXTAUTH_SECRET = 'strong-nextauth-secret-key-888'
    const secret = resolveJwtSecret()
    expect(secret).toBe('strong-jwt-secret-key-999')
  })
})

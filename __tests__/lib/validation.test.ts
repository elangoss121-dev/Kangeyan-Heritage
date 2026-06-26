import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhone,
  validatePincode,
  validateCategory,
  validateOrderStatus,
  validatePaymentStatus,
  validateAddress
} from '../../lib/validation'

describe('validation module', () => {
  describe('validateEmail', () => {
    it('should return true for valid email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.in')).toBe(true)
    })

    it('should return false for invalid email formats', () => {
      expect(validateEmail('plain')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should return true for valid 10-digit Indian phone numbers', () => {
      expect(validatePhone('9876543210')).toBe(true)
      expect(validatePhone('7845068989')).toBe(true)
    })

    it('should return false for invalid phone numbers', () => {
      expect(validatePhone('1234567890')).toBe(false) // Must start with 6-9
      expect(validatePhone('987654321')).toBe(false)  // Too short
      expect(validatePhone('98765432101')).toBe(false) // Too long
      expect(validatePhone('abcde12345')).toBe(false)
    })
  })

  describe('validatePincode', () => {
    it('should return true for valid 6-digit pincodes', () => {
      expect(validatePincode('638111')).toBe(true)
      expect(validatePincode('600001')).toBe(true)
    })

    it('should return false for invalid pincodes', () => {
      expect(validatePincode('63811')).toBe(false)   // Too short
      expect(validatePincode('6381111')).toBe(false) // Too long
      expect(validatePincode('abcdef')).toBe(false)
    })
  })

  describe('validateCategory', () => {
    it('should return true for valid store categories', () => {
      expect(validateCategory('cold-pressed-oils')).toBe(true)
      expect(validateCategory('jaggery')).toBe(true)
      expect(validateCategory('spices')).toBe(true)
      expect(validateCategory('grains')).toBe(true)
    })

    it('should return false for invalid categories', () => {
      expect(validateCategory('sarees')).toBe(false)
      expect(validateCategory('invalid-category')).toBe(false)
    })
  })

  describe('validateOrderStatus', () => {
    it('should return true for valid order status values', () => {
      expect(validateOrderStatus('pending')).toBe(true)
      expect(validateOrderStatus('delivered')).toBe(true)
      expect(validateOrderStatus('cancelled')).toBe(true)
    })

    it('should return false for invalid status values', () => {
      expect(validateOrderStatus('deleted')).toBe(false)
      expect(validateOrderStatus('hacked')).toBe(false)
    })
  })

  describe('validatePaymentStatus', () => {
    it('should return true for valid payment status values', () => {
      expect(validatePaymentStatus('pending')).toBe(true)
      expect(validatePaymentStatus('paid')).toBe(true)
      expect(validatePaymentStatus('failed')).toBe(true)
    })

    it('should return false for invalid values', () => {
      expect(validatePaymentStatus('refunded')).toBe(false) // Note: VALID_PAYMENT_STATUSES in our code has pending/paid/failed (refunded was in generic list but our store definition uses pending/paid/failed)
      expect(validatePaymentStatus('success')).toBe(false)
    })
  })

  describe('validateAddress', () => {
    it('should return valid true for a correct address object', () => {
      const addr = {
        fullName: 'Sivakumar K',
        phone: '9876543211',
        line1: '123 Heritage Lane',
        city: 'Tirupur',
        state: 'Tamil Nadu',
        pincode: '638111'
      }
      expect(validateAddress(addr)).toEqual({ valid: true })
    })

    it('should return valid false with error when values are missing', () => {
      expect(validateAddress(null)).toHaveProperty('valid', false)
      expect(validateAddress({})).toHaveProperty('valid', false)
      
      const missingName = {
        phone: '9876543211',
        line1: '123 Street',
        city: 'City',
        state: 'State',
        pincode: '638111'
      }
      expect(validateAddress(missingName).valid).toBe(false)
      expect(validateAddress(missingName).error).toContain('Full Name')

      const invalidPhone = {
        fullName: 'Sivakumar',
        phone: '12345',
        line1: '123 Street',
        city: 'City',
        state: 'State',
        pincode: '638111'
      }
      expect(validateAddress(invalidPhone).valid).toBe(false)
      expect(validateAddress(invalidPhone).error).toContain('Phone')
    })
  })
})

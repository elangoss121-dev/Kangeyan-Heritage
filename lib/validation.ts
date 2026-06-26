import type { Category } from './types'

export const VALID_CATEGORIES: Category[] = [
  'cold-pressed-oils',
  'jaggery',
  'spices',
  'grains',
]

export const VALID_ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
] as const;

export const VALID_PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed"
] as const;

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.trim());
}

export function validatePincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode.trim());
}

export function validateCategory(category: string): category is Category {
  return VALID_CATEGORIES.includes(category as Category);
}

export function validateOrderStatus(status: string): boolean {
  return (VALID_ORDER_STATUSES as readonly string[]).includes(status);
}

export function validatePaymentStatus(status: string): boolean {
  return (VALID_PAYMENT_STATUSES as readonly string[]).includes(status);
}

export function validateAddress(address: unknown): { valid: boolean; error?: string } {
  if (!address || typeof address !== "object") {
    return { valid: false, error: "Address must be an object" };
  }
  const a = address as Record<string, unknown>;
  if (typeof a.fullName !== "string" || !a.fullName.trim()) {
    return { valid: false, error: "Full Name is required" };
  }
  if (typeof a.phone !== "string" || !validatePhone(a.phone)) {
    return { valid: false, error: "Phone must be a valid 10-digit Indian mobile number" };
  }
  if (typeof a.line1 !== "string" || !a.line1.trim()) {
    return { valid: false, error: "Address Line 1 is required" };
  }
  if (typeof a.city !== "string" || !a.city.trim()) {
    return { valid: false, error: "City is required" };
  }
  if (typeof a.state !== "string" || !a.state.trim()) {
    return { valid: false, error: "State is required" };
  }
  if (typeof a.pincode !== "string" || !validatePincode(a.pincode)) {
    return { valid: false, error: "Pincode must be a 6-digit number" };
  }
  return { valid: true };
}

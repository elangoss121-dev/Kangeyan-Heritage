export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const WHATSAPP_NUMBER = '917845068989'
export const PHONE_DISPLAY = '+91 78450 68989'
export const SITE_NAME = 'Kangeyan Heritage'
export const INSTAGRAM = 'https://instagram.com/kangeyanheritage'
export const FACEBOOK = 'https://facebook.com/kangeyanheritage'
export const YOUTUBE = 'https://youtube.com/@kangeyanheritage'

export const FREE_SHIPPING_THRESHOLD = 999
export const SHIPPING_FEE = 60

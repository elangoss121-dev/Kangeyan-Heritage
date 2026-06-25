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
export const INSTAGRAM = 'https://www.instagram.com/kangeyanheritage?igsh=MTY3YnRzdW1wcGhsOA=='
export const FACEBOOK = 'https://www.facebook.com/profile.php?id=399007386638739&hr=1&wtsid=rdr_0nt1HczdT1bfLGZSo'
export const YOUTUBE = 'https://youtube.com/@kangeyanheritage'
export const EMAIL = 'kangeyanheritage@gmail.com'

export const FREE_SHIPPING_THRESHOLD = 999
export const SHIPPING_FEE = 60

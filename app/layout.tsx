import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Manrope, Geist_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart/cart-provider'
import { WishlistProvider } from '@/components/wishlist/wishlist-context'
import { Toaster } from '@/components/ui/sonner'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})
const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kangeyanheritage.com'),
  title: {
    default: 'Kangeyan Heritage | Cold Pressed Oils & Organic Foods',
    template: '%s | Kangeyan Heritage',
  },
  description:
    'Wood pressed, chemical-free and unrefined cold pressed oils, organic jaggery and traditional foods. Pure heritage from Tamil Nadu, delivered to your doorstep.',
  keywords: [
    'cold pressed oil',
    'wood pressed oil',
    'groundnut oil',
    'coconut oil',
    'sesame oil',
    'organic jaggery',
    'chemical free',
    'Kangeyan Heritage',
  ],
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    title: 'Kangeyan Heritage | Cold Pressed Oils & Organic Foods',
    description:
      'Wood pressed, chemical-free and unrefined cold pressed oils and organic foods. Pure heritage, delivered to your doorstep.',
    siteName: 'Kangeyan Heritage',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#B5531F',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${manrope.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
        <Toaster richColors position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

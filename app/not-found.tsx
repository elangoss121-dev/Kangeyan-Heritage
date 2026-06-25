import Link from 'next/link'
import { ArrowLeft, Home, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-paper p-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="font-serif text-8xl font-black text-primary animate-pulse">404</h1>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved to a new location. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button className="rounded-full gap-2" render={<Link href="/" />}>
            <Home className="size-4" />
            Go to Home
          </Button>
          <Button variant="outline" className="rounded-full gap-2" render={<Link href="/shop" />}>
            <ShoppingBag className="size-4" />
            Browse Shop
          </Button>
        </div>

        <div className="pt-8">
          <Link href="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="size-3" />
            Need help? Contact support
          </Link>
        </div>
      </div>
    </div>
  )
}

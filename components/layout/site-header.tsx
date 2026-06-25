'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, Search, ShoppingBag, User } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCart } from '@/components/cart/cart-provider'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/shop/cold-pressed-oils', label: 'Cold Pressed Oils' },
  { href: '/process', label: 'Our Process' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { count, setOpen } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="bg-primary text-primary-foreground">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs font-medium tracking-wide sm:text-sm">
          Wood Pressed • Chemical Free • Unrefined — Free shipping on orders
          above ₹999
        </p>
      </div>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="Open menu" />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-2 flex flex-col px-2">
                  {NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground',
                        pathname === item.href && 'bg-accent text-foreground',
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent"
                  >
                    My Account
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <Logo className="lg:flex-1" />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-primary',
                  pathname === item.href && 'text-primary',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 lg:flex-1 lg:justify-end">
            <Button
              variant="ghost"
              size="icon"
              render={<Link href="/shop" />}
              aria-label="Search"
            >
              <Search className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              render={<Link href="/account" />}
              aria-label="Account"
            >
              <User className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Cart"
              onClick={() => setOpen(true)}
            >
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  )
}

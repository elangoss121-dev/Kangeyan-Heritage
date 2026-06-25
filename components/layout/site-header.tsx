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
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="Open menu" />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="top" className="w-full pt-16 pb-8">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-4 flex flex-col px-2 gap-1">
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

          <Logo className="md:flex-1" />

          <nav className="hidden items-center gap-1 md:flex">
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

          <div className="flex items-center gap-4 md:flex-1 md:justify-end">
            <Link
              href="/account"
              className="text-foreground transition-opacity hover:opacity-70"
              aria-label="Account"
            >
              <User className="size-[22px]" />
            </Link>
            <button
              type="button"
              className="relative text-foreground transition-opacity hover:opacity-70"
              onClick={() => setOpen(true)}
              aria-label="Cart"
            >
              <ShoppingBag className="size-[22px]" />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  )
}

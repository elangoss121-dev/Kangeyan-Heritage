import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/brand/social-icons'
import {
  PHONE_DISPLAY,
  INSTAGRAM,
  FACEBOOK,
  YOUTUBE,
} from '@/lib/format'

const shopLinks = [
  { href: '/shop', label: 'All Products' },
  { href: '/shop/cold-pressed-oils', label: 'Cold Pressed Oils' },
  { href: '/shop/jaggery', label: 'Jaggery' },
  { href: '/product/cold-pressed-groundnut-oil', label: 'Groundnut Oil' },
  { href: '/product/cold-pressed-coconut-oil', label: 'Coconut Oil' },
]

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/process', label: 'Our Process' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
]

const policyLinks = [
  { href: '/policies/shipping', label: 'Shipping Policy' },
  { href: '/policies/returns', label: 'Returns & Refunds' },
  { href: '/policies/privacy', label: 'Privacy Policy' },
  { href: '/policies/terms', label: 'Terms of Service' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Pure heritage from Tamil Nadu. Wood pressed cold pressed oils,
            organic jaggery and traditional foods — chemical free and unrefined,
            delivered to your doorstep.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid size-9 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid size-9 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <FacebookIcon className="size-4" />
            </a>
            <a
              href={YOUTUBE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="grid size-9 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <YoutubeIcon className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
            Shop
          </h4>
          <ul className="space-y-2.5 text-sm">
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
            Company
          </h4>
          <ul className="space-y-2.5 text-sm">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
            Get in Touch
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                387, Erode Road, Vellikovil, Tirupur Dt, Tamil Nadu - 638111
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href={`tel:${PHONE_DISPLAY.replace(/\s/g, '')}`}>
                {PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" />
              <a href="mailto:hello@kangeyanheritage.com">
                hello@kangeyanheritage.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Kangeyan Heritage. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {policyLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

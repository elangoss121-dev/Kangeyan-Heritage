'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Check,
  ChevronLeft,
  Loader2,
  Truck,
  Wallet,
  CreditCard,
  ShoppingBag,
} from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  formatINR,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from '@/lib/format'
import type { Address } from '@/lib/types'
import { cn } from '@/lib/utils'

const STEPS = ['Shipping', 'Payment', 'Review'] as const

const INDIAN_STATES = [
  'Tamil Nadu',
  'Kerala',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Delhi',
  'Other',
]

export function CheckoutFlow() {
  const router = useRouter()
  const { items, subtotal, clear } = useCart()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [payment, setPayment] = useState<'cod' | 'online'>('cod')
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
  })

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-9 text-muted-foreground" />
        </div>
        <h2 className="font-serif text-2xl text-foreground">
          Nothing to check out
        </h2>
        <Button className="rounded-full" render={<Link href="/shop" />}>
          Browse Products
        </Button>
      </div>
    )
  }

  function validShipping() {
    const okEmail = /\S+@\S+\.\S+/.test(email)
    const okPhone = /^\d{10}$/.test(address.phone)
    const okPin = /^\d{6}$/.test(address.pincode)
    return (
      okEmail &&
      okPhone &&
      okPin &&
      address.fullName.trim() &&
      address.line1.trim() &&
      address.city.trim()
    )
  }

  function nextFromShipping() {
    if (!validShipping()) {
      toast.error('Please complete all required fields correctly.')
      return
    }
    setStep(1)
  }

  async function placeOrder() {
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, address, email, paymentMethod: payment }),
      })
      if (!res.ok) throw new Error('Order failed')
      const data = await res.json()
      const order = data.order
      try {
        sessionStorage.setItem(
          `kh_order_${order.orderNumber}`,
          JSON.stringify(order),
        )
      } catch {
        // ignore storage failures
      }
      clear()
      router.push(`/order/${order.orderNumber}`)
    } catch {
      toast.error('Something went wrong placing your order. Please try again.')
      setSubmitting(false)
    }
  }

  function setField(key: keyof Address, value: string) {
    setAddress((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        {/* Stepper */}
        <ol className="mb-8 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors',
                  i < step && 'bg-primary text-primary-foreground',
                  i === step &&
                    'bg-primary text-primary-foreground ring-4 ring-primary/20',
                  i > step && 'bg-muted text-muted-foreground',
                )}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  i <= step ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="mx-1 hidden h-px flex-1 bg-border sm:block" />
              )}
            </li>
          ))}
        </ol>

        {/* Step 1: Shipping */}
        {step === 0 && (
          <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl text-foreground">
              Shipping Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" className="sm:col-span-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Full Name">
                <Input
                  value={address.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  placeholder="Your name"
                />
              </Field>
              <Field label="Phone (10 digits)">
                <Input
                  value={address.phone}
                  onChange={(e) =>
                    setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="9876543210"
                  inputMode="numeric"
                />
              </Field>
              <Field label="Address Line 1" className="sm:col-span-2">
                <Input
                  value={address.line1}
                  onChange={(e) => setField('line1', e.target.value)}
                  placeholder="House no, street"
                />
              </Field>
              <Field label="Address Line 2 (optional)" className="sm:col-span-2">
                <Input
                  value={address.line2}
                  onChange={(e) => setField('line2', e.target.value)}
                  placeholder="Area, landmark"
                />
              </Field>
              <Field label="City">
                <Input
                  value={address.city}
                  onChange={(e) => setField('city', e.target.value)}
                  placeholder="City"
                />
              </Field>
              <Field label="State">
                <select
                  value={address.state}
                  onChange={(e) => setField('state', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Pincode (6 digits)">
                <Input
                  value={address.pincode}
                  onChange={(e) =>
                    setField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder="638111"
                  inputMode="numeric"
                />
              </Field>
            </div>
            <Button
              size="lg"
              className="w-full rounded-full"
              onClick={nextFromShipping}
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 1 && (
          <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl text-foreground">
              Payment Method
            </h2>
            <div className="space-y-3">
              <PaymentOption
                active={payment === 'cod'}
                onClick={() => setPayment('cod')}
                icon={<Wallet className="size-5" />}
                title="Cash on Delivery"
                description="Pay in cash when your order arrives."
              />
              <PaymentOption
                active={payment === 'online'}
                onClick={() => setPayment('online')}
                icon={<CreditCard className="size-5" />}
                title="Online Payment"
                description="UPI, cards & netbanking (demo — no charge made)."
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setStep(0)}
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1 rounded-full"
                onClick={() => setStep(2)}
              >
                Review Order
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl text-foreground">
              Review &amp; Confirm
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-secondary/50 p-4 text-sm">
                <p className="mb-1 flex items-center gap-2 font-medium text-foreground">
                  <Truck className="size-4 text-primary" />
                  Delivering to
                </p>
                <p className="text-muted-foreground">
                  {address.fullName}
                  <br />
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ''}
                  <br />
                  {address.city}, {address.state} - {address.pincode}
                  <br />
                  {address.phone} · {email}
                </p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-4 text-sm">
                <p className="mb-1 flex items-center gap-2 font-medium text-foreground">
                  <Wallet className="size-4 text-primary" />
                  Payment
                </p>
                <p className="text-muted-foreground">
                  {payment === 'cod'
                    ? 'Cash on Delivery'
                    : 'Online Payment (demo)'}
                </p>
              </div>
            </div>
            <Separator />
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.sku} className="flex items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-muted-foreground">
                      {item.size} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium tabular-nums">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setStep(1)}
                disabled={submitting}
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1 rounded-full"
                onClick={placeOrder}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order · ${formatINR(total)}`
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-serif text-lg text-foreground">Order Summary</h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.sku} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.name}{' '}
                <span className="text-xs">
                  ({item.size} × {item.quantity})
                </span>
              </span>
              <span className="tabular-nums">
                {formatINR(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <Separator />
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="tabular-nums">{formatINR(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="tabular-nums">
              {shipping === 0 ? 'Free' : formatINR(shipping)}
            </dd>
          </div>
        </dl>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg text-foreground">Total</span>
          <span className="font-serif text-xl text-foreground tabular-nums">
            {formatINR(total)}
          </span>
        </div>
      </aside>
    </div>
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-sm text-foreground">{label}</Label>
      {children}
    </div>
  )
}

function PaymentOption({
  active,
  onClick,
  icon,
  title,
  description,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors',
        active
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/40',
      )}
    >
      <span
        className={cn(
          'flex size-10 items-center justify-center rounded-full',
          active ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
        )}
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-medium text-foreground">{title}</span>
        <span className="block text-sm text-muted-foreground">
          {description}
        </span>
      </span>
      <span
        className={cn(
          'flex size-5 items-center justify-center rounded-full border',
          active ? 'border-primary bg-primary' : 'border-muted-foreground/40',
        )}
      >
        {active && <Check className="size-3 text-primary-foreground" />}
      </span>
    </button>
  )
}

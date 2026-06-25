'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function Newsletter() {
  const [email, setEmail] = useState('')

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:py-16">
      <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
        <span className="grid mx-auto size-12 place-items-center rounded-full bg-primary-foreground/15">
          <Mail className="size-6" />
        </span>
        <h2 className="mt-4 font-serif text-3xl font-bold text-balance">
          Join the Heritage Family
        </h2>
        <p className="mx-auto mt-2 max-w-md text-primary-foreground/80">
          Get traditional recipes, wellness tips and exclusive offers delivered
          to your inbox.
        </p>
        <form
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
            if (!email) return
            toast.success('Subscribed!', {
              description: 'Welcome to the Kangeyan Heritage family.',
            })
            setEmail('')
          }}
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-12 border-transparent bg-primary-foreground text-foreground placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="h-12 shrink-0"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}

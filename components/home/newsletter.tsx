'use client'

import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function validateEmail(emailStr: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(emailStr)
  }

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email')
      return
    }

    // Connect to Mailchimp/Brevo (Sendinblue) API here:
    // Example:
    // try {
    //   const response = await fetch('/api/newsletter/subscribe', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email })
    //   });
    //   if (!response.ok) throw new Error('API failed');
    // } catch (err) {
    //   console.error("Newsletter API error", err);
    // }
    // NOTE: Plug in your API key and List/Audience ID in your backend route using process.env.MAILCHIMP_API_KEY / process.env.BREVO_API_KEY.

    setSuccess(true)
    setEmail('')
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:py-16">
      <div className="rounded-3xl bg-secondary/80 border border-border px-6 py-12 text-center text-foreground sm:px-12">
        <span className="grid mx-auto size-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Mail className="size-6" />
        </span>
        <h2 className="mt-4 font-serif text-3xl font-bold text-balance text-foreground">
          Join the Heritage Family
        </h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Get traditional recipes, wellness tips and exclusive offers delivered
          to your inbox.
        </p>

        <div className="mx-auto mt-6 max-w-md">
          {success ? (
            <div className="flex flex-col items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 py-3">
              <CheckCircle className="size-8 animate-bounce" />
              <p className="text-sm font-semibold">
                You're in! Welcome to the heritage family.
              </p>
            </div>
          ) : (
            <form
              className="flex flex-col gap-3 sm:flex-row items-stretch"
              onSubmit={handleSubscribe}
              noValidate
            >
              <div className="flex-1 flex flex-col items-start gap-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder="Your email address"
                  className={`h-12 w-full bg-background text-foreground border ${
                    error ? 'border-destructive ring-1 ring-destructive' : 'border-border'
                  }`}
                />
                {error && (
                  <p className="text-xs text-destructive mt-0.5 pl-1 font-medium">
                    {error}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 shrink-0 w-full sm:w-[130px] rounded-md bg-[#B5531F] text-white hover:bg-[#B5531F]/90 border border-transparent font-medium"
              >
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

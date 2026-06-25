'use client'

import { useState } from 'react'
import { PageHero } from '@/components/layout/page-hero'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { PHONE_DISPLAY } from '@/lib/format'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    toast.success('Message sent successfully!', {
      description: "Thank you for reaching out. We will get back to you shortly.",
    })
    
    setName('')
    setEmail('')
    setPhone('')
    setMessage('')
    setSubmitting(false)
  }

  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="We'd Love to Hear From You"
        description="Have questions about our wood pressed oils, orders, bulk corporate gifting, or wholesale pricing? Contact us below."
      />

      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16 grid gap-8 lg:grid-cols-5">
        {/* Left 3 cols: Form */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs md:p-8 lg:col-span-3">
          <h2 className="font-serif text-xl font-bold text-foreground mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contact-name">Full Name *</Label>
                <Input
                  id="contact-name"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input
                  id="contact-phone"
                  placeholder="10-digit number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-email">Email Address *</Label>
              <Input
                id="contact-email"
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-msg">Message *</Label>
              <textarea
                id="contact-msg"
                required
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={submitting} className="rounded-full gap-2 mt-2">
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="size-4" /> Send Message
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Right 2 cols: Info & Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold text-foreground">Contact Information</h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="size-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">Store Address</h3>
                  <p className="mt-1 leading-relaxed">
                    387, Erode Road, Vellikovil,
                    <br />
                    Tirupur District, Tamil Nadu - 638111
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="size-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">Call or WhatsApp</h3>
                  <p className="mt-1">
                    <a href={`tel:${PHONE_DISPLAY.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                      {PHONE_DISPLAY}
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Mon - Sat: 9:00 AM - 7:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="size-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">Email Support</h3>
                  <p className="mt-1">
                    <a href="mailto:hello@kangeyanheritage.com" className="hover:text-primary transition-colors">
                      hello@kangeyanheritage.com
                    </a>
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Embedded Map Container */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border bg-secondary/30">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <MapPin className="size-8 text-primary animate-bounce mb-2" />
              <p className="font-serif text-sm font-semibold text-foreground">Vellikovil Store, Tirupur</p>
              <p className="text-xs text-muted-foreground mt-0.5">Google Maps Location Placeholder</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors"
              >
                Open Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

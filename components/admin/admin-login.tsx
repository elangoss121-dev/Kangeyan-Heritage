import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Lock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AdminLoginProps {
  onSubmit: (email: string, password: string) => Promise<void>
  submitting: boolean
}

export function AdminLogin({ onSubmit, submitting }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-md md:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="size-6" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-foreground">
            Heritage Admin Access
          </h1>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Only authorized administrators can log in here.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              required
              type="email"
              placeholder="admin@kangeyanheritage.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full rounded-full mt-2">
            {submitting ? 'Authenticating...' : 'Sign In to Panel'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="size-3" />
            Back to storefront
          </Link>
        </div>
      </div>
    </div>
  )
}

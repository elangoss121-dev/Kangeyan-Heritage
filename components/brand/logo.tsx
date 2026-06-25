import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  showText = true,
  size = 44,
}: {
  className?: string
  showText?: boolean
  size?: number
}) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-3', className)}
      aria-label="Kangeyan Heritage home"
    >
      <span
        className="relative shrink-0 overflow-hidden rounded-full ring-1 ring-border"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/logo-mark.jpeg"
          alt="Kangeyan Heritage bull emblem"
          fill
          sizes="48px"
          className="object-cover"
          priority
        />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-lg font-bold tracking-tight text-primary">
            Kangeyan
          </span>
          <span className="font-serif text-lg font-bold tracking-tight text-foreground">
            Heritage
          </span>
        </span>
      )}
    </Link>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <Leaf className="size-3.5" />
            Wood Pressed • Chemical Free • Unrefined
          </span>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.05] text-foreground text-balance sm:text-5xl lg:text-6xl">
            Pure Heritage,
            <span className="block text-primary">Cold Pressed with Care</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Traditional chekku oils and organic foods from the heart of Tamil
            Nadu. No chemicals, no refining — just the way nature intended.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-full"
              render={<Link href="/shop" />}
            >
              Shop Now
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              render={<Link href="/process" />}
            >
              Our Process
            </Button>
          </div>
          <div className="mt-9 grid grid-cols-3 gap-6">
            {[
              { value: '100%', label: 'Chemical Free' },
              { value: '5000+', label: 'Happy Families' },
              { value: '4.8★', label: 'Avg. Rating' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-2xl font-bold text-primary">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border shadow-xl shadow-primary/5">
            <Image
              src="/brand/ad-groundnut.jpeg"
              alt="Kangeyan Heritage cold pressed groundnut oil"
              width={900}
              height={1125}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

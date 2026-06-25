import Image from 'next/image'
import { Check } from 'lucide-react'

const points = [
  {
    title: 'Traditional Wood Pressing',
    desc: 'Our oils are extracted in a wooden chekku at low temperatures, preserving nutrients and natural aroma.',
  },
  {
    title: 'Absolutely Chemical Free',
    desc: 'No hexane, no sulphur, no refining. What you get is 100% pure and unrefined.',
  },
  {
    title: 'Farm to Doorstep',
    desc: 'Sourced directly from trusted farmers and delivered fresh across India.',
  },
  {
    title: 'Rooted in Heritage',
    desc: 'Recipes and methods passed down through generations of Tamil tradition.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-3xl border border-border">
            <Image
              src="/brand/ad-coconut.jpeg"
              alt="Kangeyan Heritage cold pressed coconut oil"
              width={900}
              height={1125}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            Why Kangeyan Heritage
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl">
            The Difference You Can Taste
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We believe pure food is the foundation of a healthy life. Every
            bottle and pack carries the promise of purity.
          </p>
          <ul className="mt-7 space-y-5">
            {points.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-4" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

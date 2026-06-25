import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const categories = [
  {
    href: '/product/cold-pressed-groundnut-oil',
    title: 'Groundnut Oil',
    image: '/brand/ad-groundnut.jpeg',
  },
  {
    href: '/product/cold-pressed-coconut-oil',
    title: 'Coconut Oil',
    image: '/brand/ad-coconut.jpeg',
  },
  {
    href: '/product/cold-pressed-palm-jaggery-sesame-oil',
    title: 'Sesame Oil',
    image: '/brand/ad-sesame.jpeg',
  },
  {
    href: '/product/organic-jaggery-powder',
    title: 'Jaggery Powder',
    image: '/brand/ad-jaggery.jpeg',
  },
]

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-primary">
          Our Range
        </span>
        <h2 className="mt-2 font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl">
          Crafted from Nature&apos;s Best
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative overflow-hidden rounded-2xl border border-border"
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={cat.image || '/placeholder.svg'}
                alt={cat.title}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon/70 via-transparent to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
              <h3 className="font-serif text-lg font-bold text-white">
                {cat.title}
              </h3>
              <span className="grid size-8 place-items-center rounded-full bg-white/90 text-maroon transition-transform group-hover:translate-x-0.5">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

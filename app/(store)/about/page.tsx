import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'
import { Check, ShieldCheck, Heart, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our roots in Kangeyam, our traditional farming, and our commitment to pure, wood pressed oils.',
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Pure Heritage, Honest Foods"
        description="Preserving the traditional farming and wood pressing legacy of Kangeyam, Tamil Nadu."
      />

      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16 space-y-12">
        {/* Heritage Section */}
        <section className="grid gap-6 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">The Kangeyam Legacy</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Kangeyam, nestled in the heart of Tamil Nadu, is famous across the country for its legendary Kangayam bulls and resilient farming communities. In this arid yet rich soil, sesame, groundnut, and coconuts grow with a unique oil-rich texture.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              For generations, our ancestors used large wooden mortars turned by bulls (Marachekku) to extract cooking oil at slow speeds, keeping temperatures low to preserve natural nutrients and aroma. <strong>Kangeyan Heritage</strong> was founded to keep this honest heritage alive.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 flex flex-col justify-center text-center space-y-4 h-full">
            <h3 className="font-serif text-3xl font-extrabold text-primary">100%</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Traditional Wood Pressed</p>
            <Separator />
            <h3 className="font-serif text-3xl font-extrabold text-primary">Zero</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Chemicals or Sulphur</p>
          </div>
        </section>

        {/* Pillars */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-foreground text-center">Our Core Pillars</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <PillarCard
              icon={<ShieldCheck className="size-5 text-primary" />}
              title="Uncompromising Purity"
              description="No mineral oil, no paraffin, no bleaching agents, and no synthetic preservatives. Just pure, unrefined oil as nature intended."
            />
            <PillarCard
              icon={<Heart className="size-5 text-primary" />}
              title="Traditional Method"
              description="Extracted in Vaagai (East Indian Walnut) wooden mortars that absorb excess heat, preserving the oil's natural antioxidants."
            />
            <PillarCard
              icon={<Users className="size-5 text-primary" />}
              title="Supporting Farmers"
              description="Sourced directly from native farmers in Tirupur, Erode, and Karur districts, ensuring fair price value for crops."
            />
          </div>
        </section>

        {/* The Promise */}
        <section className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-4">
          <h2 className="font-serif text-xl font-bold text-foreground">Our Promise to You</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We do not compromise. In a market flooded with chemically extracted solvents, we stand by our wooden mortars. It takes more time, it is more labor-intensive, and the yields are smaller—but the result is oil that preserves the flavor, aroma, and vitality of traditional South Indian cooking.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm pt-2">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-primary shrink-0" />
              Sourced from sun-dried local copra & seeds
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-primary shrink-0" />
              Vaagai wood mortars (chekku)
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-primary shrink-0" />
              Naturally sedimented under sunlight
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-primary shrink-0" />
              Packaged with strict quality standards
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}

function PillarCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <div className="size-9 rounded-full bg-secondary flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

function Separator() {
  return <div className="h-px bg-border/80 w-1/3 mx-auto" />
}

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageHero } from '@/components/layout/page-hero'
import { Shield, Sparkles, Eye, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our roots in Kangeyam, our traditional farming, and our commitment to pure, wood pressed oils.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        eyebrow="Our Story"
        title="Pure Heritage, Tamil Soil"
        description="Preserving the traditional farming and wood pressing legacy of Kangeyam, Tamil Nadu."
      />

      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-16">
        
        {/* Founder's Story Section */}
        <section className="grid gap-10 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Founder's Story</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Why We Started Kangeyan Heritage</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Kangeyan Heritage was born out of a desire to bring pure, unadulterated traditional foods back to modern households. Coming from an agricultural family in the Tirupur district, we witnessed the gradual disappearance of authentic, healthy cooking fats in favor of cheap, refined, solvent-extracted oils.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Our family has always believed that food is medicine. By reviving the traditional *Marachekku* (wood-pressing mortar) tradition, we ensure the crops grown in our region—premium sesame, dry copra, and sun-dried groundnuts—are extracted without heat or chemicals, preserving the legacy of our ancestors.
            </p>
          </div>
          {/* Founder image slot placeholder */}
          <div className="relative aspect-[4/5] max-w-sm mx-auto w-full overflow-hidden rounded-3xl border border-border bg-secondary/40 flex items-center justify-center">
            <div className="text-center p-6 space-y-2">
              <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="font-serif text-lg font-bold">KH</span>
              </div>
              <p className="font-serif text-sm font-semibold text-foreground">Founder Photo Placeholder</p>
              <p className="text-xs text-muted-foreground">Kangeyan Heritage Agriculture Family</p>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="space-y-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Core Principles</span>
            <h2 className="mt-1 font-serif text-2xl md:text-3xl font-bold text-foreground">Our Core Values</h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-3">
            <ValueCard
              icon={<Shield className="size-6 text-primary" />}
              title="Purity"
              description="No mineral oil, no paraffin, no bleach, and no synthetic preservatives. Just pure, unrefined oils extracted exactly as nature intended."
            />
            <ValueCard
              icon={<Sparkles className="size-6 text-primary" />}
              title="Tradition"
              description="Crushed in Vaagai (East Indian Walnut) wood mortars at low speed (under 15 RPM). This slow churning absorbs friction heat to keep vital nutrients intact."
            />
            <ValueCard
              icon={<Eye className="size-6 text-primary" />}
              title="Transparency"
              description="From sourcing groundnuts and sesame seeds from native farmers to gravity sedimentation under natural sunlight—every step is honest and open."
            />
          </div>
        </section>

        {/* Process Teaser Section */}
        <section className="rounded-3xl border border-border bg-card p-8 text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">See How We Extract Our Oils</h2>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-lg mx-auto">
            Curious about traditional Vaagai wood mortars or how we use palm jaggery to enrich sesame oil? Read our detailed, step-by-step extraction guide.
          </p>
          <div className="pt-2">
            <Link href="/process" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              Our Extraction Process
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* CTA Shop section */}
        <section className="text-center space-y-6 pt-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Bring Heritage to Your Kitchen</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Experience the rich aroma, nutty flavor, and wholesome benefits of authentic wood-pressed oils.
          </p>
          <div>
            <Button size="lg" className="rounded-full gap-2 px-8" render={<Link href="/shop" />}>
              Shop Our Oils
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
      <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="space-y-1.5">
        <h3 className="font-serif text-base font-bold text-foreground">{title}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

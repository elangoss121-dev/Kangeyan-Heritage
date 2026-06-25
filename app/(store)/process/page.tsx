import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'
import { Check, X } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Process',
  description: 'Understand how our cold pressed oils are made. Learn about wooden mortar extraction, sun drying and chemical-free filtration.',
}

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Craftsmanship"
        title="The Art of Wood Pressing"
        description="A step-by-step walk through our time-honored oil extraction process. Slow, natural, and chemical free."
      />

      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16 space-y-14">
        {/* Steps Grid */}
        <section className="space-y-8">
          <h2 className="font-serif text-2xl font-bold text-foreground text-center">Step-by-Step Extraction</h2>
          
          <div className="relative border-l border-border/85 pl-6 ml-4 space-y-10">
            <ProcessStep
              number="01"
              title="Handpicking Raw Materials"
              description="We source groundnuts, sesame seeds, and coconuts directly from native local farms. We perform quality checks to ensure they are fully mature, plump, and free from infestation."
            />
            <ProcessStep
              number="02"
              title="Sun Drying the Copra &amp; Seeds"
              description="Our coconuts are split open and sun-dried naturally on dry concrete yards until they become premium copra. Groundnuts and sesame seeds are also thoroughly sun-dried to eliminate moisture without artificial heating."
            />
            <ProcessStep
              number="03"
              title="Slow Wood Churning (Marachekku)"
              description="We load the seeds into traditional Vaagai wood mortars (chekku). Heavy wooden logs crush the seeds slowly at 8 to 15 RPM. Keeping the rotational speed low ensures the temperature stays below 38°C, preventing thermal damage."
            />
            <ProcessStep
              number="04"
              title="Palm Jaggery Enrichment"
              description="For our sesame oil, we add authentic palm jaggery (Karuppatti) during the final stages of crushing. This traditional technique binds bitterness, introduces minerals, and adds a rich, sweet aroma."
            />
            <ProcessStep
              number="05"
              title="Natural Solar Sedimentation"
              description="Instead of using high-pressure mechanical filters or chemical bleaching agents, we transfer the freshly pressed oil into stainless steel containers. It rests in sunlight for 3 to 4 days, letting impurities settle naturally by gravity."
            />
          </div>
        </section>

        {/* Method Comparison Table */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-foreground text-center">Wooden Chekku vs. Industrial Refining</h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm text-foreground">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Feature</th>
                  <th className="p-4">Traditional Wood Churn (Vaagai)</th>
                  <th className="p-4">Modern Solvent Refineries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-4 font-semibold">Extraction Speed</td>
                  <td className="p-4 text-emerald-600 font-medium">8 - 15 RPM (Very Slow)</td>
                  <td className="p-4 text-destructive font-medium">High speed machinery</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Operating Heat</td>
                  <td className="p-4 text-emerald-600 font-medium">Ambient (keeps under 38°C)</td>
                  <td className="p-4 text-destructive font-medium">Exceeds 150°C - 200°C</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Solvent / Preservative</td>
                  <td className="p-4 flex items-center gap-1 text-emerald-600 font-medium">
                    <Check className="size-4" /> None (100% natural)
                  </td>
                  <td className="p-4 text-destructive font-medium">Uses Hexane, BHA, BHT</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Nutrients &amp; Vitamins</td>
                  <td className="p-4 text-emerald-600 font-medium">Fully Retained (Vitamin E, Lecithin)</td>
                  <td className="p-4 text-destructive font-medium">Stripped during refining</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Filtration</td>
                  <td className="p-4 text-emerald-600 font-medium">Sun sedimentation (Gravity)</td>
                  <td className="p-4 text-destructive font-medium">Acid wash &amp; chemical bleaching</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative">
      <div className="absolute -left-[37px] top-0.5 flex size-6 items-center justify-center rounded-full bg-primary font-sans text-[10px] font-bold text-primary-foreground">
        {number}
      </div>
      <h3 className="font-serif text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

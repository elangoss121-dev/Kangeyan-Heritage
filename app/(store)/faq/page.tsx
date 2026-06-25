import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers about cold pressed oils, organic jaggery, shipping timelines and returns.',
}

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="Help & Support"
        title="Frequently Asked Questions"
        description="Got queries about wood-pressed oils, organic jaggery, or our shipping? Find quick answers below."
      />

      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16 space-y-10">
        {/* Section: Oils */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-foreground border-b border-border/80 pb-2">Cold Pressed Oils</h2>
          <Accordion className="space-y-2">
            <AccordionItem value="what-is-cold-pressed">
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3">
                What does &quot;cold pressed&quot; or &quot;wood pressed&quot; mean?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                <p>
                  Cold pressed (or wood pressed / Marachekku) oil is extracted by crushing oil seeds slowly in a wooden mortar (Vaagai wood). No artificial heat or chemical solvents are introduced. Because of the low friction, temperatures remain under 38°C, retaining the natural antioxidants, vitamins, and natural nutty flavor.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sediments">
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3">
                Why is there sediment at the bottom of the bottle?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                <p>
                  Since we do not use high-pressure micro-filters or chemical clearing agents, tiny seed particles sink naturally to the bottom of the oil. This sediment is a proof of raw, unrefined purity and is completely safe to consume.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shelf-life">
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3">
                What is the shelf life of these oils?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                <p>
                  Our unrefined wood-pressed oils have a natural shelf life of 6 to 9 months. To keep them fresh, store them in a cool, dry place away from direct sunlight, and ensure the cap is tightly closed after use.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Section: Jaggery */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-foreground border-b border-border/80 pb-2">Organic Jaggery</h2>
          <Accordion className="space-y-2">
            <AccordionItem value="karuppatti-benefits">
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3">
                How is palm jaggery (Karuppatti) different from white sugar?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                <p>
                  Palm jaggery is made from the sap of palm trees. Unlike white sugar, which is heavily refined and contains empty calories, palm jaggery is loaded with iron, calcium, potassium, and magnesium. It has a lower glycemic index and is a staple in traditional wellness drinks.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="jaggery-chemicals">
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3">
                Do you add sodium hydrosulfite or bleaching agents?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                <p>
                  No. Mass-market jaggery is often bleached using chemicals to look bright yellow. Our organic jaggery powder and blocks are dark brown in color because they are made using traditional clarification methods (such as adding natural lime), with absolutely zero chemical bleaches.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Section: Delivery */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-foreground border-b border-border/80 pb-2">Shipping &amp; Support</h2>
          <Accordion className="space-y-2">
            <AccordionItem value="shipping-timeline">
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3">
                How long does shipping take?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                <p>
                  Orders within Tamil Nadu are delivered within 2 to 3 business days. For other states (Karnataka, Kerala, Maharashtra, Delhi, etc.), it typically takes 4 to 6 business days. You will receive an SMS and email notification with tracking links as soon as your order is shipped.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="leakage-guarantee">
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3">
                What happens if my bottle leaks during delivery?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                <p>
                  We use heavy-duty leak-proof bottles and cardboard boxes to wrap our orders. However, if transit damage occurs, simply take a photo of the leaked bottle and send it to our WhatsApp support at +91 98765 43210. We will dispatch a replacement bottle immediately at no extra cost.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </>
  )
}

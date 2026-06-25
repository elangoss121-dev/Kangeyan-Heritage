import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
        description="Got queries about our traditional wood-pressed oils, shipping, or certification? Find answers below."
      />

      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16 space-y-10">
        <Accordion className="space-y-2.5">
          <AccordionItem value="faq-1">
            <AccordionTrigger className="text-sm font-semibold text-foreground py-3.5">
              1. What is wood-pressed (chekku) oil?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              <p>
                Wood-pressed (or Marachekku) oil is cooking oil extracted using a traditional wooden mortar (usually Vaagai wood) and pestle. The wooden mechanism absorbs heat, keeping the oil-crushing process at a low temperature (below 38°C). This ensures that vital nutrients, natural aromas, and healthy fats are fully retained.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2">
            <AccordionTrigger className="text-sm font-semibold text-foreground py-3.5">
              2. How is your oil different from cold-pressed oils sold in supermarkets?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              <p>
                Many supermarket &quot;cold-pressed&quot; oils are processed in large metal expellers that generate high frictional heat, or are chemically treated afterward to clean their appearance. Our oils are purely wood-pressed, meaning they are extracted at low speeds in wooden mortar setups, left to settle naturally under sunlight, and packaged without any bleaching, refining, or chemical preservatives.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3">
            <AccordionTrigger className="text-sm font-semibold text-foreground py-3.5">
              3. What is the shelf life of your oils?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              <p>
                Our unrefined wood-pressed groundnut, coconut, and sesame oils have a natural shelf life of 6 to 9 months. Because they contain absolutely no chemical preservatives or stabilizers, we recommend using them fresh to enjoy their maximum aroma and health benefits.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4">
            <AccordionTrigger className="text-sm font-semibold text-foreground py-3.5">
              4. How should I store the oil?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              <p>
                Keep the bottles stored in a cool, dark, and dry place, away from direct sunlight and heat sources like cooktops. Always close the cap tightly after cooking to prevent contact with moisture and air, which can cause unrefined oils to oxidize.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-5">
            <AccordionTrigger className="text-sm font-semibold text-foreground py-3.5">
              5. Why is the oil slightly darker/cloudier than refined oil?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              <p>
                Refined oils undergo chemical bleaching and acid washing to look clear and uniform. Our wood-pressed oil is settled naturally under sunlight without heavy industrial filtration, leaving microscopic seed sediments in the bottle. This causes the oil to appear slightly darker and cloudier, which is a key indicator of its raw, unbleached purity.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-6">
            <AccordionTrigger className="text-sm font-semibold text-foreground py-3.5">
              6. Do you offer Cash on Delivery (COD)?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              <p>
                Yes, we offer Cash on Delivery (COD) for orders across India to make your purchasing experience convenient. You can choose the COD option at checkout, and pay in cash or via scanning a UPI code when the courier partner delivers the box.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-7">
            <AccordionTrigger className="text-sm font-semibold text-foreground py-3.5">
              7. How long does delivery take?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              <p>
                Deliveries within Tamil Nadu typically arrive within 2 to 3 business days. For shipments to other states, it usually takes between 4 to 6 business days depending on your location. You will receive a tracking link via SMS and email as soon as your box is dispatched.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-8">
            <AccordionTrigger className="text-sm font-semibold text-foreground py-3.5">
              8. What is your return/refund policy?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              <p>
                Due to the consumable nature of food items, we do not accept returns once a package is opened. However, if your bottle leaks or arrives damaged, simply take a photo and send it to our WhatsApp support within 24 hours. We will send a free replacement or issue a full refund immediately.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-9">
            <AccordionTrigger className="text-sm font-semibold text-foreground py-3.5">
              9. Is your oil FSSAI certified?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              <p>
                Yes, our oils and processing unit are fully certified by the Food Safety and Standards Authority of India (FSSAI). We maintain strict sanitation, traditional standards, and regular testing to ensure you receive the safest, highest-quality natural products.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-10">
            <AccordionTrigger className="text-sm font-semibold text-foreground py-3.5">
              10. Can I visit your unit in Tirupur?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              <p>
                Absolutely! We welcome customer visits to our wood-pressing facility located in Vellikovil, Tirupur district, Tamil Nadu. Please reach out to us in advance via WhatsApp so we can coordinate your visit and show you how our Vaagai wood chekku setup extracts oils in real time.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Still have questions CTA */}
        <div className="rounded-3xl border border-border bg-card p-6 text-center space-y-4">
          <h2 className="font-serif text-lg font-bold text-foreground">Still have questions?</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Get in touch with us directly! We are happy to help with bulk orders or questions about our traditional farm foods.
          </p>
          <div className="pt-1">
            <a
              href="https://wa.me/917845068989"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-600 px-6 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors gap-2"
            >
              <MessageSquare className="size-4" />
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

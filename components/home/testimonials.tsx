import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Lakshmi Narayanan',
    location: 'Chennai',
    text: 'The groundnut oil tastes exactly like what my grandmother used to make. Pure aroma and you can feel the difference in cooking.',
  },
  {
    name: 'Priya Subramaniam',
    location: 'Coimbatore',
    text: 'Switched to their coconut oil for both cooking and hair care. Quality is outstanding and delivery was quick.',
  },
  {
    name: 'Karthik Raja',
    location: 'Bengaluru',
    text: 'The palm jaggery sesame oil is a rare find. Authentic taste and completely chemical free. Highly recommend.',
  },
]

export function Testimonials() {
  return (
    <section className="bg-maroon text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-gold">
            Testimonials
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-balance sm:text-4xl">
            Trusted by Thousands of Families
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="flex flex-col rounded-2xl bg-white/5 p-6 ring-1 ring-white/10"
            >
              <Quote className="size-7 text-gold" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/85">
                {r.text}
              </p>
              <div className="mt-5">
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-white/60">{r.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

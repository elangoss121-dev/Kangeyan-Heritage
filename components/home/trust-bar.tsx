import { Truck, ShieldCheck, Leaf, Heart } from 'lucide-react'

const items = [
  { icon: Leaf, title: 'Chemical Free', desc: 'No additives or preservatives' },
  { icon: ShieldCheck, title: 'Wood Pressed', desc: 'Traditional chekku method' },
  { icon: Truck, title: 'Doorstep Delivery', desc: 'Free above ₹999' },
  { icon: Heart, title: 'FSSAI Certified', desc: 'Safe & quality assured' },
]

export function TrustBar() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3 bg-card px-4 py-5"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <item.icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

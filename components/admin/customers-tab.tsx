import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { User, Order } from '@/lib/types'

interface CustomersTabProps {
  customers: User[]
  orders: Order[]
}

export function CustomersTab({ customers, orders }: CustomersTabProps) {
  const [customerSearch, setCustomerSearch] = useState('')

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.phone && c.phone.includes(customerSearch))
  )

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search customer name, email..."
          className="pl-9"
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground text-xs uppercase">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Addresses</th>
                <th className="pb-3">Register Date</th>
                <th className="pb-3 text-center">Orders Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCustomers.map((cust) => {
                const count = orders.filter((o) => o.email === cust.email).length
                const dateString = cust.createdAt
                  ? new Date(cust.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                  : 'Pre-seeded'
                return (
                  <tr key={cust.email} className="hover:bg-accent/5 align-top">
                    <td className="py-4">
                      <p className="font-semibold text-foreground">{cust.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cust.role}</p>
                    </td>
                    <td className="py-4">
                      <p className="font-medium text-foreground">{cust.email}</p>
                      {cust.phone && <p className="text-xs text-muted-foreground mt-1">{cust.phone}</p>}
                    </td>
                    <td className="py-4 max-w-[280px]">
                      {!cust.addresses?.length ? (
                        <span className="text-xs text-muted-foreground italic">No addresses saved</span>
                      ) : (
                        <div className="space-y-2">
                          {cust.addresses.map((a, i) => (
                            <p key={i} className="text-xs text-muted-foreground border-l border-primary/20 pl-2 leading-relaxed">
                              <span className="font-medium text-foreground">{a.fullName}</span>: {a.line1}, {a.city} - {a.pincode}
                            </p>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-xs text-muted-foreground">{dateString}</td>
                    <td className="py-4 text-center font-bold text-foreground">{count}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatINR } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Order } from '@/lib/types'

interface OrdersTabProps {
  orders: Order[]
  onOrderStateChange: (orderNum: string, field: 'status' | 'paymentStatus', value: string) => Promise<void>
}

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed']

export function OrdersTab({ orders, onOrderStateChange }: OrdersTabProps) {
  const [orderSearch, setOrderSearch] = useState('')

  const filteredOrders = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.address.fullName.toLowerCase().includes(orderSearch.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search order number, email..."
          className="pl-9"
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground text-xs uppercase">
                <th className="pb-3">Order #</th>
                <th className="pb-3">Customer Info</th>
                <th className="pb-3">Delivery Address</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredOrders.map((ord) => (
                <tr key={ord.orderNumber} className="hover:bg-accent/5 align-top">
                  <td className="py-4 font-semibold">{ord.orderNumber}</td>
                  <td className="py-4 max-w-[200px]">
                    <p className="font-medium text-foreground">{ord.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ord.items.map((i) => `${i.name} (${i.size} × ${i.quantity})`).join(', ')}
                    </p>
                  </td>
                  <td className="py-4 text-xs text-muted-foreground leading-relaxed max-w-[220px]">
                    <span className="font-semibold text-foreground">{ord.address.fullName}</span> ({ord.address.phone})
                    <br />
                    {ord.address.line1}, {ord.address.city}, {ord.address.state} - {ord.address.pincode}
                  </td>
                  <td className="py-4">
                    <select
                      value={ord.status}
                      onChange={(e) => onOrderStateChange(ord.orderNumber, 'status', e.target.value)}
                      className="h-8 rounded-md border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring capitalize"
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col gap-1">
                      <select
                        value={ord.paymentStatus}
                        onChange={(e) => onOrderStateChange(ord.orderNumber, 'paymentStatus', e.target.value)}
                        className={cn(
                          'h-8 rounded-md border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring capitalize',
                          ord.paymentStatus === 'paid' && 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400',
                          ord.paymentStatus === 'failed' && 'text-destructive bg-destructive/5'
                        )}
                      >
                        {PAYMENT_STATUSES.map((pst) => (
                          <option key={pst} value={pst}>
                            {pst}
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-muted-foreground uppercase text-center">{ord.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right font-semibold">{formatINR(ord.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

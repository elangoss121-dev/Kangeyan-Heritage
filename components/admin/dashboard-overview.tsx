import { IndianRupee, ShoppingBag, Package, Users } from 'lucide-react'
import { MetricCard } from './metric-card'
import { formatINR } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Order } from '@/lib/types'

interface DashboardOverviewProps {
  totalSales: number
  ordersCount: number
  pendingOrders: number
  productsCount: number
  outOfStockProducts: number
  customersCount: number
  recentOrders: Order[]
}

export function DashboardOverview({
  totalSales,
  ordersCount,
  pendingOrders,
  productsCount,
  outOfStockProducts,
  customersCount,
  recentOrders,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Metrics cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={formatINR(totalSales)}
          icon={<IndianRupee className="size-5 text-emerald-600" />}
        />
        <MetricCard
          title="Total Orders"
          value={ordersCount}
          subtext={`${pendingOrders} processing`}
          icon={<ShoppingBag className="size-5 text-primary" />}
        />
        <MetricCard
          title="Products"
          value={productsCount}
          subtext={`${outOfStockProducts} out of stock`}
          icon={<Package className="size-5 text-indigo-600" />}
        />
        <MetricCard
          title="Customers"
          value={customersCount}
          icon={<Users className="size-5 text-amber-600" />}
        />
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-lg font-bold text-foreground mb-4">Recent Sales</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground text-xs uppercase">
                <th className="pb-3">Order #</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {recentOrders.slice(0, 5).map((ord) => (
                <tr key={ord.orderNumber} className="hover:bg-accent/5">
                  <td className="py-3.5 font-medium">{ord.orderNumber}</td>
                  <td className="py-3.5 text-muted-foreground">{ord.email}</td>
                  <td className="py-3.5 capitalize">
                    <span className="inline-block rounded-full bg-accent px-2 py-0.5 text-xs text-foreground font-semibold">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 capitalize">
                    <span
                      className={cn(
                        'inline-block rounded-full px-2 py-0.5 text-xs font-semibold',
                        ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-semibold">{formatINR(ord.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'

export function MetricCard({
  title,
  value,
  subtext,
  icon,
}: {
  title: string
  value: string | number | ReactNode
  subtext?: string
  icon?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        <p className="font-serif text-2xl font-bold text-foreground leading-none pt-0.5">{value}</p>
        {subtext && <p className="text-[10px] text-muted-foreground pt-0.5">{subtext}</p>}
      </div>
      {icon && (
        <div className="size-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
    </div>
  )
}

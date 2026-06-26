export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category chips placeholder */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-secondary" />
          ))}
        </div>
        {/* Sort select placeholder */}
        <div className="h-8 w-[180px] animate-pulse rounded-md bg-secondary sm:ml-auto" />
      </div>

      {/* Product cards grid placeholder */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col rounded-2xl border border-border bg-card p-4 space-y-4">
            <div className="relative aspect-square w-full animate-pulse rounded-xl bg-secondary" />
            <div className="space-y-2">
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-secondary" />
              <div className="h-3 w-1/3 animate-pulse rounded-md bg-secondary" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 w-1/4 animate-pulse rounded-md bg-secondary" />
              <div className="h-8 w-1/3 animate-pulse rounded-full bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

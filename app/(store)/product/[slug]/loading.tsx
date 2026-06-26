export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Breadcrumb skeleton */}
      <div className="flex h-5 w-64 animate-pulse rounded-md bg-secondary mb-8" />

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery skeleton */}
        <div className="flex flex-col md:flex-row-reverse gap-4 md:items-start">
          <div className="relative flex-1 aspect-square animate-pulse rounded-3xl bg-secondary" />
          <div className="flex flex-row md:flex-col gap-3 shrink-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="size-20 animate-pulse rounded-xl bg-secondary" />
            ))}
          </div>
        </div>

        {/* Product info skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded-md bg-secondary" />
            <div className="h-10 w-2/3 animate-pulse rounded-md bg-secondary" />
            <div className="h-6 w-1/3 animate-pulse rounded-md bg-secondary" />
          </div>

          <div className="h-5 w-48 animate-pulse rounded-md bg-secondary" />
          <div className="h-20 w-full animate-pulse rounded-md bg-secondary" />

          {/* Price skeleton */}
          <div className="h-10 w-36 animate-pulse rounded-md bg-secondary" />

          {/* Size picker skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-12 animate-pulse rounded-md bg-secondary" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-9 w-20 animate-pulse rounded-lg bg-secondary" />
              ))}
            </div>
          </div>

          {/* Add-to-cart controls skeleton */}
          <div className="flex gap-3 pt-4">
            <div className="h-10 w-24 animate-pulse rounded-lg bg-secondary" />
            <div className="h-10 flex-1 animate-pulse rounded-full bg-secondary" />
            <div className="h-10 flex-1 animate-pulse rounded-full bg-secondary" />
          </div>
        </div>
      </div>
    </div>
  )
}

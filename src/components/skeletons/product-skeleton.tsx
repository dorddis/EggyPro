import { Skeleton } from '@/components/ui/skeleton';

export function ProductSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 md:mb-8">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <Skeleton className="w-full h-96 md:h-[500px] rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-20 rounded-md" />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Product Title and Price */}
          <div>
            <Skeleton className="h-8 md:h-10 w-3/4 mb-3" />
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Quantity Controls */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-24" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-10 rounded" />
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Product Description */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Product Features */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 md:mt-16">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg p-4 md:p-6">
              <div className="flex items-start gap-4 mb-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-1/3 mb-1" />
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Skeleton key={star} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
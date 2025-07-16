import { Skeleton } from '@/components/ui/skeleton';

export function CartSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 md:mb-8">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-12" />
      </nav>

      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <Skeleton className="h-8 md:h-10 lg:h-12 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-lg">
            <div className="p-4 md:p-6 border-b">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="p-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 md:p-6 border-b last:border-b-0">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-md" />
                    
                    {/* Product Details */}
                    <div className="flex-grow min-w-0">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/3 mb-3" />
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-4 w-8" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <Skeleton className="h-5 w-16 mb-2" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-lg p-4 md:p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            
            <Skeleton className="h-12 w-full mb-3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
} 
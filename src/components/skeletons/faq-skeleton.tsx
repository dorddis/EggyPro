import { Skeleton } from '@/components/ui/skeleton';

export function FaqSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Page Header */}
      <div className="text-center mb-8 md:mb-12">
        <Skeleton className="h-8 md:h-10 lg:h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 md:h-6 w-2/3 mx-auto" />
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-card rounded-lg border">
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-5" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant Interface */}
      <div className="mt-8 md:mt-12">
        <Skeleton className="h-6 w-48 mx-auto mb-6" />
        <div className="bg-card rounded-lg border p-4 md:p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
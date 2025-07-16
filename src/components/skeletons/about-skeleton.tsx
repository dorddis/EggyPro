import { Skeleton } from '@/components/ui/skeleton';

export function AboutSkeleton() {
  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hero Section */}
      <section className="text-center py-8 md:py-10 bg-gradient-to-b from-primary/10 to-background rounded-lg">
        <Skeleton className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4" />
        <Skeleton className="h-8 md:h-10 lg:h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-4 md:h-6 w-2/3 mx-auto" />
      </section>

      {/* Two-column layout */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
        <div>
          <Skeleton className="h-6 md:h-8 lg:h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-xl order-first md:order-last">
          <Skeleton className="w-full h-full" />
        </div>
      </section>

      {/* Values Grid */}
      <section>
        <Skeleton className="h-8 md:h-10 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-lg shadow-md">
              <div className="p-4 md:p-6 text-center">
                <Skeleton className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-3" />
                <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-action */}
      <section className="text-center py-8 md:py-10 bg-secondary rounded-lg">
        <Skeleton className="h-8 md:h-10 w-80 mx-auto mb-4" />
        <Skeleton className="h-4 md:h-6 w-2/3 mx-auto" />
      </section>
    </div>
  );
} 
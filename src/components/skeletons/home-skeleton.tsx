import { Skeleton } from '@/components/ui/skeleton';

export function HomeSkeleton() {
  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section className="text-center py-8 md:py-12 bg-gradient-to-br from-primary/20 via-background to-background rounded-xl">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 md:h-10 lg:h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-4 md:h-6 w-2/3 mx-auto mb-6" />
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <Skeleton className="h-8 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 md:p-6 bg-card rounded-lg shadow-md">
              <Skeleton className="h-12 w-12 mx-auto mb-4" />
              <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section>
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded-lg overflow-hidden shadow-lg">
              <Skeleton className="h-48 md:h-64 w-full" />
              <div className="p-4 md:p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-5 w-1/3 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <Skeleton className="h-8 w-80 mx-auto mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded-lg p-4 md:p-6 shadow-md">
              <div className="flex items-start gap-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </section>

      {/* About Us Teaser */}
      <section className="text-center py-8 md:py-12 bg-secondary rounded-xl">
        <Skeleton className="h-8 w-80 mx-auto mb-4" />
        <Skeleton className="h-4 w-2/3 mx-auto mb-6" />
        <Skeleton className="h-12 w-48 mx-auto" />
      </section>

      {/* FAQ Teaser Section */}
      <section className="text-center">
        <Skeleton className="h-12 w-12 mx-auto mb-4" />
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-2/3 mx-auto mb-6" />
        <Skeleton className="h-12 w-48 mx-auto" />
      </section>
    </div>
  );
} 
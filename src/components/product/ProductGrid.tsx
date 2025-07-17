'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { AlertCircle, Package } from 'lucide-react';
import { EqualHeightGrid } from '@/components/ui/equal-height-grid';
import type { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({ 
  products, 
  loading = false, 
  error = null,
  columns = 3 
}: ProductGridProps) {
  const [displayCount, setDisplayCount] = useState(12);

  if (loading) {
    return (
      <EqualHeightGrid
        columns={columns}
        gap="gap-6"
        className="w-full"
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-96 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </EqualHeightGrid>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to Load Products
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search criteria or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  const displayedProducts = products.slice(0, displayCount);
  const hasMore = products.length > displayCount;

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <EqualHeightGrid
        columns={columns}
        gap="gap-6"
        className="w-full"
      >
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </EqualHeightGrid>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <Button 
            onClick={() => setDisplayCount(prev => prev + 6)}
            variant="outline"
            size="lg"
          >
            Load More Products ({products.length - displayCount} remaining)
          </Button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {displayedProducts.length} of {products.length} products
      </div>
    </div>
  );
}
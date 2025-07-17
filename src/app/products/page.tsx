import { fetchProducts } from '@/lib/api';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import { PageWrapper } from '@/components/ui/page-wrapper';
import { Suspense } from 'react';
import type { Product } from '@/lib/types';

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  
  let products: Product[] = [];
  let error: string | null = null;
  
  try {
    // For now, fetch all products and filter client-side
    // Later we can enhance this to use the search API
    const allProducts = await fetchProducts();
    products = allProducts;
    
    // Apply client-side filtering based on search params
    if (params.q) {
      const query = params.q.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    if (params.minPrice) {
      const minPrice = parseFloat(params.minPrice);
      products = products.filter(product => parseFloat(product.price.toString()) >= minPrice);
    }
    
    if (params.maxPrice) {
      const maxPrice = parseFloat(params.maxPrice);
      products = products.filter(product => parseFloat(product.price.toString()) <= maxPrice);
    }
    
    if (params.inStock === 'true') {
      products = products.filter(product => product.stock_quantity > 0);
    }
    
    // Apply sorting
    if (params.sort) {
      switch (params.sort) {
        case 'price-asc':
          products.sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()));
          break;
        case 'price-desc':
          products.sort((a, b) => parseFloat(b.price.toString()) - parseFloat(a.price.toString()));
          break;
        case 'name-asc':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
          break;
      }
    }
    
  } catch (err) {
    console.error('Error loading products:', err);
    error = 'Failed to load products. Please try again later.';
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our complete range of premium egg-based protein supplements. 
            Each product is carefully crafted to support your fitness journey.
          </p>
        </div>

        {/* Filters and Search */}
        <Suspense fallback={<div className="h-20 bg-gray-100 rounded-lg animate-pulse" />}>
          <ProductFilters 
            totalProducts={products.length}
            currentFilters={{
              q: params.q,
              minPrice: params.minPrice,
              maxPrice: params.maxPrice,
              sort: params.sort,
              inStock: params.inStock
            }}
          />
        </Suspense>

        {/* Products Grid */}
        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>}>
          <ProductGrid 
            products={products} 
            error={error}
            loading={false}
          />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
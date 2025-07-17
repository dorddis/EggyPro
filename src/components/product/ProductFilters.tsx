'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductFiltersProps {
  totalProducts: number;
  currentFilters: {
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
  };
}

export default function ProductFilters({ totalProducts, currentFilters }: ProductFiltersProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  
  // Form state
  const [searchQuery, setSearchQuery] = useState(currentFilters.q || '');
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || '');
  const [sortBy, setSortBy] = useState(currentFilters.sort || 'default');
  const [inStockOnly, setInStockOnly] = useState(currentFilters.inStock === 'true');

  // Update URL with new filters
  const updateFilters = () => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy && sortBy !== 'default') params.set('sort', sortBy);
    if (inStockOnly) params.set('inStock', 'true');
    
    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ''}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('default');
    setInStockOnly(false);
    router.push('/products');
  };

  // Count active filters
  const activeFiltersCount = [
    currentFilters.q,
    currentFilters.minPrice,
    currentFilters.maxPrice,
    currentFilters.sort,
    currentFilters.inStock
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateFilters()}
            className="pl-10"
          />
        </div>

        {/* Quick Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full sm:w-auto"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Apply Filters Button */}
        <Button onClick={updateFilters} className="w-full sm:w-auto">
          Apply
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
              </span>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Price Range</Label>
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <span className="text-muted-foreground">to</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Stock Filter */}
            <div className="flex items-center justify-between">
              <Label htmlFor="in-stock" className="text-sm font-medium">
                In Stock Only
              </Label>
              <Switch
                id="in-stock"
                checked={inStockOnly}
                onCheckedChange={setInStockOnly}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {currentFilters.q && (
            <Badge variant="secondary">
              Search: &quot;{currentFilters.q}&quot;
            </Badge>
          )}
          {currentFilters.minPrice && (
            <Badge variant="secondary">
              Min: ${currentFilters.minPrice}
            </Badge>
          )}
          {currentFilters.maxPrice && (
            <Badge variant="secondary">
              Max: ${currentFilters.maxPrice}
            </Badge>
          )}
          {currentFilters.sort && (
            <Badge variant="secondary">
              Sort: {currentFilters.sort.replace('-', ' ')}
            </Badge>
          )}
          {currentFilters.inStock === 'true' && (
            <Badge variant="secondary">
              In Stock Only
            </Badge>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        {totalProducts === 1 ? '1 product found' : `${totalProducts} products found`}
      </div>
    </div>
  );
}
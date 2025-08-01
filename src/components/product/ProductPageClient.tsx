'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import ReviewList from '@/components/product/ReviewList';
import QuantitySelector from '@/components/product/QuantitySelector';
import AddToCartButton from '@/components/product/AddToCartButton';
import BuyNowButton from '@/components/product/BuyNowButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Info, DollarSign, AlertTriangle } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { EqualHeightGrid } from '@/components/ui/equal-height-grid';
import { PageWrapper } from '@/components/ui/page-wrapper';
import { ProductSkeleton } from '@/components/skeletons/product-skeleton';
import { PriceUtils } from '@/lib/price-utils';

import type { Review } from '@/lib/types';

interface ProductPageClientProps {
  product: Product;
  productReviews: Review[];
  relatedProducts: Product[];
}

// Stock status component
const StockStatus = ({ stockQuantity }: { stockQuantity: number }) => {
  if (stockQuantity === 0) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm font-medium">Out of Stock</span>
      </div>
    );
  }
  
  if (stockQuantity <= 5) {
    return (
      <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg">
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm font-medium">Only {stockQuantity} left</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
      <CheckCircle className="h-5 w-5" />
      <span className="text-sm font-medium">In Stock</span>
    </div>
  );
};

export default function ProductPageClient({ 
  product, 
  productReviews, 
  relatedProducts 
}: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [previousTotal, setPreviousTotal] = useState(PriceUtils.getNumericPrice(product.price));
  const [slideDirection, setSlideDirection] = useState<'top' | 'bottom'>('bottom');

  const totalPrice = PriceUtils.getNumericPrice(product.price) * quantity;
  const isOutOfStock = product.stock_quantity === 0;

  useEffect(() => {
    if (totalPrice !== previousTotal) {
      setSlideDirection(totalPrice > previousTotal ? 'top' : 'bottom');
      setPreviousTotal(totalPrice);
    }
  }, [totalPrice, previousTotal]);

  // Reset quantity if it exceeds stock
  useEffect(() => {
    if (quantity > product.stock_quantity && product.stock_quantity > 0) {
      setQuantity(product.stock_quantity);
    }
  }, [quantity, product.stock_quantity]);

  return (
    <PageWrapper skeleton={<ProductSkeleton />}>
      <div className="space-y-8 md:space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Product Image Gallery */}
          <Card className="shadow-xl">
            <CardContent className="p-3 md:p-4">
              <Image
                src={product.images[0] || 'https://placehold.co/600x600.png'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-auto object-contain rounded-lg max-h-[400px] md:max-h-none"
                priority // Prioritize loading for LCP
                data-ai-hint="protein powder package"
              />
              {/* TODO: Add carousel for multiple images if available */}
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight">{product.name}</h1>
            <p className="text-xl md:text-2xl font-semibold text-accent">{PriceUtils.formatPrice(product.price)}</p>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed">{product.description}</p>
            
            {/* Stock Status */}
            <StockStatus stockQuantity={product.stock_quantity} />
            
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="space-y-3">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity:
                </label>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  max={product.stock_quantity}
                  disabled={isOutOfStock}
                />
              </div>
            )}

            {/* Total Price Display */}
            {!isOutOfStock && (
              <div className="flex items-center gap-2 p-3 md:p-4 bg-secondary/30 rounded-lg border border-border/50">
                <DollarSign className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Total for {quantity} {quantity === 1 ? 'item' : 'items'}:</p>
                  <p 
                    key={totalPrice}
                    className={`text-xl md:text-2xl font-bold text-primary transition-all duration-300 ease-out animate-in fade-in-0 ${
                      slideDirection === 'top' ? 'slide-in-from-top-2' : 'slide-in-from-bottom-2'
                    }`}
                  >
                    {PriceUtils.formatPrice(totalPrice)}
                  </p>
                </div>
                {quantity > 1 && (
                  <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded animate-in fade-in-0 slide-in-from-bottom-2">
                    {PriceUtils.formatPrice(product.price)} each
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <AddToCartButton
                product={product}
                quantity={quantity}
                disabled={isOutOfStock}
                className="w-full sm:flex-1"
              />
              <BuyNowButton
                product={product}
                quantity={quantity}
                disabled={isOutOfStock}
                className="w-full sm:flex-1"
              />
            </div>

            <Card className="bg-secondary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <CheckCircle className="h-6 w-6 text-accent" /> Key Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-foreground/90">
                  <li>High-Quality Egg Protein</li>
                  <li>Supports Muscle Growth & Recovery</li>
                  <li>Sustainably Sourced</li>
                  <li>Excellent Mixability</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Product Information Tabs/Accordion (Ingredients, Details) */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Detailed Description</h3>
                <p className="text-sm md:text-base text-foreground/80 whitespace-pre-line leading-relaxed">{product.details}</p>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Ingredients</h3>
                <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-foreground/80">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Customer Reviews Section */}
        <section>
          <ReviewList reviews={productReviews} />
          {/* TODO: Add Review Submission Form */}
          {/* <Card className="mt-8">
            <CardHeader><CardTitle>Leave a Review</CardTitle></CardHeader>
            <CardContent> <p className="text-muted-foreground">Review submission form coming soon!</p> </CardContent>
          </Card> */}
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-10 px-4">You Might Also Like</h2>
            <EqualHeightGrid
              columns={2}
              gap="gap-6 md:gap-8"
              className="w-full"
            >
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </EqualHeightGrid>
          </section>
        )}
      </div>
    </PageWrapper>
  );
}
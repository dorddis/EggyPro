'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import ReviewList from '@/components/product/ReviewList';
import QuantitySelector from '@/components/product/QuantitySelector';
import AddToCartButton from '@/components/product/AddToCartButton';
import BuyNowButton from '@/components/product/BuyNowButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Info, DollarSign } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { PageWrapper } from '@/components/ui/page-wrapper';
import { ProductSkeleton } from '@/components/skeletons/product-skeleton';

interface ProductPageClientProps {
  product: Product;
  productReviews: any[];
  relatedProducts: Product[];
}

export default function ProductPageClient({ 
  product, 
  productReviews, 
  relatedProducts 
}: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [previousTotal, setPreviousTotal] = useState(product.price);
  const [slideDirection, setSlideDirection] = useState<'top' | 'bottom'>('bottom');

  const totalPrice = product.price * quantity;

  useEffect(() => {
    if (totalPrice !== previousTotal) {
      setSlideDirection(totalPrice > previousTotal ? 'top' : 'bottom');
      setPreviousTotal(totalPrice);
    }
  }, [totalPrice, previousTotal]);

  return (
    <PageWrapper skeleton={<ProductSkeleton />}>
      <div className="space-y-8 md:space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Product Image Gallery */}
          <Card className="shadow-xl">
            <CardContent className="p-3 md:p-4">
              <Image
                src={product.imageUrl}
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
            <p className="text-xl md:text-2xl font-semibold text-accent">${product.price.toFixed(2)}</p>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed">{product.description}</p>
            
            {/* Quantity Selector */}
            <div className="space-y-3">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity:
              </label>
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
            </div>

            {/* Total Price Display */}
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
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
              {quantity > 1 && (
                <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded animate-in fade-in-0 slide-in-from-bottom-2">
                  ${product.price.toFixed(2)} each
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <AddToCartButton
                product={product}
                quantity={quantity}
                className="w-full sm:flex-1"
              />
              <BuyNowButton
                product={product}
                quantity={quantity}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageWrapper>
  );
}
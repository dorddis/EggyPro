'use client';

import { useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ArrowRight, Home, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PageWrapper } from '@/components/ui/page-wrapper';
import { CartSkeleton } from '@/components/skeletons/cart-skeleton';

export default function CartPage() {
  const { items, totalPrice, clearCart, updateQuantity, markItemDeleting, completeItemDeletion, canUndo, undoDelete, clearUndo } = useCart();

  // Auto-clear undo after 5 seconds
  useEffect(() => {
    if (canUndo) {
      const timer = setTimeout(() => {
        clearUndo();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [canUndo, clearUndo]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemove = (itemId: string) => {
    // Start delete animation
    markItemDeleting(itemId);
    
    // Complete deletion after animation completes
    setTimeout(() => {
      completeItemDeletion(itemId);
    }, 300);
  };

  // Check if cart is empty AND no undo is available
  if (items.length === 0 && !canUndo) {
    return (
      <PageWrapper skeleton={<CartSkeleton />}>
        <div className="max-w-2xl mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 md:mb-8">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Cart</span>
          </nav>

          {/* Empty Cart State */}
          <div className="text-center py-12 md:py-16">
            <ShoppingBag className="h-16 w-16 md:h-20 md:w-20 mx-auto text-muted-foreground mb-4 md:mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Your cart is empty</h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any products to your cart yet. Start shopping to fill it up!
            </p>
            <Button size="lg" asChild className="w-full sm:w-auto min-h-[48px]">
              <Link href="/product/eggypro-original">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper skeleton={<CartSkeleton />}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 md:mb-8">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Cart</span>
        </nav>

        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">
            Shopping Cart
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {/* Undo notification */}
        {canUndo && (
          <div className="mb-4 p-4 bg-muted/50 border border-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-foreground" />
                <span className="text-sm font-medium text-foreground">Item removed from cart</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={undoDelete}
                className="text-xs bg-foreground text-background hover:bg-foreground/90"
              >
                Undo
              </Button>
            </div>
          </div>
        )}

        {/* Show cart content or empty state with undo option */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Cart Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {items.map((item, index) => (
                    <div key={item.id}>
                      <div className={`p-4 md:p-6 transition-all duration-300 ease-out ${
                        item.isDeleting === true ? 'animate-out fade-out-0 slide-out-to-top-2' : 'animate-in fade-in-0 slide-in-from-bottom-2'
                      }`}>
                        <div className="flex items-center gap-4">
                          {/* Product Image */}
                          <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                              sizes="(max-width: 768px) 64px, 80px"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-grow min-w-0">
                            <Link 
                              href={`/product/${item.slug}`}
                              className="font-semibold text-base md:text-lg hover:text-primary transition-colors block mb-1"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm md:text-base text-muted-foreground mb-3">
                              ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)} each
                            </p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => item.quantity <= 1 ? handleRemove(item.id) : handleQuantityChange(item.id, item.quantity - 1)}
                                  className="h-8 w-8 transition-all duration-200 ease-out hover:scale-110 active:scale-95 hover:shadow-sm"
                                  aria-label={item.quantity <= 1 ? "Remove item" : "Decrease quantity"}
                                >
                                  <Minus className="h-4 w-4 transition-transform duration-200 ease-out" />
                                </Button>
                                
                                <span className="text-sm font-medium min-w-[2rem] text-center transition-all duration-200 ease-out">
                                  {item.quantity}
                                </span>
                                
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= 99}
                                  className="h-8 w-8 transition-all duration-200 ease-out hover:scale-110 active:scale-95 hover:shadow-sm"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-4 w-4 transition-transform duration-200 ease-out" />
                                </Button>
                              </div>
                              
                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemove(item.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                                aria-label={`Remove ${item.name} from cart. It will delete current item(s).`}
                                title="Remove item from cart"
                              >
                                <Trash2 className="h-5 w-5 transition-transform hover:scale-110 hover:rotate-12" />
                              </Button>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="font-semibold text-base md:text-lg text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < items.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <Button asChild className="w-full h-12 text-base font-semibold">
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      By proceeding to checkout, you agree to our{' '}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                    className="w-full"
                  >
                    Clear Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </PageWrapper>
  );
}
'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, X, ArrowRight } from 'lucide-react';
import CartItem from './CartItem';
import Link from 'next/link';
import { useEffect } from 'react';

const CartSidebar = () => {
  const { items, totalPrice, isOpen, toggleCart, canUndo, undoDelete, clearUndo } = useCart();

  // Auto-clear undo after 5 seconds
  useEffect(() => {
    if (canUndo) {
      const timer = setTimeout(() => {
        clearUndo();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [canUndo, clearUndo]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        toggleCart();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, toggleCart]);

  const handleCheckoutClick = () => {
    toggleCart();
  };

  const handleSidebarClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={toggleCart}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <div 
        className="fixed inset-y-0 right-0 w-full sm:w-96 max-w-full sm:max-w-md bg-background border-l shadow-xl z-50 flex flex-col"
        onClick={handleSidebarClick}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({items.length})
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Undo notification */}
        {canUndo && (
          <div className="p-4 border-b border-accent/20">
            <div className="p-3 bg-accent/50 border border-accent rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm text-accent-foreground">Item removed from cart</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={undoDelete}
                  className="text-xs h-6 px-2 hover:bg-accent/70"
                >
                  Undo
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Add some products to get started</p>
              <Button 
                onClick={toggleCart} 
                className="w-full"
                asChild
              >
                <Link href="/product/eggypro-original">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="p-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            
            <Button 
              className="w-full"
              size="lg"
              asChild
            >
              <Link href="/checkout" onClick={handleCheckoutClick}>
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
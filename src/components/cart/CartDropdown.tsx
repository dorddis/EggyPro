'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import CartItem from './CartItem';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const CartDropdown = () => {
  const { items, totalPrice, isOpen, toggleCart, canUndo, undoDelete, clearUndo } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-clear undo after 5 seconds
  useEffect(() => {
    if (canUndo) {
      const timer = setTimeout(() => {
        clearUndo();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [canUndo, clearUndo]);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      // Small delay to allow exit animation to complete
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    let isMouseDownInside = false;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if mouse down is inside the dropdown
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        isMouseDownInside = true;
      } else {
        isMouseDownInside = false;
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // If mouse down was inside, don't close on click
      if (isMouseDownInside) {
        return;
      }
      
      // Check if the click target is outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        // Additional check: make sure we're not clicking on the cart icon itself
        const cartIcon = document.querySelector('[data-cart-icon]');
        if (cartIcon && cartIcon.contains(target)) {
          return; // Don't close if clicking on cart icon
        }
        
        if (isOpen) {
          toggleCart();
        }
      }
    };

    if (isOpen) {
      // Use a small delay to prevent immediate closing
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('click', handleClick);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('click', handleClick);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('click', handleClick);
    };
  }, [isOpen, toggleCart]);

  // Close dropdown on escape key
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

  const handleViewCartClick = () => {
    toggleCart();
  };

  const handleCheckoutClick = () => {
    toggleCart();
  };

  // Don't render if not open and not animating
  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] z-50 transition-all duration-200 ease-out overflow-hidden ${
        isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
      }`}
      ref={dropdownRef}
    >
      <Card className={`shadow-xl border-2 transition-all duration-200 ease-out ${
        isOpen 
          ? 'shadow-2xl' 
          : 'shadow-lg'
      }`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({items.length})
          </CardTitle>
        </CardHeader>
        
        {/* Undo notification */}
        {canUndo && (
          <div className="px-4 pb-3">
            <div className="p-3 bg-muted/50 border border-muted rounded-md animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground font-medium">Item removed from cart</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={undoDelete}
                  className="text-xs h-6 px-2 bg-foreground text-background hover:bg-foreground/90"
                >
                  Undo
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <CardContent className="p-0 overflow-hidden">
          {items.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button 
                onClick={toggleCart} 
                className="w-full"
                asChild
              >
                <Link href="/product/eggypro-original">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-hidden overflow-x-hidden">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-in slide-in-from-right-2"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationDuration: '300ms',
                    animationFillMode: 'both'
                  }}
                >
                  <CartItem item={item} />
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {items.length > 0 && (
          <CardFooter className="flex flex-col gap-3 pt-4 border-t animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center w-full">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                asChild
              >
                <Link href="/cart" onClick={handleViewCartClick}>View Cart</Link>
              </Button>
              <Button 
                className="flex-1"
                asChild
              >
                <Link href="/checkout" onClick={handleCheckoutClick}>
                  Checkout <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default CartDropdown;
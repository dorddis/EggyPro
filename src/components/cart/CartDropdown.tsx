'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import CartItem from './CartItem';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const CartDropdown = () => {
  const { items, totalPrice, isOpen, toggleCart, canUndo, undoDelete, clearUndo } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-clear undo after 5 seconds
  useEffect(() => {
    if (canUndo) {
      const timer = setTimeout(() => {
        clearUndo();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [canUndo, clearUndo]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
          toggleCart();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
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

  const handleDropdownClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] z-50" 
      ref={dropdownRef}
      onClick={handleDropdownClick}
    >
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({items.length})
          </CardTitle>
        </CardHeader>
        
        {/* Undo notification */}
        {canUndo && (
          <div className="px-4 pb-3">
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
        
        <CardContent className="p-0">
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
            <div className="max-h-64 overflow-y-auto">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>

        {items.length > 0 && (
          <CardFooter className="flex flex-col gap-3 pt-4 border-t">
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
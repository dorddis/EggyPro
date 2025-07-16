import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { formatCartBadgeCount } from '@/lib/cart-utils';
import CartPopup from './CartPopup';

const CartIcon = () => {
  const { totalItems, toggleCart } = useCart();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCart}
        className="relative h-9 w-9 md:h-10 md:w-10 transition-all duration-200 ease-out hover:scale-110 hover:shadow-md"
        aria-label={`Shopping cart, ${totalItems} items`}
      >
        <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-200 ease-out hover:rotate-12" />
        <span 
          className={`absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 transition-all duration-300 ease-bounce ${
            totalItems > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
          aria-hidden={totalItems === 0}
        >
          {formatCartBadgeCount(totalItems)}
        </span>
      </Button>
      
      {/* Unified Cart Popup - Responsive */}
      <CartPopup />
    </div>
  );
};

export default CartIcon;
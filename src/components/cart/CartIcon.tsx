import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { formatCartBadgeCount } from '@/lib/cart-utils';
import CartPopup from './CartPopup';
import Link from 'next/link';

const CartIcon = () => {
  const { totalItems, toggleCart } = useCart();

  const handleCartClick = () => {
    // On mobile, navigate to cart page directly
    // On desktop, toggle the cart popup
    if (window.innerWidth < 768) {
      // Mobile: navigate to cart page
      window.location.href = '/cart';
    } else {
      // Desktop: toggle cart popup
      toggleCart();
    }
  };

  return (
    <div className="relative">
      {/* Mobile: Link to cart page */}
      <Link href="/cart" className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 md:h-10 md:w-10 transition-all duration-200 ease-out hover:scale-110 hover:shadow-md"
          aria-label={`Shopping cart, ${totalItems} items`}
          data-cart-icon
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
      </Link>

      {/* Desktop: Button with popup */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCartClick}
        className="relative h-9 w-9 md:h-10 md:w-10 transition-all duration-200 ease-out hover:scale-110 hover:shadow-md hidden md:flex"
        aria-label={`Shopping cart, ${totalItems} items`}
        data-cart-icon
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
      
      {/* Desktop Cart Popup */}
      <div className="hidden md:block">
        <CartPopup />
      </div>
    </div>
  );
};

export default CartIcon;
'use client';

import { useCart } from '@/hooks/use-cart';
import CartDropdown from './CartDropdown';
import CartSidebar from './CartSidebar';

const CartPopup = () => {
  const { isOpen } = useCart();

  if (!isOpen) return null;

  // Render both components and use CSS classes to control visibility
  // This prevents hydration mismatch by ensuring server and client render the same structure
  return (
    <>
      {/* Mobile/Tablet Sidebar - hidden on desktop */}
      <div className="md:hidden">
        <CartSidebar />
      </div>
      
      {/* Desktop Dropdown - hidden on mobile/tablet */}
      <div className="hidden md:block">
        <CartDropdown />
      </div>
    </>
  );
};

export default CartPopup;
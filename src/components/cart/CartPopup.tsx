'use client';

import { useCart } from '@/hooks/use-cart';
import CartDropdown from './CartDropdown';

const CartPopup = () => {
  const { isOpen } = useCart();

  if (!isOpen) return null;

  return <CartDropdown />;
};

export default CartPopup;
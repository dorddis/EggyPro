import type { CartItem } from './cart-types';
import { PriceUtils } from './price-utils';

export function calculateCartTotal(items: CartItem[]): number {
  const cartItems = items.map(item => ({
    price: item.price,
    quantity: item.quantity
  }));
  
  const total = PriceUtils.calculateTotal(cartItems);
  return total.numeric;
}

export function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function formatCartBadgeCount(count: number): string {
  return count > 9 ? '9+' : count.toString();
}

export function generateCartItemId(productId: string): string {
  return `cart-item-${productId}-${Date.now()}`;
}

export function validateQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;
}

export function findCartItem(items: CartItem[], productId: string): CartItem | undefined {
  return items.find(item => item.productId === productId);
}

export function updateCartItemQuantity(items: CartItem[], itemId: string, quantity: number): CartItem[] {
  return items.map(item => 
    item.id === itemId ? { ...item, quantity } : item
  );
}

export function removeCartItem(items: CartItem[], itemId: string): CartItem[] {
  return items.filter(item => item.id !== itemId);
}
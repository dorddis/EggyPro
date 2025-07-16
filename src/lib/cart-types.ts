export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  slug: string;
  isDeleting?: boolean;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  // Undo functionality properties
  lastDeletedItem: CartItem | null;
  canUndo: boolean;
}

export interface CartActions {
  addItem: (product: Product, quantity: number) => void;
  markItemDeleting: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  buyNow: (product: Product, quantity: number) => void;
  // Undo functionality methods
  undoDelete: () => void;
  clearUndo: () => void;
}

export interface CartContextType extends CartState, CartActions {}

// Import Product type from existing types
import type { Product } from './types';
export type { Product } from './types';
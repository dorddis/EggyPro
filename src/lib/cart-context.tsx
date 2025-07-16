'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { CartContextType, CartState, CartItem, Product } from './cart-types';
import { 
  calculateCartTotal, 
  calculateItemCount, 
  generateCartItemId, 
  validateQuantity,
  findCartItem,
  updateCartItemQuantity,
  removeCartItem
} from './cart-utils';

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'MARK_ITEM_DELETING'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: { isOpen: boolean } }
  | { type: 'LOAD_CART'; payload: { items: CartItem[] } }
  // Undo functionality actions
  | { type: 'UNDO_DELETE' }
  | { type: 'CLEAR_UNDO' };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
  // Undo functionality initial state
  lastDeletedItem: null,
  canUndo: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      
      if (!validateQuantity(quantity)) {
        return state;
      }

      const existingItem = findCartItem(state.items, product.id);
      let newItems: CartItem[];

      if (existingItem) {
        // Update existing item quantity
        const newQuantity = existingItem.quantity + quantity;
        if (!validateQuantity(newQuantity)) {
          return state;
        }
        newItems = updateCartItemQuantity(state.items, existingItem.id, newQuantity);
      } else {
        // Add new item
        const newItem: CartItem = {
          id: generateCartItemId(product.id),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl,
          slug: product.slug,
        };
        newItems = [...state.items, newItem];
      }

      return {
        ...state,
        items: newItems,
        totalItems: calculateItemCount(newItems),
        totalPrice: calculateCartTotal(newItems),
      };
    }

    case 'REMOVE_ITEM': {
      const itemToDelete = state.items.find(item => item.id === action.payload.itemId);
      const newItems = removeCartItem(state.items, action.payload.itemId);
      return {
        ...state,
        items: newItems,
        totalItems: calculateItemCount(newItems),
        totalPrice: calculateCartTotal(newItems),
        // Store deleted item for undo
        lastDeletedItem: itemToDelete || null,
        canUndo: true,
      };
    }

    case 'MARK_ITEM_DELETING': {
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.itemId 
            ? { ...item, isDeleting: true }
            : item
        ),
      };
    }

    case 'UNDO_DELETE': {
      if (!state.lastDeletedItem) return state;
      const newItems = [...state.items, state.lastDeletedItem];
      return {
        ...state,
        items: newItems,
        totalItems: calculateItemCount(newItems),
        totalPrice: calculateCartTotal(newItems),
        lastDeletedItem: null,
        canUndo: false,
      };
    }

    case 'CLEAR_UNDO': {
      return {
        ...state,
        lastDeletedItem: null,
        canUndo: false,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      
      if (!validateQuantity(quantity)) {
        return state;
      }

      const newItems = updateCartItemQuantity(state.items, itemId, quantity);
      return {
        ...state,
        items: newItems,
        totalItems: calculateItemCount(newItems),
        totalPrice: calculateCartTotal(newItems),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    }

    case 'TOGGLE_CART': {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }

    case 'SET_CART_OPEN': {
      return {
        ...state,
        isOpen: action.payload.isOpen,
      };
    }

    case 'LOAD_CART': {
      const items = action.payload.items;
      return {
        ...state,
        items,
        totalItems: calculateItemCount(items),
        totalPrice: calculateCartTotal(items),
        // Preserve undo state when loading cart
        lastDeletedItem: state.lastDeletedItem,
        canUndo: state.canUndo,
      };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const router = useRouter();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('eggypro-cart');
      if (savedCart) {
        const items = JSON.parse(savedCart) as CartItem[];
        dispatch({ type: 'LOAD_CART', payload: { items } });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('eggypro-cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  const addItem = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const markItemDeleting = (itemId: string) => {
    dispatch({ type: 'MARK_ITEM_DELETING', payload: { itemId } });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const buyNow = (product: Product, quantity: number) => {
    // Add item to cart
    addItem(product, quantity);
    // Close cart if open
    dispatch({ type: 'SET_CART_OPEN', payload: { isOpen: false } });
    // Redirect to checkout
    router.push('/checkout');
  };

  const undoDelete = () => {
    dispatch({ type: 'UNDO_DELETE' });
  };

  const clearUndo = () => {
    dispatch({ type: 'CLEAR_UNDO' });
  };

  const contextValue: CartContextType = {
    ...state,
    addItem,
    markItemDeleting,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    buyNow,
    undoDelete,
    clearUndo,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
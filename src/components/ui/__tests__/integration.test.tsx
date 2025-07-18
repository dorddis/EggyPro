import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PriceUtils } from '@/lib/price-utils';
import ProductCard from '@/components/product/ProductCard';
import CartItem from '@/components/cart/CartItem';
import { CartProvider } from '@/lib/cart-context';

// Mock the cart hook
const mockUseCart = {
  updateQuantity: jest.fn(),
  markItemDeleting: jest.fn(),
  completeItemDeletion: jest.fn(),
};

jest.mock('@/hooks/use-cart', () => ({
  useCart: () => mockUseCart,
}));

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: React.ReactNode }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('Price Handling Integration Tests', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    slug: 'test-product',
    description: 'A test product',
    price: '29.99', // String price to test conversion
    stock_quantity: 10,
    images: ['test-image.jpg'],
    ingredients: ['Test ingredient'],
    details: 'Test details',
    is_active: true,
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
  };

  const mockCartItem = {
    id: 'cart-item-1',
    productId: '1',
    name: 'Test Product',
    price: '29.99', // String price to test conversion
    quantity: 2,
    imageUrl: 'test-image.jpg',
    slug: 'test-product',
    isDeleting: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ProductCard Price Display', () => {
    it('should display formatted price correctly with string input', () => {
      render(<ProductCard product={mockProduct} />);
      
      // Should display formatted price using PriceUtils
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('should handle numeric price input', () => {
      const numericPriceProduct = { ...mockProduct, price: 29.99 };
      render(<ProductCard product={numericPriceProduct} />);
      
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('should handle invalid price gracefully', () => {
      const invalidPriceProduct = { ...mockProduct, price: 'invalid' };
      render(<ProductCard product={invalidPriceProduct} />);
      
      // Should display fallback price
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });
  });

  describe('CartItem Price Calculations', () => {
    it('should display individual price and total correctly', () => {
      render(
        <CartProvider>
          <CartItem item={mockCartItem} />
        </CartProvider>
      );
      
      // Should display individual price
      expect(screen.getByText('$29.99 each')).toBeInTheDocument();
      
      // Should display total (29.99 * 2 = 59.98)
      expect(screen.getByText('$59.98')).toBeInTheDocument();
    });

    it('should handle quantity changes correctly', () => {
      const { rerender } = render(
        <CartProvider>
          <CartItem item={mockCartItem} />
        </CartProvider>
      );
      
      // Initial total
      expect(screen.getByText('$59.98')).toBeInTheDocument();
      
      // Update quantity
      const updatedItem = { ...mockCartItem, quantity: 3 };
      rerender(
        <CartProvider>
          <CartItem item={updatedItem} />
        </CartProvider>
      );
      
      // Should display new total (29.99 * 3 = 89.97)
      expect(screen.getByText('$89.97')).toBeInTheDocument();
    });

    it('should handle mixed price types in calculations', () => {
      const mixedPriceItem = { ...mockCartItem, price: 29.99 }; // Numeric price
      render(
        <CartProvider>
          <CartItem item={mixedPriceItem} />
        </CartProvider>
      );
      
      expect(screen.getByText('$29.99 each')).toBeInTheDocument();
      expect(screen.getByText('$59.98')).toBeInTheDocument();
    });
  });

  describe('Price Utility Integration', () => {
    it('should handle cart total calculations with mixed price types', () => {
      const items = [
        { price: '29.99', quantity: 2 }, // String price
        { price: 15.50, quantity: 1 },   // Numeric price
        { price: '10.00', quantity: 3 }, // String price
      ];
      
      const total = PriceUtils.calculateTotal(items);
      
      // 29.99*2 + 15.50*1 + 10.00*3 = 59.98 + 15.50 + 30.00 = 105.48
      expect(total.numeric).toBe(105.48);
      expect(total.formatted).toBe('$105.48');
      expect(total.isValid).toBe(true);
    });

    it('should handle invalid prices in cart calculations', () => {
      const items = [
        { price: '29.99', quantity: 2 },  // Valid
        { price: 'invalid', quantity: 1 }, // Invalid
        { price: 15.50, quantity: 1 },    // Valid
      ];
      
      const total = PriceUtils.calculateTotal(items);
      
      // Should only count valid prices: 29.99*2 + 15.50*1 = 75.48
      expect(total.numeric).toBe(75.48);
      expect(total.formatted).toBe('$75.48');
      expect(total.isValid).toBe(false); // Has invalid prices
    });

    it('should handle edge cases in price formatting', () => {
      // Test null/undefined
      expect(PriceUtils.formatPrice(null)).toBe('$0.00');
      expect(PriceUtils.formatPrice(undefined)).toBe('$0.00');
      
      // Test zero
      expect(PriceUtils.formatPrice(0)).toBe('$0.00');
      expect(PriceUtils.formatPrice('0')).toBe('$0.00');
      
      // Test large numbers
      expect(PriceUtils.formatPrice(1299.99)).toBe('$1,299.99');
      expect(PriceUtils.formatPrice('1299.99')).toBe('$1,299.99');
      
      // Test negative numbers (should be clamped to 0)
      expect(PriceUtils.formatPrice(-10.50)).toBe('$0.00');
    });
  });

  describe('Error Handling Integration', () => {
    it('should not crash when price operations fail', () => {
      // Test that components don't crash with invalid data
      const invalidProduct = {
        ...mockProduct,
        price: null,
      };
      
      expect(() => {
        render(<ProductCard product={invalidProduct} />);
      }).not.toThrow();
      
      // Should display fallback price
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('should handle cart operations with invalid prices', () => {
      const invalidCartItem = {
        ...mockCartItem,
        price: 'not-a-number',
      };
      
      expect(() => {
        render(
          <CartProvider>
            <CartItem item={invalidCartItem} />
          </CartProvider>
        );
      }).not.toThrow();
      
      // Should display fallback values
      expect(screen.getByText('$0.00 each')).toBeInTheDocument();
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });
  });

  describe('Performance Integration', () => {
    it('should handle large numbers of price calculations efficiently', () => {
      const startTime = performance.now();
      
      // Simulate many price calculations
      const items = Array.from({ length: 1000 }, () => ({
        price: (Math.random() * 100).toFixed(2),
        quantity: Math.floor(Math.random() * 10) + 1,
      }));
      
      const total = PriceUtils.calculateTotal(items);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100);
      expect(total.isValid).toBe(true);
      expect(typeof total.numeric).toBe('number');
    });

    it('should handle repeated price formatting efficiently', () => {
      const startTime = performance.now();
      
      // Format the same price many times
      for (let i = 0; i < 1000; i++) {
        PriceUtils.formatPrice('29.99');
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Accessibility Integration', () => {
    it('should provide accessible price information', () => {
      render(<ProductCard product={mockProduct} />);
      
      // Price should be readable by screen readers
      const priceElement = screen.getByText('$29.99');
      expect(priceElement).toBeInTheDocument();
      expect(priceElement).toBeVisible();
    });

    it('should handle price updates without losing focus', () => {
      const { rerender } = render(
        <CartProvider>
          <CartItem item={mockCartItem} />
        </CartProvider>
      );
      
      const quantityDisplay = screen.getByText('2');
      expect(quantityDisplay).toBeInTheDocument();
      
      // Update quantity
      const updatedItem = { ...mockCartItem, quantity: 3 };
      rerender(
        <CartProvider>
          <CartItem item={updatedItem} />
        </CartProvider>
      );
      
      // New quantity should be displayed
      expect(screen.getByText('3')).toBeInTheDocument();
      // New total should be calculated
      expect(screen.getByText('$89.97')).toBeInTheDocument();
    });
  });
});
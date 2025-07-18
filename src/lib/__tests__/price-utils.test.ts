import { PriceUtils } from '../price-utils';

describe('PriceUtils', () => {
  describe('validatePriceInput', () => {
    it('should validate numeric prices correctly', () => {
      const result = PriceUtils.validatePriceInput(29.99);
      expect(result.isValid).toBe(true);
      expect(result.numericValue).toBe(29.99);
      expect(result.originalValue).toBe(29.99);
      expect(result.error).toBeUndefined();
    });

    it('should validate string prices correctly', () => {
      const result = PriceUtils.validatePriceInput('29.99');
      expect(result.isValid).toBe(true);
      expect(result.numericValue).toBe(29.99);
      expect(result.originalValue).toBe('29.99');
    });

    it('should handle string prices with currency symbols', () => {
      const result = PriceUtils.validatePriceInput('$29.99');
      expect(result.isValid).toBe(true);
      expect(result.numericValue).toBe(29.99);
    });

    it('should handle string prices with commas', () => {
      const result = PriceUtils.validatePriceInput('1,299.99');
      expect(result.isValid).toBe(true);
      expect(result.numericValue).toBe(1299.99);
    });

    it('should handle null values', () => {
      const result = PriceUtils.validatePriceInput(null);
      expect(result.isValid).toBe(false);
      expect(result.numericValue).toBe(0);
      expect(result.error).toBe('Price is null or undefined');
    });

    it('should handle undefined values', () => {
      const result = PriceUtils.validatePriceInput(undefined);
      expect(result.isValid).toBe(false);
      expect(result.numericValue).toBe(0);
      expect(result.error).toBe('Price is null or undefined');
    });

    it('should handle invalid string values', () => {
      const result = PriceUtils.validatePriceInput('invalid');
      expect(result.isValid).toBe(false);
      expect(result.numericValue).toBe(0);
      expect(result.error).toBe('Invalid price format');
    });

    it('should handle NaN values', () => {
      const result = PriceUtils.validatePriceInput(NaN);
      expect(result.isValid).toBe(false);
      expect(result.numericValue).toBe(0);
    });

    it('should handle Infinity values', () => {
      const result = PriceUtils.validatePriceInput(Infinity);
      expect(result.isValid).toBe(false);
      expect(result.numericValue).toBe(0);
    });

    it('should ensure non-negative prices', () => {
      const result = PriceUtils.validatePriceInput(-10.50);
      expect(result.isValid).toBe(true);
      expect(result.numericValue).toBe(0); // Should be clamped to 0
    });
  });

  describe('getNumericPrice', () => {
    it('should return numeric value for valid prices', () => {
      expect(PriceUtils.getNumericPrice(29.99)).toBe(29.99);
      expect(PriceUtils.getNumericPrice('29.99')).toBe(29.99);
      expect(PriceUtils.getNumericPrice('$29.99')).toBe(29.99);
    });

    it('should return 0 for invalid prices', () => {
      expect(PriceUtils.getNumericPrice('invalid')).toBe(0);
      expect(PriceUtils.getNumericPrice(null)).toBe(0);
      expect(PriceUtils.getNumericPrice(undefined)).toBe(0);
    });
  });

  describe('isValidPrice', () => {
    it('should return true for valid prices', () => {
      expect(PriceUtils.isValidPrice(29.99)).toBe(true);
      expect(PriceUtils.isValidPrice('29.99')).toBe(true);
      expect(PriceUtils.isValidPrice('$29.99')).toBe(true);
      expect(PriceUtils.isValidPrice(0)).toBe(true);
    });

    it('should return false for invalid prices', () => {
      expect(PriceUtils.isValidPrice('invalid')).toBe(false);
      expect(PriceUtils.isValidPrice(null)).toBe(false);
      expect(PriceUtils.isValidPrice(undefined)).toBe(false);
      expect(PriceUtils.isValidPrice(NaN)).toBe(false);
      expect(PriceUtils.isValidPrice(Infinity)).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with default options', () => {
      const result = PriceUtils.formatCurrency(29.99);
      expect(result).toBe('$29.99');
    });

    it('should format currency with custom options', () => {
      const result = PriceUtils.formatCurrency(29.99, {
        currency: 'EUR',
        locale: 'de-DE'
      });
      expect(result).toContain('29,99'); // German formatting
    });

    it('should handle formatting errors gracefully', () => {
      const result = PriceUtils.formatCurrency(29.99, {
        currency: 'INVALID',
        fallbackText: 'Error'
      });
      expect(result).toBe('Error');
    });
  });

  describe('formatPrice', () => {
    it('should format numeric prices correctly', () => {
      expect(PriceUtils.formatPrice(29.99)).toBe('$29.99');
      expect(PriceUtils.formatPrice(0)).toBe('$0.00');
    });

    it('should format string prices correctly', () => {
      expect(PriceUtils.formatPrice('29.99')).toBe('$29.99');
      expect(PriceUtils.formatPrice('$29.99')).toBe('$29.99');
    });

    it('should handle invalid prices with fallback', () => {
      expect(PriceUtils.formatPrice('invalid')).toBe('$0.00');
      expect(PriceUtils.formatPrice(null)).toBe('$0.00');
      expect(PriceUtils.formatPrice(undefined)).toBe('$0.00');
    });

    it('should use custom fallback text', () => {
      const result = PriceUtils.formatPrice('invalid', { fallbackText: 'N/A' });
      expect(result).toBe('N/A');
    });

    it('should handle large numbers', () => {
      expect(PriceUtils.formatPrice(1299.99)).toBe('$1,299.99');
    });
  });

  describe('parsePrice', () => {
    it('should parse valid prices correctly', () => {
      const result = PriceUtils.parsePrice(29.99);
      expect(result.raw).toBe(29.99);
      expect(result.numeric).toBe(29.99);
      expect(result.formatted).toBe('$29.99');
      expect(result.isValid).toBe(true);
    });

    it('should parse invalid prices with fallback', () => {
      const result = PriceUtils.parsePrice('invalid');
      expect(result.raw).toBe('invalid');
      expect(result.numeric).toBe(0);
      expect(result.formatted).toBe('$0.00');
      expect(result.isValid).toBe(false);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate totals with numeric prices', () => {
      const items = [
        { price: 29.99, quantity: 2 },
        { price: 15.50, quantity: 1 }
      ];
      const result = PriceUtils.calculateTotal(items);
      expect(result.numeric).toBeCloseTo(75.48, 2);
      expect(result.formatted).toBe('$75.48');
      expect(result.isValid).toBe(true);
    });

    it('should calculate totals with string prices', () => {
      const items = [
        { price: '29.99', quantity: 2 },
        { price: '15.50', quantity: 1 }
      ];
      const result = PriceUtils.calculateTotal(items);
      expect(result.numeric).toBeCloseTo(75.48, 2);
      expect(result.formatted).toBe('$75.48');
      expect(result.isValid).toBe(true);
    });

    it('should calculate totals with mixed price types', () => {
      const items = [
        { price: '29.99', quantity: 2 },
        { price: 15.50, quantity: 1 }
      ];
      const result = PriceUtils.calculateTotal(items);
      expect(result.numeric).toBeCloseTo(75.48, 2);
      expect(result.isValid).toBe(true);
    });

    it('should handle invalid prices in calculation', () => {
      const items = [
        { price: '29.99', quantity: 2 },
        { price: 'invalid', quantity: 1 },
        { price: 10.00, quantity: 1 }
      ];
      const result = PriceUtils.calculateTotal(items);
      expect(result.numeric).toBeCloseTo(69.98, 2); // Only valid prices counted
      expect(result.isValid).toBe(false); // Has invalid prices
    });

    it('should handle zero and negative quantities', () => {
      const items = [
        { price: 29.99, quantity: 0 },
        { price: 15.50, quantity: -1 }, // Should be treated as 0
        { price: 10.00, quantity: 2 }
      ];
      const result = PriceUtils.calculateTotal(items);
      expect(result.numeric).toBe(20.00); // Only the last item
    });

    it('should handle empty array', () => {
      const result = PriceUtils.calculateTotal([]);
      expect(result.numeric).toBe(0);
      expect(result.formatted).toBe('$0.00');
      expect(result.isValid).toBe(true);
    });
  });

  describe('addPrices', () => {
    it('should add two valid prices', () => {
      const result = PriceUtils.addPrices(29.99, 15.50);
      expect(result.numeric).toBeCloseTo(45.49, 2);
      expect(result.formatted).toBe('$45.49');
      expect(result.isValid).toBe(true);
    });

    it('should add string and numeric prices', () => {
      const result = PriceUtils.addPrices('29.99', 15.50);
      expect(result.numeric).toBeCloseTo(45.49, 2);
      expect(result.isValid).toBe(true);
    });

    it('should handle invalid prices in addition', () => {
      const result = PriceUtils.addPrices('invalid', 15.50);
      expect(result.numeric).toBe(15.50);
      expect(result.isValid).toBe(false);
    });
  });

  describe('multiplyPrice', () => {
    it('should multiply price by quantity', () => {
      const result = PriceUtils.multiplyPrice(29.99, 3);
      expect(result.numeric).toBe(89.97);
      expect(result.formatted).toBe('$89.97');
      expect(result.isValid).toBe(true);
    });

    it('should handle string prices', () => {
      const result = PriceUtils.multiplyPrice('29.99', 2);
      expect(result.numeric).toBe(59.98);
      expect(result.isValid).toBe(true);
    });

    it('should handle zero quantity', () => {
      const result = PriceUtils.multiplyPrice(29.99, 0);
      expect(result.numeric).toBe(0);
      expect(result.isValid).toBe(true);
    });

    it('should handle negative quantity', () => {
      const result = PriceUtils.multiplyPrice(29.99, -2);
      expect(result.numeric).toBe(0); // Should be clamped to 0
    });

    it('should handle invalid price', () => {
      const result = PriceUtils.multiplyPrice('invalid', 2);
      expect(result.numeric).toBe(0);
      expect(result.isValid).toBe(false);
    });

    it('should handle invalid quantity', () => {
      const result = PriceUtils.multiplyPrice(29.99, NaN);
      expect(result.isValid).toBe(false);
    });
  });

  describe('comparePrices', () => {
    it('should compare prices correctly', () => {
      expect(PriceUtils.comparePrices(29.99, 15.50)).toBe(1);
      expect(PriceUtils.comparePrices(15.50, 29.99)).toBe(-1);
      expect(PriceUtils.comparePrices(29.99, 29.99)).toBe(0);
    });

    it('should compare string and numeric prices', () => {
      expect(PriceUtils.comparePrices('29.99', 15.50)).toBe(1);
      expect(PriceUtils.comparePrices(15.50, '29.99')).toBe(-1);
      expect(PriceUtils.comparePrices('29.99', '29.99')).toBe(0);
    });

    it('should handle invalid prices in comparison', () => {
      expect(PriceUtils.comparePrices('invalid', 15.50)).toBe(-1);
      expect(PriceUtils.comparePrices(15.50, 'invalid')).toBe(1);
      expect(PriceUtils.comparePrices('invalid', 'invalid')).toBe(0);
    });
  });

  describe('formatPriceRange', () => {
    it('should format price range correctly', () => {
      const result = PriceUtils.formatPriceRange(15.50, 29.99);
      expect(result).toBe('$15.50 - $29.99');
    });

    it('should handle same min and max prices', () => {
      const result = PriceUtils.formatPriceRange(29.99, 29.99);
      expect(result).toBe('$29.99');
    });

    it('should handle string prices in range', () => {
      const result = PriceUtils.formatPriceRange('15.50', '29.99');
      expect(result).toBe('$15.50 - $29.99');
    });

    it('should handle invalid prices in range', () => {
      const result = PriceUtils.formatPriceRange('invalid', 29.99);
      expect(result).toBe('$0.00 - $29.99');
    });
  });
});
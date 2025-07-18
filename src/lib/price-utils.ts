import { priceMonitor } from './price-monitoring';

interface PriceValue {
  raw: string | number;
  numeric: number;
  formatted: string;
  isValid: boolean;
}

interface PriceFormatOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  fallbackText?: string;
}

interface PriceValidationResult {
  isValid: boolean;
  numericValue: number;
  originalValue: string | number;
  error?: string;
}

export class PriceUtils {
  private static readonly DEFAULT_CURRENCY = 'USD';
  private static readonly DEFAULT_LOCALE = 'en-US';
  private static readonly DEFAULT_FALLBACK = '$0.00';

  /**
   * Validates and converts price input to numeric value
   */
  static validatePriceInput(price: unknown): PriceValidationResult {
    try {
      priceMonitor.logSuccessfulValidation();
      
      if (price === null || price === undefined) {
        const error = 'Price is null or undefined';
        priceMonitor.logValidationError('validatePriceInput', price, error);
        return { 
          isValid: false, 
          numericValue: 0, 
          originalValue: price, 
          error 
        };
      }
      
      if (typeof price === 'number' && !isNaN(price) && isFinite(price)) {
        return { 
          isValid: true, 
          numericValue: Math.max(0, price), // Ensure non-negative
          originalValue: price 
        };
      }
      
      if (typeof price === 'string') {
        // Remove currency symbols and whitespace
        const cleanPrice = price.replace(/[$,\s]/g, '');
        const parsed = parseFloat(cleanPrice);
        
        if (!isNaN(parsed) && isFinite(parsed)) {
          return { 
            isValid: true, 
            numericValue: Math.max(0, parsed), // Ensure non-negative
            originalValue: price 
          };
        }
      }
      
      const error = 'Invalid price format';
      priceMonitor.logValidationError('validatePriceInput', price, error);
      return { 
        isValid: false, 
        numericValue: 0, 
        originalValue: price, 
        error 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      priceMonitor.logValidationError('validatePriceInput', price, errorMessage);
      return { 
        isValid: false, 
        numericValue: 0, 
        originalValue: price, 
        error: errorMessage 
      };
    }
  }

  /**
   * Safely converts price to numeric value
   */
  static getNumericPrice(price: string | number): number {
    const validation = this.validatePriceInput(price);
    return validation.numericValue;
  }

  /**
   * Checks if a price value is valid
   */
  static isValidPrice(price: unknown): boolean {
    return this.validatePriceInput(price).isValid;
  }

  /**
   * Formats a numeric amount as currency
   */
  static formatCurrency(amount: number, options: PriceFormatOptions = {}): string {
    const {
      currency = this.DEFAULT_CURRENCY,
      locale = this.DEFAULT_LOCALE,
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
      fallbackText = this.DEFAULT_FALLBACK
    } = options;

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      priceMonitor.logFormattingError('formatCurrency', { amount, options }, errorMessage);
      console.error('Currency formatting error:', error);
      return fallbackText;
    }
  }

  /**
   * Safely formats price with comprehensive error handling
   */
  static formatPrice(price: string | number, options: PriceFormatOptions = {}): string {
    const validation = this.validatePriceInput(price);
    
    if (!validation.isValid) {
      console.warn(`Invalid price value: ${price}`, validation.error);
      return options.fallbackText || this.DEFAULT_FALLBACK;
    }
    
    try {
      return this.formatCurrency(validation.numericValue, options);
    } catch (error) {
      console.error('Price formatting error:', error);
      return options.fallbackText || this.DEFAULT_FALLBACK;
    }
  }

  /**
   * Parses price and returns detailed information
   */
  static parsePrice(price: string | number, options: PriceFormatOptions = {}): PriceValue {
    const validation = this.validatePriceInput(price);
    
    return {
      raw: price,
      numeric: validation.numericValue,
      formatted: validation.isValid 
        ? this.formatCurrency(validation.numericValue, options)
        : (options.fallbackText || this.DEFAULT_FALLBACK),
      isValid: validation.isValid
    };
  }

  /**
   * Calculates total from array of items with price and quantity
   */
  static calculateTotal(items: Array<{price: string | number, quantity: number}>): PriceValue {
    let total = 0;
    let hasInvalidPrices = false;

    for (const item of items) {
      const validation = this.validatePriceInput(item.price);
      
      if (validation.isValid) {
        total += validation.numericValue * Math.max(0, item.quantity || 0);
      } else {
        hasInvalidPrices = true;
        console.warn(`Invalid price in total calculation:`, {
          price: item.price,
          error: validation.error
        });
      }
    }

    return {
      raw: total,
      numeric: total,
      formatted: this.formatCurrency(total),
      isValid: !hasInvalidPrices
    };
  }

  /**
   * Safely adds two price values
   */
  static addPrices(price1: string | number, price2: string | number): PriceValue {
    const val1 = this.getNumericPrice(price1);
    const val2 = this.getNumericPrice(price2);
    const sum = val1 + val2;

    return {
      raw: sum,
      numeric: sum,
      formatted: this.formatCurrency(sum),
      isValid: this.isValidPrice(price1) && this.isValidPrice(price2)
    };
  }

  /**
   * Safely multiplies price by quantity
   */
  static multiplyPrice(price: string | number, quantity: number): PriceValue {
    const priceValue = this.getNumericPrice(price);
    const safeQuantity = Math.max(0, quantity || 0);
    const result = priceValue * safeQuantity;

    return {
      raw: result,
      numeric: result,
      formatted: this.formatCurrency(result),
      isValid: this.isValidPrice(price) && typeof quantity === 'number' && !isNaN(quantity)
    };
  }

  /**
   * Compares two prices numerically
   */
  static comparePrices(price1: string | number, price2: string | number): number {
    const val1 = this.getNumericPrice(price1);
    const val2 = this.getNumericPrice(price2);
    
    if (val1 < val2) return -1;
    if (val1 > val2) return 1;
    return 0;
  }

  /**
   * Formats price range (min - max)
   */
  static formatPriceRange(minPrice: string | number, maxPrice: string | number, options: PriceFormatOptions = {}): string {
    const min = this.formatPrice(minPrice, options);
    const max = this.formatPrice(maxPrice, options);
    
    if (min === max) {
      return min;
    }
    
    return `${min} - ${max}`;
  }
}

// Export types for use in other files
export type { PriceValue, PriceFormatOptions, PriceValidationResult };
import { loadStripe, Stripe } from '@stripe/stripe-js';

export interface StripeConfig {
  publishableKey: string;
  apiVersion: string;
}

export interface PaymentConfig {
  isDevelopment: boolean;
  stripePublishableKey: string;
  enableDevBypass: boolean;
}

// Get Stripe configuration based on environment
export function getStripeConfig(): StripeConfig {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    throw new Error(
      'Missing Stripe publishable key. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment variables.'
    );
  }

  return {
    publishableKey,
    apiVersion: '2023-10-16', // Latest stable API version
  };
}

// Get payment configuration for the application
export function getPaymentConfig(): PaymentConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  
  return {
    isDevelopment,
    stripePublishableKey,
    // Enable dev bypass in production for portfolio/demo purposes
    // Can be disabled by setting NEXT_PUBLIC_ENABLE_DEV_BYPASS=false
    enableDevBypass: process.env.NEXT_PUBLIC_ENABLE_DEV_BYPASS !== 'false',
  };
}

// Stripe instance (singleton)
let stripePromise: Promise<Stripe | null> | null = null;

// Get Stripe instance
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const config = getStripeConfig();
    stripePromise = loadStripe(config.publishableKey);
  }
  return stripePromise;
}

// Validate Stripe configuration
export function validateStripeConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const config = getStripeConfig();
    
    if (!config.publishableKey.startsWith('pk_')) {
      errors.push('Stripe publishable key must start with "pk_"');
    }
    
    if (process.env.NODE_ENV === 'production' && config.publishableKey.includes('test')) {
      errors.push('Production environment should not use test Stripe keys');
    }
    
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown configuration error');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Helper to format amount for Stripe (convert dollars to cents)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function formatAmountForStripe(amount: number, currency: string = 'usd'): number {
  // Stripe expects amounts in the smallest currency unit (cents for USD)
  return Math.round(amount * 100);
}

// Helper to format amount for display (convert cents to dollars)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function formatAmountForDisplay(amount: number, currency: string = 'usd'): number {
  return amount / 100;
}
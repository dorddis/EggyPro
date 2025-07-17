'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Loader2, CheckCircle } from 'lucide-react';
import { getPaymentConfig } from '@/lib/stripe';

interface DevBypassButtonProps {
  onPaymentSuccess: (result: {
    paymentIntentId: string;
    orderId: string;
    status: 'succeeded';
  }) => void;
  onPaymentError: (error: string) => void;
  disabled?: boolean;
  amount: number;
  customerInfo: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export default function DevBypassButton({
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
  amount,
  customerInfo,
  items,
}: DevBypassButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const config = getPaymentConfig();
  
  // Don't render in production or if bypass is disabled
  if (!config.enableDevBypass) {
    return null;
  }
  
  const handleBypassPayment = async () => {
    if (disabled || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Create mock payment intent ID for bypass
      const paymentIntentId = `pi_dev_bypass_${Date.now()}`;
      
      // Call the payment confirmation API with order data
      const response = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          paymentMethodType: 'bypass',
          customerInfo,
          items,
          amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment confirmation failed');
      }

      const result = await response.json();
      
      console.log('🚀 Development Payment Bypass Completed:', {
        orderId: result.orderId,
        amount: `${amount.toFixed(2)}`,
        customer: customerInfo.name,
        itemCount: items.length,
      });
      
      setIsSuccess(true);
      
      // Brief success state before calling success handler
      setTimeout(() => {
        onPaymentSuccess({
          paymentIntentId: result.paymentIntentId,
          orderId: result.orderId,
          status: 'succeeded',
        });
      }, 800);
      
    } catch (error) {
      console.error('❌ Dev bypass error:', error);
      onPaymentError(error instanceof Error ? error.message : 'Development bypass failed. Please try again.');
      setIsProcessing(false);
    }
  };
  
  if (isSuccess) {
    return (
      <Button
        size="lg"
        className="w-full bg-green-600 hover:bg-green-700 min-h-[48px]"
        disabled
      >
        <CheckCircle className="mr-2 h-5 w-5" />
        Payment Successful!
      </Button>
    );
  }
  
  return (
    <div className="space-y-3">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-center">
          <Zap className="h-4 w-4 text-yellow-600 mr-2" />
          <p className="text-sm text-yellow-800 font-medium">
            Development Mode
          </p>
        </div>
        <p className="text-xs text-yellow-700 mt-1">
          This bypass button is only available in development. It simulates a successful payment without processing real money.
        </p>
      </div>
      
      <Button
        onClick={handleBypassPayment}
        disabled={disabled || isProcessing}
        size="lg"
        variant="outline"
        className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-900 min-h-[48px]"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Mock Payment...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-5 w-5" />
            Bypass Payment (Dev Only)
          </>
        )}
      </Button>
    </div>
  );
}
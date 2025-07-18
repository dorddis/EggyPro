'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { FormValidation } from '@/components/ui/form-validation';
import { PriceUtils } from '@/lib/price-utils';

interface MockStripePaymentFormProps {
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

interface CardFormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
}

interface CardErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  cardholderName?: string;
}

export default function MockStripePaymentForm({
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
  amount,
  customerInfo,
  items,
}: MockStripePaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState<CardFormData>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
  });
  const [errors, setErrors] = useState<CardErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: keyof CardFormData, value: string): string | undefined => {
    switch (name) {
      case 'cardNumber':
        if (!value.trim()) return 'Card number is required';
        if (value.replace(/\s/g, '').length < 13) return 'Card number is too short';
        return undefined;
      case 'expiryDate':
        if (!value.trim()) return 'Expiry date is required';
        if (!/^\d{2}\/\d{2}$/.test(value)) return 'Format: MM/YY';
        return undefined;
      case 'cvc':
        if (!value.trim()) return 'CVC is required';
        if (value.length < 3) return 'CVC must be 3-4 digits';
        return undefined;
      case 'cardholderName':
        if (!value.trim()) return 'Cardholder name is required';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (name: keyof CardFormData, value: string) => {
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.substring(0, 5);
    }
    
    // Format CVC (numbers only)
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) formattedValue = formattedValue.substring(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleInputBlur = (name: keyof CardFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, cardData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: CardErrors = {};
    let isValid = true;

    Object.keys(cardData).forEach((key) => {
      const fieldName = key as keyof CardFormData;
      const error = validateField(fieldName, cardData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      cardNumber: true,
      expiryDate: true,
      cvc: true,
      cardholderName: true,
    });
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || disabled || isProcessing) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check for test card numbers that should fail
      const cardNumber = cardData.cardNumber.replace(/\s/g, '');
      
      if (cardNumber === '4000000000000002') {
        throw new Error('Your card was declined. Please try a different payment method.');
      }
      
      if (cardNumber === '4000000000009995') {
        throw new Error('Your card has insufficient funds. Please try a different payment method.');
      }
      
      // Create mock payment intent ID
      const paymentIntentId = `pi_mock_${Date.now()}`;
      
      // Call the payment confirmation API with order data
      const response = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          paymentMethodType: 'card',
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
      
      console.log('💳 Mock Payment Processed:', {
        orderId: result.orderId,
        amount: PriceUtils.formatPrice(amount),
        customer: customerInfo.name,
        cardLast4: cardNumber.slice(-4),
      });
      
      onPaymentSuccess({
        paymentIntentId: result.paymentIntentId,
        orderId: result.orderId,
        status: 'succeeded',
      });
      
    } catch (error) {
      console.error('❌ Mock payment error:', error);
      onPaymentError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 text-blue-600 mr-2" />
          <p className="text-sm text-blue-800 font-medium">
            Mock Payment Form
          </p>
        </div>
        <p className="text-xs text-blue-700 mt-1">
          This is a simulated payment form. No real payment processing occurs. Use test card: 4242 4242 4242 4242
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Input
            id="cardholderName"
            placeholder="John Doe"
            value={cardData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            onBlur={() => handleInputBlur('cardholderName')}
            className="mt-1"
          />
          <FormValidation
            isInvalid={!!errors.cardholderName}
            message={errors.cardholderName}
            show={touched.cardholderName && !!errors.cardholderName}
          />
        </div>

        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="4242 4242 4242 4242"
            value={cardData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            onBlur={() => handleInputBlur('cardNumber')}
            className="mt-1"
          />
          <FormValidation
            isInvalid={!!errors.cardNumber}
            message={errors.cardNumber}
            show={touched.cardNumber && !!errors.cardNumber}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              value={cardData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              onBlur={() => handleInputBlur('expiryDate')}
              className="mt-1"
            />
            <FormValidation
              isInvalid={!!errors.expiryDate}
              message={errors.expiryDate}
              show={touched.expiryDate && !!errors.expiryDate}
            />
          </div>
          <div>
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              placeholder="123"
              value={cardData.cvc}
              onChange={(e) => handleInputChange('cvc', e.target.value)}
              onBlur={() => handleInputBlur('cvc')}
              className="mt-1"
            />
            <FormValidation
              isInvalid={!!errors.cvc}
              message={errors.cvc}
              show={touched.cvc && !!errors.cvc}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 min-h-[48px]"
          disabled={disabled || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Pay {PriceUtils.formatPrice(amount)}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
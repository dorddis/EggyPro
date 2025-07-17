'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TrustBadges from '@/components/TrustBadges';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, ShoppingCart, Zap } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';
import { FormValidation } from '@/components/ui/form-validation';

import MockStripePaymentForm from '@/components/payment/MockStripePaymentForm';
import DevBypassButton from '@/components/payment/DevBypassButton';
import OrderConfirmation from '@/components/payment/OrderConfirmation';

interface ShippingFormData {
  fullName: string;
  address: string;
  city: string;
  zip: string;
}

interface ShippingErrors {
  fullName?: string;
  address?: string;
  city?: string;
  zip?: string;
}

interface OrderDetails {
  paymentIntentId: string;
  orderId: string;
  status: 'succeeded';
  amount: number;
  timestamp: string;
}

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    fullName: '',
    address: '',
    city: '',
    zip: '',
  });
  const [shippingErrors, setShippingErrors] = useState<ShippingErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [paymentError, setPaymentError] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateShippingField = (name: keyof ShippingFormData, value: string): string | undefined => {
    const trimmedValue = value.trim();

    switch (name) {
      case 'fullName':
        if (!trimmedValue) return 'Please enter your full name';
        if (trimmedValue.length < 2) return 'Name must be at least 2 characters';
        if (trimmedValue.length > 50) return 'Name must be less than 50 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(trimmedValue)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        return undefined;

      case 'address':
        if (!trimmedValue) return 'Please enter your address';
        if (trimmedValue.length < 5) return 'Address must be at least 5 characters';
        if (trimmedValue.length > 100) return 'Address must be less than 100 characters';
        return undefined;

      case 'city':
        if (!trimmedValue) return 'Please enter your city';
        if (trimmedValue.length < 2) return 'City must be at least 2 characters';
        if (trimmedValue.length > 50) return 'City must be less than 50 characters';
        if (!/^[a-zA-Z\s'.-]+$/.test(trimmedValue)) return 'City can only contain letters, spaces, hyphens, apostrophes, and periods';
        return undefined;

      case 'zip':
        if (!trimmedValue) return 'Please enter your ZIP code';
        // Support various ZIP code formats (US, Canada, UK, etc.)
        if (!/^[A-Za-z0-9\s-]{3,10}$/.test(trimmedValue)) return 'Please enter a valid ZIP/postal code';
        return undefined;

      default:
        return undefined;
    }
  };

  const handleShippingInputChange = (name: keyof ShippingFormData, value: string) => {
    setShippingData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (shippingErrors[name]) {
      setShippingErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleShippingInputBlur = (name: keyof ShippingFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateShippingField(name, shippingData[name]);
    setShippingErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateShippingForm = (): boolean => {
    const newErrors: ShippingErrors = {};
    let isValid = true;

    Object.keys(shippingData).forEach((key) => {
      const fieldName = key as keyof ShippingFormData;
      const error = validateShippingField(fieldName, shippingData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setShippingErrors(newErrors);
    setTouched({
      fullName: true,
      address: true,
      city: true,
      zip: true,
    });

    return isValid;
  };

  const handleContinueToPayment = () => {
    if (validateShippingForm()) {
      setCurrentStep('payment');
      setPaymentError('');
    }
  };

  const handlePaymentSuccess = (result: {
    paymentIntentId: string;
    orderId: string;
    status: 'succeeded';
  }) => {
    // Create order details for confirmation
    const orderData = {
      ...result,
      amount: totalPrice,
      timestamp: new Date().toISOString(),
    };

    setOrderDetails(orderData);
    setCurrentStep('confirmation');

    // Clear the cart
    clearCart();

    toast({
      title: "Payment Successful!",
      description: "Your order has been confirmed. Thank you for your purchase!",
    });
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  // Don't render until component is mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Show empty cart state if cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products to continue with checkout</p>
        <Button asChild>
          <Link href="/product/eggypro-original">Shop Now</Link>
        </Button>
      </div>
    );
  }

  // Show order confirmation if payment is complete
  if (currentStep === 'confirmation' && orderDetails) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <OrderConfirmation
          orderDetails={orderDetails}
          items={items.map(item => ({
            id: item.id,
            name: item.name,
            price: typeof item.price === 'number' ? item.price : parseFloat(item.price),
            quantity: item.quantity,
          }))}
          customerInfo={{
            name: shippingData.fullName,
            address: shippingData.address,
            city: shippingData.city,
            zip: shippingData.zip,
          }}
          isDevelopmentOrder={true}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <header className="text-center mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2 md:mb-4">Secure Checkout</h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">You&apos;re just a few steps away from delicious, trustworthy protein!</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Order Summary */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <ShoppingCart className="h-6 w-6 text-primary" /> Order Summary
            </CardTitle>
            <CardDescription className="text-sm md:text-base">Review your items before completing the purchase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm md:text-base">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity} × ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}</p>
                </div>
                <p className="font-semibold text-sm md:text-base">${typeof item.price === 'number' ? (item.price * item.quantity).toFixed(2) : (parseFloat(item.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center text-sm">
              <p>Subtotal</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p>Shipping</p>
              <p>Free shipping on orders over $25</p>
            </div>
            <Separator />
            <div className="flex justify-between items-center font-bold text-base md:text-lg">
              <p>Total (USD)</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Steps */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <CreditCard className="h-6 w-6 text-primary" />
              {currentStep === 'shipping' ? 'Shipping Information' : 'Payment'}
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              {currentStep === 'shipping'
                ? 'Enter your shipping details to continue.'
                : 'Choose your payment method to complete the order.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 'shipping' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-sm md:text-base">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={shippingData.fullName}
                    onChange={(e) => handleShippingInputChange('fullName', e.target.value)}
                    onBlur={() => handleShippingInputBlur('fullName')}
                    className="mt-1 h-11 md:h-10"
                  />
                  <FormValidation
                    isInvalid={!!shippingErrors.fullName}
                    message={shippingErrors.fullName}
                    show={touched.fullName && !!shippingErrors.fullName}
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-sm md:text-base">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Protein Lane"
                    value={shippingData.address}
                    onChange={(e) => handleShippingInputChange('address', e.target.value)}
                    onBlur={() => handleShippingInputBlur('address')}
                    className="mt-1 h-11 md:h-10"
                  />
                  <FormValidation
                    isInvalid={!!shippingErrors.address}
                    message={shippingErrors.address}
                    show={touched.address && !!shippingErrors.address}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm md:text-base">City</Label>
                    <Input
                      id="city"
                      placeholder="Fitville"
                      value={shippingData.city}
                      onChange={(e) => handleShippingInputChange('city', e.target.value)}
                      onBlur={() => handleShippingInputBlur('city')}
                      className="mt-1 h-11 md:h-10"
                    />
                    <FormValidation
                      isInvalid={!!shippingErrors.city}
                      message={shippingErrors.city}
                      show={touched.city && !!shippingErrors.city}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip" className="text-sm md:text-base">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="90210"
                      value={shippingData.zip}
                      onChange={(e) => handleShippingInputChange('zip', e.target.value)}
                      onBlur={() => handleShippingInputBlur('zip')}
                      className="mt-1 h-11 md:h-10"
                    />
                    <FormValidation
                      isInvalid={!!shippingErrors.zip}
                      message={shippingErrors.zip}
                      show={touched.zip && !!shippingErrors.zip}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleContinueToPayment}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 min-h-[48px]"
                >
                  Continue to Payment
                </Button>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-6">
                {paymentError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">{paymentError}</p>
                  </div>
                )}

                <Tabs defaultValue="bypass" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="bypass" className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Quick Pay
                    </TabsTrigger>
                    <TabsTrigger value="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit Card
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="bypass" className="mt-4">
                    <DevBypassButton
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      amount={totalPrice}
                      customerInfo={{
                        name: shippingData.fullName,
                        address: shippingData.address,
                        city: shippingData.city,
                        zip: shippingData.zip,
                      }}
                      items={items.map(item => ({
                        id: item.productId.toString(),
                        name: item.name,
                        price: typeof item.price === 'number' ? item.price : parseFloat(item.price),
                        quantity: item.quantity,
                      }))}
                    />
                  </TabsContent>

                  <TabsContent value="card" className="mt-4">
                    <MockStripePaymentForm
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      amount={totalPrice}
                      customerInfo={{
                        name: shippingData.fullName,
                        address: shippingData.address,
                        city: shippingData.city,
                        zip: shippingData.zip,
                      }}
                      items={items.map(item => ({
                        id: item.productId.toString(),
                        name: item.name,
                        price: typeof item.price === 'number' ? item.price : parseFloat(item.price),
                        quantity: item.quantity,
                      }))}
                    />
                  </TabsContent>
                </Tabs>

                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('shipping')}
                  className="w-full"
                >
                  Back to Shipping
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 md:mt-10">
        <TrustBadges />
      </div>
    </div>
  );
}

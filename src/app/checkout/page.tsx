'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TrustBadges from '@/components/TrustBadges';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';
import { FormValidation } from '@/components/ui/form-validation';

interface FormData {
  fullName: string;
  address: string;
  city: string;
  zip: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

interface ValidationErrors {
  fullName?: string;
  address?: string;
  city?: string;
  zip?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        return value.trim() ? undefined : 'Please enter your full name';
      case 'address':
        return value.trim() ? undefined : 'Please enter your address';
      case 'city':
        return value.trim() ? undefined : 'Please enter your city';
      case 'zip':
        return value.trim() ? undefined : 'Please enter your ZIP code';
      case 'cardNumber':
        return value.trim() ? undefined : 'Please enter your card number';
      case 'expiryDate':
        return value.trim() ? undefined : 'Please enter expiry date';
      case 'cvc':
        return value.trim() ? undefined : 'Please enter CVC';
      default:
        return undefined;
    }
  };

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleInputBlur = (name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof FormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Clear the cart after successful order
    clearCart();
    
    toast({
      title: "Order placed successfully!",
      description: "Thank you for your order! You will receive a confirmation email shortly.",
    });
    
    // Redirect to home page
    router.push('/');
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
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <p className="font-semibold text-sm md:text-base">${(item.price * item.quantity).toFixed(2)}</p>
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

        {/* Payment and Shipping Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <CreditCard className="h-6 w-6 text-primary" /> Shipping & Payment
            </CardTitle>
            <CardDescription className="text-sm md:text-base">Please enter your shipping and payment details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" noValidate>
              {/* Shipping Information */}
              <fieldset className="space-y-3 md:space-y-4">
                <legend className="text-base md:text-lg font-semibold mb-2 md:mb-3">Shipping Address</legend>
                <div>
                  <Label htmlFor="fullName" className="text-sm md:text-base">Full Name</Label>
                  <Input 
                    id="fullName" 
                    placeholder="John Doe" 
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    onBlur={() => handleInputBlur('fullName')}
                    className="mt-1 h-11 md:h-10" 
                  />
                  <FormValidation
                    isInvalid={!!errors.fullName}
                    message={errors.fullName}
                    show={touched.fullName && !!errors.fullName}
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-sm md:text-base">Address</Label>
                  <Input 
                    id="address" 
                    placeholder="123 Protein Lane" 
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onBlur={() => handleInputBlur('address')}
                    className="mt-1 h-11 md:h-10" 
                  />
                  <FormValidation
                    isInvalid={!!errors.address}
                    message={errors.address}
                    show={touched.address && !!errors.address}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm md:text-base">City</Label>
                    <Input 
                      id="city" 
                      placeholder="Fitville" 
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      onBlur={() => handleInputBlur('city')}
                      className="mt-1 h-11 md:h-10" 
                    />
                    <FormValidation
                      isInvalid={!!errors.city}
                      message={errors.city}
                      show={touched.city && !!errors.city}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip" className="text-sm md:text-base">ZIP Code</Label>
                    <Input 
                      id="zip" 
                      placeholder="90210" 
                      value={formData.zip}
                      onChange={(e) => handleInputChange('zip', e.target.value)}
                      onBlur={() => handleInputBlur('zip')}
                      className="mt-1 h-11 md:h-10" 
                    />
                    <FormValidation
                      isInvalid={!!errors.zip}
                      message={errors.zip}
                      show={touched.zip && !!errors.zip}
                    />
                  </div>
                </div>
              </fieldset>

              {/* Payment Information */}
              <fieldset className="space-y-3 md:space-y-4">
                <legend className="text-base md:text-lg font-semibold mb-2 md:mb-3">Payment Details</legend>
                <div>
                  <Label htmlFor="cardNumber" className="text-sm md:text-base">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="•••• •••• •••• ••••" 
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    onBlur={() => handleInputBlur('cardNumber')}
                    className="mt-1 h-11 md:h-10" 
                  />
                  <FormValidation
                    isInvalid={!!errors.cardNumber}
                    message={errors.cardNumber}
                    show={touched.cardNumber && !!errors.cardNumber}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label htmlFor="expiryDate" className="text-sm md:text-base">Expiry Date</Label>
                    <Input 
                      id="expiryDate" 
                      placeholder="MM/YY" 
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      onBlur={() => handleInputBlur('expiryDate')}
                      className="mt-1 h-11 md:h-10" 
                    />
                    <FormValidation
                      isInvalid={!!errors.expiryDate}
                      message={errors.expiryDate}
                      show={touched.expiryDate && !!errors.expiryDate}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc" className="text-sm md:text-base">CVC</Label>
                    <Input 
                      id="cvc" 
                      placeholder="•••" 
                      value={formData.cvc}
                      onChange={(e) => handleInputChange('cvc', e.target.value)}
                      onBlur={() => handleInputBlur('cvc')}
                      className="mt-1 h-11 md:h-10" 
                    />
                    <FormValidation
                      isInvalid={!!errors.cvc}
                      message={errors.cvc}
                      show={touched.cvc && !!errors.cvc}
                    />
                  </div>
                </div>
              </fieldset>
              
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 min-h-[48px]">
                <Lock className="mr-2 h-5 w-5" /> Place Secure Order
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 md:mt-10">
        <TrustBadges />
      </div>
    </div>
  );
}

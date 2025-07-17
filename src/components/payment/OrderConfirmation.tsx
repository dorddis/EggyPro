'use client';

import { CheckCircle, Package, CreditCard, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface OrderConfirmationProps {
  orderDetails: {
    orderId: string;
    paymentIntentId: string;
    status: 'succeeded';
    amount: number;
    timestamp: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  customerInfo: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  isDevelopmentOrder?: boolean;
}

export default function OrderConfirmation({
  orderDetails,
  items,
  customerInfo,
  isDevelopmentOrder = false,
}: OrderConfirmationProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
          {isDevelopmentOrder && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800">
                🎯 This is a portfolio demonstration - no real payment was processed. Thank you for exploring the checkout flow!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </CardTitle>
          <CardDescription>
            Order #{orderDetails.orderId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">Order Date</p>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(orderDetails.timestamp)}
              </p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Payment Status</p>
              <p className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="text-green-600 font-medium">Paid</span>
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Items */}
          <div>
            <h3 className="font-medium mb-3">Items Ordered</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex justify-between items-center font-bold text-lg">
              <p>Total</p>
              <p>${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="font-medium">{customerInfo.name}</p>
            <p>{customerInfo.address}</p>
            <p>{customerInfo.city}, {customerInfo.zip}</p>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Estimated Delivery:</strong> 3-5 business days
            </p>
            <p className="text-xs text-blue-600 mt-1">
              You will receive a tracking number via email once your order ships.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What&apos;s Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <p>✅ Order confirmation email sent</p>
            <p>📦 Order processing (1-2 business days)</p>
            <p>🚚 Shipping notification with tracking</p>
            <p>🎉 Delivery (3-5 business days)</p>
          </div>
          
          <div className="pt-4 space-y-2">
            <Button asChild className="w-full">
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Need help with your order? Contact us at{' '}
          <a href="mailto:support@eggypro.com" className="text-primary hover:underline">
            support@eggypro.com
          </a>
        </p>
      </div>
    </div>
  );
}
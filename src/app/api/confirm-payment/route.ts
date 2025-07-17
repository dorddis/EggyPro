import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';

export interface PaymentConfirmationRequest {
  paymentIntentId: string;
  paymentMethodType?: 'card' | 'bypass';
  customerInfo: {
    name: string;
    email?: string;
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
  amount: number;
}

export interface PaymentConfirmationResponse {
  paymentIntentId: string;
  status: 'succeeded' | 'failed' | 'processing';
  amount: number;
  currency: string;
  receiptUrl?: string;
  orderId: string;
  timestamp: string;
}

// Mock payment confirmation and database storage
async function processMockPaymentAndSaveOrder(data: PaymentConfirmationRequest): Promise<PaymentConfirmationResponse> {
  // Generate mock order ID
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  // Simulate different payment outcomes based on payment intent ID
  const shouldFail = data.paymentIntentId.includes('fail');
  const shouldProcess = data.paymentIntentId.includes('process');
  
  let status: 'succeeded' | 'failed' | 'processing' = 'succeeded';
  
  if (shouldFail) {
    status = 'failed';
  } else if (shouldProcess) {
    status = 'processing';
  }

  // If payment succeeded, save order to database
  if (status === 'succeeded') {
    try {
      // Insert order into database
      const [savedOrder] = await db.insert(orders).values({
        order_id: orderId,
        payment_intent_id: data.paymentIntentId,
        status: 'completed',
        total_amount: data.amount.toString(),
        currency: 'usd',
        customer_name: data.customerInfo.name,
        customer_email: data.customerInfo.email || null,
        shipping_address: data.customerInfo.address,
        shipping_city: data.customerInfo.city,
        shipping_zip: data.customerInfo.zip,
        payment_method: data.paymentMethodType || 'card',
        is_development_order: true, // Mark as development order
      }).returning();

      // Insert order items
      if (data.items && data.items.length > 0) {
        const orderItemsData = data.items.map(item => ({
          order_id: savedOrder.id,
          product_id: parseInt(item.id),
          product_name: item.name,
          product_price: item.price.toString(),
          quantity: item.quantity,
          line_total: (item.price * item.quantity).toString(),
        }));

        await db.insert(orderItems).values(orderItemsData);
      }

      console.log('✅ Order saved to database:', {
        orderId: savedOrder.order_id,
        dbId: savedOrder.id,
        itemCount: data.items?.length || 0,
      });

    } catch (dbError) {
      console.error('❌ Database error while saving order:', dbError);
      // Don't fail the payment, but log the error
      // In production, you might want to handle this differently
    }
  }
  
  return {
    paymentIntentId: data.paymentIntentId,
    status,
    amount: data.amount * 100, // Convert to cents for consistency
    currency: 'usd',
    receiptUrl: status === 'succeeded' ? `https://mock-receipts.com/${orderId}` : undefined,
    orderId,
    timestamp: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentConfirmationRequest = await request.json();
    
    // Validate request data
    if (!body.paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required.' },
        { status: 400 }
      );
    }
    
    if (!body.customerInfo || !body.customerInfo.name) {
      return NextResponse.json(
        { error: 'Customer information is required.' },
        { status: 400 }
      );
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate additional required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required.' },
        { status: 400 }
      );
    }

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Order amount is required.' },
        { status: 400 }
      );
    }
    
    // Process mock payment and save to database
    const result = await processMockPaymentAndSaveOrder(body);
    
    // Log the payment confirmation (for development)
    console.log('💳 Mock Payment Processed:', {
      orderId: result.orderId,
      status: result.status,
      amount: `$${(result.amount / 100).toFixed(2)}`,
      customer: body.customerInfo.name,
      paymentMethod: body.paymentMethodType || 'card',
    });
    
    // Simulate payment failure
    if (result.status === 'failed') {
      return NextResponse.json(
        { 
          error: 'Payment failed. Please check your payment information and try again.',
          paymentIntentId: body.paymentIntentId,
          code: 'card_declined'
        },
        { status: 402 }
      );
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Payment Confirmation API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process payment. Please try again.',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: 'Payment Confirmation API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
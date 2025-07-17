import { NextRequest, NextResponse } from 'next/server';
import { formatAmountForStripe } from '@/lib/stripe';

export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  customerInfo?: {
    name: string;
    email?: string;
  };
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'succeeded' | 'processing';
}

// Mock payment intent creation (simulates Stripe behavior)
function createMockPaymentIntent(data: PaymentIntentRequest): PaymentIntentResponse {
  // Generate mock IDs that look like Stripe IDs
  const paymentIntentId = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 16)}`;
  
  return {
    clientSecret,
    paymentIntentId,
    amount: formatAmountForStripe(data.amount),
    currency: data.currency.toLowerCase(),
    status: 'requires_payment_method',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentIntentRequest = await request.json();
    
    // Validate request data
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be greater than 0.' },
        { status: 400 }
      );
    }
    
    if (!body.currency) {
      return NextResponse.json(
        { error: 'Currency is required.' },
        { status: 400 }
      );
    }
    
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required.' },
        { status: 400 }
      );
    }
    
    // Validate that the amount matches the items total
    const calculatedTotal = body.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    if (Math.abs(calculatedTotal - body.amount) > 0.01) {
      return NextResponse.json(
        { error: 'Amount mismatch. Calculated total does not match provided amount.' },
        { status: 400 }
      );
    }
    
    // Create mock payment intent
    const paymentIntent = createMockPaymentIntent(body);
    
    // Log the payment intent creation (for development)
    console.log('🔄 Mock Payment Intent Created:', {
      id: paymentIntent.paymentIntentId,
      amount: `$${body.amount.toFixed(2)}`,
      items: body.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
      customer: body.customerInfo?.name || 'Anonymous',
    });
    
    return NextResponse.json(paymentIntent);
    
  } catch (error) {
    console.error('❌ Payment Intent API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent. Please try again.',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: 'Payment Intent API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

interface OrderItem {
  product_id?: string | number;
  id?: string | number;
  name?: string;
  product_name?: string;
  price?: number;
  product_price?: number;
  quantity: number;
}

// GET /api/orders - Fetch recent orders (for testing/admin purposes)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const developmentOnly = searchParams.get('dev') === 'true';

    // Build query
    let query = db.select().from(orders);
    
    if (developmentOnly) {
      query = query.where(eq(orders.is_development_order, true));
    }
    
    const recentOrders = await query
      .orderBy(desc(orders.created_at))
      .limit(Math.min(limit, 50)); // Cap at 50 orders

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      recentOrders.map(async (order) => {
        const items = await db.select()
          .from(orderItems)
          .where(eq(orderItems.order_id, order.id));
        
        return {
          ...order,
          items,
        };
      })
    );

    return NextResponse.json({
      orders: ordersWithItems,
      count: ordersWithItems.length,
      message: developmentOnly ? 'Development orders only' : 'All orders',
    });

  } catch (error) {
    console.error('❌ Orders API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order (alternative to payment confirmation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.order_id || !body.customer_name || !body.total_amount) {
      return NextResponse.json(
        { error: 'Missing required fields: order_id, customer_name, total_amount' },
        { status: 400 }
      );
    }

    // Insert order
    const [newOrder] = await db.insert(orders).values({
      order_id: body.order_id,
      payment_intent_id: body.payment_intent_id || `pi_manual_${Date.now()}`,
      status: body.status || 'completed',
      total_amount: body.total_amount.toString(),
      currency: body.currency || 'usd',
      customer_name: body.customer_name,
      customer_email: body.customer_email || null,
      shipping_address: body.shipping_address || 'N/A',
      shipping_city: body.shipping_city || 'N/A',
      shipping_zip: body.shipping_zip || 'N/A',
      payment_method: body.payment_method || 'manual',
      is_development_order: body.is_development_order || false,
    }).returning();

    // Insert order items if provided
    if (body.items && Array.isArray(body.items)) {
      const orderItemsData = body.items.map((item: OrderItem) => ({
        order_id: newOrder.id,
        product_id: parseInt(item.product_id || item.id),
        product_name: item.name || item.product_name,
        product_price: (item.price || item.product_price).toString(),
        quantity: item.quantity,
        line_total: ((item.price || item.product_price) * item.quantity).toString(),
      }));

      await db.insert(orderItems).values(orderItemsData);
    }

    console.log('✅ Manual order created:', {
      orderId: newOrder.order_id,
      dbId: newOrder.id,
      customer: newOrder.customer_name,
    });

    return NextResponse.json({
      message: 'Order created successfully',
      order: newOrder,
    });

  } catch (error) {
    console.error('❌ Create Order API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}
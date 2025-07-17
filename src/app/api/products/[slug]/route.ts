import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, reviews } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, params.slug))
      .limit(1);

    if (!product.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get reviews for this product
    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.product_id, product[0].id));

    const productWithReviews = {
      ...product[0],
      reviews: productReviews,
    };

    return NextResponse.json(productWithReviews);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const updates: any = {};

    // Handle form data updates
    ['name', 'description', 'details', 'price', 'stock_quantity'].forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        if (field === 'price') {
          updates[field] = parseFloat(value as string).toString();
        } else if (field === 'stock_quantity') {
          updates[field] = parseInt(value as string);
        } else {
          updates[field] = value;
        }
      }
    });

    // Handle ingredients if provided
    const ingredientsValue = formData.get('ingredients');
    if (ingredientsValue) {
      updates.ingredients = JSON.parse(ingredientsValue as string);
    }

    // Add updated timestamp
    updates.updated_at = new Date();

    const updatedProduct = await db
      .update(products)
      .set(updates)
      .where(eq(products.slug, params.slug))
      .returning();

    if (!updatedProduct.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Delete reviews first (due to foreign key constraint)
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, params.slug))
      .limit(1);

    if (!product.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    await db.delete(reviews).where(eq(reviews.product_id, product[0].id));
    await db.delete(products).where(eq(products.slug, params.slug));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
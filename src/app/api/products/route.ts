import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');

    let query = db.select().from(products).where(eq(products.is_active, true));
    
    if (category) {
      // Add category filtering logic when categories are implemented
    }
    
    if (sort === 'price-asc') {
      query = query.orderBy(asc(products.price));
    } else if (sort === 'price-desc') {
      query = query.orderBy(desc(products.price));
    } else {
      query = query.orderBy(desc(products.created_at));
    }

    const allProducts = await query;
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const details = formData.get('details') as string;
    const price = parseFloat(formData.get('price') as string);
    const stockQuantity = parseInt(formData.get('stock_quantity') as string) || 0;
    const ingredients = JSON.parse(formData.get('ingredients') as string || '[]');

    // Validate required fields
    if (!name || !slug || !description || !details || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle image uploads (will be implemented with Cloudinary integration)
    const images: string[] = [];

    const newProduct = await db.insert(products).values({
      name,
      slug,
      description,
      details,
      price: price.toString(),
      stock_quantity: stockQuantity,
      ingredients,
      images,
    }).returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
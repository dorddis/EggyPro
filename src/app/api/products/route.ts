import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/fallback-data';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  console.log('API: Products endpoint called');
  
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort');

    console.log('API: Processing products request with sort:', sort);

    // Try Supabase first, fallback to mock data
    try {
      console.log('API: Attempting Supabase connection...');
      const { supabase } = await import('@/lib/db');
      
      // Build Supabase query
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      
      // Apply sorting
      if (sort === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (sort === 'price-desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: allProducts, error } = await query;
      
      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }
      
      console.log('API: Supabase query successful, returning', allProducts?.length || 0, 'products');
      
      // Return in new format
      return NextResponse.json({
        data: allProducts || [],
        meta: {
          total: allProducts?.length || 0,
          fallback: false
        }
      });
      
    } catch (dbError) {
      console.warn('API: Supabase connection failed, using mock data:', dbError);
      
      // Apply sorting to mock data
      const sortedProducts = [...mockProducts];
      if (sort === 'price-asc') {
        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sort === 'price-desc') {
        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      }
      
      console.log('API: Returning', sortedProducts.length, 'mock products');
      
      // Return in new format
      return NextResponse.json({
        data: sortedProducts,
        meta: {
          total: sortedProducts.length,
          fallback: true
        }
      });
    }
    
  } catch (error) {
    console.error('API: Critical error:', error);
    
    // Even on critical error, return mock products
    return NextResponse.json({
      data: mockProducts,
      meta: {
        total: mockProducts.length,
        fallback: true
      }
    });
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
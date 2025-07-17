import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { ApiErrorHandler } from '@/lib/error-handler';
import { logger } from '@/lib/logging';
import { mockProducts } from '@/lib/fallback-data';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const endpoint = '/api/products';
  
  logger.apiRequest(endpoint, 'GET');

  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort');

    logger.info('PRODUCTS_API', 'Processing products request', { sort });

    // Try Supabase first, with fallback to mock data
    const { data: productsData, error: dbError, usedFallback } = await ApiErrorHandler.safeAsync(
      async () => {
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
          throw new Error(`Supabase products query failed: ${error.message}`);
        }
        
        return allProducts || [];
      },
      'PRODUCTS_API_DB'
    );

    // If database failed, use fallback products
    if (dbError && !productsData) {
      logger.warn('PRODUCTS_API', 'Database failed, using fallback data', { error: dbError.message });
      
      // Apply sorting to mock data
      let sortedProducts = [...mockProducts];
      if (sort === 'price-asc') {
        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sort === 'price-desc') {
        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      }

      const duration = Date.now() - startTime;
      logger.apiResponse(endpoint, 200, duration);
      logger.warn('PRODUCTS_API', 'Using fallback products data', { count: sortedProducts.length });

      return ApiErrorHandler.createSuccessResponse(sortedProducts, {
        total: sortedProducts.length,
        fallback: true
      });
    }

    // Handle successful database products
    if (productsData) {
      const duration = Date.now() - startTime;
      logger.apiResponse(endpoint, 200, duration);
      
      if (usedFallback) {
        logger.warn('PRODUCTS_API', 'Using fallback products data', { count: productsData.length });
      }

      return ApiErrorHandler.createSuccessResponse(productsData, {
        total: productsData.length,
        fallback: usedFallback
      });
    }

    // If we reach here, no products data was available
    logger.warn('PRODUCTS_API', 'No products data available, using fallback');
    return ApiErrorHandler.createSuccessResponse(mockProducts, {
      total: mockProducts.length,
      fallback: true
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError(endpoint, error, { duration });
    
    // Even on critical error, try to return fallback products
    logger.warn('PRODUCTS_API', 'Critical error, returning fallback products', error);
    return ApiErrorHandler.createSuccessResponse(mockProducts, {
      total: mockProducts.length,
      fallback: true
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
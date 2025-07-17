import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, reviews } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ApiErrorHandler } from '@/lib/error-handler';
import { logger } from '@/lib/logging';
import { findProductBySlug, getProductReviews } from '@/lib/fallback-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const startTime = Date.now();
  const endpoint = `/api/products/${params.slug}`;
  
  logger.apiRequest(endpoint, 'GET', { slug: params.slug });

  try {
    // Validate slug parameter
    if (!ApiErrorHandler.validateSlug(params.slug)) {
      logger.apiError(endpoint, new Error('Invalid slug parameter'), { slug: params.slug });
      return ApiErrorHandler.createErrorResponse('Invalid product slug', 400);
    }

    // Try Supabase first, with fallback to mock data
    const { data: productData, error: dbError, usedFallback } = await ApiErrorHandler.safeAsync(
      async () => {
        const { supabase } = await import('@/lib/db');
        
        // Get product by slug
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('slug', params.slug)
          .eq('is_active', true)
          .single();

        if (productError) {
          throw new Error(`Product query failed: ${productError.message}`);
        }

        if (!product) {
          throw new Error('Product not found in database');
        }

        // Get reviews for this product
        const { data: productReviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', product.id);

        if (reviewsError) {
          logger.warn('PRODUCT_API', 'Failed to fetch reviews, continuing without them', reviewsError);
        }

        return {
          ...product,
          reviews: productReviews || [],
        };
      },
      'PRODUCT_API_DB'
    );

    // If database failed, try fallback data
    if (dbError && !productData) {
      const product = findProductBySlug(params.slug);
      if (!product) {
        logger.apiError(endpoint, new Error('Product not found in fallback data'), { slug: params.slug });
        return ApiErrorHandler.createErrorResponse('Product not found', 404);
      }

      const productReviews = getProductReviews(product.id);
      const fallbackData = {
        ...product,
        reviews: productReviews,
      };

      const duration = Date.now() - startTime;
      logger.apiResponse(endpoint, 200, duration);
      logger.warn('PRODUCT_API', 'Using fallback data for product', { slug: params.slug });

      return ApiErrorHandler.createSuccessResponse(fallbackData, { 
        fallback: true 
      });
    }

    // Handle case where we have data from database
    if (productData) {
      const duration = Date.now() - startTime;
      logger.apiResponse(endpoint, 200, duration);

      if (usedFallback) {
        logger.warn('PRODUCT_API', 'Using fallback data for product', { slug: params.slug });
      }

      return ApiErrorHandler.createSuccessResponse(productData, { 
        fallback: usedFallback 
      });
    }

    // If we reach here, no product data was found
    logger.apiError(endpoint, new Error('No product data available'), { slug: params.slug });
    return ApiErrorHandler.createErrorResponse('Product not found', 404);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError(endpoint, error, { slug: params.slug, duration });
    return ApiErrorHandler.createErrorResponse(
      'Failed to fetch product',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const endpoint = `/api/products/${params.slug}`;
  logger.apiRequest(endpoint, 'PUT', { slug: params.slug });

  try {
    // Validate slug parameter
    if (!ApiErrorHandler.validateSlug(params.slug)) {
      logger.apiError(endpoint, new Error('Invalid slug parameter'), { slug: params.slug });
      return ApiErrorHandler.createErrorResponse('Invalid product slug', 400);
    }

    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      logger.apiError(endpoint, new Error('Unauthorized access attempt'), { slug: params.slug });
      return ApiErrorHandler.createErrorResponse('Authentication required', 401);
    }

    const formData = await request.formData();
    const updates: {
      name?: string;
      description?: string;
      details?: string;
      price?: string;
      stock_quantity?: number;
      ingredients?: string[];
      updated_at?: Date;
    } = {};

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
      logger.apiError(endpoint, new Error('Product not found for update'), { slug: params.slug });
      return ApiErrorHandler.createErrorResponse('Product not found', 404);
    }

    logger.apiResponse(endpoint, 200);
    return ApiErrorHandler.createSuccessResponse(updatedProduct[0]);
  } catch (error) {
    logger.apiError(endpoint, error, { slug: params.slug });
    return ApiErrorHandler.createErrorResponse(
      'Failed to update product',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const endpoint = `/api/products/${params.slug}`;
  logger.apiRequest(endpoint, 'DELETE', { slug: params.slug });

  try {
    // Validate slug parameter
    if (!ApiErrorHandler.validateSlug(params.slug)) {
      logger.apiError(endpoint, new Error('Invalid slug parameter'), { slug: params.slug });
      return ApiErrorHandler.createErrorResponse('Invalid product slug', 400);
    }

    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      logger.apiError(endpoint, new Error('Unauthorized delete attempt'), { slug: params.slug });
      return ApiErrorHandler.createErrorResponse('Authentication required', 401);
    }

    // Delete reviews first (due to foreign key constraint)
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, params.slug))
      .limit(1);

    if (!product.length) {
      logger.apiError(endpoint, new Error('Product not found for deletion'), { slug: params.slug });
      return ApiErrorHandler.createErrorResponse('Product not found', 404);
    }

    await db.delete(reviews).where(eq(reviews.product_id, product[0].id));
    await db.delete(products).where(eq(products.slug, params.slug));

    logger.apiResponse(endpoint, 204);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.apiError(endpoint, error, { slug: params.slug });
    return ApiErrorHandler.createErrorResponse(
      'Failed to delete product',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
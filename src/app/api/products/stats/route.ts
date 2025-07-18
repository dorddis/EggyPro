import { NextRequest } from 'next/server';
import { ApiErrorHandler } from '@/lib/error-handler';
import { logger } from '@/lib/logging';
import { mockStats } from '@/lib/fallback-data';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  const startTime = Date.now();
  const endpoint = '/api/products/stats';

  logger.apiRequest(endpoint, 'GET');

  try {
    // Try Supabase first, with fallback to mock data
    const { data: statsData, error: dbError, usedFallback } = await ApiErrorHandler.safeAsync(
      async () => {
        const { supabase } = await import('@/lib/db');

        // Initialize stats object with fallback values
        const stats = {
          totalProducts: 0,
          totalStock: 0,
          totalReviews: 0,
          averageRating: '0.0',
          lowStockProducts: [] as any[],
          summary: {
            inStock: 0,
            outOfStock: 0,
            lowStock: 0
          }
        };

        // Get total products with individual error handling
        try {
          const { data: productCount, error: productError } = await supabase
            .from('products')
            .select('id', { count: 'exact' })
            .eq('is_active', true);

          if (!productError && productCount) {
            stats.totalProducts = productCount.length;
          }
        } catch (error) {
          logger.warn('STATS_API', 'Failed to get total products, using fallback', error as Record<string, unknown>);
        }

        // Get total stock with individual error handling
        try {
          const { data: products, error: stockError } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('is_active', true);

          if (!stockError && products) {
            stats.totalStock = products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);
          }
        } catch (error) {
          logger.warn('STATS_API', 'Failed to get total stock, using fallback', error as Record<string, unknown>);
        }

        // Get review stats with individual error handling
        try {
          const { data: reviews, error: reviewError } = await supabase
            .from('reviews')
            .select('rating');

          if (!reviewError && reviews) {
            stats.totalReviews = reviews.length;
            if (reviews.length > 0) {
              const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
              stats.averageRating = avgRating.toFixed(1);
            }
          }
        } catch (error) {
          logger.warn('STATS_API', 'Failed to get review stats, using fallback', error as Record<string, unknown>);
        }

        // Get low stock products with individual error handling
        try {
          const { data: lowStockProducts, error: lowStockError } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .lt('stock_quantity', 70)
            .order('stock_quantity', { ascending: true })
            .limit(10);

          if (!lowStockError && lowStockProducts) {
            stats.lowStockProducts = lowStockProducts;

            // Calculate summary
            stats.summary = {
              inStock: lowStockProducts.filter(p => p.stock_quantity > 0).length,
              outOfStock: lowStockProducts.filter(p => p.stock_quantity === 0).length,
              lowStock: lowStockProducts.filter(p => p.stock_quantity > 0 && p.stock_quantity < 50).length
            };
          }
        } catch (error) {
          logger.warn('STATS_API', 'Failed to get low stock products, using fallback', error as Record<string, unknown>);
        }

        return stats;
      },
      'STATS_API_DB'
    );

    // If database failed completely, use fallback stats
    if (dbError && !statsData) {
      logger.warn('STATS_API', 'Database stats failed, using fallback data', { error: (dbError as Error)?.message || 'Unknown error' });

      const duration = Date.now() - startTime;
      logger.apiResponse(endpoint, 200, duration);
      logger.warn('STATS_API', 'Using fallback stats data');

      return ApiErrorHandler.createSuccessResponse(mockStats, {
        fallback: true
      });
    }

    // Handle successful database stats
    if (statsData) {
      const duration = Date.now() - startTime;
      logger.apiResponse(endpoint, 200, duration);

      if (usedFallback) {
        logger.warn('STATS_API', 'Using fallback stats data');
      }

      return ApiErrorHandler.createSuccessResponse(statsData, {
        fallback: usedFallback
      });
    }

    // If we reach here, no stats data was available
    logger.warn('STATS_API', 'No stats data available, using fallback');
    return ApiErrorHandler.createSuccessResponse(mockStats, {
      fallback: true
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError(endpoint, error, { duration });

    // Even on error, try to return fallback stats
    logger.warn('STATS_API', 'Critical error, returning fallback stats', error as Record<string, unknown>);
    return ApiErrorHandler.createSuccessResponse(mockStats, {
      fallback: true
    });
  }
}
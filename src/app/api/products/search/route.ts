import { NextRequest } from 'next/server';
import { ApiErrorHandler } from '@/lib/error-handler';
import { logger } from '@/lib/logging';
import { searchMockProducts } from '@/lib/fallback-data';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const endpoint = '/api/products/search';
  
  logger.apiRequest(endpoint, 'GET');

  try {
    const { searchParams } = new URL(request.url);
    
    // Validate and sanitize search parameters
    const validatedParams = ApiErrorHandler.validateSearchParams(searchParams);
    
    logger.info('SEARCH_API', 'Processing search request', validatedParams);

    // Try Supabase first, with fallback to mock data
    const { data: searchResults, error: dbError, usedFallback } = await ApiErrorHandler.safeAsync(
      async () => {
        const { supabase } = await import('@/lib/db');
        
        // Build Supabase query
        let dbQuery = supabase
          .from('products')
          .select('*')
          .eq('is_active', true);
        
        // Text search - use ilike for case-insensitive search
        if (validatedParams.query) {
          dbQuery = dbQuery.or(`name.ilike.%${validatedParams.query}%,description.ilike.%${validatedParams.query}%`);
        }
        
        // Price filtering
        if (validatedParams.minPrice !== undefined) {
          dbQuery = dbQuery.gte('price', validatedParams.minPrice.toString());
        }
        if (validatedParams.maxPrice !== undefined) {
          dbQuery = dbQuery.lte('price', validatedParams.maxPrice.toString());
        }
        
        // Stock filtering
        if (validatedParams.inStock === true) {
          dbQuery = dbQuery.gte('stock_quantity', 1);
        }
        
        // Apply pagination
        if (validatedParams.limit) {
          dbQuery = dbQuery.limit(validatedParams.limit);
        }
        if (validatedParams.offset) {
          dbQuery = dbQuery.range(validatedParams.offset, validatedParams.offset + (validatedParams.limit || 50) - 1);
        }
        
        // Sorting
        switch (validatedParams.sort) {
          case 'price-asc':
            dbQuery = dbQuery.order('price', { ascending: true });
            break;
          case 'price-desc':
            dbQuery = dbQuery.order('price', { ascending: false });
            break;
          case 'name-asc':
            dbQuery = dbQuery.order('name', { ascending: true });
            break;
          case 'stock-desc':
            dbQuery = dbQuery.order('stock_quantity', { ascending: false });
            break;
          case 'newest':
          default:
            dbQuery = dbQuery.order('created_at', { ascending: false });
            break;
        }

        const { data: results, error } = await dbQuery;
        
        if (error) {
          throw new Error(`Supabase search query failed: ${error.message}`);
        }
        
        return results || [];
      },
      'SEARCH_API_DB'
    );

    // If database failed, use fallback search
    if (dbError && !searchResults) {
      logger.warn('SEARCH_API', 'Database search failed, using fallback data', { error: dbError.message });
      
      const fallbackResults = searchMockProducts({
        query: validatedParams.query,
        minPrice: validatedParams.minPrice,
        maxPrice: validatedParams.maxPrice,
        sort: validatedParams.sort,
        inStock: validatedParams.inStock
      });

      // Apply pagination to fallback results
      let paginatedResults = fallbackResults;
      if (validatedParams.offset || validatedParams.limit) {
        const start = validatedParams.offset || 0;
        const end = start + (validatedParams.limit || 50);
        paginatedResults = fallbackResults.slice(start, end);
      }

      const duration = Date.now() - startTime;
      logger.apiResponse(endpoint, 200, duration);
      logger.warn('SEARCH_API', 'Using fallback search results', { 
        resultCount: paginatedResults.length,
        totalCount: fallbackResults.length
      });

      return ApiErrorHandler.createSuccessResponse(paginatedResults, {
        total: fallbackResults.length,
        query: validatedParams,
        fallback: true
      });
    }

    // Handle successful database search
    if (searchResults) {
      const duration = Date.now() - startTime;
      logger.apiResponse(endpoint, 200, duration);
      
      if (usedFallback) {
        logger.warn('SEARCH_API', 'Using fallback search results', { resultCount: searchResults.length });
      }

      return ApiErrorHandler.createSuccessResponse(searchResults, {
        total: searchResults.length,
        query: validatedParams,
        fallback: usedFallback
      });
    }

    // If we reach here, no search results were found
    logger.info('SEARCH_API', 'No search results found', validatedParams);
    return ApiErrorHandler.createSuccessResponse([], {
      total: 0,
      query: validatedParams
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError(endpoint, error, { duration });
    return ApiErrorHandler.createErrorResponse(
      'Failed to search products',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
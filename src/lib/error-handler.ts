import { NextResponse } from 'next/server';

// Standardized API response interfaces
export interface ApiErrorResponse {
    error: string;
    details?: string;
    fallback?: boolean;
    timestamp: string;
}

export interface ApiSuccessResponse<T> {
    data: T;
    meta?: {
        total?: number;
        query?: Record<string, string | number | boolean>;
    };
}

// Error logging interface
export interface ErrorLog {
    timestamp: string;
    endpoint: string;
    error: string;
    details?: Record<string, unknown>;
    userAgent?: string;
    ip?: string;
}

export class ApiErrorHandler {
    /**
     * Handle database connection errors with fallback options
     */
    static handleDatabaseError(
        error: Error | unknown,
        context: string,
        fallbackData?: unknown
    ): NextResponse {
        this.logError(context, error);

        if (fallbackData) {
            return NextResponse.json({
                data: fallbackData,
                meta: { fallback: true },
                timestamp: new Date().toISOString()
            });
        }

        return this.createErrorResponse(
            'Database connection failed',
            500,
            error instanceof Error ? error.message : 'Unknown error'
        );
    }

    /**
     * Create standardized error response
     */
    static createErrorResponse(
        message: string,
        status: number,
        details?: string
    ): NextResponse {
        const errorResponse: ApiErrorResponse = {
            error: message,
            details: details,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(errorResponse, { status });
    }

    /**
     * Create standardized success response
     */
    static createSuccessResponse<T>(
        data: T,
        meta?: { total?: number; query?: Record<string, string | number | boolean>; fallback?: boolean }
    ): NextResponse {
        const response: ApiSuccessResponse<T> = {
            data,
            ...(meta && { meta })
        };

        return NextResponse.json(response);
    }

    /**
     * Log errors with context for debugging
     */
    static logError(context: string, error: Error | unknown, additionalInfo?: Record<string, unknown>): void {
        const errorLog: ErrorLog = {
            timestamp: new Date().toISOString(),
            endpoint: context,
            error: error instanceof Error ? error.message : 'Unknown error',
            details: {
                stack: error instanceof Error ? error.stack : undefined,
                code: error && typeof error === 'object' && 'code' in error ? (error as { code: unknown }).code : undefined,
                ...additionalInfo
            }
        };

        console.error(`[${context}] Error:`, errorLog);
    }

    /**
     * Validate and sanitize search parameters
     */
    static validateSearchParams(params: URLSearchParams): {
        query?: string;
        minPrice?: number;
        maxPrice?: number;
        sort?: string;
        inStock?: boolean;
        limit?: number;
        offset?: number;
    } {
        const validated: {
            query?: string;
            minPrice?: number;
            maxPrice?: number;
            sort?: string;
            inStock?: boolean;
            limit?: number;
            offset?: number;
        } = {};

        // Text query
        const query = params.get('q');
        if (query && typeof query === 'string' && query.trim().length > 0) {
            validated.query = query.trim().substring(0, 100); // Limit length
        }

        // Price filters
        const minPrice = params.get('minPrice');
        if (minPrice) {
            const parsed = parseFloat(minPrice);
            if (!isNaN(parsed) && parsed >= 0) {
                validated.minPrice = parsed;
            }
        }

        const maxPrice = params.get('maxPrice');
        if (maxPrice) {
            const parsed = parseFloat(maxPrice);
            if (!isNaN(parsed) && parsed >= 0) {
                validated.maxPrice = parsed;
            }
        }

        // Sort parameter
        const sort = params.get('sort');
        const validSorts = ['price-asc', 'price-desc', 'name-asc', 'stock-desc', 'newest'];
        if (sort && validSorts.includes(sort)) {
            validated.sort = sort;
        }

        // Stock filter
        const inStock = params.get('inStock');
        if (inStock === 'true' || inStock === 'false') {
            validated.inStock = inStock === 'true';
        }

        // Pagination
        const limit = params.get('limit');
        if (limit) {
            const parsed = parseInt(limit);
            if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
                validated.limit = parsed;
            }
        }

        const offset = params.get('offset');
        if (offset) {
            const parsed = parseInt(offset);
            if (!isNaN(parsed) && parsed >= 0) {
                validated.offset = parsed;
            }
        }

        return validated;
    }

    /**
     * Validate product slug parameter
     */
    static validateSlug(slug: string): boolean {
        if (!slug || typeof slug !== 'string') {
            return false;
        }

        // Check for valid slug format (letters, numbers, hyphens)
        const slugRegex = /^[a-z0-9-]+$/;
        return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
    }

    /**
     * Handle async operations with error catching
     */
    static async safeAsync<T>(
        operation: () => Promise<T>,
        context: string,
        fallback?: T
    ): Promise<{ data?: T; error?: Error | unknown; usedFallback?: boolean }> {
        try {
            const data = await operation();
            return { data };
        } catch (error) {
            this.logError(context, error);

            if (fallback !== undefined) {
                return { data: fallback, usedFallback: true };
            }

            return { error };
        }
    }
}
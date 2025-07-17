'use client';

import { useState, useCallback } from 'react';
import { logger } from '@/lib/logging';

interface UseApiWithRetryOptions<T> {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retryCount: number;
}

export function useApiWithRetry<T>(
  apiFunction: () => Promise<T>,
  options: UseApiWithRetryOptions<T> = {}
) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onSuccess
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0
  });

  const execute = useCallback(async (retryCount = 0): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiFunction();
      setState({
        data,
        loading: false,
        error: null,
        retryCount
      });

      if (onSuccess) {
        onSuccess(data);
      }

      logger.info('API_RETRY', 'API call successful', { retryCount });
    } catch (error) {
      const apiError = error instanceof Error ? error : new Error('Unknown error');
      
      logger.error('API_RETRY', 'API call failed', { 
        error: apiError.message, 
        retryCount,
        maxRetries 
      });

      if (retryCount < maxRetries) {
        logger.info('API_RETRY', `Retrying in ${retryDelay}ms`, { retryCount: retryCount + 1 });
        
        setTimeout(() => {
          execute(retryCount + 1);
        }, retryDelay * Math.pow(2, retryCount)); // Exponential backoff
      } else {
        setState({
          data: null,
          loading: false,
          error: apiError,
          retryCount
        });

        if (onError) {
          onError(apiError);
        }
      }
    }
  }, [apiFunction, maxRetries, retryDelay, onError, onSuccess]);

  const retry = useCallback(() => {
    execute(0);
  }, [execute]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      retryCount: 0
    });
  }, []);

  return {
    ...state,
    execute,
    retry,
    reset,
    canRetry: state.retryCount < maxRetries
  };
}

// Specialized hook for product fetching
export function useProductWithRetry(slug: string) {
  return useApiWithRetry(
    async () => {
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      return response.json();
    },
    {
      maxRetries: 2,
      retryDelay: 1000,
      onError: (error) => {
        logger.error('PRODUCT_FETCH', 'Failed to fetch product after retries', { slug, error: error.message });
      }
    }
  );
}

// Specialized hook for search with retry
export function useSearchWithRetry(searchParams: URLSearchParams) {
  return useApiWithRetry(
    async () => {
      const response = await fetch(`/api/products/search?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      return response.json();
    },
    {
      maxRetries: 2,
      retryDelay: 500,
      onError: (error) => {
        logger.error('SEARCH_FETCH', 'Failed to search products after retries', { 
          params: Object.fromEntries(searchParams.entries()), 
          error: error.message 
        });
      }
    }
  );
}
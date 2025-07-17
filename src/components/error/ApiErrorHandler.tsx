'use client';

import React from 'react';
import { ErrorMessage, NetworkError, NotFoundError, FallbackDataNotice } from './ErrorMessage';

interface ApiErrorHandlerProps {
  error: Error | null;
  loading: boolean;
  fallbackUsed?: boolean;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function ApiErrorHandler({
  error,
  loading,
  fallbackUsed = false,
  onRetry,
  children
}: ApiErrorHandlerProps) {
  // Show loading state
  if (loading) {
    return <>{children}</>;
  }

  // Show fallback notice if using cached/fallback data
  if (fallbackUsed && !error) {
    return (
      <>
        <div className="mb-4">
          <FallbackDataNotice />
        </div>
        {children}
      </>
    );
  }

  // Handle different types of errors
  if (error) {
    // Network/connection errors
    if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('connection')) {
      return <NetworkError onRetry={onRetry} />;
    }

    // 404 errors
    if (error.message.includes('404') || error.message.includes('not found')) {
      return <NotFoundError />;
    }

    // Generic API errors
    return (
      <ErrorMessage
        title="API Error"
        message="We encountered an error while loading the data."
        details={error.message}
        onRetry={onRetry}
      />
    );
  }

  // No error, render children normally
  return <>{children}</>;
}

// Higher-order component for wrapping components with API error handling
export function withApiErrorHandler<P extends object>(
  Component: React.ComponentType<P>,
  getErrorProps: (props: P) => {
    error: Error | null;
    loading: boolean;
    fallbackUsed?: boolean;
    onRetry?: () => void;
  }
) {
  return function WrappedComponent(props: P) {
    const errorProps = getErrorProps(props);
    
    return (
      <ApiErrorHandler {...errorProps}>
        <Component {...props} />
      </ApiErrorHandler>
    );
  };
}
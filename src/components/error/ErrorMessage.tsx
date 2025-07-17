'use client';

import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  variant?: 'error' | 'warning' | 'info';
}

export function ErrorMessage({
  title = 'Error',
  message,
  details,
  onRetry,
  showRetry = true,
  variant = 'error'
}: ErrorMessageProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: '⚠️',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'ℹ️',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
      default:
        return {
          container: 'bg-red-50 border-red-200',
          icon: '❌',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`border rounded-lg p-4 ${styles.container}`}>
      <div className="flex items-start">
        <div className={`text-xl mr-3 ${styles.iconColor}`}>
          {styles.icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${styles.titleColor}`}>
            {title}
          </h3>
          <p className={`mt-1 ${styles.messageColor}`}>
            {message}
          </p>
          {details && (
            <details className="mt-2">
              <summary className={`cursor-pointer text-sm ${styles.messageColor} hover:underline`}>
                Show details
              </summary>
              <pre className={`mt-2 text-xs ${styles.messageColor} bg-white bg-opacity-50 p-2 rounded overflow-x-auto`}>
                {details}
              </pre>
            </details>
          )}
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 px-3 py-1 text-sm text-white rounded-md transition-colors ${styles.buttonColor}`}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Specialized error message components
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorMessage
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
      variant="warning"
    />
  );
}

export function NotFoundError({ message = "The requested item could not be found." }: { message?: string }) {
  return (
    <ErrorMessage
      title="Not Found"
      message={message}
      showRetry={false}
      variant="info"
    />
  );
}

export function FallbackDataNotice() {
  return (
    <ErrorMessage
      title="Using Offline Data"
      message="We're currently using cached data. Some information may not be up to date."
      showRetry={false}
      variant="warning"
    />
  );
}
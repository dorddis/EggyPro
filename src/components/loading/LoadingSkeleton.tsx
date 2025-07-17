'use client';

import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function LoadingSkeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
      default:
        return '';
    }
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? width : undefined)
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()} mb-2 last:mb-0`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  );
}

// Specialized skeleton components
export function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <LoadingSkeleton variant="rectangular" height="200px" />
      <div className="space-y-2">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="text" width="60%" />
        <LoadingSkeleton variant="text" width="40%" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image skeleton */}
        <div className="space-y-4">
          <LoadingSkeleton variant="rectangular" height="400px" />
          <div className="flex space-x-2">
            {Array.from({ length: 4}).map((_, index) => (
              <LoadingSkeleton key={index} variant="rectangular" width="80px" height="80px" />
            ))}
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-6">
          <LoadingSkeleton variant="text" height="32px" />
          <LoadingSkeleton variant="text" lines={3} />
          <LoadingSkeleton variant="text" width="120px" height="24px" />
          <LoadingSkeleton variant="rectangular" height="48px" />
          <LoadingSkeleton variant="text" lines={4} />
        </div>
      </div>
      
      {/* Reviews skeleton */}
      <div className="mt-12 space-y-4">
        <LoadingSkeleton variant="text" width="200px" height="24px" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <LoadingSkeleton variant="circular" width="40px" height="40px" />
              <div className="space-y-1">
                <LoadingSkeleton variant="text" width="120px" />
                <LoadingSkeleton variant="text" width="80px" />
              </div>
            </div>
            <LoadingSkeleton variant="text" lines={2} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 space-y-2">
          <LoadingSkeleton variant="text" width="60%" />
          <LoadingSkeleton variant="text" height="32px" width="80px" />
        </div>
      ))}
    </div>
  );
}
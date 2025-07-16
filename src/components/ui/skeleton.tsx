import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animated?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = true,
  animated = true
}) => {
  return (
    <div
      className={cn(
        'bg-muted',
        rounded && 'rounded',
        animated && 'animate-pulse',
        className
      )}
      style={{
        width: width,
        height: height,
      }}
      aria-hidden="true"
    />
  );
};

export { Skeleton };

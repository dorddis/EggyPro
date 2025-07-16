'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GPUAcceleratedProps {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
}

export function GPUAccelerated({ 
  children, 
  className = '', 
  enabled = true 
}: GPUAcceleratedProps) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div 
      className={cn(
        'transform-gpu will-change-transform',
        className
      )}
      style={{
        transform: 'translateZ(0)', // Force GPU acceleration
      }}
    >
      {children}
    </div>
  );
} 
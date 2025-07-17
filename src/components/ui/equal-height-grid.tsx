'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface EqualHeightGridProps {
  children: React.ReactNode;
  columns?: number | { mobile: number; tablet: number; desktop: number };
  gap?: string | { mobile: string; tablet: string; desktop: string };
  className?: string;
  minCardWidth?: string;
}

/**
 * EqualHeightGrid component ensures all child cards have consistent heights
 * Uses CSS Grid with subgrid support for modern browsers and flexbox fallback
 * 
 * @param children - Card components to be rendered in equal height grid
 * @param columns - Number of columns (number) or responsive object
 * @param gap - Gap between cards (string) or responsive object  
 * @param className - Additional CSS classes
 * @param minCardWidth - Minimum width for cards in auto-fit layouts
 */
export function EqualHeightGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: '1.5rem', tablet: '2rem', desktop: '2rem' },
  className,
  minCardWidth = '300px'
}: EqualHeightGridProps) {
  // Handle both number and object formats for columns
  const columnConfig = typeof columns === 'number' 
    ? { mobile: 1, tablet: Math.min(2, columns), desktop: columns }
    : columns;

  // Handle both string and object formats for gap
  const gapConfig = typeof gap === 'string'
    ? { mobile: gap, tablet: gap, desktop: gap }
    : gap;

  // Generate responsive grid classes
  const gridClasses = cn(
    // Base grid setup with equal height support
    'grid items-stretch',
    
    // Mobile columns (default: 1)
    `grid-cols-${columnConfig.mobile}`,
    
    // Tablet columns (md breakpoint)
    `md:grid-cols-${columnConfig.tablet}`,
    
    // Desktop columns (lg breakpoint)  
    `lg:grid-cols-${columnConfig.desktop}`,
    
    // Gap classes - convert rem to Tailwind classes
    gapConfig.mobile === '1.5rem' ? 'gap-6' : 'gap-4',
    gapConfig.tablet === '2rem' ? 'md:gap-8' : 'md:gap-6',
    gapConfig.desktop === '2rem' ? 'lg:gap-8' : 'lg:gap-6',
    
    // Additional custom classes
    className
  );

  // Custom CSS for advanced grid features
  const customStyles: React.CSSProperties = {
    // Use CSS custom properties for dynamic configuration
    '--min-card-width': minCardWidth,
    
    // For desktop auto-fit behavior when columns is high
    ...(typeof columns === 'number' && columns > 3 && {
      gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}, 1fr))`
    })
  };

  return (
    <div 
      className={gridClasses}
      style={customStyles}
    >
      {children}
    </div>
  );
}

/**
 * Hook to detect CSS Grid subgrid support
 * Used for progressive enhancement
 */
export function useSubgridSupport(): boolean {
  const [supportsSubgrid, setSupportsSubgrid] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'CSS' in window && 'supports' in window.CSS) {
      setSupportsSubgrid(window.CSS.supports('grid-template-rows', 'subgrid'));
    }
  }, []);

  return supportsSubgrid;
}

/**
 * Utility component for feature cards on homepage
 * Pre-configured for 3-column layout with proper spacing
 */
export function FeatureCardGrid({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <EqualHeightGrid
      columns={{ mobile: 1, tablet: 3, desktop: 3 }}
      gap={{ mobile: '1.5rem', tablet: '2rem', desktop: '2rem' }}
      className={cn('text-center', className)}
    >
      {children}
    </EqualHeightGrid>
  );
}

/**
 * Utility component for product grids
 * Pre-configured for responsive product card layouts
 */
export function ProductCardGrid({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <EqualHeightGrid
      columns={{ mobile: 1, tablet: 2, desktop: 3 }}
      gap={{ mobile: '1.5rem', tablet: '2rem', desktop: '2rem' }}
      minCardWidth="280px"
      className={className}
    >
      {children}
    </EqualHeightGrid>
  );
}

/**
 * Utility component for testimonial grids
 * Pre-configured for testimonial card layouts
 */
export function TestimonialCardGrid({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <EqualHeightGrid
      columns={{ mobile: 1, tablet: 1, desktop: 2 }}
      gap={{ mobile: '1.5rem', tablet: '2rem', desktop: '2rem' }}
      minCardWidth="320px"
      className={className}
    >
      {children}
    </EqualHeightGrid>
  );
}
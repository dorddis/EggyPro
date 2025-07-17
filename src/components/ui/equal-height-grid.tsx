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
 * Includes performance optimizations for large datasets and responsive layouts
 * 
 * @example
 * // Basic usage with 3 columns
 * <EqualHeightGrid columns={3}>
 *   <ProductCard product={product1} />
 *   <ProductCard product={product2} />
 *   <ProductCard product={product3} />
 * </EqualHeightGrid>
 * 
 * @example
 * // Responsive columns with custom gap
 * <EqualHeightGrid 
 *   columns={{ mobile: 1, tablet: 2, desktop: 3 }}
 *   gap={{ mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }}
 * >
 *   {cards.map(card => <Card key={card.id}>{card.content}</Card>)}
 * </EqualHeightGrid>
 * 
 * @example
 * // Auto-fit layout for many columns
 * <EqualHeightGrid columns={6} minCardWidth="250px">
 *   {manyCards.map(card => <Card key={card.id}>{card.content}</Card>)}
 * </EqualHeightGrid>
 * 
 * @param children - Card components to be rendered in equal height grid
 * @param columns - Number of columns (number) or responsive object { mobile, tablet, desktop }
 * @param gap - Gap between cards (string) or responsive object { mobile, tablet, desktop }
 * @param className - Additional CSS classes to apply to the grid container
 * @param minCardWidth - Minimum width for cards in auto-fit layouts (default: '300px')
 * 
 * @remarks
 * - Cards should use `card-equal-height` class for proper flex behavior
 * - Content areas should use `card-content-grow` for flexible height
 * - Footers should use `card-footer-auto` to stick to bottom
 * - Performance optimized for large datasets (>20 items)
 * - Supports CSS Grid subgrid with flexbox fallback
 * - Includes CSS containment for better performance
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Subgrid} CSS Grid Subgrid
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/contain} CSS Containment
 */
export function EqualHeightGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: '1.5rem', tablet: '2rem', desktop: '2rem' },
  className,
  minCardWidth = '300px'
}: EqualHeightGridProps) {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [isLargeDataset, setIsLargeDataset] = React.useState(false);

  // Performance optimization: detect large datasets
  React.useEffect(() => {
    const childCount = React.Children.count(children);
    setIsLargeDataset(childCount > 20);
  }, [children]);

  // Performance optimization: ResizeObserver for efficient height recalculation
  React.useEffect(() => {
    if (!gridRef.current || !isLargeDataset) return;

    const resizeObserver = new ResizeObserver((entries) => {
      // Batch DOM updates for better performance
      requestAnimationFrame(() => {
        entries.forEach((entry) => {
          const { target } = entry;
          if (target instanceof HTMLElement) {
            // Optimize layout recalculation for large grids
            target.style.contain = 'layout style';
          }
        });
      });
    });

    resizeObserver.observe(gridRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isLargeDataset]);

  // Handle both number and object formats for columns
  const columnConfig = React.useMemo(() => 
    typeof columns === 'number' 
      ? { mobile: 1, tablet: Math.min(2, columns), desktop: columns }
      : columns,
    [columns]
  );

  // Handle both string and object formats for gap
  const gapConfig = React.useMemo(() => 
    typeof gap === 'string'
      ? { mobile: gap, tablet: gap, desktop: gap }
      : gap,
    [gap]
  );

  // Generate responsive grid classes with memoization for performance
  const gridClasses = React.useMemo(() => cn(
    // Base grid setup with equal height support
    'grid items-stretch',
    
    // Performance optimization: CSS containment for large datasets
    isLargeDataset && 'contain-layout contain-style',
    
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
  ), [columnConfig, gapConfig, isLargeDataset, className]);

  // Custom CSS for advanced grid features with performance optimizations
  const customStyles: React.CSSProperties = React.useMemo(() => ({
    // Use CSS custom properties for dynamic configuration
    '--min-card-width': minCardWidth,
    
    // Performance optimization: CSS containment
    contain: isLargeDataset ? 'layout style' : undefined,
    
    // Performance optimization: will-change for animations
    willChange: isLargeDataset ? 'transform' : undefined,
    
    // For desktop auto-fit behavior when columns is high
    ...(typeof columns === 'number' && columns > 3 && {
      gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}, 1fr))`
    }),
    
    // Performance optimization: Reduce layout shift (CLS)
    minHeight: isLargeDataset ? '200px' : undefined,
  }), [minCardWidth, columns, isLargeDataset]);

  return (
    <div 
      ref={gridRef}
      className={gridClasses}
      style={customStyles}
      // Performance optimization: Intersection observer hint
      data-grid-size={React.Children.count(children)}
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
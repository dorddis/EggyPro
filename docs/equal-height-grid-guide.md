# Equal Height Grid Usage Guide

## Overview

The EqualHeightGrid component system provides a comprehensive solution for creating consistent card layouts with equal heights across all cards in a grid. This guide covers implementation, best practices, and troubleshooting.

## Quick Start

### Basic Usage

```tsx
import { EqualHeightGrid } from '@/components/ui/equal-height-grid';
import ProductCard from '@/components/product/ProductCard';

function ProductGrid({ products }) {
  return (
    <EqualHeightGrid columns={3}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </EqualHeightGrid>
  );
}
```

### Responsive Layout

```tsx
<EqualHeightGrid 
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap={{ mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }}
>
  {cards.map(card => <Card key={card.id}>{card.content}</Card>)}
</EqualHeightGrid>
```

## Component Architecture

### Core Components

1. **EqualHeightGrid** - Main grid container component
2. **Card Components** - Individual cards with height consistency classes
3. **Tailwind Utilities** - Custom CSS classes for equal height behavior

### Required CSS Classes

For cards to work properly with EqualHeightGrid, they must use these classes:

```tsx
// Card container
<Card className="card-equal-height">
  {/* Card content that grows to fill space */}
  <CardContent className="card-content-grow">
    {/* Main content */}
  </CardContent>
  
  {/* Footer that sticks to bottom */}
  <CardFooter className="card-footer-auto">
    {/* Footer content */}
  </CardFooter>
</Card>
```

## Configuration Options

### Columns

```tsx
// Fixed number of columns
<EqualHeightGrid columns={3}>

// Responsive columns
<EqualHeightGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>

// Auto-fit for many columns
<EqualHeightGrid columns={6} minCardWidth="250px">
```

### Gap Spacing

```tsx
// Fixed gap
<EqualHeightGrid gap="gap-6">

// Responsive gap
<EqualHeightGrid gap={{ mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }}>
```

### Performance Options

```tsx
// For large datasets (>20 items)
<EqualHeightGrid 
  columns={3}
  minCardWidth="300px" // Enables auto-fit optimization
  className="contain-layout" // CSS containment
>
```

## Pre-configured Components

### FeatureCardGrid

For homepage feature sections:

```tsx
import { FeatureCardGrid } from '@/components/ui/equal-height-grid';

<FeatureCardGrid>
  <div className="card-equal-height p-6 bg-card rounded-lg">
    <h3>Feature Title</h3>
    <p>Feature description</p>
  </div>
</FeatureCardGrid>
```

### ProductCardGrid

For product listings:

```tsx
import { ProductCardGrid } from '@/components/ui/equal-height-grid';

<ProductCardGrid>
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</ProductCardGrid>
```

### TestimonialCardGrid

For testimonial sections:

```tsx
import { TestimonialCardGrid } from '@/components/ui/equal-height-grid';

<TestimonialCardGrid>
  {testimonials.map(testimonial => (
    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
  ))}
</TestimonialCardGrid>
```

## Text Truncation Integration

### Using Text Utilities

```tsx
import { useTruncatedText, getLineClampClass } from '@/lib/text-utils';

function MyCard({ content }) {
  const truncatedText = useTruncatedText(content.description, 'productDescription');
  
  return (
    <Card className="card-equal-height">
      <CardContent className="card-content-grow">
        <p 
          className={`${getLineClampClass(3)} leading-relaxed`}
          title={truncatedText.title}
          aria-label={truncatedText.ariaLabel}
        >
          {truncatedText.displayText}
        </p>
      </CardContent>
    </Card>
  );
}
```

### Available Presets

- `productDescription` - For product card descriptions (120 chars, 3 lines)
- `testimonialComment` - For testimonial comments (200 chars, 4 lines)
- `featureDescription` - For feature cards (100 chars, 3 lines)
- `blogExcerpt` - For blog post excerpts (180 chars, 4 lines)
- `cardTitle` - For card titles (60 chars, 2 lines)

## Browser Support

### Modern Browsers (Recommended)

- Chrome 57+
- Firefox 52+
- Safari 10.1+
- Edge 16+

**Features:** Full CSS Grid support with subgrid fallback

### Legacy Browsers

- Internet Explorer 11
- Older mobile browsers

**Features:** Flexbox fallback with basic equal height behavior

### Feature Detection

```tsx
import { useSubgridSupport } from '@/components/ui/equal-height-grid';

function MyComponent() {
  const supportsSubgrid = useSubgridSupport();
  
  return (
    <div className={supportsSubgrid ? 'supports-subgrid' : 'no-subgrid'}>
      {/* Content */}
    </div>
  );
}
```

## Performance Optimization

### Large Datasets

For grids with >20 items, the component automatically applies:

- CSS containment (`contain: layout style`)
- ResizeObserver for efficient height recalculation
- `will-change` optimization for animations
- Minimum height to reduce layout shift (CLS)

### Manual Optimization

```tsx
// Enable CSS containment manually
<EqualHeightGrid className="contain-layout contain-style">

// Optimize for specific viewport
<EqualHeightGrid 
  columns={6} 
  minCardWidth="250px" // Enables auto-fit
>
```

## Accessibility

### Screen Reader Support

Cards automatically include proper ARIA attributes when using text truncation:

```tsx
// Automatically applied by useTruncatedText
<p 
  title="Full text for hover tooltip"
  aria-label="Full text for screen readers"
>
  Truncated text...
</p>
```

### Keyboard Navigation

- Focus order is maintained regardless of visual layout
- All interactive elements remain accessible
- Focus indicators work correctly with equal height cards

### Testing

```tsx
// Accessibility testing example
import { axe } from 'jest-axe';

test('EqualHeightGrid has no accessibility violations', async () => {
  const { container } = render(
    <EqualHeightGrid>
      <Card role="article" aria-label="Test card">Content</Card>
    </EqualHeightGrid>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Common Patterns

### Homepage Sections

```tsx
// Feature cards
<EqualHeightGrid columns={3} className="text-center">
  {features.map(feature => (
    <div key={feature.id} className="card-equal-height p-6 bg-card rounded-lg">
      <Icon className="h-12 w-12 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </div>
  ))}
</EqualHeightGrid>

// Product showcase
<EqualHeightGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</EqualHeightGrid>
```

### Loading States

```tsx
function LoadingGrid() {
  return (
    <EqualHeightGrid columns={3}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-96 bg-gray-100 rounded-lg animate-pulse" />
      ))}
    </EqualHeightGrid>
  );
}
```

### Dynamic Content

```tsx
function DynamicGrid({ items, loading }) {
  if (loading) return <LoadingGrid />;
  
  return (
    <EqualHeightGrid columns={3}>
      {items.map(item => (
        <Card key={item.id} className="card-equal-height">
          <CardContent className="card-content-grow">
            {item.content}
          </CardContent>
        </Card>
      ))}
    </EqualHeightGrid>
  );
}
```

## Troubleshooting

### Common Issues

#### Cards Not Equal Height

**Problem:** Cards have different heights despite using EqualHeightGrid

**Solution:** Ensure cards use the required CSS classes:
```tsx
// ❌ Wrong
<Card className="flex flex-col">

// ✅ Correct
<Card className="card-equal-height">
```

#### Content Overflow

**Problem:** Long content breaks card layout

**Solution:** Use text truncation utilities:
```tsx
import { useTruncatedText, getLineClampClass } from '@/lib/text-utils';

const truncated = useTruncatedText(longText, 'productDescription');
```

#### Performance Issues

**Problem:** Grid is slow with many items

**Solution:** The component auto-optimizes for >20 items, but you can manually enable:
```tsx
<EqualHeightGrid className="contain-layout" minCardWidth="300px">
```

#### Responsive Breakpoints

**Problem:** Grid doesn't respond correctly on different screen sizes

**Solution:** Use responsive column configuration:
```tsx
<EqualHeightGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
```

### Browser-Specific Issues

#### Safari Flexbox Quirks

```tsx
// Add explicit flex properties for Safari
.card-equal-height {
  display: flex;
  flex-direction: column;
  min-height: 0; /* Safari fix */
}
```

#### Internet Explorer Support

```tsx
// IE11 fallback
.no-subgrid .card-equal-height {
  display: flex;
  flex-direction: column;
  height: 100%;
}
```

## Testing

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import { EqualHeightGrid } from '@/components/ui/equal-height-grid';

test('renders children with equal height classes', () => {
  render(
    <EqualHeightGrid>
      <div data-testid="card">Card content</div>
    </EqualHeightGrid>
  );
  
  const grid = screen.getByTestId('card').parentElement;
  expect(grid).toHaveClass('grid', 'items-stretch');
});
```

### Integration Tests

```tsx
test('maintains equal heights with varying content', () => {
  const cards = [
    { id: 1, content: 'Short' },
    { id: 2, content: 'Much longer content that spans multiple lines' },
    { id: 3, content: 'Medium content' }
  ];
  
  render(
    <EqualHeightGrid>
      {cards.map(card => (
        <Card key={card.id} className="card-equal-height">
          {card.content}
        </Card>
      ))}
    </EqualHeightGrid>
  );
  
  // All cards should have equal height classes
  const cardElements = screen.getAllByRole('generic');
  cardElements.forEach(card => {
    expect(card).toHaveClass('card-equal-height');
  });
});
```

## Migration Guide

### From Regular Grid

```tsx
// Before
<div className="grid grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</div>

// After
<EqualHeightGrid columns={3} gap="gap-6">
  {items.map(item => (
    <Card key={item.id} className="card-equal-height">
      <CardContent className="card-content-grow">
        {item.content}
      </CardContent>
    </Card>
  ))}
</EqualHeightGrid>
```

### From Flexbox

```tsx
// Before
<div className="flex flex-wrap gap-6">
  {items.map(item => (
    <div key={item.id} className="flex-1 min-w-0">
      <Card>{item.content}</Card>
    </div>
  ))}
</div>

// After
<EqualHeightGrid columns={3}>
  {items.map(item => (
    <Card key={item.id} className="card-equal-height">
      {item.content}
    </Card>
  ))}
</EqualHeightGrid>
```

## Best Practices

1. **Always use required CSS classes** on card components
2. **Implement text truncation** for consistent content lengths
3. **Test across different screen sizes** and browsers
4. **Use pre-configured components** when possible
5. **Enable performance optimizations** for large datasets
6. **Include accessibility attributes** for truncated content
7. **Test with varying content lengths** to ensure equal heights
8. **Use semantic HTML** structure within cards
9. **Implement proper loading states** for dynamic content
10. **Consider browser support** requirements for your users

## Support

For issues or questions about the EqualHeightGrid system:

1. Check this documentation first
2. Review the troubleshooting section
3. Test with the provided examples
4. Check browser compatibility
5. Verify CSS class usage on card components

The system is designed to be robust and handle most common use cases automatically, but proper implementation of the required CSS classes is essential for correct behavior.
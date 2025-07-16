# Animation Standards Specification

## Overview

This document outlines comprehensive animation standards for the EggyPro e-commerce website. Based on the current codebase audit, we've identified areas for improvement and established consistent animation patterns that will create a more elegant, polished, and engaging user experience.

## Current Animation Audit

### Existing Animations
1. **Button Interactions**: Basic hover states with `transition-colors` and `active:scale-95`
2. **Product Cards**: Shadow transitions on hover (`hover:shadow-xl`)
3. **Cart Badge**: Scale and opacity transitions for item count
4. **UI Components**: Radix-based animations for modals, dropdowns, and tooltips
5. **Add to Cart**: Multi-stage animation with loading, success, and navigation states
6. **Delete Buttons**: Simple scale and rotate hover effects

### Missing Animation Opportunities
1. **Page Transitions**: No smooth page-to-page navigation
2. **Loading States**: Limited skeleton and loading animations
3. **Micro-interactions**: Insufficient feedback for user actions
4. **Scroll Animations**: No scroll-triggered animations
5. **Form Interactions**: Limited input field animations
6. **Image Interactions**: No hover effects on product images

## Animation Philosophy

### Core Principles
1. **Purposeful**: Every animation serves a functional purpose
2. **Subtle**: Animations enhance, not distract from content
3. **Consistent**: Standardized timing and easing across components
4. **Accessible**: Respect `prefers-reduced-motion` preferences
5. **Performance**: GPU-accelerated transforms for smooth 60fps animations

### Animation Categories
1. **Micro-interactions**: Small feedback animations (200-300ms)
2. **State Transitions**: Loading, success, error states (300-600ms)
3. **Navigation**: Page transitions and route changes (300-500ms)
4. **Reveal Animations**: Content appearing on scroll (400-800ms)
5. **Hover Effects**: Interactive element feedback (150-250ms)

## Animation Standards

### Timing Standards

#### Micro-interactions (150-300ms)
- **Hover Effects**: 200ms with `ease-out`
- **Button Press**: 150ms with `ease-in-out`
- **Icon Transitions**: 250ms with `ease-out`
- **Color Changes**: 200ms with `ease-in-out`

#### State Transitions (300-600ms)
- **Loading States**: 300ms with `ease-out`
- **Success/Error**: 400ms with `ease-in-out`
- **Modal Open/Close**: 300ms with `ease-out`
- **Dropdown Animations**: 250ms with `ease-out`

#### Page Transitions (300-800ms)
- **Route Changes**: 400ms with `ease-in-out`
- **Content Reveal**: 600ms with `ease-out`
- **Scroll Animations**: 800ms with `ease-out`

### Easing Functions
```css
/* Standard easing variables */
--ease-micro: cubic-bezier(0.4, 0, 0.2, 1);
--ease-standard: cubic-bezier(0.4, 0, 0.6, 1);
--ease-emphasis: cubic-bezier(0.4, 0, 0.6, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Transform Standards
```css
/* Standard transform values */
--scale-hover: scale(1.05);
--scale-active: scale(0.95);
--scale-micro: scale(1.02);
--rotate-subtle: rotate(5deg);
--rotate-emphasis: rotate(12deg);
```

## Implementation Plan

### Phase 1: Foundation (High Priority)

#### 1.1 Enhanced Button Animations
**Location**: `src/components/ui/button.tsx`

**Current State**:
```tsx
"active:scale-95 transition-transform"
```

**Enhanced Implementation**:
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md active:shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-destructive/25",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline hover:scale-[1.02]",
      },
      // ... existing size variants
    }
  }
)
```

**Benefits**:
- Subtle scale on hover for better feedback
- Shadow effects for depth
- Consistent timing across all button variants
- Enhanced visual hierarchy

#### 1.2 Product Card Enhancements
**Location**: `src/components/product/ProductCard.tsx`

**Current State**:
```tsx
"shadow-lg hover:shadow-xl transition-shadow duration-300"
```

**Enhanced Implementation**:
```tsx
<Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-out group hover:scale-[1.02] hover:-translate-y-1">
  <CardHeader className="p-0 overflow-hidden">
    <Link href={`/product/${product.slug}`} className="block">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={400}
        height={400}
        className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        data-ai-hint="protein powder product"
      />
    </Link>
  </CardHeader>
  <CardContent className="p-4 md:p-6 flex-grow">
    <Link href={`/product/${product.slug}`}>
      <CardTitle className="text-lg md:text-xl font-semibold mb-2 md:mb-3 hover:text-primary transition-colors duration-200 leading-tight group-hover:text-primary">
        {product.name}
      </CardTitle>
    </Link>
    <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 line-clamp-3 leading-relaxed">
      {product.description}
    </p>
    <p className="text-base md:text-lg font-bold text-primary transition-transform duration-200 group-hover:scale-105">
      ${product.price.toFixed(2)}
    </p>
  </CardContent>
  <CardFooter className="p-4 md:p-6 pt-0">
    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 min-h-[44px] md:min-h-[40px] transition-all duration-200 group-hover:shadow-lg">
      <Link href={`/product/${product.slug}`}>
        <ShoppingCart className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
        View Details
      </Link>
    </Button>
  </CardFooter>
</Card>
```

**Benefits**:
- Subtle lift effect on hover
- Image zoom effect for engagement
- Price scaling for emphasis
- Icon animations for interactivity

#### 1.3 Navigation Enhancements
**Location**: `src/components/layout/Navbar.tsx`

**Current State**:
```tsx
"transition-colors hover:text-primary"
```

**Enhanced Implementation**:
```tsx
<Link
  key={item.href}
  href={item.href}
  onClick={onItemClick}
  className={cn(
    mobile 
      ? 'block py-2 px-3 text-base font-medium transition-all duration-200 ease-out hover:text-primary hover:bg-primary/10 rounded-md min-h-[44px] flex items-center hover:scale-[1.02] hover:shadow-sm'
      : 'text-sm font-medium transition-all duration-200 ease-out hover:text-primary relative group',
    pathname === item.href ? 'text-primary' : 'text-foreground/70',
    mobile && pathname === item.href && 'bg-primary/10'
  )}
>
  {item.label}
  {!mobile && (
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 ease-out group-hover:w-full" />
  )}
</Link>
```

**Benefits**:
- Underline animation for active states
- Subtle scale on mobile
- Smooth color transitions
- Visual feedback for current page

### Phase 2: Interactive Elements (Medium Priority)

#### 2.1 Cart Icon Enhancements
**Location**: `src/components/cart/CartIcon.tsx`

**Enhanced Implementation**:
```tsx
<Button
  variant="ghost"
  size="icon"
  onClick={toggleCart}
  className="relative h-9 w-9 md:h-10 md:w-10 transition-all duration-200 ease-out hover:scale-110 hover:shadow-md"
  aria-label={`Shopping cart, ${totalItems} items`}
>
  <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-200 ease-out hover:rotate-12" />
  <span 
    className={`absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 transition-all duration-300 ease-bounce ${
      totalItems > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
    }`}
    aria-hidden={totalItems === 0}
  >
    {formatCartBadgeCount(totalItems)}
  </span>
</Button>
```

**Benefits**:
- Bounce animation for badge appearance
- Icon rotation for playfulness
- Scale effect for better touch targets
- Smooth badge transitions

#### 2.2 Form Input Animations
**Location**: `src/components/ui/input.tsx`

**Enhanced Implementation**:
```tsx
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 md:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-out hover:border-primary/50 focus:border-primary focus:shadow-sm focus:shadow-primary/25",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

**Benefits**:
- Subtle border color changes
- Focus shadow effects
- Smooth transitions
- Better visual feedback

#### 2.3 Loading States
**Location**: New component `src/components/ui/loading-spinner.tsx`

**Implementation**:
```tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'accent';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'default',
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const variantClasses = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    accent: 'text-accent'
  };

  return (
    <div className={cn(
      'animate-spin rounded-full border-2 border-current border-t-transparent',
      sizeClasses[size],
      variantClasses[variant],
      className
    )} />
  );
};
```

**Benefits**:
- Consistent loading indicators
- Multiple size options
- Theme-aware colors
- Smooth rotation animation

#### 2.4 Quantity Control Animations
**Location**: `src/components/product/QuantitySelector.tsx` and cart quantity controls

**Current Issue**:
- Price changes are too abrupt when using +/- buttons
- No visual feedback for quantity changes
- Missing smooth transitions for price updates

**Enhanced Implementation**:
```tsx
// Price display with animation
<div className="relative">
  <span 
    key={totalPrice} // Force re-render for animation
    className="text-lg font-bold text-primary transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-bottom-2"
  >
    ${totalPrice.toFixed(2)}
  </span>
</div>

// Quantity buttons with enhanced feedback
<Button
  variant="outline"
  size="icon"
  onClick={handleDecrease}
  disabled={quantity <= 1}
  className="h-8 w-8 transition-all duration-200 ease-out hover:scale-110 active:scale-95 hover:shadow-sm"
  aria-label="Decrease quantity"
>
  <Minus className="h-4 w-4 transition-transform duration-200 ease-out" />
</Button>

<span className="text-sm font-medium min-w-[2rem] text-center transition-all duration-200 ease-out">
  {quantity}
</span>

<Button
  variant="outline"
  size="icon"
  onClick={handleIncrease}
  disabled={quantity >= 99}
  className="h-8 w-8 transition-all duration-200 ease-out hover:scale-110 active:scale-95 hover:shadow-sm"
  aria-label="Increase quantity"
>
  <Plus className="h-4 w-4 transition-transform duration-200 ease-out" />
</Button>
```

**Animation Details**:
- **Price Changes**: 300ms fade-in with slide-up animation
- **Button Interactions**: 200ms scale effects with shadow feedback
- **Quantity Display**: Smooth transitions for number changes
- **Disabled States**: Subtle opacity changes for better UX

**Benefits**:
- Smooth price transitions instead of abrupt changes
- Visual feedback for quantity adjustments
- Consistent animation timing across controls
- Enhanced user experience for cart interactions

#### 2.5 Cart Item Delete/Undo Animations
**Location**: All cart interfaces including:
- `src/components/cart/CartItem.tsx` (Cart popup and sidebar)
- `src/app/cart/page.tsx` (Cart page)
- `src/components/cart/CartDropdown.tsx` (Cart dropdown)
- `src/components/cart/CartSidebar.tsx` (Cart sidebar)
- `src/components/cart/CartPopup.tsx` (Cart popup)

**Current Issue**:
- Items disappear instantly when deleted across all cart interfaces
- No visual feedback for delete actions
- Undo operations lack smooth reappear animations
- Missing subtle transitions for item state changes
- Inconsistent animation behavior between different cart views

**Enhanced Implementation**:
```tsx
// Cart item with delete animation
<div 
  className={`transition-all duration-300 ease-out ${
    isDeleting ? 'opacity-0 scale-95 -translate-x-4' : 'opacity-100 scale-100 translate-x-0'
  }`}
>
  <div className="p-4 md:p-6">
    {/* Existing cart item content */}
    <div className="flex items-center gap-4">
      {/* Product details */}
      <div className="flex-grow min-w-0">
        {/* ... existing content ... */}
      </div>
      
      {/* Remove button with enhanced animation */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 ease-out hover:scale-110"
        aria-label={`Remove ${item.name} from cart. It will delete current item(s).`}
        title="Remove item from cart"
      >
        <Trash2 className="h-5 w-5 transition-transform duration-200 ease-out hover:rotate-12" />
      </Button>
    </div>
  </div>
</div>
```

**Undo Notification Animation**:
```tsx
// Undo notification with appear/disappear animation
<div 
  className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
    showUndo ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
  }`}
>
  <div className="bg-background border border-border rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
    <span className="text-sm">Item removed</span>
    <Button
      variant="outline"
      size="sm"
      onClick={handleUndo}
      className="transition-all duration-200 ease-out hover:scale-105"
    >
      Undo
    </Button>
  </div>
</div>
```

**Item Reappear Animation**:
```tsx
// When item is restored via undo
<div 
  className={`transition-all duration-400 ease-out ${
    isReappearing ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'
  }`}
>
  {/* Cart item content */}
</div>
```

**Animation Details**:
- **Delete Animation**: 300ms fade-out with scale-down and slide-left
- **Undo Notification**: 300ms fade-in with slide-up and scale
- **Reappear Animation**: 400ms fade-in with scale-up and slide-right
- **Button Interactions**: 200ms scale and rotation effects
- **Easing**: `ease-out` for natural, subtle motion

**State Management**:
```tsx
const [isDeleting, setIsDeleting] = useState(false);
const [isReappearing, setIsReappearing] = useState(false);

const handleRemove = () => {
  setIsDeleting(true);
  setTimeout(() => {
    // Actual delete logic
    removeItem(item.id);
  }, 300);
};

const handleUndo = () => {
  setIsReappearing(true);
  // Restore item logic
  setTimeout(() => {
    setIsReappearing(false);
  }, 100);
};
```

**Benefits**:
- Subtle visual feedback for delete actions across all cart interfaces
- Smooth transitions between item states
- Enhanced undo experience with reappear animation
- Consistent timing across all cart interactions
- Professional, polished feel for cart operations
- Unified animation experience regardless of cart view (popup, sidebar, page, dropdown)

**Implementation Requirements**:
- Apply delete animations to all cart item components
- Ensure undo notifications appear consistently across interfaces
- Maintain consistent timing and easing across all cart views
- Test animations on mobile and desktop cart interfaces
- Verify animations work with both individual item deletion and bulk operations

**Cart Interface Consistency Checklist**:
- [ ] Cart Popup (`CartPopup.tsx`) - Delete animations and undo notifications
- [ ] Cart Sidebar (`CartSidebar.tsx`) - Delete animations and undo notifications  
- [ ] Cart Page (`cart/page.tsx`) - Delete animations and undo notifications
- [ ] Cart Dropdown (`CartDropdown.tsx`) - Delete animations and undo notifications
- [ ] Mobile cart interfaces - Responsive animation behavior
- [ ] Desktop cart interfaces - Enhanced animation details
- [ ] Undo notification positioning - Consistent across all views
- [ ] Animation timing - Unified 300ms delete, 400ms reappear
- [ ] Easing functions - Consistent `ease-out` across all interfaces

### Phase 3: Page Transitions ✅ COMPLETED

#### 3.1 Route Transition Animations ✅
**Location**: `src/app/layout.tsx` and `src/components/ui/page-transition.tsx`

**Implementation**: ✅ COMPLETED
- Created `PageTransition` component with smooth page-to-page navigation
- Integrated into main layout for consistent transitions
- Uses framer-motion with 300ms easeInOut transitions
- Smooth fade-in/fade-out with subtle vertical movement

**Benefits**:
- Smooth page transitions
- Consistent navigation experience
- Professional feel
- Reduced perceived loading time

#### 3.2 Scroll-Triggered Animations ✅
**Location**: `src/hooks/use-scroll-animation.ts` and `src/components/ui/scroll-animation.tsx`

**Implementation**: ✅ COMPLETED
- Created `useScrollAnimation` hook for intersection observer
- Built `ScrollAnimation` component with multiple animation variants
- Applied to homepage sections with staggered delays
- Supports fade-up, fade-in, slide-left, slide-right, and scale-up animations

**Usage Example**: ✅ IMPLEMENTED
- Applied to homepage hero, features, products, and testimonials sections
- Staggered animations with progressive delays
- Responsive animation behavior

### Phase 4: Advanced Interactions ✅ PARTIALLY COMPLETED

#### 4.1 Gesture-Based Animations (Future Implementation)
- Swipe gestures for mobile cart interactions
- Pinch-to-zoom on product images
- Pull-to-refresh animations

#### 4.2 Micro-Interactions ✅ PARTIALLY COMPLETED
- ✅ Button ripple effects (`src/components/ui/ripple-button.tsx`)
- ✅ Form validation animations (`src/components/ui/form-validation.tsx`)
- ✅ Success/error state transitions (implemented in form validation)
- Hover sound effects (optional - not implemented)

#### 4.3 Performance Optimizations ✅ PARTIALLY COMPLETED
- ✅ CSS containment for better performance (implemented in global CSS)
- ✅ Will-change property for GPU acceleration (`src/components/ui/gpu-accelerated.tsx`)
- ✅ Reduced motion preferences (implemented in global CSS)
- Animation frame optimization (future implementation)

## Accessibility Standards

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Focus Management
- Ensure animations don't interfere with focus indicators
- Maintain keyboard navigation during animations
- Provide alternative interaction methods

### Screen Reader Support
- Use `aria-live` regions for dynamic content
- Provide descriptive labels for animated elements
- Ensure animations don't create confusion

## Performance Considerations

### GPU Acceleration
```css
/* Use transform and opacity for smooth animations */
.animated-element {
  transform: translateZ(0); /* Force GPU acceleration */
  will-change: transform, opacity;
}
```

### Animation Optimization
- Limit concurrent animations to 3-4 per page
- Use `requestAnimationFrame` for complex animations
- Debounce scroll and resize events
- Use CSS transforms instead of layout properties

### Bundle Size
- Consider lazy loading for animation libraries
- Use CSS animations over JavaScript when possible
- Minimize animation dependencies

## Testing Strategy

### Visual Testing
- Test animations across different devices and browsers
- Verify smooth 60fps performance
- Check animation timing and easing
- Validate accessibility compliance

### User Experience Testing
- Gather feedback on animation preferences
- Test with users who have motion sensitivity
- Validate animation enhances rather than distracts
- Measure impact on conversion rates

### Performance Testing
- Monitor animation frame rates
- Test on low-end devices
- Measure bundle size impact
- Validate memory usage

## Implementation Timeline

### ✅ Week 1-2: Foundation - COMPLETED
- ✅ Enhanced button animations
- ✅ Product card improvements
- ✅ Navigation enhancements
- ✅ Basic loading states

### ✅ Week 3-4: Interactive Elements - COMPLETED
- ✅ Cart icon animations
- ✅ Form input enhancements
- ✅ Loading spinner component
- ✅ Quantity control animations
- ✅ Cart item delete/undo animations
- ✅ Accessibility improvements

### ✅ Week 5-6: Advanced Features - COMPLETED
- ✅ Page transition animations
- ✅ Scroll-triggered animations
- ✅ Performance optimizations (partial)
- ✅ Testing and refinement

### 🔄 Week 7-8: Polish & Testing - IN PROGRESS
- User experience testing
- Performance optimization
- Accessibility audit
- Documentation updates

## Success Metrics

### User Experience
- Reduced perceived loading times
- Increased user engagement
- Improved conversion rates
- Positive user feedback

### Performance
- Maintained 60fps animations
- No impact on Core Web Vitals
- Reduced bundle size impact
- Improved accessibility scores

### Technical
- Consistent animation patterns
- Reduced code duplication
- Improved maintainability
- Enhanced developer experience

## Conclusion

This animation standards specification provides a comprehensive framework for creating elegant, performant, and accessible animations throughout the EggyPro website. By implementing these standards systematically, we'll create a more engaging and professional user experience while maintaining excellent performance and accessibility.

The phased approach ensures we can implement improvements incrementally, test thoroughly, and refine based on user feedback. Each phase builds upon the previous one, creating a solid foundation for advanced animation features in the future. 
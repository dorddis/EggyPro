# Styling Changes Specification

## Overview

This document outlines the requested styling changes to improve the visual consistency and user experience of the EggyPro website. The changes focus on four main areas:

1. **Bright Green Color Adjustments** - Reduce the intensity of bright green colors used for success confirmations
2. **Button Hover Effect Consistency** - Fix the "Discover our values" button hover effect to match other buttons
3. **Delete Button Animation** - Replace dark background hover with trash can lid opening animation
4. **Quantity Control Behavior** - Make the minus button trigger delete when quantity is 1

## 1. Bright Green Color Adjustments

### Current Issues
- **Location**: `src/components/product/AddToCartButton.tsx` (line 67)
- **Problem**: Uses `bg-green-600 hover:bg-green-600` for success state, which is too bright and jarring
- **Impact**: Creates visual inconsistency with the overall muted color scheme

### Proposed Changes

#### File: `src/components/product/AddToCartButton.tsx`
**Current Code:**
```tsx
className={`bg-primary hover:bg-primary/90 min-h-[48px] md:min-h-[40px] transition-all ${
  showSuccess ? 'bg-green-600 hover:bg-green-600' : ''
} ${className}`}
```

**New Implementation:**
```tsx
className={`bg-primary hover:bg-primary/90 min-h-[48px] md:min-h-[40px] transition-all ${
  showSuccess ? 'bg-accent hover:bg-accent/90' : ''
} ${className}`}
```

**Alternative Option (More Subtle):**
```tsx
className={`bg-primary hover:bg-primary/90 min-h-[48px] md:min-h-[40px] transition-all ${
  showSuccess ? 'bg-primary/80 hover:bg-primary/70' : ''
} ${className}`}
```

### Color Scheme Alignment
- **Current**: Uses bright `green-600` (#16A34A) - too vibrant
- **Proposed**: Use `accent` color (#A2B38B) - muted olive green that fits the theme
- **Alternative**: Use `primary/80` - slightly muted version of the primary green

### Success State Duration
- **Current**: 1.5 seconds
- **Recommendation**: Keep at 1.5 seconds for good UX
- **Visual Feedback**: Check icon + "Added!" text remains the same

## 2. Button Hover Effect Consistency

### Current Issues
- **Location**: `src/app/page.tsx` (line 75)
- **Problem**: "Discover our values" button uses `hover:bg-primary/10` which creates poor visibility
- **Impact**: Inconsistent with other buttons that use stronger hover effects

### Current Implementation
```tsx
<Button variant="outline" size="lg" asChild className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto min-h-[48px]">
  <Link href="/about">Discover Our Values</Link>
</Button>
```

### Proposed Changes

#### File: `src/app/page.tsx`
**New Implementation:**
```tsx
<Button variant="outline" size="lg" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto min-h-[48px]">
  <Link href="/about">Discover Our Values</Link>
</Button>
```

### Hover Effect Analysis
- **Current**: `hover:bg-primary/10` - Very light background (10% opacity)
- **Proposed**: `hover:bg-primary hover:text-primary-foreground` - Full background with contrasting text
- **Consistency**: Matches the pattern used by other primary buttons in the codebase

### Alternative Options
1. **Subtle Approach**: `hover:bg-primary/20 hover:text-primary` - Light background with darker text
2. **Medium Approach**: `hover:bg-accent hover:text-accent-foreground` - Use accent color for hover
3. **Bold Approach**: `hover:bg-primary hover:text-primary-foreground` - Full primary color (recommended)

## 3. Delete Button Animation

### Current Issues
- **Locations**: 
  - `src/components/cart/CartItem.tsx` (line 101)
  - `src/app/cart/page.tsx` (line 149)
- **Problem**: Uses `hover:text-red-600` which only changes text color, creating poor visual feedback
- **Impact**: Users may not clearly understand the delete action

### Current Implementation
```tsx
<Button
  variant="ghost"
  size="icon"
  onClick={handleRemove}
  className="h-6 w-6 text-red-500 hover:text-red-600 transition-colors"
  aria-label={`Remove ${item.name} from cart`}
>
  <Trash2 className="h-4 w-4" />
</Button>
```

### Proposed Animation: Trash Can Lid Opening

#### Implementation Locations
The delete button animation should be implemented in **all cart interfaces**:

1. **Cart Popup/Dropdown** (`src/components/cart/CartItem.tsx`)
2. **Cart Sidebar** (`src/components/cart/CartItem.tsx`) 
3. **Cart Page** (`src/app/cart/page.tsx`)
4. **Cart Dropdown** (`src/components/cart/CartDropdown.tsx`)

#### File: `src/components/cart/CartItem.tsx` (Used in Popup & Sidebar)
**New Implementation:**
```tsx
<Button
  variant="ghost"
  size="icon"
  onClick={handleRemove}
  className="h-6 w-6 text-red-500 hover:text-red-600 transition-all group relative"
  aria-label={`Remove ${item.name} from cart`}
>
  <div className="relative">
    {/* Trash Can Body */}
    <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
    
    {/* Trash Can Lid - Animated */}
    <div className="absolute -top-1 -left-0.5 w-5 h-1 bg-red-500 rounded-t-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-12 origin-left" />
  </div>
</Button>
```

#### File: `src/app/cart/page.tsx` (Cart Page - Larger Size)
**New Implementation:**
```tsx
<Button
  variant="ghost"
  size="icon"
  onClick={() => handleRemove(item.id)}
  className="h-8 w-8 text-red-500 hover:text-red-600 transition-all group relative"
  aria-label={`Remove ${item.name} from cart`}
>
  <div className="relative">
    {/* Trash Can Body - Larger for cart page */}
    <Trash2 className="h-5 w-5 transition-transform group-hover:scale-110" />
    
    {/* Trash Can Lid - Animated - Adjusted for larger size */}
    <div className="absolute -top-1.5 -left-0.5 w-6 h-1.5 bg-red-500 rounded-t-sm transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:rotate-12 origin-left" />
  </div>
</Button>
```

#### Responsive Sizing Considerations
- **Popup/Sidebar**: `h-6 w-6` button, `h-4 w-4` icon, `w-5 h-1` lid
- **Cart Page**: `h-8 w-8` button, `h-5 w-5` icon, `w-6 h-1.5` lid
- **Mobile**: Maintain touch target sizes (44px minimum)
- **Desktop**: Slightly larger for better visibility

### Animation Details
- **Lid Movement**: Translates up and rotates slightly on hover
- **Duration**: 300ms for smooth animation
- **Origin**: Left side for natural opening effect
- **Scale**: Trash can body scales up slightly (110%) for emphasis
- **Color**: Uses same red color scheme for consistency

## 3.5. Undo Delete Functionality

### Overview
When an item is deleted from the cart, provide an undo option to allow customers to quickly restore the item. This improves user experience by preventing accidental deletions.

### Implementation Requirements

#### File: `src/lib/cart-context.tsx`
**Add to CartState interface:**
```tsx
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  // New properties for undo functionality
  lastDeletedItem: CartItem | null;
  canUndo: boolean;
}
```

**Add to CartAction type:**
```tsx
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: { isOpen: boolean } }
  | { type: 'LOAD_CART'; payload: { items: CartItem[] } }
  // New actions for undo functionality
  | { type: 'UNDO_DELETE' }
  | { type: 'CLEAR_UNDO' };
```

**Update cartReducer:**
```tsx
case 'REMOVE_ITEM': {
  const itemToDelete = state.items.find(item => item.id === action.payload.itemId);
  const newItems = removeCartItem(state.items, action.payload.itemId);
  return {
    ...state,
    items: newItems,
    totalItems: calculateItemCount(newItems),
    totalPrice: calculateCartTotal(newItems),
    // Store deleted item for undo
    lastDeletedItem: itemToDelete || null,
    canUndo: true,
  };
}

case 'UNDO_DELETE': {
  if (!state.lastDeletedItem) return state;
  const newItems = [...state.items, state.lastDeletedItem];
  return {
    ...state,
    items: newItems,
    totalItems: calculateItemCount(newItems),
    totalPrice: calculateCartTotal(newItems),
    lastDeletedItem: null,
    canUndo: false,
  };
}

case 'CLEAR_UNDO': {
  return {
    ...state,
    lastDeletedItem: null,
    canUndo: false,
  };
}
```

#### File: `src/hooks/use-cart.ts`
**Add new methods:**
```tsx
const undoDelete = () => {
  dispatch({ type: 'UNDO_DELETE' });
};

const clearUndo = () => {
  dispatch({ type: 'CLEAR_UNDO' });
};
```

**Update return object:**
```tsx
return {
  ...state,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleCart,
  buyNow,
  undoDelete,
  clearUndo,
};
```

#### File: `src/components/cart/CartPopup.tsx`
**Add undo notification:**
```tsx
const { items, totalPrice, totalItems, canUndo, undoDelete, clearUndo } = useCart();

// Auto-clear undo after 5 seconds
useEffect(() => {
  if (canUndo) {
    const timer = setTimeout(() => {
      clearUndo();
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [canUndo, clearUndo]);

// Add undo notification in the component
{canUndo && (
  <div className="p-3 bg-accent/50 border border-accent rounded-md mb-3">
    <div className="flex items-center justify-between">
      <span className="text-sm text-accent-foreground">Item removed from cart</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={undoDelete}
        className="text-xs h-6 px-2 hover:bg-accent/70"
      >
        Undo
      </Button>
    </div>
  </div>
)}
```

#### File: `src/app/cart/page.tsx`
**Add undo notification:**
```tsx
const { items, totalPrice, clearCart, updateQuantity, removeItem, canUndo, undoDelete, clearUndo } = useCart();

// Auto-clear undo after 5 seconds
useEffect(() => {
  if (canUndo) {
    const timer = setTimeout(() => {
      clearUndo();
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [canUndo, clearUndo]);

// Add undo notification after page header
{canUndo && (
  <div className="mb-4 p-4 bg-accent/50 border border-accent rounded-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium">Item removed from cart</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={undoDelete}
        className="text-xs"
      >
        Undo
      </Button>
    </div>
  </div>
)}
```

### Undo Functionality Details
- **Duration**: Undo option available for 5 seconds after deletion
- **Auto-clear**: Automatically removes undo option after timeout
- **Visual Feedback**: Clear notification with undo button
- **Multiple Deletions**: Only stores the most recently deleted item
- **Cart State**: Preserves all item details (quantity, price, etc.)
- **Accessibility**: Proper ARIA labels and keyboard navigation

### User Experience Considerations
- **Non-intrusive**: Notification appears without blocking cart interaction
- **Clear Action**: "Undo" button is prominently displayed
- **Time Limit**: 5-second window prevents confusion
- **Consistent**: Same behavior across all cart interfaces
- **Mobile Friendly**: Touch-friendly button sizes and spacing

## 4. Quantity Control Behavior

### Current Issues
- **Locations**: 
  - `src/components/cart/CartItem.tsx` (line 65)
  - `src/app/cart/page.tsx` (line 125)
- **Problem**: Minus button is disabled when quantity is 1, but should trigger delete instead
- **Impact**: Confusing UX - users expect the minus button to work

### Current Implementation
```tsx
<Button
  variant="outline"
  size="icon"
  onClick={handleQuantityDecrease}
  disabled={item.quantity <= 1}
  className="h-6 w-6 md:h-7 md:w-7"
  aria-label="Decrease quantity"
>
  <Minus className="h-3 w-3" />
</Button>
```

### Proposed Changes

#### File: `src/components/cart/CartItem.tsx`
**New Implementation:**
```tsx
<Button
  variant="outline"
  size="icon"
  onClick={item.quantity <= 1 ? handleRemove : handleQuantityDecrease}
  className="h-6 w-6 md:h-7 md:w-7"
  aria-label={item.quantity <= 1 ? "Remove item" : "Decrease quantity"}
>
  <Minus className="h-3 w-3" />
</Button>
```

#### File: `src/app/cart/page.tsx`
**New Implementation:**
```tsx
<Button
  variant="outline"
  size="icon"
  onClick={() => item.quantity <= 1 ? handleRemove(item.id) : handleQuantityChange(item.id, item.quantity - 1)}
  className="h-8 w-8"
  aria-label={item.quantity <= 1 ? "Remove item" : "Decrease quantity"}
>
  <Minus className="h-4 w-4" />
</Button>
```

### Behavior Changes
- **Quantity > 1**: Decrease quantity as before
- **Quantity = 1**: Remove item from cart entirely
- **Visual Feedback**: Button remains enabled but changes functionality
- **Accessibility**: Updated aria-label to reflect current action

### Alternative Approaches
1. **Visual Indicator**: Add a small trash icon overlay when quantity is 1
2. **Tooltip**: Show tooltip explaining the behavior change
3. **Confirmation**: Add confirmation dialog for delete action
4. **Separate Button**: Keep minus button disabled and add separate remove button

## Implementation Priority

### High Priority
1. **Bright Green Color Adjustment** - Immediate visual improvement
2. **Button Hover Effect Consistency** - Fixes poor UX on homepage
3. **Undo Delete Functionality** - Critical for preventing accidental deletions

### Medium Priority
4. **Delete Button Animation** - Enhances user experience but requires more complex implementation

### Low Priority
5. **Quantity Control Behavior** - Improves UX but changes established patterns

## Testing Considerations

### Color Changes
- Test on different screen sizes and color schemes
- Ensure sufficient contrast ratios for accessibility
- Verify success states are clearly visible but not jarring

### Hover Effects
- Test on desktop and mobile devices
- Verify hover states work with keyboard navigation
- Ensure touch devices have appropriate feedback

### Animations
- Test animation performance on lower-end devices
- Verify animations don't interfere with other interactions
- Ensure animations are smooth and not distracting

### Quantity Controls
- Test edge cases (quantity 1, quantity 99)
- Verify delete action is clear to users
- Test keyboard navigation and screen readers

### Undo Functionality
- Test undo timing (5-second window)
- Verify undo works across all cart interfaces
- Test multiple rapid deletions
- Verify undo notification appears and disappears correctly
- Test undo with different item types and quantities
- Verify undo preserves all item details correctly

## Accessibility Considerations

### Color Changes
- Maintain WCAG AA contrast ratios
- Ensure color is not the only indicator of state
- Provide alternative text for screen readers

### Animations
- Respect `prefers-reduced-motion` user preference
- Provide alternative interaction methods
- Ensure animations don't cause motion sickness

### Button Behavior
- Clear labeling of button actions
- Consistent behavior patterns
- Keyboard navigation support

## Browser Compatibility

### CSS Animations
- Use `transform` and `transition` for best performance
- Provide fallbacks for older browsers
- Test on major browsers (Chrome, Firefox, Safari, Edge)

### Color Support
- Ensure colors work in both light and dark modes
- Test with color blindness simulators
- Verify high contrast mode compatibility

## Performance Impact

### Minimal Impact
- Color changes: No performance impact
- Hover effects: Standard CSS transitions
- Button behavior: Simple logic changes

### Moderate Impact
- Delete animation: CSS transforms are GPU-accelerated
- Quantity control: Slight increase in event handling complexity

## Success Criteria

### Color Changes
- ✅ Success states are visible but not jarring
- ✅ Colors align with overall design system
- ✅ Maintains accessibility standards

### Hover Effects
- ✅ All buttons have consistent hover behavior
- ✅ Hover states provide clear visual feedback
- ✅ Works across all devices and input methods

### Animations
- ✅ Delete button animation is smooth and intuitive
- ✅ Animation enhances rather than distracts from UX
- ✅ Respects user motion preferences

### Quantity Controls
- ✅ Minus button behavior is intuitive
- ✅ Delete action is clear to users
- ✅ Maintains accessibility standards

### Undo Functionality
- ✅ Undo option appears immediately after deletion
- ✅ 5-second timeout works correctly
- ✅ Undo restores item with correct details
- ✅ Works consistently across all cart interfaces
- ✅ Non-intrusive notification design
- ✅ Accessible to keyboard and screen reader users

## Rollback Plan

### If Issues Arise
1. **Color Changes**: Revert to original green-600 with reduced opacity
2. **Hover Effects**: Use subtle background change instead of full color
3. **Animations**: Fall back to simple color transitions
4. **Quantity Controls**: Keep minus button disabled at quantity 1

### Monitoring
- Track user feedback on new interactions
- Monitor for any accessibility issues
- Watch for performance impacts on mobile devices 
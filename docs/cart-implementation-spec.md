# Cart Functionality Implementation Specification

## Overview
This document outlines the complete implementation of shopping cart functionality for the EggyPro Trust Store, including adding products to cart, quantity selection, cart state management, and UI updates.

## Current State Analysis

### Existing Components That Need Updates:
- `src/components/layout/Header.tsx` - Replace checkout button with cart icon
- `src/components/layout/Navbar.tsx` - Remove checkout from navigation items
- `src/app/product/[slug]/page.tsx` - Add quantity selector and cart functionality
- `src/components/product/ProductCard.tsx` - Update "View Details" to support cart actions
- `src/app/checkout/page.tsx` - Update to use cart data instead of mock data
- `src/app/page.tsx` - Update hero section button behavior

### Current Navigation Structure:
- Header contains: Logo + Navigation + Checkout button (to be replaced)
- Navigation items: Home, Product, About Us, FAQ, Checkout (to be removed)
- Mobile: Hamburger menu + Cart icon (cart icon should be separate from hamburger menu)

## Implementation Requirements

### 1. Cart State Management

#### New Files to Create:
- `src/lib/cart-context.tsx` - React Context for cart state management
- `src/lib/cart-types.ts` - TypeScript interfaces for cart functionality
- `src/hooks/use-cart.ts` - Custom hook for cart operations
- `src/lib/cart-utils.ts` - Utility functions for cart calculations

#### Cart State Structure:
```typescript
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  slug: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

interface CartActions {
  addItem: (product: Product, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  buyNow: (product: Product, quantity: number) => void; // Adds item and redirects to checkout
}
```

### 2. Header Updates

#### File: `src/components/layout/Header.tsx`
**Changes Required:**
- Remove checkout button from navigation
- Add cart icon with badge showing item count
- **Mobile Layout**: Cart icon should appear to the RIGHT of hamburger menu (not inside dropdown)
- **Desktop Layout**: Cart icon replaces checkout button in header
- Import cart context and display total items
- Add click handler to toggle cart dropdown/sidebar
- Implement cart badge logic (show count up to 9, then "9+")
- Add cart dropdown/sidebar component integration

**Mobile Header Structure:**
```
[Logo] ..................... [Cart Icon] [Hamburger Menu]
```

**Desktop Header Structure:**
```
[Logo] ............... [Navigation Items] [Cart Icon]
```

#### File: `src/components/layout/Navbar.tsx`
**Changes Required:**
- Remove "Checkout" from navItems array
- Update navigation to only include: Home, Product, About Us, FAQ
- Ensure mobile navigation doesn't include checkout link

**New Components to Create:**
- `src/components/cart/CartIcon.tsx` - Cart icon with badge
- `src/components/cart/CartDropdown.tsx` - Dropdown cart summary
- `src/components/cart/CartSidebar.tsx` - Full cart sidebar (alternative to dropdown)

### 3. Product Page Updates

#### File: `src/app/product/[slug]/page.tsx`
**Changes Required:**
- Replace "Add to Cart" button with functional implementation
- Add quantity selector component
- Add cart context integration
- Add success feedback when item is added
- Handle loading states during add to cart
- Add proper error handling
- Remove all "mock" references from button text and functionality
- **Add Buy Now button**: Secondary button next to "Add to Cart"
- **Buy Now functionality**: 
  - Uses current quantity from QuantitySelector
  - Adds item to cart (temporarily if needed)
  - Redirects to `/checkout` page immediately
  - Handles loading states during the process
- **Button layout**: Stack buttons vertically on mobile, side-by-side on desktop
- **Button styling**: "Add to Cart" as primary, "Buy Now" as secondary/outline

**New Components to Create:**
- `src/components/product/QuantitySelector.tsx` - Quantity input with +/- buttons
- `src/components/product/AddToCartButton.tsx` - Enhanced add to cart button with states
- `src/components/product/BuyNowButton.tsx` - Buy now button with redirect functionality

### 4. Product Card Updates

#### File: `src/components/product/ProductCard.tsx`
**Changes Required:**
- Keep "View Details" as primary action
- Optionally add quick "Add to Cart" button for home page
- Ensure consistent styling with new cart functionality

### 5. Cart Components

#### New Components to Create:

**`src/components/cart/CartIcon.tsx`**
- Shopping cart icon from Lucide React
- Badge overlay showing item count
- Responsive design for mobile/desktop
- Click handler to open cart
- **Mobile**: Positioned to the right of hamburger menu
- **Desktop**: Replaces checkout button position

**`src/components/cart/CartDropdown.tsx`**
- Dropdown panel showing cart items
- Mini cart item list with images, names, quantities
- Subtotal display
- "View Cart" and "Checkout" buttons
- Empty cart state
- Remove item functionality
- **Checkout button**: Direct link to `/checkout` page
- **View Cart button**: Opens full cart sidebar/modal for detailed management

**`src/components/cart/CartSidebar.tsx`**
- Full-height sidebar for detailed cart view
- Complete cart item management
- Quantity adjustment controls
- Price calculations
- Checkout button
- Close functionality
- **Checkout button**: Direct link to `/checkout` page with proper cart validation

**`src/components/cart/CartItem.tsx`**
- Individual cart item component
- Product image, name, price display
- Quantity controls
- Remove button
- Subtotal calculation

**`src/components/product/QuantitySelector.tsx`**
- Input field with +/- buttons
- Min quantity: 1, Max quantity: 99
- Proper mobile touch targets
- Validation and error states

**`src/components/product/AddToCartButton.tsx`**
- Button with loading states
- Success animation/feedback
- Error handling display
- Disabled state management

**`src/components/product/BuyNowButton.tsx`** (NEW)
- Secondary button for immediate purchase
- Takes current quantity selection
- Adds item to cart temporarily
- Redirects directly to checkout page
- Handles loading and error states
- Different styling from "Add to Cart" (e.g., outline variant)
### 6. Checkout Page Updates

#### File: `src/app/checkout/page.tsx`
**Changes Required:**
- Replace order summary with actual cart data
- Calculate real totals from cart items
- Display all cart items in order summary
- Update form submission to include cart data
- Add cart validation (ensure cart not empty)
- Handle cart clearing after successful order
- **Handle Buy Now flow**: Accept items passed from Buy Now functionality
- **Cart validation**: Redirect to home if cart is empty (with appropriate message)
- **Order completion**: Clear cart after successful order submission
- **Remove all "mock" references** from:
  - Order summary text
  - Button text ("Place Secure Order" instead of "Place Secure Order (Mock)")
  - Form labels and descriptions
  - Any placeholder text mentioning mock functionality

### 7. Home Page Updates

#### File: `src/app/page.tsx`
**Changes Required:**
- Update hero section button to either:
  - Navigate to product page, OR
  - Open quick add to cart for featured product
- Ensure ProductCard components work with new cart system

### 8. Layout Integration

#### File: `src/app/layout.tsx`
**Changes Required:**
- Wrap app with CartProvider context
- Ensure cart state persists across page navigation
- Add cart sidebar/modal to layout if using overlay approach

### 9. Utility Functions

#### File: `src/lib/cart-utils.ts`
**Functions to Implement:**
- `calculateCartTotal(items: CartItem[]): number`
- `calculateItemCount(items: CartItem[]): number`
- `formatCartBadgeCount(count: number): string` - Returns "9+" for counts > 9
- `generateCartItemId(productId: string): string`
- `validateQuantity(quantity: number): boolean`

### 10. Local Storage Integration

#### Implementation in `src/lib/cart-context.tsx`
- Persist cart state to localStorage
- Restore cart state on app initialization
- Handle localStorage errors gracefully
- Clear cart data when needed

## UI/UX Specifications

### Mobile Header Layout:
```
┌─────────────────────────────────────────────────────────┐
│ [EggyPro Logo]                  [Cart Icon] [☰ Menu]   │
└─────────────────────────────────────────────────────────┘
```

### Desktop Header Layout:
```
┌─────────────────────────────────────────────────────────┐
│ [EggyPro]     [Home] [Product] [About] [FAQ]  [Cart]    │
└─────────────────────────────────────────────────────────┘
```

### Cart Icon Badge:
- Position: Top-right of cart icon
- Background: Primary color with white text
- Size: Small circle, minimum 16px diameter
- Animation: Subtle bounce when count increases
- Display logic: Show only when count > 0
- Count display: Show numbers 1-9, then "9+" for 10 or more

### Quantity Selector:
- Style: Input field with +/- buttons on sides
- Mobile: Larger touch targets (44px minimum)
- Validation: Real-time validation with error states
- Limits: Min 1, Max 99

### Cart Dropdown/Sidebar:
- Animation: Smooth slide-in/fade-in
- Mobile: Full-screen overlay or bottom sheet
- Desktop: Dropdown from cart icon or right sidebar
- Empty state: Friendly message with shop button

### Add to Cart Button States:
- Default: "Add to Cart"
- Loading: "Adding..." with spinner
- Success: "Added!" with checkmark (brief)
- Error: "Try Again" with error styling

### Buy Now Button States:
- Default: "Buy Now"
- Loading: "Processing..." with spinner
- Error: "Try Again" with error styling
## Responsive Design Considerations

### Mobile (< 768px):
- Cart icon: Positioned to the right of hamburger menu
- Cart icon: Larger touch target (44px minimum)
- Quantity selector: Bigger buttons
- Cart sidebar: Full-screen overlay
- Add to cart: Full-width button

### Desktop (>= 768px):
- Cart icon: Replaces checkout button position
- Cart dropdown: Positioned dropdown
- Quantity selector: Compact inline design
- Cart sidebar: Right-side panel
- Add to cart: Auto-width button
- Buy now: Auto-width button, positioned next to "Add to Cart"

## Error Handling

### Scenarios to Handle:
- localStorage unavailable
- Invalid quantity values
- Product not found when adding to cart
- Network errors (if future API integration)
- Cart state corruption

### Error Display:
- Toast notifications for cart actions
- Inline errors for quantity validation
- Fallback UI for critical errors

## Testing Considerations

### Key Test Cases:
- Add single item to cart
- Add multiple quantities of same item
- Add different products to cart
- Remove items from cart
- Update quantities in cart
- Cart persistence across page reloads
- Cart badge count display (including 9+ logic)
- Empty cart states
- Mobile responsive behavior (cart icon positioning)
- localStorage error handling
- Buy Now functionality with different quantities
- Buy Now redirect to checkout
- Checkout page with cart validation
- Cart clearing after order completion

## Performance Considerations

### Optimizations:
- Debounce quantity changes
- Memoize cart calculations
- Lazy load cart components
- Optimize re-renders with React.memo
- Efficient localStorage operations

## Accessibility Requirements

### ARIA Labels:
- Cart icon: "Shopping cart, X items"
- Quantity controls: Proper labels and descriptions
- Cart items: Screen reader friendly descriptions
- Remove buttons: "Remove [product name] from cart"
- Buy Now button: "Buy [product name] now"
- Checkout buttons: "Proceed to checkout"

### Keyboard Navigation:
- Cart icon: Focusable and keyboard accessible
- Quantity controls: Arrow key support
- Cart dropdown: Proper focus management
- All interactive elements: Tab navigation
- Buy Now button: Proper tab order with Add to Cart button

## Post-Implementation Cleanup

### Remove Mock References:
After implementing the cart functionality, remove all references to "mock" or "mock implementation" from:

1. **Checkout Page** (`src/app/checkout/page.tsx`):
   - Button text: "Place Secure Order" (remove "(Mock)")
   - Form descriptions: Remove "mock" from payment details
   - Alert message: Update to real order confirmation
   - Page title and descriptions

2. **Product Pages** (`src/app/product/[slug]/page.tsx`):
   - Button text: "Add to Cart" (remove any mock references)

3. **Any other components** that may have mock references related to cart functionality

## File Structure Summary

```
src/
├── components/
│   ├── cart/
│   │   ├── CartIcon.tsx (NEW)
│   │   ├── CartDropdown.tsx (NEW)
│   │   ├── CartSidebar.tsx (NEW)
│   │   └── CartItem.tsx (NEW)
│   ├── product/
│   │   ├── QuantitySelector.tsx (NEW)
│   │   ├── AddToCartButton.tsx (NEW)
│   │   ├── BuyNowButton.tsx (NEW)
│   │   ├── ProductCard.tsx (UPDATE)
│   │   └── ...existing files
│   └── layout/
│       ├── Header.tsx (UPDATE - cart icon positioning)
│       ├── Navbar.tsx (UPDATE - remove checkout)
│       └── ...existing files
├── lib/
│   ├── cart-context.tsx (NEW)
│   ├── cart-types.ts (NEW)
│   ├── cart-utils.ts (NEW)
│   └── ...existing files
├── hooks/
│   ├── use-cart.ts (NEW)
│   └── ...existing files
├── app/
│   ├── layout.tsx (UPDATE)
│   ├── page.tsx (UPDATE)
│   ├── checkout/
│   │   └── page.tsx (UPDATE - remove mock references)
│   ├── product/[slug]/
│   │   └── page.tsx (UPDATE - add quantity selector)
│   └── ...existing files
└── docs/
    └── cart-implementation-spec.md (THIS FILE)
```

## Implementation Priority

### Phase 1: Core Infrastructure
1. Create cart types and context
2. Implement cart utilities
3. Create useCart hook
4. Update layout with CartProvider

### Phase 2: Basic Cart Functionality
1. Create CartIcon component
2. Update Header with cart icon (proper mobile positioning)
3. Update Navbar to remove checkout
4. Implement basic add to cart on product page
5. Create QuantitySelector component
6. Create BuyNowButton component
7. Implement Buy Now functionality

### Phase 3: Cart UI Components
1. Create CartDropdown/CartSidebar
2. Create CartItem component
3. Implement cart management (remove, update quantity)
4. Add cart persistence
5. Add checkout links in cart components
6. Implement cart validation for checkout page

### Phase 4: Integration & Polish
1. Update checkout page with cart data
2. Remove all mock references
3. Add success/error feedback
4. Implement responsive design
5. Add accessibility features
6. Testing and bug fixes
7. Test Buy Now flow end-to-end
8. Test checkout validation and cart clearing

## Success Criteria

- ✅ Users can add products to cart with custom quantities
- ✅ Cart icon shows accurate item count (with 9+ logic)
- ✅ Cart icon positioned correctly on mobile (right of hamburger menu)
- ✅ Cart state persists across page reloads
- ✅ Users can manage cart items (update quantity, remove)
- ✅ Checkout page uses real cart data
- ✅ All mock references removed from UI
- ✅ Responsive design works on all devices
- ✅ Accessibility requirements met
- ✅ Error handling works properly
- ✅ Performance is optimized
- ✅ Navigation updated (checkout removed from nav items)
- ✅ Buy Now functionality works correctly
- ✅ Checkout links properly implemented in cart components
- ✅ Cart validation prevents empty checkout
- ✅ Cart clears after successful order
- ✅ Buy Now redirects to checkout with correct items
# Frontend Integration Specification for Live Product Implementation

## 1. Introduction

This document details the required frontend changes to fully integrate live product and inventory data from the backend into the EggyPro application. The goal is to ensure that product stock status is accurately displayed, purchasing is disabled for out-of-stock items, and the UI provides a seamless, responsive experience for users.

## 2. Objective

- Display real-time stock status for each product.
- Disable Add to Cart and Buy Now actions when a product is out of stock.
- Limit the maximum selectable quantity to the available stock.
- Ensure all UI changes are responsive and accessible.

## 3. Components to Update

### 3.1 Product Page Client (`src/components/product/ProductPageClient.tsx`)
- **Display Stock Status:**
  - Show "In Stock", "Low Stock" (≤10), or "Out of Stock" based on `stock_quantity`.
  - Use badges or colored text for clear visual feedback.
- **Pass Stock Data:**
  - Pass `stock_quantity` as a prop to `QuantitySelector`, `AddToCartButton`, and `BuyNowButton`.
- **Disable Actions:**
  - If `stock_quantity === 0`, disable both Add to Cart and Buy Now buttons.
- **Example UI Addition:**
  ```tsx
  <div className="flex items-center gap-2">
    {product.stock_quantity === 0 ? (
      <span className="text-red-600 font-semibold">Out of Stock</span>
    ) : product.stock_quantity <= 10 ? (
      <span className="text-yellow-600 font-semibold">Low Stock ({product.stock_quantity} left)</span>
    ) : (
      <span className="text-green-600 font-semibold">In Stock</span>
    )}
  </div>
  ```

### 3.2 Add to Cart Button (`src/components/product/AddToCartButton.tsx`)
- **Disable When Out of Stock:**
  - Add a `disabled` prop based on `stock_quantity`.
  - Show tooltip or message if disabled.
- **Prop Update:**
  ```tsx
  <AddToCartButton
    product={product}
    quantity={quantity}
    disabled={product.stock_quantity === 0}
    className="w-full sm:flex-1"
  />
  ```

### 3.3 Buy Now Button (`src/components/product/BuyNowButton.tsx`)
- **Disable When Out of Stock:**
  - Same as Add to Cart Button.
- **Prop Update:**
  ```tsx
  <BuyNowButton
    product={product}
    quantity={quantity}
    disabled={product.stock_quantity === 0}
    className="w-full sm:flex-1"
  />
  ```

### 3.4 Quantity Selector (`src/components/product/QuantitySelector.tsx`)
- **Limit Maximum Quantity:**
  - Set `max={product.stock_quantity}`.
  - If out of stock, disable the selector.
- **Prop Update:**
  ```tsx
  <QuantitySelector
    quantity={quantity}
    onQuantityChange={setQuantity}
    max={product.stock_quantity}
    disabled={product.stock_quantity === 0}
  />
  ```

## 4. Data Flow & API Integration

- **Fetch Live Product Data:**
  - Update product page (`src/app/product/[slug]/page.tsx`) to fetch product data from the backend API (`/api/products/[slug]`) instead of static constants.
  - Ensure `stock_quantity` is included in the fetched data.
- **Example Fetch:**
  ```ts
  const res = await fetch(`/api/products/${slug}`);
  const { data: product } = await res.json();
  ```

## 5. UI/UX Guidelines

- **Accessibility:**
  - Ensure disabled buttons have `aria-disabled` and tooltips for explanation.
- **Responsiveness:**
  - All changes must work on mobile, tablet, and desktop.
- **Feedback:**
  - Show clear feedback when actions are disabled due to stock.

## 6. Testing

- **Unit Tests:**
  - Test that Add to Cart and Buy Now are disabled when out of stock.
  - Test that QuantitySelector does not allow selection above available stock.
- **Integration Tests:**
  - Simulate out-of-stock and low-stock scenarios in the UI.

## 7. Codebase References

- `src/components/product/ProductPageClient.tsx`
- `src/components/product/AddToCartButton.tsx`
- `src/components/product/BuyNowButton.tsx`
- `src/components/product/QuantitySelector.tsx`
- `src/app/product/[slug]/page.tsx`
- API: `/api/products/[slug]` (see `api-endpoints-spec.md`)

## 8. Example User Flows

- **In Stock:**
  - User can select quantity up to `stock_quantity`.
  - Add to Cart and Buy Now are enabled.
- **Low Stock:**
  - User sees a warning (e.g., "Low Stock (3 left)").
  - Can only select up to available quantity.
- **Out of Stock:**
  - User sees "Out of Stock".
  - Add to Cart, Buy Now, and QuantitySelector are disabled.

---

This spec ensures the frontend accurately reflects live inventory, prevents overselling, and provides a clear, user-friendly experience. 
# Live Products Implementation - Refactor Plan

## Overview

This document outlines the comprehensive refactor plan to transition EggyPro from a static mock data application to a dynamic live backend with database integration, inventory management, and admin functionality.

## Current State Analysis

### Existing Architecture
- **Frontend**: Next.js 15.2.3 with TypeScript
- **Data Source**: Static mock data in `src/lib/constants.ts`
- **Product Display**: Static product pages with mock data
- **Cart System**: Local storage-based cart with mock products
- **UI Components**: Comprehensive component library with shadcn/ui

### Current Data Flow
1. Products loaded from `src/lib/constants.ts`
2. Product pages use static generation with `generateStaticParams`
3. Cart system works with mock product data
4. No inventory management or stock tracking

## Required Changes

### Phase 1: Database & Backend Infrastructure

#### 1.1 Dependencies Installation
```bash
npm install drizzle-orm @vercel/postgres
npm install -D drizzle-kit @types/pg
npm install cloudinary multer
```

#### 1.2 Database Schema Implementation
**File: `src/lib/db/schema.ts`**
```typescript
import { pgTable, serial, varchar, text, decimal, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  details: text('details').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  images: text('images').array().notNull().default([]),
  ingredients: text('ingredients').array().notNull().default([]),
  stock_quantity: integer('stock_quantity').notNull().default(0),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull().references(() => products.id),
  reviewer_name: varchar('reviewer_name', { length: 255 }).notNull(),
  reviewer_image_url: varchar('reviewer_image_url', { length: 255 }),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  image_url: varchar('image_url', { length: 255 }),
  video_url: varchar('video_url', { length: 255 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
});
```

#### 1.3 Database Connection
**File: `src/lib/db/index.ts`**
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });
```

#### 1.4 Environment Variables
**File: `.env.local`**
```env
POSTGRES_URL="your_vercel_postgres_url"
ADMIN_SECRET_KEY="your_strong_admin_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### Phase 2: API Endpoints Implementation

#### 2.1 Products API Routes
**File: `src/app/api/products/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');

    let query = db.select().from(products);
    
    if (category) {
      // Add category filtering logic
    }
    
    if (sort === 'price-asc') {
      query = query.orderBy(products.price);
    } else if (sort === 'price-desc') {
      query = query.orderBy(desc(products.price));
    }

    const allProducts = await query;
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    // Handle product creation with Cloudinary image upload
    // Implementation details in next section
    
    return NextResponse.json({ message: 'Product created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

**File: `src/app/api/products/[slug]/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, reviews } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, params.slug))
      .limit(1);

    if (!product.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get reviews for this product
    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.product_id, product[0].id));

    const productWithReviews = {
      ...product[0],
      reviews: productReviews,
    };

    return NextResponse.json(productWithReviews);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Admin authentication and product update logic
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Admin authentication and product deletion logic
}
```

### Phase 3: Type System Updates

#### 3.1 Updated Type Definitions
**File: `src/lib/types.ts`**
```typescript
export interface Product {
  id: number; // Changed from string to number for database compatibility
  name: string;
  description: string;
  price: number;
  images: string[]; // Changed from imageUrl to images array
  ingredients: string[];
  details: string;
  slug: string;
  stock_quantity: number; // New field for inventory management
  created_at?: string;
}

export interface Review {
  id: number; // Changed from string to number
  product_id: number; // Changed from string to number
  reviewer_name: string;
  reviewer_image_url?: string; // New field
  rating: number;
  comment: string;
  image_url?: string;
  video_url?: string;
  created_at?: string;
}

export interface Testimonial extends Omit<Review, 'product_id' | 'rating'> {
  title: string;
  rating?: number;
}

// New types for API responses
export interface ApiProduct extends Product {
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  productId: number; // Updated to match database ID
  name: string;
  price: number;
  quantity: number;
  imageUrl: string; // Keep as single URL for cart display
  slug: string;
  stock_quantity: number; // Add stock tracking to cart items
}
```

### Phase 4: Frontend Integration

#### 4.1 Product Data Fetching
**File: `src/lib/api.ts`**
```typescript
import type { Product, Review, ApiProduct } from './types';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function fetchProduct(slug: string): Promise<ApiProduct> {
  const response = await fetch(`/api/products/${slug}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
}
```

#### 4.2 Updated Product Page
**File: `src/app/product/[slug]/page.tsx`**
```typescript
import { notFound } from 'next/navigation';
import { fetchProduct, fetchProducts } from '@/lib/api';
import ProductPageClient from '@/components/product/ProductPageClient';

export async function generateStaticParams() {
  try {
    const products = await fetchProducts();
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    const product = await fetchProduct(slug);
    const allProducts = await fetchProducts();
    const relatedProducts = allProducts
      .filter(p => p.id !== product.id)
      .slice(0, 2);

    return (
      <ProductPageClient 
        product={product} 
        productReviews={product.reviews || []} 
        relatedProducts={relatedProducts} 
      />
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
```

#### 4.3 Updated Home Page
**File: `src/app/page.tsx`**
```typescript
import { fetchProducts } from '@/lib/api';
// ... existing imports

export default async function HomePage() {
  const products = await fetchProducts();
  const featuredProducts = products.slice(0, 2);

  return (
    <PageWrapper skeleton={<HomeSkeleton />}>
      {/* ... existing JSX with updated product data */}
    </PageWrapper>
  );
}
```

### Phase 5: Inventory Management Integration

#### 5.1 Updated Product Components
**File: `src/components/product/ProductPageClient.tsx`**
```typescript
// Add stock status display
const StockStatus = ({ stockQuantity }: { stockQuantity: number }) => {
  if (stockQuantity === 0) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <span className="text-sm font-medium">Out of Stock</span>
      </div>
    );
  }
  
  if (stockQuantity <= 5) {
    return (
      <div className="flex items-center gap-2 text-orange-600">
        <span className="text-sm font-medium">Only {stockQuantity} left</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 text-green-600">
      <span className="text-sm font-medium">In Stock</span>
    </div>
  );
};

// Update component to include stock status
export default function ProductPageClient({ product, productReviews, relatedProducts }: ProductPageClientProps) {
  // ... existing code
  
  return (
    <PageWrapper skeleton={<ProductSkeleton />}>
      <div className="space-y-8 md:space-y-12">
        {/* ... existing sections */}
        
        {/* Add stock status */}
        <StockStatus stockQuantity={product.stock_quantity} />
        
        {/* Update quantity selector with stock limit */}
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          max={product.stock_quantity}
          disabled={product.stock_quantity === 0}
        />
        
        {/* Update buttons with stock check */}
        <AddToCartButton
          product={product}
          quantity={quantity}
          disabled={product.stock_quantity === 0}
          className="w-full sm:flex-1"
        />
        <BuyNowButton
          product={product}
          quantity={quantity}
          disabled={product.stock_quantity === 0}
          className="w-full sm:flex-1"
        />
      </div>
    </PageWrapper>
  );
}
```

#### 5.2 Updated Cart Components
**File: `src/components/product/AddToCartButton.tsx`**
```typescript
// Add stock validation
const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity,
  disabled = false,
  className = '',
}) => {
  const isOutOfStock = product.stock_quantity === 0;
  const isDisabled = disabled || isOutOfStock || isLoading;

  const handleAddToCart = async () => {
    if (isDisabled) return;
    
    // Add stock validation
    if (quantity > product.stock_quantity) {
      // Show error toast
      return;
    }
    
    // ... existing logic
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`${className} ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isOutOfStock ? 'Out of Stock' : getButtonContent()}
    </Button>
  );
};
```

#### 5.3 Updated Quantity Selector
**File: `src/components/product/QuantitySelector.tsx`**
```typescript
interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number; // This will now be stock_quantity
  disabled?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false,
}) => {
  // ... existing logic with updated max validation
};
```

### Phase 6: Admin Interface

#### 6.1 Admin Authentication
**File: `src/lib/auth.ts`**
```typescript
export function verifyAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${process.env.ADMIN_SECRET_KEY}`;
}
```

#### 6.2 Admin Components
**File: `src/components/admin/ProductDataTable.tsx`**
```typescript
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';

interface ProductDataTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export function ProductDataTable({ products, onEdit, onDelete }: ProductDataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>${product.price}</TableCell>
            <TableCell>{product.stock_quantity}</TableCell>
            <TableCell>
              <Button onClick={() => onEdit(product)}>Edit</Button>
              <Button variant="destructive" onClick={() => onDelete(product.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

**File: `src/components/admin/ProductForm.tsx`**
```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Product } from '@/lib/types';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Partial<Product>) => void;
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    details: product?.details || '',
    price: product?.price || 0,
    stock_quantity: product?.stock_quantity || 0,
    ingredients: product?.ingredients || [],
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="stock_quantity">Stock Quantity</Label>
          <Input
            id="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
            required
          />
        </div>
        
        {/* Add other form fields */}
        
        <Button type="submit">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
```

### Phase 7: Data Migration & Seeding

#### 7.1 Database Migration
**File: `src/lib/db/migrate.ts`**
```typescript
import { db } from './index';
import { products, reviews } from './schema';

export async function migrate() {
  // Create tables if they don't exist
  // This will be handled by Drizzle Kit in production
}
```

#### 7.2 Data Seeding
**File: `scripts/seed.ts`**
```typescript
import { db } from '../src/lib/db';
import { products, reviews } from '../src/lib/db/schema';
import { mockProducts, mockReviews } from '../src/lib/constants';

async function seed() {
  try {
    // Clear existing data
    await db.delete(reviews);
    await db.delete(products);
    
    // Insert products with stock quantities
    const seededProducts = mockProducts.map(product => ({
      ...product,
      id: undefined, // Let database generate ID
      stock_quantity: 100, // Default stock
      images: [], // Empty images array
    }));
    
    const insertedProducts = await db.insert(products).values(seededProducts).returning();
    
    // Insert reviews with proper product IDs
    const seededReviews = mockReviews.map(review => {
      const product = insertedProducts.find(p => p.slug === review.productId);
      return {
        ...review,
        id: undefined,
        product_id: product?.id || 1,
        reviewer_image_url: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      };
    });
    
    await db.insert(reviews).values(seededReviews);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();
```

### Phase 8: Cloudinary Integration

#### 8.1 Cloudinary Setup
**File: `src/lib/cloudinary.ts`**
```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'eggypro-products',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    ).end(buffer);
  });
}
```

## Implementation Timeline

### Week 1: Database & Backend Infrastructure
- [ ] Install dependencies
- [ ] Set up database schema
- [ ] Configure environment variables
- [ ] Implement database connection
- [ ] Create basic API endpoints

### Week 2: API Implementation
- [ ] Complete all API endpoints
- [ ] Add authentication for admin routes
- [ ] Implement Cloudinary integration
- [ ] Add error handling and validation

### Week 3: Frontend Integration
- [ ] Update type definitions
- [ ] Implement data fetching functions
- [ ] Update product pages
- [ ] Add inventory management to UI

### Week 4: Admin Interface
- [ ] Create admin components
- [ ] Implement product management UI
- [ ] Add image upload functionality
- [ ] Test admin workflows

### Week 5: Testing & Deployment
- [ ] Data migration and seeding
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Deployment preparation

## Testing Strategy

### Unit Tests
- API endpoint functionality
- Database operations
- Type validation
- Authentication logic

### Integration Tests
- Product CRUD operations
- Image upload workflow
- Cart integration with inventory
- Admin authentication

### E2E Tests
- Complete product purchase flow
- Admin product management
- Inventory updates
- User experience validation

## Risk Mitigation

### Data Migration
- Backup existing mock data
- Implement rollback procedures
- Test migration scripts thoroughly
- Maintain data integrity during transition

### Performance Considerations
- Implement caching for product data
- Optimize database queries
- Use CDN for image delivery
- Monitor API response times

### Security Measures
- Validate all input data
- Implement rate limiting
- Secure admin authentication
- Protect against SQL injection

## Success Metrics

### Technical Metrics
- API response time < 200ms
- Database query optimization
- Image upload success rate > 99%
- Error rate < 1%

### Business Metrics
- Successful product updates
- Inventory accuracy
- Admin workflow efficiency
- User experience improvements

## Conclusion

This refactor plan provides a comprehensive roadmap for transitioning EggyPro to a live backend system. The phased approach ensures minimal disruption while building robust functionality. Each phase includes specific deliverables and testing requirements to maintain quality throughout the implementation. 
# Live Products Implementation Guide

## Overview

This document provides a detailed, phase-by-phase implementation guide for transitioning EggyPro from static mock data to a live backend system with database integration, inventory management, and admin functionality. Each phase includes specific deliverables, testing requirements, and rollback procedures.

## Prerequisites

### Required Accounts & Services
- **Vercel Account**: For deployment and Postgres database
- **Cloudinary Account**: For image management
- **GitHub Account**: For version control

### Development Environment
- Node.js 18+ 
- npm or yarn
- Git
- Code editor (VS Code recommended)

## Phase 1: Database & Backend Infrastructure (Week 1)

### Step 1.1: Install Dependencies

**Objective**: Set up the required packages for database and image management.

**Commands**:
```bash
npm install drizzle-orm @vercel/postgres cloudinary multer
npm install -D drizzle-kit @types/pg tsx
```

**Testing**: 
- [ ] Verify all packages install without errors
- [ ] Check TypeScript compilation passes
- [ ] Confirm no dependency conflicts

### Step 1.2: Environment Configuration

**Objective**: Set up environment variables for database and services.

**File**: `.env.local`
```env
# Database
POSTGRES_URL="your_vercel_postgres_url"

# Admin Authentication
ADMIN_SECRET_KEY="your_strong_admin_secret_key_here"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

**Testing**:
- [ ] Verify environment variables are loaded correctly
- [ ] Test database connection
- [ ] Validate Cloudinary credentials

### Step 1.3: Database Schema Implementation

**Objective**: Create the database schema using Drizzle ORM.

**File**: `src/lib/db/schema.ts`
```typescript
import { pgTable, serial, varchar, text, decimal, integer, timestamp } from 'drizzle-orm/pg-core';

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

**Testing**:
- [ ] Verify schema compiles without TypeScript errors
- [ ] Test database table creation
- [ ] Validate foreign key relationships

### Step 1.4: Database Connection Setup

**Objective**: Configure the database connection using Drizzle ORM.

**File**: `src/lib/db/index.ts`
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });
```

**Testing**:
- [ ] Test database connection
- [ ] Verify schema is accessible
- [ ] Test basic query execution

### Step 1.5: Drizzle Configuration

**Objective**: Set up Drizzle Kit for migrations and schema management.

**File**: `drizzle.config.ts`
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
  },
} satisfies Config;
```

**Testing**:
- [ ] Run `npx drizzle-kit generate` successfully
- [ ] Verify migration files are created
- [ ] Test schema introspection

## Phase 2: API Endpoints Implementation (Week 2)

### Step 2.1: Products API Route

**Objective**: Create the main products API endpoint for fetching all products.

**File**: `src/app/api/products/route.ts`
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
      // Add category filtering logic when categories are implemented
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
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const details = formData.get('details') as string;
    const price = parseFloat(formData.get('price') as string);
    const stockQuantity = parseInt(formData.get('stock_quantity') as string);
    const ingredients = JSON.parse(formData.get('ingredients') as string);

    // Validate required fields
    if (!name || !slug || !description || !details || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle image uploads (implemented in Phase 3)
    const images: string[] = [];

    const newProduct = await db.insert(products).values({
      name,
      slug,
      description,
      details,
      price,
      stock_quantity: stockQuantity,
      ingredients,
      images,
    }).returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

**Testing**:
- [ ] Test GET endpoint returns products
- [ ] Test POST endpoint with valid data
- [ ] Test authentication for admin endpoints
- [ ] Test error handling for invalid data

### Step 2.2: Single Product API Route

**Objective**: Create API endpoint for fetching individual products with reviews.

**File**: `src/app/api/products/[slug]/route.ts`
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
    const updates: any = {};

    // Handle form data updates
    ['name', 'description', 'details', 'price', 'stock_quantity'].forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        if (field === 'price') {
          updates[field] = parseFloat(value as string);
        } else if (field === 'stock_quantity') {
          updates[field] = parseInt(value as string);
        } else {
          updates[field] = value;
        }
      }
    });

    const updatedProduct = await db
      .update(products)
      .set(updates)
      .where(eq(products.slug, params.slug))
      .returning();

    if (!updatedProduct.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Delete reviews first (due to foreign key constraint)
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

    await db.delete(reviews).where(eq(reviews.product_id, product[0].id));
    await db.delete(products).where(eq(products.slug, params.slug));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
```

**Testing**:
- [ ] Test GET endpoint with valid slug
- [ ] Test GET endpoint with invalid slug (404)
- [ ] Test PUT endpoint with valid data
- [ ] Test DELETE endpoint with authentication
- [ ] Test foreign key constraint handling

## Phase 3: Type System Updates (Week 2)

### Step 3.1: Update Type Definitions

**Objective**: Update TypeScript interfaces to match database schema.

**File**: `src/lib/types.ts`
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

// Admin types
export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  details: string;
  price: number;
  stock_quantity: number;
  ingredients: string[];
  images?: File[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number;
}
```

**Testing**:
- [ ] Verify TypeScript compilation passes
- [ ] Test type compatibility with existing components
- [ ] Validate interface completeness

### Step 3.2: Create API Client Functions

**Objective**: Create reusable functions for API communication.

**File**: `src/lib/api.ts`
```typescript
import type { Product, Review, ApiProduct, CreateProductData, UpdateProductData } from './types';

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

export async function createProduct(data: CreateProductData, token: string): Promise<Product> {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'ingredients') {
      formData.append(key, JSON.stringify(value));
    } else if (key === 'images' && Array.isArray(value)) {
      value.forEach(file => formData.append('images', file));
    } else {
      formData.append(key, value.toString());
    }
  });

  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return response.json();
}

export async function updateProduct(slug: string, data: UpdateProductData, token: string): Promise<Product> {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'ingredients') {
      formData.append(key, JSON.stringify(value));
    } else if (key === 'images' && Array.isArray(value)) {
      value.forEach(file => formData.append('images', file));
    } else if (value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/products/${slug}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return response.json();
}

export async function deleteProduct(slug: string, token: string): Promise<void> {
  const response = await fetch(`/api/products/${slug}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
}
```

**Testing**:
- [ ] Test fetchProducts function
- [ ] Test fetchProduct function with valid slug
- [ ] Test error handling for invalid requests
- [ ] Test admin functions with authentication

## Phase 4: Frontend Integration (Week 3)

### Step 4.1: Update Product Page

**Objective**: Modify product page to fetch data from API instead of static data.

**File**: `src/app/product/[slug]/page.tsx`
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

**Testing**:
- [ ] Test page loads with valid product slug
- [ ] Test 404 handling for invalid slug
- [ ] Verify related products display correctly
- [ ] Test static generation

### Step 4.2: Update Home Page

**Objective**: Modify home page to fetch products from API.

**File**: `src/app/page.tsx`
```typescript
import { fetchProducts } from '@/lib/api';
// ... existing imports

export default async function HomePage() {
  try {
    const products = await fetchProducts();
    const featuredProducts = products.slice(0, 2);

    return (
      <PageWrapper skeleton={<HomeSkeleton />}>
        <div className="space-y-12 md:space-y-16">
          {/* Hero Section */}
          <ScrollAnimation animation="fade-up" delay={0.1}>
            <section className="text-center py-8 md:py-12 bg-gradient-to-br from-primary/20 via-background to-background rounded-xl shadow-inner">
              <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 md:mb-6 leading-tight">
                  EggyPro: Protein You Can Trust
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-foreground/80 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                  Discover the power of pure egg protein. Sustainably sourced, meticulously crafted, and transparently shared. Fuel your body with the best.
                </p>
                {featuredProducts.length > 0 && (
                  <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto min-h-[48px]">
                    <Link href={`/product/${featuredProducts[0].slug}`}>Shop EggyPro Original</Link>
                  </Button>
                )}
              </div>
            </section>
          </ScrollAnimation>

          {/* Featured Products Section */}
          {featuredProducts.length > 0 && (
            <ScrollAnimation animation="fade-up" delay={0.2}>
              <section>
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-10 px-4">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            </ScrollAnimation>
          )}

          {/* ... rest of existing sections */}
        </div>
      </PageWrapper>
    );
  } catch (error) {
    console.error('Error loading home page:', error);
    // Fallback to static content or error state
    return (
      <PageWrapper skeleton={<HomeSkeleton />}>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-primary mb-4">Welcome to EggyPro</h1>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </PageWrapper>
    );
  }
}
```

**Testing**:
- [ ] Test home page loads with products
- [ ] Test error handling when API fails
- [ ] Verify featured products display correctly
- [ ] Test navigation to product pages

### Step 4.3: Update Product Components for Inventory

**Objective**: Add inventory management to product display components.

**File**: `src/components/product/ProductPageClient.tsx`
```typescript
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import ReviewList from '@/components/product/ReviewList';
import QuantitySelector from '@/components/product/QuantitySelector';
import AddToCartButton from '@/components/product/AddToCartButton';
import BuyNowButton from '@/components/product/BuyNowButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Info, DollarSign, AlertTriangle } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { PageWrapper } from '@/components/ui/page-wrapper';
import { ProductSkeleton } from '@/components/skeletons/product-skeleton';

interface ProductPageClientProps {
  product: Product;
  productReviews: any[];
  relatedProducts: Product[];
}

// Stock status component
const StockStatus = ({ stockQuantity }: { stockQuantity: number }) => {
  if (stockQuantity === 0) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm font-medium">Out of Stock</span>
      </div>
    );
  }
  
  if (stockQuantity <= 5) {
    return (
      <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg">
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm font-medium">Only {stockQuantity} left</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
      <CheckCircle className="h-5 w-5" />
      <span className="text-sm font-medium">In Stock</span>
    </div>
  );
};

export default function ProductPageClient({ 
  product, 
  productReviews, 
  relatedProducts 
}: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [previousTotal, setPreviousTotal] = useState(product.price);
  const [slideDirection, setSlideDirection] = useState<'top' | 'bottom'>('bottom');

  const totalPrice = product.price * quantity;
  const isOutOfStock = product.stock_quantity === 0;

  useEffect(() => {
    if (totalPrice !== previousTotal) {
      setSlideDirection(totalPrice > previousTotal ? 'top' : 'bottom');
      setPreviousTotal(totalPrice);
    }
  }, [totalPrice, previousTotal]);

  // Reset quantity if it exceeds stock
  useEffect(() => {
    if (quantity > product.stock_quantity && product.stock_quantity > 0) {
      setQuantity(product.stock_quantity);
    }
  }, [quantity, product.stock_quantity]);

  return (
    <PageWrapper skeleton={<ProductSkeleton />}>
      <div className="space-y-8 md:space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Product Image Gallery */}
          <Card className="shadow-xl">
            <CardContent className="p-3 md:p-4">
              <Image
                src={product.images[0] || product.imageUrl || 'https://placehold.co/600x600.png'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-auto object-contain rounded-lg max-h-[400px] md:max-h-none"
                priority
                data-ai-hint="protein powder package"
              />
              {/* TODO: Add carousel for multiple images if available */}
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight">{product.name}</h1>
            <p className="text-xl md:text-2xl font-semibold text-accent">${product.price.toFixed(2)}</p>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed">{product.description}</p>
            
            {/* Stock Status */}
            <StockStatus stockQuantity={product.stock_quantity} />
            
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="space-y-3">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity:
                </label>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  max={product.stock_quantity}
                  disabled={isOutOfStock}
                />
              </div>
            )}

            {/* Total Price Display */}
            {!isOutOfStock && (
              <div className="flex items-center gap-2 p-3 md:p-4 bg-secondary/30 rounded-lg border border-border/50">
                <DollarSign className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Total for {quantity} {quantity === 1 ? 'item' : 'items'}:</p>
                  <p 
                    key={totalPrice}
                    className={`text-xl md:text-2xl font-bold text-primary transition-all duration-300 ease-out animate-in fade-in-0 ${
                      slideDirection === 'top' ? 'slide-in-from-top-2' : 'slide-in-from-bottom-2'
                    }`}
                  >
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
                {quantity > 1 && (
                  <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded animate-in fade-in-0 slide-in-from-bottom-2">
                    ${product.price.toFixed(2)} each
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <AddToCartButton
                product={product}
                quantity={quantity}
                disabled={isOutOfStock}
                className="w-full sm:flex-1"
              />
              <BuyNowButton
                product={product}
                quantity={quantity}
                disabled={isOutOfStock}
                className="w-full sm:flex-1"
              />
            </div>

            {/* ... rest of existing sections */}
          </div>
        </section>

        {/* ... rest of existing sections */}
      </div>
    </PageWrapper>
  );
}
```

**Testing**:
- [ ] Test stock status display for different quantities
- [ ] Test quantity selector respects stock limits
- [ ] Test buttons are disabled when out of stock
- [ ] Test image display with new images array

## Phase 5: Data Migration & Seeding (Week 3)

### Step 5.1: Create Seeding Script

**Objective**: Create a script to populate the database with initial data.

**File**: `scripts/seed.ts`
```typescript
import { db } from '../src/lib/db';
import { products, reviews } from '../src/lib/db/schema';
import { mockProducts, mockReviews } from '../src/lib/constants';

async function seed() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.delete(reviews);
    await db.delete(products);
    
    // Insert products with stock quantities
    console.log('Inserting products...');
    const seededProducts = mockProducts.map(product => ({
      name: product.name,
      slug: product.slug,
      description: product.description,
      details: product.details,
      price: product.price,
      stock_quantity: 100, // Default stock
      images: [], // Empty images array
      ingredients: product.ingredients,
    }));
    
    const insertedProducts = await db.insert(products).values(seededProducts).returning();
    console.log(`Inserted ${insertedProducts.length} products`);
    
    // Insert reviews with proper product IDs
    console.log('Inserting reviews...');
    const seededReviews = mockReviews.map(review => {
      const product = insertedProducts.find(p => p.slug === review.productId);
      return {
        product_id: product?.id || 1,
        reviewer_name: review.reviewerName,
        reviewer_image_url: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        rating: review.rating,
        comment: review.comment,
        image_url: review.imageUrl,
        video_url: review.videoUrl,
      };
    });
    
    await db.insert(reviews).values(seededReviews);
    console.log(`Inserted ${seededReviews.length} reviews`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
```

### Step 5.2: Add Package Scripts

**Objective**: Add convenient scripts for database operations.

**File**: `package.json` (add to scripts section)
```json
{
  "scripts": {
    "seed": "tsx scripts/seed.ts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

### Step 5.3: Run Initial Seeding

**Commands**:
```bash
npm run seed
```

**Testing**:
- [ ] Verify products are inserted with correct data
- [ ] Verify reviews are linked to correct products
- [ ] Test API endpoints return seeded data
- [ ] Verify stock quantities are set correctly

## Phase 6: Testing & Validation (Week 4)

### Step 6.1: API Testing

**Objective**: Test all API endpoints with various scenarios.

**Test Cases**:
1. **GET /api/products**
   - [ ] Returns all products
   - [ ] Handles sorting parameters
   - [ ] Returns correct data structure

2. **GET /api/products/[slug]**
   - [ ] Returns product with valid slug
   - [ ] Returns 404 for invalid slug
   - [ ] Includes reviews in response

3. **POST /api/products**
   - [ ] Creates product with valid data
   - [ ] Rejects request without authentication
   - [ ] Validates required fields

4. **PUT /api/products/[slug]**
   - [ ] Updates product with valid data
   - [ ] Rejects request without authentication
   - [ ] Returns 404 for invalid slug

5. **DELETE /api/products/[slug]**
   - [ ] Deletes product and related reviews
   - [ ] Rejects request without authentication
   - [ ] Returns 404 for invalid slug

### Step 6.2: Frontend Testing

**Objective**: Test frontend integration with live data.

**Test Cases**:
1. **Home Page**
   - [ ] Loads products from API
   - [ ] Displays featured products
   - [ ] Handles API errors gracefully

2. **Product Pages**
   - [ ] Loads product data correctly
   - [ ] Displays stock status
   - [ ] Limits quantity to stock
   - [ ] Disables buttons when out of stock

3. **Cart Integration**
   - [ ] Adds products to cart correctly
   - [ ] Respects stock limits
   - [ ] Updates cart with live data

### Step 6.3: Performance Testing

**Objective**: Ensure acceptable performance with live data.

**Test Cases**:
- [ ] API response time < 200ms
- [ ] Page load time < 2 seconds
- [ ] Database queries optimized
- [ ] Image loading performance

## Phase 7: Deployment Preparation (Week 5)

### Step 7.1: Environment Setup

**Objective**: Configure production environment variables.

**Vercel Environment Variables**:
```
POSTGRES_URL=your_production_postgres_url
ADMIN_SECRET_KEY=your_production_admin_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 7.2: Database Migration

**Objective**: Run database migrations in production.

**Commands**:
```bash
npx drizzle-kit migrate
```

### Step 7.3: Production Seeding

**Objective**: Seed production database with initial data.

**Commands**:
```bash
npm run seed
```

## Rollback Procedures

### Database Rollback
1. Backup current database
2. Restore previous schema if needed
3. Update environment variables
4. Redeploy with previous configuration

### Code Rollback
1. Revert to previous git commit
2. Update package.json if dependencies changed
3. Clear build cache
4. Redeploy

### Data Recovery
1. Export current data before major changes
2. Keep backup of mock data
3. Document data transformation procedures

## Success Criteria

### Technical Criteria
- [ ] All API endpoints return correct data
- [ ] Database operations complete successfully
- [ ] Frontend displays live data correctly
- [ ] Performance meets requirements
- [ ] Error handling works properly

### Business Criteria
- [ ] Products display with inventory information
- [ ] Cart system works with live data
- [ ] Admin can manage products
- [ ] User experience remains smooth
- [ ] No data loss during transition

## Next Steps

After successful implementation of this guide:

1. **Admin Interface**: Implement full admin UI for product management
2. **Image Management**: Add Cloudinary integration for image uploads
3. **Advanced Features**: Add categories, search, filtering
4. **Analytics**: Implement product analytics and reporting
5. **Performance**: Add caching and optimization

This implementation guide provides a structured approach to transitioning EggyPro to a live backend system while maintaining functionality and user experience throughout the process. 
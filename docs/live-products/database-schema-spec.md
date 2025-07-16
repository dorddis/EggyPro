# Database Schema Specification for Live Product Implementation

## 1. Introduction

This document provides the complete database schema for the EggyPro application, serving as the blueprint for creating the necessary tables in our Vercel Postgres database using Drizzle ORM. The schema is derived directly from the existing data structures used in the application and includes necessary additions for inventory management, image handling, and comprehensive product tracking.

## 2. Technology Stack & Architecture

### 2.1 Database Technology
- **Database**: Vercel Postgres (PostgreSQL compatible)
  - Chosen for seamless integration with Vercel deployments
  - Robust SQL capabilities and reliability
  - Automatic scaling and backup management
- **ORM**: Drizzle ORM
  - Type-safe database operations
  - Excellent TypeScript support
  - Lightweight and performant
  - Built-in migration support

### 2.2 Project Structure
```
src/lib/db/
├── schema.ts          # Database table definitions
├── index.ts           # Database connection setup
├── migrations/        # Generated migration files
└── types.ts          # Database-specific type definitions
```

## 3. Entity-Relationship Diagram (ERD)

```mermaid
graph TD
    Products ||--o{ Reviews : "has"
    Products {
        id serial PK
        name varchar
        slug varchar UNIQUE
        description text
        details text
        price decimal
        images text[]
        ingredients text[]
        stock_quantity integer
        created_at timestamp
    }
    Reviews {
        id serial PK
        product_id integer FK
        reviewer_name varchar
        reviewer_image_url varchar
        rating integer
        comment text
        image_url varchar
        video_url varchar
        created_at timestamp
    }
```

## 4. Database Schema Implementation

### 4.1 Products Table Schema

**File**: `src/lib/db/schema.ts`

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
```

#### 4.1.1 Column Specifications

| Column Name      | Data Type      | Constraints                      | Description                                                  |
|------------------|----------------|----------------------------------|--------------------------------------------------------------|
| `id`             | `serial`       | `PRIMARY KEY`                    | Auto-incrementing integer for unique identification.         |
| `name`           | `varchar(255)` | `NOT NULL`                       | The name of the product.                                     |
| `slug`           | `varchar(255)` | `NOT NULL`, `UNIQUE`             | URL-friendly identifier for the product page.                |
| `description`    | `text`         | `NOT NULL`                       | A short, engaging description for product cards.             |
| `details`        | `text`         | `NOT NULL`                       | Comprehensive details for the product page.                  |
| `price`          | `decimal(10,2)`| `NOT NULL`                       | The price of the product with 2 decimal places.             |
| `images`         | `text[]`       | `NOT NULL`, `DEFAULT '{}'`      | An array of URLs pointing to product images on Cloudinary.  |
| `ingredients`    | `text[]`       | `NOT NULL`, `DEFAULT '{}'`      | An array of product ingredients.                             |
| `stock_quantity` | `integer`      | `NOT NULL`, `DEFAULT 0`          | The number of units available in inventory.                  |
| `created_at`     | `timestamp`    | `NOT NULL`, `DEFAULT now()`      | The timestamp when the product was created.                  |

#### 4.1.2 Indexes and Performance

```sql
-- Create indexes for better query performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_stock ON products(stock_quantity);
CREATE INDEX idx_products_created ON products(created_at);
```

### 4.2 Reviews Table Schema

```typescript
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

#### 4.2.1 Column Specifications

| Column Name         | Data Type      | Constraints                      | Description                                                  |
|---------------------|----------------|----------------------------------|--------------------------------------------------------------|
| `id`                | `serial`       | `PRIMARY KEY`                    | Auto-incrementing integer for unique identification.         |
| `product_id`        | `integer`      | `NOT NULL`, `REFERENCES products(id)` | Foreign key linking to the `products` table.                 |
| `reviewer_name`     | `varchar(255)` | `NOT NULL`                       | The name of the person who wrote the review.                 |
| `reviewer_image_url`| `varchar(255)` |                                  | Optional URL to the reviewer's profile picture.              |
| `rating`            | `integer`      | `NOT NULL`                       | A star rating from 1 to 5.                                   |
| `comment`           | `text`         | `NOT NULL`                       | The text content of the review.                              |
| `image_url`         | `varchar(255)` |                                  | Optional URL to an image provided with the review.           |
| `video_url`         | `varchar(255)` |                                  | Optional URL to a video provided with the review.            |
| `created_at`        | `timestamp`    | `NOT NULL`, `DEFAULT now()`      | The timestamp when the review was submitted.                 |

#### 4.2.2 Foreign Key Constraints

```sql
-- Foreign key constraint with cascade delete
ALTER TABLE reviews 
ADD CONSTRAINT fk_reviews_product_id 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE;
```

## 5. Database Connection Setup

### 5.1 Drizzle Configuration

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
  verbose: true,
  strict: true,
} satisfies Config;
```

### 5.2 Database Connection

**File**: `src/lib/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Create database connection with schema
export const db = drizzle(sql, { schema });

// Export schema for use in migrations and queries
export { schema };
```

### 5.3 Type Definitions

**File**: `src/lib/db/types.ts`

```typescript
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { products, reviews } from './schema';

// Infer types from schema
export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;
export type Review = InferSelectModel<typeof reviews>;
export type NewReview = InferInsertModel<typeof reviews>;

// Extended types for API responses
export interface ProductWithReviews extends Product {
  reviews?: Review[];
}

export interface ReviewWithProduct extends Review {
  product?: Product;
}
```

## 6. Migration Strategy

### 6.1 Initial Migration

**File**: `drizzle/0000_initial.sql`

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS "products" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "description" text NOT NULL,
  "details" text NOT NULL,
  "price" decimal(10,2) NOT NULL,
  "images" text[] NOT NULL DEFAULT '{}',
  "ingredients" text[] NOT NULL DEFAULT '{}',
  "stock_quantity" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS "reviews" (
  "id" serial PRIMARY KEY,
  "product_id" integer NOT NULL,
  "reviewer_name" varchar(255) NOT NULL,
  "reviewer_image_url" varchar(255),
  "rating" integer NOT NULL,
  "comment" text NOT NULL,
  "image_url" varchar(255),
  "video_url" varchar(255),
  "created_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_products_slug" ON "products"("slug");
CREATE INDEX IF NOT EXISTS "idx_products_stock" ON "products"("stock_quantity");
CREATE INDEX IF NOT EXISTS "idx_products_created" ON "products"("created_at");
CREATE INDEX IF NOT EXISTS "idx_reviews_product_id" ON "reviews"("product_id");
```

### 6.2 Migration Commands

```bash
# Generate migration files
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate

# View database in Drizzle Studio
npx drizzle-kit studio
```

## 7. Data Validation and Constraints

### 7.1 Application-Level Validation

**File**: `src/lib/db/validation.ts`

```typescript
import { z } from 'zod';

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  details: z.string().min(1, 'Details are required'),
  price: z.number().positive('Price must be positive').max(999999.99, 'Price too high'),
  stock_quantity: z.number().int().min(0, 'Stock quantity cannot be negative'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  images: z.array(z.string().url('Invalid image URL')).optional(),
});

// Review validation schema
export const reviewSchema = z.object({
  product_id: z.number().int().positive('Invalid product ID'),
  reviewer_name: z.string().min(1, 'Reviewer name is required').max(255, 'Name too long'),
  reviewer_image_url: z.string().url('Invalid image URL').optional(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(1, 'Comment is required'),
  image_url: z.string().url('Invalid image URL').optional(),
  video_url: z.string().url('Invalid video URL').optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
```

### 7.2 Database-Level Constraints

```sql
-- Add check constraints for data integrity
ALTER TABLE products 
ADD CONSTRAINT check_price_positive 
CHECK (price > 0);

ALTER TABLE products 
ADD CONSTRAINT check_stock_non_negative 
CHECK (stock_quantity >= 0);

ALTER TABLE reviews 
ADD CONSTRAINT check_rating_range 
CHECK (rating >= 1 AND rating <= 5);

-- Add trigger for slug uniqueness validation
CREATE OR REPLACE FUNCTION validate_slug_format()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug !~ '^[a-z0-9-]+$' THEN
    RAISE EXCEPTION 'Slug must contain only lowercase letters, numbers, and hyphens';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_slug
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION validate_slug_format();
```

## 8. Query Optimization

### 8.1 Common Query Patterns

**File**: `src/lib/db/queries.ts`

```typescript
import { db } from './index';
import { products, reviews } from './schema';
import { eq, desc, asc, and, or, like, gte, lte } from 'drizzle-orm';

// Get all products with optional filtering
export async function getProducts(options?: {
  category?: string;
  sort?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  inStock?: boolean;
  limit?: number;
  offset?: number;
}) {
  let query = db.select().from(products);
  
  // Apply stock filter
  if (options?.inStock) {
    query = query.where(gte(products.stock_quantity, 1));
  }
  
  // Apply sorting
  if (options?.sort) {
    switch (options.sort) {
      case 'price-asc':
        query = query.orderBy(asc(products.price));
        break;
      case 'price-desc':
        query = query.orderBy(desc(products.price));
        break;
      case 'name-asc':
        query = query.orderBy(asc(products.name));
        break;
      case 'name-desc':
        query = query.orderBy(desc(products.name));
        break;
    }
  }
  
  // Apply pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.offset(options.offset);
  }
  
  return query;
}

// Get product by slug with reviews
export async function getProductBySlug(slug: string) {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
    
  if (!product.length) {
    return null;
  }
  
  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.product_id, product[0].id))
    .orderBy(desc(reviews.created_at));
    
  return {
    ...product[0],
    reviews: productReviews,
  };
}

// Search products
export async function searchProducts(searchTerm: string) {
  const searchPattern = `%${searchTerm}%`;
  
  return db
    .select()
    .from(products)
    .where(
      or(
        like(products.name, searchPattern),
        like(products.description, searchPattern),
        like(products.details, searchPattern)
      )
    );
}

// Get low stock products (for admin alerts)
export async function getLowStockProducts(threshold: number = 10) {
  return db
    .select()
    .from(products)
    .where(
      and(
        lte(products.stock_quantity, threshold),
        gte(products.stock_quantity, 1)
      )
    );
}

// Get out of stock products
export async function getOutOfStockProducts() {
  return db
    .select()
    .from(products)
    .where(eq(products.stock_quantity, 0));
}
```

### 8.2 Performance Monitoring

```typescript
// Query performance monitoring
export async function getProductsWithPerformance() {
  const startTime = Date.now();
  
  try {
    const result = await getProducts();
    const endTime = Date.now();
    
    console.log(`Query executed in ${endTime - startTime}ms`);
    return result;
  } catch (error) {
    console.error('Query failed:', error);
    throw error;
  }
}
```

## 9. Backup and Recovery

### 9.1 Backup Strategy

```bash
# Create database backup
pg_dump $POSTGRES_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql $POSTGRES_URL < backup_file.sql
```

### 9.2 Data Export/Import

**File**: `scripts/export-data.ts`

```typescript
import { db } from '../src/lib/db';
import { products, reviews } from '../src/lib/db/schema';
import fs from 'fs';

async function exportData() {
  try {
    const allProducts = await db.select().from(products);
    const allReviews = await db.select().from(reviews);
    
    const exportData = {
      products: allProducts,
      reviews: allReviews,
      exported_at: new Date().toISOString(),
    };
    
    fs.writeFileSync(
      `data-export-${Date.now()}.json`,
      JSON.stringify(exportData, null, 2)
    );
    
    console.log('Data exported successfully');
  } catch (error) {
    console.error('Export failed:', error);
  }
}

exportData();
```

## 10. Testing Strategy

### 10.1 Unit Tests

**File**: `src/lib/db/__tests__/schema.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../index';
import { products, reviews } from '../schema';

describe('Database Schema', () => {
  beforeAll(async () => {
    // Setup test database
  });
  
  afterAll(async () => {
    // Cleanup test database
  });
  
  it('should create products table', async () => {
    const result = await db.select().from(products).limit(1);
    expect(result).toBeDefined();
  });
  
  it('should enforce unique slugs', async () => {
    // Test unique constraint
  });
  
  it('should enforce foreign key constraints', async () => {
    // Test foreign key relationships
  });
});
```

### 10.2 Integration Tests

**File**: `src/lib/db/__tests__/queries.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { getProducts, getProductBySlug, searchProducts } from '../queries';

describe('Database Queries', () => {
  it('should fetch all products', async () => {
    const products = await getProducts();
    expect(Array.isArray(products)).toBe(true);
  });
  
  it('should fetch product by slug with reviews', async () => {
    const product = await getProductBySlug('eggypro-original');
    expect(product).toHaveProperty('reviews');
  });
  
  it('should search products by term', async () => {
    const results = await searchProducts('protein');
    expect(results.length).toBeGreaterThan(0);
  });
});
```

## 11. Security Considerations

### 11.1 SQL Injection Prevention

- Use parameterized queries with Drizzle ORM
- Validate all input data before database operations
- Implement proper error handling

### 11.2 Data Access Control

```typescript
// Role-based access control
export async function getProductsForUser(userRole: 'admin' | 'customer') {
  if (userRole === 'admin') {
    return db.select().from(products);
  } else {
    // Customers can only see in-stock products
    return db
      .select()
      .from(products)
      .where(gte(products.stock_quantity, 1));
  }
}
```

## 12. Monitoring and Maintenance

### 12.1 Database Health Checks

```typescript
export async function checkDatabaseHealth() {
  try {
    // Test basic connectivity
    await db.select().from(products).limit(1);
    
    // Check table sizes
    const productCount = await db.select({ count: sql`count(*)` }).from(products);
    const reviewCount = await db.select({ count: sql`count(*)` }).from(reviews);
    
    return {
      status: 'healthy',
      productCount: productCount[0].count,
      reviewCount: reviewCount[0].count,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
    };
  }
}
```

### 12.2 Regular Maintenance Tasks

```bash
# Analyze table statistics
ANALYZE products;
ANALYZE reviews;

# Vacuum tables to reclaim space
VACUUM products;
VACUUM reviews;

# Check for unused indexes
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public';
```

This comprehensive database schema specification provides all the necessary details for implementing a robust, scalable, and maintainable database system for the EggyPro live products functionality.

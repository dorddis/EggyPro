# API Endpoints Specification for Live Product Implementation

## 1. Introduction

This document specifies the comprehensive RESTful API endpoints for managing products in the EggyPro application. These endpoints, implemented as Next.js Route Handlers, provide the complete interface for frontend-backend communication, including product management, inventory tracking, image uploads, and administrative operations.

## 2. API Architecture & Design Principles

### 2.1 Technology Stack
- **Framework**: Next.js 15.2.3 with App Router
- **Database**: Vercel Postgres with Drizzle ORM
- **Authentication**: Bearer token-based admin authentication
- **File Upload**: Cloudinary for image management
- **Validation**: Zod schema validation
- **Error Handling**: Structured error responses

### 2.2 API Design Principles
- **RESTful Design**: Follow REST conventions for resource management
- **Type Safety**: Full TypeScript support with generated types
- **Security**: Input validation, authentication, and authorization
- **Performance**: Optimized queries with proper indexing
- **Error Handling**: Consistent error response format
- **Documentation**: OpenAPI/Swagger compatible responses

### 2.3 Project Structure
```
src/app/api/
├── products/
│   ├── route.ts              # GET /api/products, POST /api/products
│   └── [slug]/
│       └── route.ts          # GET, PUT, DELETE /api/products/[slug]
├── auth/
│   └── admin/
│       └── route.ts          # Admin authentication endpoints
└── health/
    └── route.ts              # API health check endpoint
```

## 3. Authentication & Security

### 3.1 Admin Authentication

**File**: `src/lib/auth.ts`

```typescript
import { NextRequest } from 'next/server';

export interface AdminUser {
  id: string;
  role: 'admin';
  permissions: string[];
}

export function verifyAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.ADMIN_SECRET_KEY;
  
  if (!authHeader || !expectedToken) {
    return false;
  }
  
  const token = authHeader.replace('Bearer ', '');
  return token === expectedToken;
}

export function getAdminUser(request: NextRequest): AdminUser | null {
  if (!verifyAdminAuth(request)) {
    return null;
  }
  
  return {
    id: 'admin',
    role: 'admin',
    permissions: ['products:read', 'products:write', 'products:delete'],
  };
}

export function requireAdminAuth(request: NextRequest): AdminUser {
  const user = getAdminUser(request);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}
```

### 3.2 Rate Limiting

**File**: `src/lib/rate-limit.ts`

```typescript
import { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  request: NextRequest,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  
  const current = rateLimitMap.get(ip);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= limit) {
    return false;
  }
  
  current.count++;
  return true;
}
```

## 4. Data Validation & Types

### 4.1 Request/Response Types

**File**: `src/lib/api-types.ts`

```typescript
import { z } from 'zod';

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  details: z.string().min(1, 'Details are required'),
  price: z.number().positive('Price must be positive').max(999999.99, 'Price too high'),
  stock_quantity: z.number().int().min(0, 'Stock quantity cannot be negative'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  category: z.string().optional(),
  sort: z.enum(['price-asc', 'price-desc', 'name-asc', 'name-desc', 'created-desc']).optional(),
  inStock: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
  search: z.string().optional(),
});

// Review schemas
export const createReviewSchema = z.object({
  product_id: z.number().int().positive('Invalid product ID'),
  reviewer_name: z.string().min(1, 'Reviewer name is required').max(255, 'Name too long'),
  reviewer_image_url: z.string().url('Invalid image URL').optional(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(1, 'Comment is required'),
  image_url: z.string().url('Invalid image URL').optional(),
  video_url: z.string().url('Invalid video URL').optional(),
});

// Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
```

## 5. Core API Endpoints

### 5.1 Get All Products

**Route**: `GET /api/products`

**File**: `src/app/api/products/route.ts`

    ```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq, desc, asc, and, or, like, gte, lte, sql } from 'drizzle-orm';
import { productQuerySchema } from '@/lib/api-types';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    if (!checkRateLimit(request)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      category: searchParams.get('category'),
      sort: searchParams.get('sort'),
      inStock: searchParams.get('inStock') === 'true',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
      search: searchParams.get('search'),
    };

    const validatedParams = productQuerySchema.parse(queryParams);

    // Build query
    let query = db.select().from(products);
    const conditions: any[] = [];

    // Apply search filter
    if (validatedParams.search) {
      const searchPattern = `%${validatedParams.search}%`;
      conditions.push(
        or(
          like(products.name, searchPattern),
          like(products.description, searchPattern),
          like(products.details, searchPattern)
        )
      );
    }

    // Apply stock filter
    if (validatedParams.inStock) {
      conditions.push(gte(products.stock_quantity, 1));
    }

    // Apply category filter (when categories are implemented)
    if (validatedParams.category) {
      // TODO: Implement category filtering
      // conditions.push(eq(products.category, validatedParams.category));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    if (validatedParams.sort) {
      switch (validatedParams.sort) {
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
        case 'created-desc':
          query = query.orderBy(desc(products.created_at));
          break;
        default:
          query = query.orderBy(asc(products.name));
      }
    } else {
      query = query.orderBy(asc(products.name));
    }

    // Get total count for pagination
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(products);
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    const totalResult = await countQuery;
    const total = totalResult[0].count;

    // Apply pagination
    const limit = validatedParams.limit || 20;
    const offset = validatedParams.offset || 0;
    
    query = query.limit(limit).offset(offset);

    // Execute query
    const allProducts = await query;

    // Prepare response
    const response: PaginatedResponse<any> = {
      success: true,
      data: allProducts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

### 5.2 Create Product

**Route**: `POST /api/products`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { createProductSchema } from '@/lib/api-types';
import { requireAdminAuth } from '@/lib/auth';
import { uploadImages } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminUser = requireAdminAuth(request);

    // Parse multipart form data
    const formData = await request.formData();
    
    // Extract text fields
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const details = formData.get('details') as string;
    const price = parseFloat(formData.get('price') as string);
    const stockQuantity = parseInt(formData.get('stock_quantity') as string);
    const ingredients = JSON.parse(formData.get('ingredients') as string);

    // Validate input data
    const validatedData = createProductSchema.parse({
      name,
      slug,
      description,
      details,
      price,
      stock_quantity: stockQuantity,
      ingredients,
    });

    // Check if product with slug already exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.slug, validatedData.slug))
      .limit(1);

    if (existingProduct.length > 0) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 409 }
      );
    }

    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[];
    const uploadedImages: string[] = [];

    if (imageFiles.length > 0) {
      try {
        uploadedImages = await uploadImages(imageFiles);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload images' },
          { status: 500 }
        );
      }
    }

    // Create product in database
    const newProduct = await db.insert(products).values({
      ...validatedData,
      images: uploadedImages,
    }).returning();

    const response: ApiResponse<any> = {
      success: true,
      data: newProduct[0],
      message: 'Product created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { error: 'Invalid product data', details: error.message },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

### 5.3 Get Single Product

**Route**: `GET /api/products/[slug]`

**File**: `src/app/api/products/[slug]/route.ts`

    ```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, reviews } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Rate limiting
    if (!checkRateLimit(request)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Validate slug parameter
    if (!params.slug || params.slug.length === 0) {
      return NextResponse.json(
        { error: 'Product slug is required' },
        { status: 400 }
      );
    }

    // Fetch product
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

    // Fetch reviews for this product
    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.product_id, product[0].id))
      .orderBy(desc(reviews.created_at));

    // Calculate average rating
    const averageRating = productReviews.length > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
      : 0;

    // Prepare response
    const productWithReviews = {
      ...product[0],
      reviews: productReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviewCount: productReviews.length,
    };

    const response: ApiResponse<any> = {
      success: true,
      data: productWithReviews,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
```

### 5.4 Update Product

**Route**: `PUT /api/products/[slug]`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { updateProductSchema } from '@/lib/api-types';
import { requireAdminAuth } from '@/lib/auth';
import { uploadImages } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Verify admin authentication
    const adminUser = requireAdminAuth(request);

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.slug, params.slug))
      .limit(1);

    if (!existingProduct.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    
    // Extract and validate fields
    const updates: any = {};
    
    ['name', 'description', 'details', 'price', 'stock_quantity', 'ingredients'].forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        if (field === 'price') {
          updates[field] = parseFloat(value as string);
        } else if (field === 'stock_quantity') {
          updates[field] = parseInt(value as string);
        } else if (field === 'ingredients') {
          updates[field] = JSON.parse(value as string);
        } else {
          updates[field] = value;
        }
      }
    });

    // Validate updates
    const validatedUpdates = updateProductSchema.parse(updates);

    // Handle image uploads if provided
    const imageFiles = formData.getAll('images') as File[];
    if (imageFiles.length > 0) {
      try {
        const uploadedImages = await uploadImages(imageFiles);
        validatedUpdates.images = uploadedImages;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload images' },
          { status: 500 }
        );
      }
    }

    // Update product
    const updatedProduct = await db
      .update(products)
      .set({
        ...validatedUpdates,
        updated_at: new Date(),
      })
      .where(eq(products.slug, params.slug))
      .returning();

    const response: ApiResponse<any> = {
      success: true,
      data: updatedProduct[0],
      message: 'Product updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to update product:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { error: 'Invalid product data', details: error.message },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
```

### 5.5 Delete Product

**Route**: `DELETE /api/products/[slug]`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, reviews } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminAuth } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Verify admin authentication
    const adminUser = requireAdminAuth(request);

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.slug, params.slug))
      .limit(1);

    if (!existingProduct.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete reviews first (due to foreign key constraint)
    await db.delete(reviews).where(eq(reviews.product_id, existingProduct[0].id));

    // Delete product
    await db.delete(products).where(eq(products.slug, params.slug));

    const response: ApiResponse<null> = {
      success: true,
      message: 'Product deleted successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Failed to delete product:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
```

## 6. Additional API Endpoints

### 6.1 Health Check Endpoint

**Route**: `GET /api/health`

**File**: `src/app/api/health/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const productCount = await db.select({ count: sql<number>`count(*)` }).from(products);
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        productCount: productCount[0].count,
      },
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    return NextResponse.json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
```

### 6.2 Search Products Endpoint

**Route**: `GET /api/products/search`

**File**: `src/app/api/products/search/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { or, like, gte, and } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    if (!checkRateLimit(request)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const inStock = searchParams.get('inStock') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const searchPattern = `%${query.trim()}%`;
    const conditions: any[] = [
      or(
        like(products.name, searchPattern),
        like(products.description, searchPattern),
        like(products.details, searchPattern)
      ),
    ];

    if (inStock) {
      conditions.push(gte(products.stock_quantity, 1));
    }

    const searchResults = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .limit(limit);

    const response: ApiResponse<any[]> = {
      success: true,
      data: searchResults,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
```

## 7. Error Handling & Response Format

### 7.1 Standard Error Response

```typescript
interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
  code?: string;
  timestamp: string;
}

// Example error responses
{
  "success": false,
  "error": "Product not found",
  "code": "PRODUCT_NOT_FOUND",
  "timestamp": "2024-01-15T10:30:00.000Z"
}

{
  "success": false,
  "error": "Validation failed",
  "details": "Price must be positive",
  "code": "VALIDATION_ERROR",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 7.2 HTTP Status Codes

| Status Code | Description | Usage |
|-------------|-------------|-------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid authentication |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

## 8. Testing Strategy

### 8.1 Unit Tests

**File**: `src/app/api/products/__tests__/route.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { GET, POST } from '../route';
import { db } from '@/lib/db';

describe('Products API', () => {
  beforeAll(async () => {
    // Setup test database
  });

  afterAll(async () => {
    // Cleanup test database
  });

  it('should fetch all products', async () => {
    const request = new Request('http://localhost:3000/api/products');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should create product with valid data', async () => {
    const formData = new FormData();
    formData.append('name', 'Test Product');
    formData.append('slug', 'test-product');
    formData.append('description', 'Test description');
    formData.append('details', 'Test details');
    formData.append('price', '29.99');
    formData.append('stock_quantity', '100');
    formData.append('ingredients', JSON.stringify(['Test Ingredient']));

    const request = new Request('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ADMIN_SECRET_KEY}`,
      },
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.name).toBe('Test Product');
  });

  it('should reject unauthorized requests', async () => {
    const formData = new FormData();
    formData.append('name', 'Test Product');
    // ... other fields

    const request = new Request('http://localhost:3000/api/products', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Authentication required');
  });
});
```

### 8.2 Integration Tests

**File**: `src/app/api/products/__tests__/integration.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { GET, POST } from '../route';

describe('Products API Integration', () => {
  it('should handle complete CRUD operations', async () => {
    // Test full lifecycle: Create -> Read -> Update -> Delete
  });

  it('should handle concurrent requests', async () => {
    // Test race conditions and concurrency
  });

  it('should handle large datasets', async () => {
    // Test performance with many products
  });
});
```

## 9. Performance Optimization

### 9.1 Query Optimization

```typescript
// Optimized product query with caching
export async function getProductsOptimized(options: ProductQueryOptions) {
  const cacheKey = `products:${JSON.stringify(options)}`;
  
  // Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Execute optimized query
  const result = await getProducts(options);
  
  // Cache result for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(result));
  
  return result;
}
```

### 9.2 Response Compression

```typescript
// Enable gzip compression for large responses
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const response = NextResponse.json(data);
  response.headers.set('Content-Encoding', 'gzip');
  return response;
}
```

## 10. Monitoring & Analytics

### 10.1 API Metrics

```typescript
// Track API usage
export async function trackApiUsage(endpoint: string, method: string, duration: number) {
  await db.insert(apiMetrics).values({
    endpoint,
    method,
    duration,
    timestamp: new Date(),
    user_agent: request.headers.get('user-agent'),
    ip_address: request.ip,
  });
}
```

### 10.2 Error Tracking

```typescript
// Log errors for monitoring
export function logApiError(error: Error, context: any) {
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
  
  // Send to error tracking service
  // Sentry.captureException(error, { extra: context });
}
```

This comprehensive API endpoints specification provides all the necessary details for implementing a robust, scalable, and maintainable API system for the EggyPro live products functionality.

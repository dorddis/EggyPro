# Backend Architecture Specification for Live Product Implementation

## 1. Introduction

This document outlines the comprehensive technical architecture, environment setup, and data access patterns for the EggyPro backend. It details the chosen technologies, project structure, deployment strategies, monitoring solutions, and critical environment variables required for the application to function with a live database and image management system.

## 2. Technology Stack & Architecture Overview

### 2.1 Core Technologies

#### 2.1.1 Database Layer
- **Database**: Vercel Postgres (PostgreSQL compatible)
  - **Rationale**: Seamless integration with Vercel deployments
  - **Benefits**: Automatic scaling, backup management, connection pooling
  - **Features**: Full PostgreSQL compatibility, managed service
  - **Limits**: 256MB storage (free tier), 10GB (pro tier)

#### 2.1.2 ORM Layer
- **ORM**: Drizzle ORM
  - **Rationale**: Type-safe database operations with excellent TypeScript support
  - **Benefits**: Lightweight, performant, built-in migration support
  - **Features**: Query builder, schema introspection, type generation
  - **Alternatives Considered**: Prisma (heavier), TypeORM (less type-safe)

#### 2.1.3 Image Management
- **Service**: Cloudinary
  - **Rationale**: Cloud-based image optimization and delivery
  - **Benefits**: Automatic optimization, CDN delivery, transformation APIs
  - **Features**: Upload, resize, format conversion, responsive images
  - **Limits**: 25GB storage, 25GB bandwidth (free tier)

#### 2.1.4 Deployment Platform
- **Platform**: Vercel
  - **Rationale**: Optimized for Next.js applications
  - **Benefits**: Serverless functions, edge caching, automatic deployments
  - **Features**: Git integration, preview deployments, analytics
  - **Limits**: 100GB bandwidth, 1000 serverless function executions (free tier)

### 2.2 Architecture Patterns

#### 2.2.1 Layered Architecture
```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│        (Next.js App Router)        │
├─────────────────────────────────────┤
│            API Layer               │
│      (Route Handlers + Auth)       │
├─────────────────────────────────────┤
│          Business Logic            │
│      (Services + Validation)       │
├─────────────────────────────────────┤
│         Data Access Layer          │
│      (Drizzle ORM + Queries)      │
├─────────────────────────────────────┤
│           Database Layer           │
│        (Vercel Postgres)          │
└─────────────────────────────────────┘
```

#### 2.2.2 Service-Oriented Components
- **API Routes**: RESTful endpoints for product management
- **Authentication Service**: Admin token validation
- **Image Service**: Cloudinary integration for uploads
- **Validation Service**: Zod schema validation
- **Database Service**: Drizzle ORM wrapper
- **Cache Service**: Redis for performance optimization

## 3. Project Structure & Organization

### 3.1 Directory Structure

```
src/
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.ts              # GET, POST /api/products
│   │   │   ├── [slug]/
│   │   │   │   └── route.ts          # GET, PUT, DELETE /api/products/[slug]
│   │   │   └── search/
│   │   │       └── route.ts          # GET /api/products/search
│   │   ├── auth/
│   │   │   └── admin/
│   │   │       └── route.ts          # Admin authentication
│   │   └── health/
│   │       └── route.ts              # Health check endpoint
│   └── globals.css
├── lib/
│   ├── db/
│   │   ├── schema.ts                 # Database table definitions
│   │   ├── index.ts                  # Database connection
│   │   ├── migrations/               # Generated migration files
│   │   ├── queries.ts                # Common query functions
│   │   ├── validation.ts             # Database validation schemas
│   │   └── types.ts                  # Database-specific types
│   ├── auth.ts                       # Authentication utilities
│   ├── cloudinary.ts                 # Cloudinary integration
│   ├── rate-limit.ts                 # Rate limiting utilities
│   ├── api-types.ts                  # API request/response types
│   ├── cache.ts                      # Redis cache utilities
│   └── utils.ts                      # General utilities
├── services/
│   ├── product-service.ts            # Product business logic
│   ├── image-service.ts              # Image upload/management
│   ├── validation-service.ts         # Data validation
│   └── cache-service.ts              # Caching logic
├── middleware/
│   ├── auth.ts                       # Authentication middleware
│   ├── rate-limit.ts                 # Rate limiting middleware
│   └── cors.ts                       # CORS configuration
└── types/
    ├── api.ts                        # API type definitions
    ├── database.ts                   # Database type definitions
    └── common.ts                     # Shared type definitions
```

### 3.2 Configuration Files

```
├── drizzle.config.ts                 # Drizzle ORM configuration
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
├── .env.local                        # Local environment variables
├── .env.example                      # Environment variables template
└── .gitignore                        # Git ignore rules
```

## 4. Database Architecture

### 4.1 Database Connection Setup

**File**: `src/lib/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Create database connection with schema
export const db = drizzle(sql, { schema });

// Export schema for use in migrations and queries
export { schema };

// Database connection pool configuration
export const dbConfig = {
  maxConnections: 20,
  idleTimeout: 30000,
  connectionTimeout: 10000,
};

// Health check function
export async function checkDatabaseHealth() {
  try {
    const result = await sql`SELECT 1 as health_check`;
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      connection: 'active',
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

### 4.2 Database Schema Definition

**File**: `src/lib/db/schema.ts`

```typescript
import { 
  pgTable, 
  serial, 
  varchar, 
  text, 
  decimal, 
  integer, 
  timestamp, 
  boolean,
  index,
  uniqueIndex,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description').notNull(),
  details: text('details').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  images: text('images').array().notNull().default([]),
  ingredients: text('ingredients').array().notNull().default([]),
  stock_quantity: integer('stock_quantity').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex('products_slug_idx').on(table.slug),
  nameIdx: index('products_name_idx').on(table.name),
  priceIdx: index('products_price_idx').on(table.price),
  stockIdx: index('products_stock_idx').on(table.stock_quantity),
  activeIdx: index('products_active_idx').on(table.is_active),
}));

// Reviews table
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull(),
  reviewer_name: varchar('reviewer_name', { length: 255 }).notNull(),
  reviewer_image_url: varchar('reviewer_image_url', { length: 255 }),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  image_url: varchar('image_url', { length: 255 }),
  video_url: varchar('video_url', { length: 255 }),
  is_verified: boolean('is_verified').notNull().default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  productIdx: index('reviews_product_id_idx').on(table.product_id),
  ratingIdx: index('reviews_rating_idx').on(table.rating),
  verifiedIdx: index('reviews_verified_idx').on(table.is_verified),
}));

// Categories table (for future expansion)
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  description: text('description'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex('categories_slug_idx').on(table.slug),
}));

// Product categories junction table
export const productCategories = pgTable('product_categories', {
  product_id: integer('product_id').notNull(),
  category_id: integer('category_id').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.product_id, table.category_id] }),
}));

// API metrics table (for monitoring)
export const apiMetrics = pgTable('api_metrics', {
  id: serial('id').primaryKey(),
  endpoint: varchar('endpoint', { length: 255 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  status_code: integer('status_code').notNull(),
  response_time: integer('response_time').notNull(), // in milliseconds
  user_agent: text('user_agent'),
  ip_address: varchar('ip_address', { length: 45 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  endpointIdx: index('api_metrics_endpoint_idx').on(table.endpoint),
  timestampIdx: index('api_metrics_timestamp_idx').on(table.created_at),
}));

// Define relationships
export const productsRelations = relations(products, ({ many }) => ({
  reviews: many(reviews),
  categories: many(productCategories),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.product_id],
    references: [products.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(productCategories),
}));
```

### 4.3 Database Migrations

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
  // Migration options
  migrations: {
    table: 'drizzle_migrations',
    schema: 'public',
  },
  // Introspection options
  introspect: {
    casing: 'camel',
  },
} satisfies Config;
```

**Migration Commands**:
```bash
# Generate migration files
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate

# View database in Drizzle Studio
npx drizzle-kit studio

# Introspect existing database
npx drizzle-kit introspect
```

## 5. Authentication & Security

### 5.1 Admin Authentication System

**File**: `src/lib/auth.ts`

```typescript
import { NextRequest } from 'next/server';
import { db } from './db';
import { apiMetrics } from './db/schema';
import { eq, and, gte } from 'drizzle-orm';

export interface AdminUser {
  id: string;
  role: 'admin';
  permissions: string[];
  lastLogin?: Date;
}

export interface AuthResult {
  user: AdminUser | null;
  isValid: boolean;
  error?: string;
}

// Rate limiting for authentication attempts
const authAttempts = new Map<string, { count: number; resetTime: number }>();

export function verifyAdminAuth(request: NextRequest): AuthResult {
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.ADMIN_SECRET_KEY;
  const clientIP = request.ip || 'unknown';
  
  // Check rate limiting for auth attempts
  const now = Date.now();
  const current = authAttempts.get(clientIP);
  
  if (current && now < current.resetTime && current.count >= 5) {
    return {
      user: null,
      isValid: false,
      error: 'Too many authentication attempts',
    };
  }
  
  if (!authHeader || !expectedToken) {
    recordAuthAttempt(clientIP);
    return {
      user: null,
      isValid: false,
      error: 'Missing authentication header',
    };
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  if (token !== expectedToken) {
    recordAuthAttempt(clientIP);
    return {
      user: null,
      isValid: false,
      error: 'Invalid authentication token',
    };
  }
  
  // Reset auth attempts on successful authentication
  authAttempts.delete(clientIP);
  
  return {
    user: {
      id: 'admin',
      role: 'admin',
      permissions: ['products:read', 'products:write', 'products:delete', 'reviews:moderate'],
    },
    isValid: true,
  };
}

function recordAuthAttempt(clientIP: string) {
  const now = Date.now();
  const resetTime = now + 15 * 60 * 1000; // 15 minutes
  
  const current = authAttempts.get(clientIP);
  if (current && now < current.resetTime) {
    current.count++;
  } else {
    authAttempts.set(clientIP, { count: 1, resetTime });
  }
}

export function requireAdminAuth(request: NextRequest): AdminUser {
  const result = verifyAdminAuth(request);
  if (!result.isValid) {
    throw new Error(result.error || 'Authentication required');
  }
  return result.user!;
}

// Track API usage for monitoring
export async function trackApiUsage(
  request: NextRequest,
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number
) {
  try {
    await db.insert(apiMetrics).values({
      endpoint,
      method,
      status_code: statusCode,
      response_time: responseTime,
      user_agent: request.headers.get('user-agent') || null,
      ip_address: request.ip || null,
    });
  } catch (error) {
    console.error('Failed to track API usage:', error);
  }
}
```

### 5.2 Rate Limiting Implementation

**File**: `src/lib/rate-limit.ts`

```typescript
import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked?: boolean;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function createRateLimiter(config: RateLimitConfig) {
  return function checkRateLimit(request: NextRequest): boolean {
    const key = getRateLimitKey(request);
    const now = Date.now();
    
    const entry = rateLimitStore.get(key);
    
    // Check if rate limit window has expired
    if (!entry || now > entry.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return true;
    }
    
    // Check if blocked
    if (entry.blocked) {
      return false;
    }
    
    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      entry.blocked = true;
      return false;
    }
    
    // Increment count
    entry.count++;
    return true;
  };
}

function getRateLimitKey(request: NextRequest): string {
  const ip = request.ip || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  return `${ip}:${userAgent}`;
}

// Default rate limiters
export const standardRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
});

export const strictRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
});

export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});
```

## 6. Image Management with Cloudinary

### 6.1 Cloudinary Configuration

**File**: `src/lib/cloudinary.ts`

```typescript
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}

// Upload image to Cloudinary
export async function uploadImage(
  file: File,
  options: {
    folder?: string;
    publicId?: string;
    transformation?: ImageTransformOptions;
  } = {}
): Promise<UploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uploadOptions: any = {
    resource_type: 'image',
    folder: options.folder || 'eggypro-products',
    transformation: options.transformation ? [options.transformation] : [],
  };
  
  if (options.publicId) {
    uploadOptions.public_id = options.publicId;
  }
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(new Error(`Upload failed: ${error.message}`));
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
          });
        } else {
          reject(new Error('Upload failed: No result returned'));
        }
      }
    );
    
    uploadStream.end(buffer);
  });
}

// Upload multiple images
export async function uploadImages(
  files: File[],
  options: {
    folder?: string;
    transformation?: ImageTransformOptions;
  } = {}
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file, index) => {
    const publicId = options.folder 
      ? `${options.folder}/${Date.now()}-${index}`
      : undefined;
      
    return uploadImage(file, {
      ...options,
      publicId,
    });
  });
  
  return Promise.all(uploadPromises);
}

// Delete image from Cloudinary
export async function deleteImage(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(new Error(`Delete failed: ${error.message}`));
      } else {
        resolve();
      }
    });
  });
}

// Generate optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options: ImageTransformOptions = {}
): string {
  const transformation = {
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  };
  
  return cloudinary.url(publicId, {
    transformation: [transformation],
    secure: true,
  });
}

// Generate responsive image URLs
export function getResponsiveImageUrls(
  publicId: string,
  sizes: number[] = [400, 800, 1200]
): Record<string, string> {
  const urls: Record<string, string> = {};
  
  sizes.forEach(size => {
    urls[`${size}w`] = getOptimizedImageUrl(publicId, {
      width: size,
      crop: 'fill',
    });
  });
  
  return urls;
}
```

### 6.2 Image Service Layer

**File**: `src/services/image-service.ts`

```typescript
import { uploadImage, uploadImages, deleteImage, getOptimizedImageUrl } from '@/lib/cloudinary';

export interface ImageUploadResult {
  original: string;
  optimized: string;
  thumbnail: string;
  responsive: Record<string, string>;
}

export class ImageService {
  private static instance: ImageService;
  
  private constructor() {}
  
  static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }
  
  async uploadProductImage(file: File): Promise<ImageUploadResult> {
    // Upload original image
    const original = await uploadImage(file, {
      folder: 'eggypro-products',
    });
    
    // Generate optimized versions
    const optimized = getOptimizedImageUrl(original.publicId, {
      width: 800,
      quality: 80,
    });
    
    const thumbnail = getOptimizedImageUrl(original.publicId, {
      width: 400,
      height: 400,
      crop: 'fill',
    });
    
    const responsive = {
      '400w': getOptimizedImageUrl(original.publicId, { width: 400 }),
      '800w': getOptimizedImageUrl(original.publicId, { width: 800 }),
      '1200w': getOptimizedImageUrl(original.publicId, { width: 1200 }),
    };
    
    return {
      original: original.url,
      optimized,
      thumbnail,
      responsive,
    };
  }
  
  async uploadMultipleImages(files: File[]): Promise<ImageUploadResult[]> {
    const uploadPromises = files.map(file => this.uploadProductImage(file));
    return Promise.all(uploadPromises);
  }
  
  async deleteProductImages(publicIds: string[]): Promise<void> {
    const deletePromises = publicIds.map(publicId => deleteImage(publicId));
    await Promise.all(deletePromises);
  }
  
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size exceeds 10MB limit' };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' };
    }
    
    return { isValid: true };
  }
}
```

## 7. Environment Configuration

### 7.1 Environment Variables

**File**: `.env.local`

```env
# Database Configuration
POSTGRES_URL="postgres://user:password@host:port/database?sslmode=require"

# Admin Authentication
ADMIN_SECRET_KEY="your_strong_admin_secret_key_here_minimum_32_characters"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Application Configuration
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# Monitoring
ENABLE_API_METRICS="true"
ENABLE_ERROR_TRACKING="true"

# Cache Configuration (if using Redis)
REDIS_URL="redis://localhost:6379"
CACHE_TTL="300"

# Security
CORS_ORIGIN="http://localhost:3000"
JWT_SECRET="your_jwt_secret_for_future_use"
```

### 7.2 Environment Validation

**File**: `src/lib/env.ts`

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Database
  POSTGRES_URL: z.string().url('Invalid POSTGRES_URL'),
  
  // Authentication
  ADMIN_SECRET_KEY: z.string().min(32, 'ADMIN_SECRET_KEY must be at least 32 characters'),
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
  
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid NEXT_PUBLIC_APP_URL'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(val => parseInt(val, 10)),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(val => parseInt(val, 10)),
  
  // Monitoring
  ENABLE_API_METRICS: z.string().transform(val => val === 'true'),
  ENABLE_ERROR_TRACKING: z.string().transform(val => val === 'true'),
  
  // Optional
  REDIS_URL: z.string().url().optional(),
  CACHE_TTL: z.string().transform(val => parseInt(val, 10)).optional(),
  CORS_ORIGIN: z.string().optional(),
  JWT_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export function validateEnvironment(): void {
  try {
    envSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    process.exit(1);
  }
}
```

## 8. Deployment Strategy

### 8.1 Vercel Deployment Configuration

**File**: `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "env": {
    "POSTGRES_URL": "@postgres_url",
    "ADMIN_SECRET_KEY": "@admin_secret_key",
    "CLOUDINARY_CLOUD_NAME": "@cloudinary_cloud_name",
    "CLOUDINARY_API_KEY": "@cloudinary_api_key",
    "CLOUDINARY_API_SECRET": "@cloudinary_api_secret"
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### 8.2 Database Migration Strategy

**File**: `scripts/deploy.ts`

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function deploy() {
  try {
    console.log('🚀 Starting deployment...');
    
    // 1. Run database migrations
    console.log('📊 Running database migrations...');
    await execAsync('npx drizzle-kit migrate');
    
    // 2. Validate environment variables
    console.log('🔧 Validating environment...');
    const { validateEnvironment } = await import('../src/lib/env');
    validateEnvironment();
    
    // 3. Build application
    console.log('🏗️ Building application...');
    await execAsync('npm run build');
    
    // 4. Run tests
    console.log('🧪 Running tests...');
    await execAsync('npm test');
    
    console.log('✅ Deployment completed successfully!');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy();
```

### 8.3 Health Check Implementation

**File**: `src/app/api/health/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db';
import { checkCloudinaryHealth } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check database health
    const dbHealth = await checkDatabaseHealth();
    
    // Check Cloudinary health
    const cloudinaryHealth = await checkCloudinaryHealth();
    
    // Check environment variables
    const envHealth = {
      database: !!process.env.POSTGRES_URL,
      cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
      admin: !!process.env.ADMIN_SECRET_KEY,
    };
    
    const responseTime = Date.now() - startTime;
    
    const healthStatus = {
      status: dbHealth.status === 'healthy' && cloudinaryHealth.status === 'healthy' 
        ? 'healthy' 
        : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime,
      services: {
        database: dbHealth,
        cloudinary: cloudinaryHealth,
        environment: envHealth,
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
    };
    
    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
```

## 9. Monitoring & Observability

### 9.1 API Metrics Collection

**File**: `src/lib/metrics.ts`

```typescript
import { db } from './db';
import { apiMetrics } from './db/schema';

export interface MetricData {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  ipAddress?: string;
}

export class MetricsCollector {
  private static instance: MetricsCollector;
  
  private constructor() {}
  
  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }
  
  async recordMetric(data: MetricData): Promise<void> {
    try {
      await db.insert(apiMetrics).values({
        endpoint: data.endpoint,
        method: data.method,
        status_code: data.statusCode,
        response_time: data.responseTime,
        user_agent: data.userAgent,
        ip_address: data.ipAddress,
      });
    } catch (error) {
      console.error('Failed to record metric:', error);
    }
  }
  
  async getMetricsSummary(days: number = 7): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const metrics = await db
      .select({
        endpoint: apiMetrics.endpoint,
        method: apiMetrics.method,
        avgResponseTime: sql<number>`avg(response_time)`,
        totalRequests: sql<number>`count(*)`,
        errorCount: sql<number>`count(*) filter (where status_code >= 400)`,
      })
      .from(apiMetrics)
      .where(gte(apiMetrics.created_at, startDate))
      .groupBy(apiMetrics.endpoint, apiMetrics.method);
    
    return metrics;
  }
}
```

### 9.2 Error Tracking

**File**: `src/lib/error-tracking.ts`

```typescript
export interface ErrorContext {
  endpoint?: string;
  method?: string;
  userId?: string;
  requestId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export class ErrorTracker {
  private static instance: ErrorTracker;
  
  private constructor() {}
  
  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }
  
  trackError(error: Error, context: ErrorContext = {}): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      context,
    };
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', errorData);
    }
    
    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(errorData);
    }
  }
  
  private sendToErrorService(errorData: any): void {
    // Implementation for error tracking service (e.g., Sentry)
    // This would be implemented based on the chosen error tracking service
    console.error('Error tracking service not configured');
  }
}
```

## 10. Performance Optimization

### 10.1 Caching Strategy

**File**: `src/lib/cache.ts`

```typescript
import { Redis } from 'ioredis';

class CacheService {
  private redis: Redis | null = null;
  private memoryCache = new Map<string, { value: any; expiry: number }>();
  
  constructor() {
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL);
    }
  }
  
  async get<T>(key: string): Promise<T | null> {
    // Try Redis first
    if (this.redis) {
      try {
        const value = await this.redis.get(key);
        if (value) {
          return JSON.parse(value);
        }
      } catch (error) {
        console.error('Redis get error:', error);
      }
    }
    
    // Fallback to memory cache
    const cached = this.memoryCache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.value;
    }
    
    return null;
  }
  
  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    const serialized = JSON.stringify(value);
    
    // Set in Redis
    if (this.redis) {
      try {
        await this.redis.setex(key, ttl, serialized);
      } catch (error) {
        console.error('Redis set error:', error);
      }
    }
    
    // Set in memory cache
    this.memoryCache.set(key, {
      value,
      expiry: Date.now() + ttl * 1000,
    });
  }
  
  async delete(key: string): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.del(key);
      } catch (error) {
        console.error('Redis delete error:', error);
      }
    }
    
    this.memoryCache.delete(key);
  }
  
  async clear(): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.flushdb();
      } catch (error) {
        console.error('Redis clear error:', error);
      }
    }
    
    this.memoryCache.clear();
  }
}

export const cacheService = new CacheService();
```

### 10.2 Query Optimization

**File**: `src/lib/db/queries.ts`

```typescript
import { db } from './index';
import { products, reviews } from './schema';
import { eq, desc, asc, and, or, like, gte, lte, sql } from 'drizzle-orm';
import { cacheService } from '../cache';

export async function getProductsOptimized(options: {
  category?: string;
  sort?: string;
  inStock?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
} = {}) {
  const cacheKey = `products:${JSON.stringify(options)}`;
  
  // Try cache first
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Build query
  let query = db.select().from(products);
  const conditions: any[] = [];
  
  // Apply filters
  if (options.search) {
    const searchPattern = `%${options.search}%`;
    conditions.push(
      or(
        like(products.name, searchPattern),
        like(products.description, searchPattern)
      )
    );
  }
  
  if (options.inStock) {
    conditions.push(gte(products.stock_quantity, 1));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  // Apply sorting
  if (options.sort) {
    switch (options.sort) {
      case 'price-asc':
        query = query.orderBy(asc(products.price));
        break;
      case 'price-desc':
        query = query.orderBy(desc(products.price));
        break;
      default:
        query = query.orderBy(asc(products.name));
    }
  }
  
  // Apply pagination
  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.offset(options.offset);
  }
  
  const result = await query;
  
  // Cache result
  await cacheService.set(cacheKey, result, 300); // 5 minutes
  
  return result;
}
```

## 11. Security Considerations

### 11.1 Input Validation

```typescript
import { z } from 'zod';

export const productValidationSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(255, 'Name too long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Name contains invalid characters'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(255, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  price: z.number()
    .positive('Price must be positive')
    .max(999999.99, 'Price too high'),
  stock_quantity: z.number()
    .int('Stock quantity must be an integer')
    .min(0, 'Stock quantity cannot be negative'),
  ingredients: z.array(z.string())
    .min(1, 'At least one ingredient is required')
    .max(50, 'Too many ingredients'),
});
```

### 11.2 SQL Injection Prevention

```typescript
// Use parameterized queries with Drizzle ORM
export async function getProductBySlug(slug: string) {
  return db
    .select()
    .from(products)
    .where(eq(products.slug, slug)) // Parameterized query
    .limit(1);
}

// Avoid raw SQL when possible
// ❌ Bad: Raw SQL with string concatenation
// const query = `SELECT * FROM products WHERE slug = '${slug}'`;

// ✅ Good: Parameterized query
const query = db.select().from(products).where(eq(products.slug, slug));
```

### 11.3 CORS Configuration

**File**: `src/middleware/cors.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
  
  const response = NextResponse.next();
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}
```

This comprehensive backend architecture specification provides all the necessary details for implementing a robust, scalable, and maintainable backend system for the EggyPro live products functionality.

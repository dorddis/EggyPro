# `backend-architecture-spec.md`

## 1. Introduction

This document outlines the technical architecture, environment setup, and data access patterns for the EggyPro backend. It details the chosen technologies, project structure, and critical environment variables required for the application to function with a live database and image management system.

## 2. Technology Choices

*   **Database:** Vercel Postgres (PostgreSQL compatible)
    *   Chosen for its seamless integration with Vercel deployments and robust SQL capabilities.
*   **ORM (Object-Relational Mapper):** Drizzle ORM
    *   Selected for its type-safety, lightweight nature, and excellent support for PostgreSQL, allowing us to define database schemas using TypeScript.
*   **Image Management:** Cloudinary
    *   A cloud-based service for managing images and other media assets. It handles storage, optimization, and delivery, reducing the load on our own servers.
*   **Deployment:** Vercel
    *   The platform for deploying the Next.js application, providing serverless functions for API routes and seamless integration with Vercel Postgres.

## 3. Project Structure

To maintain a clean and organized codebase, the following new directories and files will be introduced:

*   `src/lib/db/`:
    *   This directory will house all database-related files.
    *   `src/lib/db/schema.ts`: Defines the Drizzle ORM schema for our database tables (e.g., `products`, `reviews`).
    *   `src/lib/db/index.ts`: Initializes the Drizzle client and handles the database connection.
    *   `src/lib/db/migrate.ts`: (Optional, but recommended for migrations) Script for running database migrations.
*   `src/lib/cloudinary.ts`:
    *   This file will contain the Cloudinary configuration and helper functions for uploading images.
*   `src/app/api/products/route.ts` and `src/app/api/products/[slug]/route.ts`:
    *   These files will contain the Next.js Route Handlers for our product API endpoints.

## 4. Environment Variables

Sensitive information and configuration settings will be managed using environment variables, primarily through a `.env.local` file in the project root. These variables should **never** be committed to version control.

*   `POSTGRES_URL`: The connection string for the Vercel Postgres database.
    *   Example: `POSTGRES_URL="postgres://user:password@host:port/database?sslmode=require"`
*   `ADMIN_SECRET_KEY`: A secret key used to protect administrative API endpoints (e.g., for creating, updating, or deleting products).
    *   Example: `ADMIN_SECRET_KEY="your_strong_admin_secret_key"`
*   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
    *   Example: `CLOUDINARY_CLOUD_NAME="your_cloud_name"`
*   `CLOUDINARY_API_KEY`: Your Cloudinary API key.
    *   Example: `CLOUDINARY_API_KEY="your_api_key"`
*   `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
    *   Example: `CLOUDINARY_API_SECRET="your_api_secret"`

## 5. Data Access Layer

Drizzle ORM will be used to interact with the PostgreSQL database. This provides a type-safe way to construct and execute SQL queries, reducing the likelihood of runtime errors and improving developer experience.

Example of a conceptual Drizzle query within a Route Handler:

```typescript
// src/app/api/products/route.ts (conceptual snippet)
import { db } from '@/lib/db';
import { productsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const allProducts = await db.select().from(productsTable);
    return new Response(JSON.stringify(allProducts), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 });
  }
}
```

## 6. Security Considerations

*   **Environment Variables:** All sensitive credentials (database URL, API keys, secret keys) must be stored as environment variables and never hardcoded or exposed client-side.
*   **API Endpoint Protection:** Administrative API endpoints (`POST`, `PUT`, `DELETE`) must be protected using the `ADMIN_SECRET_KEY` to prevent unauthorized modifications to the database.
*   **Input Validation:** All incoming data from API requests must be thoroughly validated to prevent SQL injection, cross-site scripting (XSS), and other common web vulnerabilities.

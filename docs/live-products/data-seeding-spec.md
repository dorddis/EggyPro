# `data-seeding-spec.md`

## 1. Introduction

This document defines the process for populating the EggyPro database with initial data. This "seed" data is crucial for development, testing, and demonstrating the application with pre-filled content. The script will focus on inserting product and review text data, with image URLs being handled separately via the admin UI.

## 2. Seed Data Strategy

*   **Source:** The primary source of seed data will be the `mockProducts` and `mockReviews` arrays found in `src/lib/constants.ts`.
*   **Product Images:** For simplicity and to align with the Cloudinary integration, the `images` array for each product will be initialized as an empty array (`[]`) during seeding. Actual product images will be uploaded manually through the Admin UI after the initial database setup.
*   **Stock Quantity:** Each product will be seeded with a default `stock_quantity` (e.g., 100) to enable immediate testing of inventory management features.
*   **Reviewer Image URL:** Reviewer image URLs will be set to a placeholder URL (e.g., `https://i.pravatar.cc/150?img={id}`) to provide visual representation for reviews.

## 3. Seed Script (`scripts/seed.ts`)

A dedicated TypeScript script will be created to handle the seeding process. This script will perform the following actions:

1.  **Connect to Database:** Establish a connection to the Vercel Postgres database using the Drizzle client.
2.  **Drop Existing Tables:** (For development/testing environments) Remove existing `products` and `reviews` tables to ensure a clean slate before seeding. This prevents duplicate data on successive runs.
3.  **Create Tables:** Recreate the `products` and `reviews` tables based on the Drizzle schema defined in `src/lib/db/schema.ts`.
4.  **Insert Products:** Iterate through the `mockProducts` data from `src/lib/constants.ts`.
    *   For each product, construct a new product object that includes a default `stock_quantity` and an empty `images` array.
    *   Insert these product objects into the `products` table.
5.  **Insert Reviews:** Iterate through the `mockReviews` data from `src/lib/constants.ts`.
    *   For each review, construct a new review object that includes a placeholder `reviewer_image_url`.
    *   Insert these review objects into the `reviews` table.

## 4. Instructions

### 4.1. Environment Configuration

Ensure the following environment variables are set in your `.env.local` file:

*   `POSTGRES_URL`

### 4.2. `package.json` Script

Add the following script to your `package.json` to easily run the seed process:

```json
{
  "scripts": {
    "seed": "tsx scripts/seed.ts"
  }
}
```

### 4.3. Running the Seed Script

To populate your database with the initial data, execute the following command in your terminal:

```bash
npm run seed
```

## 5. Codebase References for LLM Analysis

*   `src/lib/constants.ts`: This file is the **source of truth** for the initial product and review data. The LLM must correctly import and transform this data for database insertion.
*   `src/lib/db/schema.ts` (to be created): The seed script will need to import the table definitions from this Drizzle schema file to create and insert data into the correct tables.
*   `src/lib/types.ts`: Provides the TypeScript interfaces for `Product` and `Review`, which will guide the structure of the data being inserted.

# Master Specification for Live Product Implementation

## 1. Introduction

This document serves as a master specification for generating five detailed child specification documents. The ultimate goal is to transition the EggyPro application from using mock product data to a robust, live backend powered by a database.

This master spec provides the necessary structure, context, and instructions for an LLM to generate each child spec with precision and adherence to the project's existing architecture and conventions.

---

## 2. How to Use This Document

For each child spec listed below, use the provided **Objective**, **Structure & Content Guidelines**, and **Codebase References** to generate the corresponding markdown file. The LLM should follow the instructions carefully to create detailed and actionable specs.

---

## 3. Child Specification Blueprints

### 3.1. `database-schema-spec.md`

*   **Objective:** To define the complete database schema for products and reviews. This spec will be the single source of truth for the database structure.

*   **Structure & Content Guidelines:**
    1.  **Introduction:** Briefly state the purpose of the document.
    2.  **Technology Stack:** Specify **Vercel Postgres** as the database and **Drizzle ORM** as the data access layer.
    3.  **ERD (Entity-Relationship Diagram):** (Optional but recommended) Include a simple text-based or Mermaid diagram showing the relationship between `Products` and `Reviews`.
    4.  **Table: `products`**
        *   Provide a detailed breakdown of each column.
        *   For each column, specify: `Column Name`, `Data Type`, `Constraints` (e.g., `PRIMARY KEY`, `NOT NULL`, `UNIQUE`), and a `Description`.
        *   The schema must be derived from the existing `Product` type in the codebase.
    5.  **Table: `reviews`**
        *   Provide a detailed breakdown of each column, similar to the `products` table.
        *   Define the foreign key relationship to the `products` table (e.g., `product_id`).
        *   The schema must be derived from the existing `Review` type.
    6.  **Enums and Custom Types:** Define any SQL `ENUM` types if necessary (e.g., for product categories if they are fixed).

*   **Codebase References for LLM Analysis:**
    *   `src/lib/types.ts`: **Primary reference.** The `Product` and `Review` TypeScript interfaces defined here are the blueprint for the database tables. The LLM must map these types to SQL data types.
    *   `src/lib/constants.ts`: The `mockProducts` and `mockReviews` arrays provide concrete examples of the data that will be stored, which helps in determining appropriate data types and constraints (e.g., string lengths, numeric precision).
    *   `src/components/product/ProductPageClient.tsx`: The props used by this component reveal how product data is consumed and what fields are essential.

### 3.2. `api-endpoints-spec.md`

*   **Objective:** To define the server-side API endpoints (Next.js Route Handlers) required to fetch product data from the database.

*   **Structure & Content Guidelines:**
    1.  **Introduction:** Explain that this document specifies the API routes for product data.
    2.  **General Principles:** Mention that all endpoints will be read-only (`GET` requests) for this phase and will follow RESTful conventions.
    3.  **Endpoint Definitions:** For each endpoint, provide:
        *   **Route:** The URL path (e.g., `GET /api/products`).
        *   **Description:** What the endpoint does.
        *   **Success Response (200):** The shape of the JSON response body. Use TypeScript interfaces for clarity.
        *   **Error Responses (4xx/5xx):** Potential error scenarios (e.g., 404 Not Found).
    4.  **Defined Endpoints:**
        *   `GET /api/products`: Fetches a list of all products. Should support optional query parameters for filtering by category or sorting.
        *   `GET /api/products/[slug]`: Fetches a single product by its unique `slug`.

*   **Codebase References for LLM Analysis:**
    *   `src/app/page.tsx` and `src/app/product/[slug]/page.tsx`: These pages are the primary consumers of the API. Their data requirements will dictate the API response shapes.
    *   `src/lib/types.ts`: The `Product` type will define the structure of the JSON responses.
    *   **Next.js App Router Documentation:** The LLM should adhere to the standard conventions for creating Route Handlers in the `src/app/api/` directory.

### 3.3. `backend-architecture-spec.md`

*   **Objective:** To outline the technical architecture, environment setup, and data access patterns for the backend.

*   **Structure & Content Guidelines:**
    1.  **Introduction:** State the purpose of the document.
    2.  **Technology Choices:**
        *   **Database:** Vercel Postgres
        *   **ORM:** Drizzle ORM
        *   **Deployment:** Vercel
    3.  **Project Structure:**
        *   Specify the creation of a `src/lib/db` directory for Drizzle schema, client, and migration files.
    4.  **Database Connection:**
        *   Describe how the application will connect to the Vercel Postgres instance.
        *   Explain the use of environment variables (`POSTGRES_URL`) and the need for a `.env` or `.env.local` file. Provide a template.
    5.  **Data Access Layer:**
        *   Explain that Drizzle ORM will be used to execute type-safe SQL queries.
        *   Provide a small, conceptual code snippet showing how to query the database using Drizzle within a Next.js Route Handler.
    6.  **Security:** Emphasize that all database credentials must be stored securely in environment variables and never be exposed to the client-side.

*   **Codebase References for LLM Analysis:**
    *   `package.json`: To check for existing dependencies and determine which new packages need to be added (e.g., `@vercel/postgres`, `drizzle-orm`, `drizzle-kit`).
    *   `next.config.ts`: To ensure the architecture aligns with the current Next.js configuration.

### 3.4. `data-seeding-spec.md`

*   **Objective:** To define a process for populating the database with initial ("seed") data.

*   **Structure & Content Guidelines:**
    1.  **Introduction:** Explain the importance of seeding the database for development and testing.
    2.  **Seed Script:**
        *   Propose the creation of a script at `scripts/seed.ts`.
        *   The script should be executable via `npm run seed`.
        *   The script must:
            *   Connect to the database.
            *   Drop existing tables to ensure a clean slate.
            *   Create the tables based on the Drizzle schema.
            *   Insert the product and review data.
    3.  **Seed Data Source:**
        *   Specify that the seed data will be imported directly from `src/lib/constants.ts`.
    4.  **Instructions:**
        *   Provide clear, step-by-step instructions on how to configure the environment (`.env` file) and run the seed script.
        *   Include the necessary `package.json` script definition.

*   **Codebase References for LLM Analysis:**
    *   `src/lib/constants.ts`: **The source of truth for seed data.** The LLM must write a script that correctly imports `mockProducts` and `mockReviews` and inserts them into the database.
    *   `src/lib/db/schema.ts` (to be created): The seed script will need to import the table definitions from the Drizzle schema file.

### 3.5. `frontend-integration-spec.md`

*   **Objective:** To detail the necessary changes to the frontend components to fetch and display data from the new API endpoints instead of the mock data.

*   **Structure & Content Guidelines:**
    1.  **Introduction:** State the goal of connecting the React components to the live backend API.
    2.  **Data Fetching Strategy:**
        *   Explain that data fetching will occur in Server Components where possible to leverage Next.js performance benefits.
        *   Create a new file `src/lib/data.ts` to centralize data fetching functions (e.g., `getProducts`, `getProductBySlug`). These functions will encapsulate the `fetch` calls to the API endpoints.
    3.  **Component Modification Plan:**
        *   Create a table or list of components that need to be modified.
        *   For each component, specify:
            *   **Component Path:** (e.g., `src/app/page.tsx`)
            *   **Current Method:** (e.g., "Imports `mockProducts` from `constants.ts`")
            *   **New Method:** (e.g., "Will call `getProducts()` from `src/lib/data.ts` and pass the result as props.")
    4.  **Affected Components (Initial List):**
        *   `src/app/page.tsx`
        *   `src/app/product/[slug]/page.tsx`
        *   `src/components/product/ProductPageClient.tsx` (and how it receives data from its parent server component)
    5.  **State Management:** Confirm that no changes are needed to the cart or state management hooks (`use-cart.ts`) at this stage, as they operate on product data that has already been loaded.

*   **Codebase References for LLM Analysis:**
    *   `src/lib/constants.ts`: The main file to identify where mock data is currently being imported from.
    *   `src/app/page.tsx`, `src/app/product/[slug]/page.tsx`: These are the primary pages that will be refactored to use live data.
    *   `src/components/product/ProductCard.tsx`, `src/components/product/ProductPageClient.tsx`, `src/components/product/ReviewList.tsx`: These components will be affected by the changes in data fetching and need to be analyzed for prop changes.

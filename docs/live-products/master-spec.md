# Master Specification for Live Product Implementation

## 1. Introduction

This document serves as a master specification for generating **six** detailed child specification documents. The ultimate goal is to transition the EggyPro application from using mock product data to a robust, live backend powered by a database, complete with an admin interface for managing products, inventory, and images via Cloudinary.

This master spec provides the necessary structure, context, and instructions for an LLM to generate each child spec with precision and adherence to the project's existing architecture and conventions.

---

## 2. How to Use This Document

For each child spec listed below, use the provided **Objective**, **Structure & Content Guidelines**, and **Codebase References** to generate the corresponding markdown file. The LLM should follow the instructions carefully to create detailed and actionable specs.

---

## 3. Child Specification Blueprints

### 3.1. `database-schema-spec.md`

*   **Objective:** To define the complete database schema for products and reviews, including inventory management.

*   **Structure & Content Guidelines:**
    1.  **Introduction:** Briefly state the purpose of the document.
    2.  **Technology Stack:** Specify **Vercel Postgres** and **Drizzle ORM**.
    3.  **Table: `products`**
        *   The schema must include a `stock_quantity` column (`integer`, `NOT NULL`, `DEFAULT 0`).
        *   The `images` column must be defined as `text[]` for Cloudinary URLs.
    4.  **Table: `reviews`**
        *   The schema must include a `reviewer_image_url` column (`varchar(255)`).

*   **Codebase References for LLM Analysis:**
    *   `src/lib/types.ts`: The `Product` and `Review` interfaces are the base.
    *   `src/components/product/QuantitySelector.tsx`: This component shows an existing UI for quantity, which will now be tied to `stock_quantity`.

### 3.2. `api-endpoints-spec.md`

*   **Objective:** To define the API endpoints for managing products, including inventory.

*   **Structure & Content Guidelines:**
    1.  **Introduction:** Explain the purpose of the API routes.
    2.  **Inventory Handling:**
        *   The `GET /api/products` and `GET /api/products/[slug]` endpoints should return the `stock_quantity`.
        *   The `POST` and `PUT` endpoints must allow for setting the `stock_quantity`.
    3.  **Endpoint Definitions:**
        *   `GET /api/products`
        *   `GET /api/products/[slug]`
        *   `POST /api/products`
        *   `PUT /api/products/[slug]`
        *   `DELETE /api/products/[slug]`

*   **Codebase References for LLM Analysis:**
    *   `src/lib/types.ts`: To define the shape of API responses.
    *   `database-schema-spec.md`: To ensure API request/response bodies align with the schema.

### 3.3. `backend-architecture-spec.md`

*   **Objective:** To outline the backend architecture, including Cloudinary for images.

*   **Structure & Content Guidelines:**
    1.  **Technology Choices:** Vercel Postgres, Drizzle ORM, Cloudinary.
    2.  **Environment Variables:** Include `POSTGRES_URL`, `ADMIN_SECRET_KEY`, and Cloudinary keys.

*   **Codebase References for LLM Analysis:**
    *   `package.json`: To identify dependencies.

### 3.4. `data-seeding-spec.md`

*   **Objective:** To define the process for seeding the database with initial data, including stock levels.

*   **Structure & Content Guidelines:**
    1.  **Seed Data Strategy:**
        *   The seed script will populate product data from `src/lib/constants.ts`.
        *   **For each product, it must set a default `stock_quantity` (e.g., 100).**
        *   The `images` array will be empty, to be populated later via the admin UI.

*   **Codebase References for LLM Analysis:**
    *   `src/lib/constants.ts`: The source for seed data.

### 3.5. `frontend-integration-spec.md`

*   **Objective:** To detail the frontend changes required to display stock status and disable purchasing for out-of-stock items.

*   **Structure & Content Guidelines:**
    1.  **Introduction:** Explain the goal of integrating inventory data into the UI.
    2.  **Component Modification Plan:**
        *   `src/components/product/ProductPageClient.tsx`: Must display the stock status (e.g., "In Stock" or "Out of Stock").
        *   `src/components/product/AddToCartButton.tsx` and `src/components/product/BuyNowButton.tsx`: Must be disabled if `stock_quantity` is 0.
        *   `src/components/product/QuantitySelector.tsx`: The maximum selectable quantity should be limited by the `stock_quantity`.

*   **Codebase References for LLM Analysis:**
    *   The component files listed above.

### 3.6. `admin-ui-spec.md`

*   **Objective:** To specify the admin interface for managing products, including their inventory.

*   **Structure & Content Guidelines:**
    1.  **UI/UX and Component Design:**
        *   The `<ProductDataTable />` must display the current `stock_quantity` for each product.
        *   The `<ProductForm />` must include a number input field for `stock_quantity`.

*   **Codebase References for LLM Analysis:**
    *   `src/components/ui/`: For reusing existing UI components.
    *   `database-schema-spec.md`: The form fields must align with the database schema.

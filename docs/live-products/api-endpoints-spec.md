# `api-endpoints-spec.md`

## 1. Introduction

This document specifies the RESTful API endpoints for managing products in the EggyPro application. These endpoints, implemented as Next.js Route Handlers, will provide the necessary interface for the frontend to interact with the database for all product-related operations, including inventory and image uploads.

## 2. General Principles

*   **Convention:** Endpoints follow RESTful design principles.
*   **Data Format:** All endpoints will accept and return JSON, with the exception of the `POST` and `PUT` endpoints, which will accept `multipart/form-data` to handle file uploads.
*   **Security:** `GET` endpoints are public. All other endpoints (`POST`, `PUT`, `DELETE`) are considered administrative and must be protected. The backend will expect a secret key or token to be passed in the request headers for authorization.

## 3. Endpoint Definitions

---

### 3.1. Get All Products

*   **Route:** `GET /api/products`
*   **Description:** Retrieves a list of all products. Can be used to populate the main shop page.
*   **Query Parameters (Optional):**
    *   `category` (string): Filter products by category.
    *   `sort` (string): Sort products (e.g., `price-asc`, `price-desc`).
*   **Success Response (200):**
    *   **Body:** `Product[]` - An array of product objects.
    ```typescript
    // Based on the future database schema
    interface Product {
      id: number;
      name: string;
      slug: string;
      description: string;
      price: number;
      images: string[]; // URLs from Cloudinary
      stock_quantity: number;
    }
    ```
*   **Error Response (500):**
    *   **Body:** `{ "error": "Failed to fetch products" }`

---

### 3.2. Get a Single Product

*   **Route:** `GET /api/products/[slug]`
*   **Description:** Retrieves the complete details for a single product, identified by its slug.
*   **Success Response (200):**
    *   **Body:** `Product` - A single, detailed product object.
    ```typescript
    interface Product {
      id: number;
      name: string;
      slug: string;
      description: string;
      details: string;
      price: number;
      images: string[]; // URLs from Cloudinary
      ingredients: string[];
      stock_quantity: number;
      reviews: Review[];
    }
    ```
*   **Error Responses:**
    *   **404 Not Found:** `{ "error": "Product not found" }`
    *   **500 Internal Server Error:** `{ "error": "Failed to fetch product" }`

---

### 3.3. Create a New Product

*   **Route:** `POST /api/products`
*   **Description:** Creates a new product. Handles image uploads to Cloudinary.
*   **Request Body:** `multipart/form-data` containing product fields and image files.
    *   `name` (string)
    *   `slug` (string)
    *   `description` (string)
    *   `details` (string)
    *   `price` (number)
    *   `stock_quantity` (number)
    *   `ingredients` (JSON stringified array of strings)
    *   `images` (File): One or more image files.
*   **Success Response (201 Created):**
    *   **Body:** The newly created `Product` object.
*   **Error Responses:**
    *   **400 Bad Request:** `{ "error": "Invalid product data" }`
    *   **401 Unauthorized:** `{ "error": "Authentication required" }`
    *   **500 Internal Server Error:** `{ "error": "Failed to create product" }`

---

### 3.4. Update a Product

*   **Route:** `PUT /api/products/[slug]`
*   **Description:** Updates an existing product. Can handle new image uploads, updates to text fields, and changes to stock quantity.
*   **Request Body:** `multipart/form-data` containing the fields to be updated.
*   **Success Response (200 OK):**
    *   **Body:** The updated `Product` object.
*   **Error Responses:**
    *   **400 Bad Request:** `{ "error": "Invalid product data" }`
    *   **401 Unauthorized:** `{ "error": "Authentication required" }`
    *   **404 Not Found:** `{ "error": "Product not found" }`
    *   **500 Internal Server Error:** `{ "error": "Failed to update product" }`

---

### 3.5. Delete a Product

*   **Route:** `DELETE /api/products/[slug]`
*   **Description:** Deletes a product from the database.
*   **Success Response (204 No Content):**
    *   An empty response body indicates successful deletion.
*   **Error Responses:**
    *   **401 Unauthorized:** `{ "error": "Authentication required" }`
    *   **404 Not Found:** `{ "error": "Product not found" }`
    *   **500 Internal Server Error:** `{ "error": "Failed to delete product" }`

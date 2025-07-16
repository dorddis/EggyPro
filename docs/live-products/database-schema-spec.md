# `database-schema-spec.md`

## 1. Introduction

This document provides the complete database schema for the EggyPro application. It serves as the blueprint for creating the necessary tables in our Vercel Postgres database using Drizzle ORM. The schema is derived directly from the existing data structures used in the application and includes necessary additions for inventory management.

## 2. Technology Stack

*   **Database:** Vercel Postgres
*   **ORM:** Drizzle ORM

## 3. Entity-Relationship Diagram (ERD)

```mermaid
graph TD
    Products ||--o{ Reviews : "has"
```

## 4. Table: `products`

This table stores all product information. The schema is based on the `Product` interface in `src/lib/types.ts` and is expanded to include stock management.

| Column Name      | Data Type      | Constraints                      | Description                                                  |
|------------------|----------------|----------------------------------|--------------------------------------------------------------|
| `id`             | `serial`       | `PRIMARY KEY`                    | Auto-incrementing integer for unique identification.         |
| `name`           | `varchar(255)` | `NOT NULL`                       | The name of the product.                                     |
| `slug`           | `varchar(255)` | `NOT NULL`, `UNIQUE`             | URL-friendly identifier for the product page.                |
| `description`    | `text`         | `NOT NULL`                       | A short, engaging description for product cards.             |
| `details`        | `text`         | `NOT NULL`                       | Comprehensive details for the product page.                  |
| `price`          | `decimal(10,2)`| `NOT NULL`                       | The price of the product.                                    |
| `images`         | `text[]`       | `NOT NULL`, `DEFAULT '{}'`      | An array of URLs pointing to product images on Cloudinary.      |
| `ingredients`    | `text[]`       | `NOT NULL`, `DEFAULT '{}'`      | An array of product ingredients.                             |
| `stock_quantity` | `integer`      | `NOT NULL`, `DEFAULT 0`          | The number of units available in inventory.                  |
| `created_at`     | `timestamp`    | `NOT NULL`, `DEFAULT now()`      | The timestamp when the product was created.                  |

## 5. Table: `reviews`

This table stores customer reviews for products. The schema is based on the `Review` interface in `src/lib/types.ts`.

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

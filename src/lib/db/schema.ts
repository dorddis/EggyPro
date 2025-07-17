import { pgTable, serial, varchar, text, decimal, integer, timestamp, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';
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
  pk: uniqueIndex('product_categories_pk').on(table.product_id, table.category_id),
}));

// Relations
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

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
  product: one(products, {
    fields: [productCategories.product_id],
    references: [products.id],
  }),
  category: one(categories, {
    fields: [productCategories.category_id],
    references: [categories.id],
  }),
})); 
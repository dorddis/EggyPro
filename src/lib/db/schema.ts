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

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  order_id: varchar('order_id', { length: 100 }).notNull(),
  payment_intent_id: varchar('payment_intent_id', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, processing, completed, cancelled, failed
  total_amount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('usd'),
  customer_name: varchar('customer_name', { length: 255 }).notNull(),
  customer_email: varchar('customer_email', { length: 255 }),
  shipping_address: text('shipping_address').notNull(),
  shipping_city: varchar('shipping_city', { length: 100 }).notNull(),
  shipping_zip: varchar('shipping_zip', { length: 20 }).notNull(),
  payment_method: varchar('payment_method', { length: 50 }).notNull().default('card'), // card, bypass
  is_development_order: boolean('is_development_order').notNull().default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  orderIdIdx: uniqueIndex('orders_order_id_idx').on(table.order_id),
  paymentIntentIdx: index('orders_payment_intent_idx').on(table.payment_intent_id),
  statusIdx: index('orders_status_idx').on(table.status),
  customerEmailIdx: index('orders_customer_email_idx').on(table.customer_email),
  createdAtIdx: index('orders_created_at_idx').on(table.created_at),
}));

// Order items table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull(),
  product_id: integer('product_id').notNull(),
  product_name: varchar('product_name', { length: 255 }).notNull(), // Store name at time of purchase
  product_price: decimal('product_price', { precision: 10, scale: 2 }).notNull(), // Store price at time of purchase
  quantity: integer('quantity').notNull(),
  line_total: decimal('line_total', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  orderIdx: index('order_items_order_id_idx').on(table.order_id),
  productIdx: index('order_items_product_id_idx').on(table.product_id),
}));

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  reviews: many(reviews),
  categories: many(productCategories),
  orderItems: many(orderItems),
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

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.order_id],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.product_id],
    references: [products.id],
  }),
}));
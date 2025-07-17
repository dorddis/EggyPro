import { config } from 'dotenv';
import { resolve } from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function pushSchema() {
  // Force use the Supabase URL (system env var is overriding .env.local)
  const connectionString = 'postgresql://postgres:mYl93dLOiZCVVWX7@db.namtebydwqsyyiwkzwpb.supabase.co:5432/postgres';
  
  try {
    console.log('Connecting to database...');
    const client = postgres(connectionString, { max: 1 });
    const db = drizzle(client);
    
    console.log('Creating tables...');
    
    // Create tables manually since drizzle-kit push isn't working
    await client`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL,
        description TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    
    await client`
      CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug)
    `;
    
    await client`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        details TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        images TEXT[] NOT NULL DEFAULT '{}',
        ingredients TEXT[] NOT NULL DEFAULT '{}',
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    
    await client`
      CREATE UNIQUE INDEX IF NOT EXISTS products_slug_idx ON products(slug)
    `;
    
    await client`
      CREATE INDEX IF NOT EXISTS products_name_idx ON products(name)
    `;
    
    await client`
      CREATE INDEX IF NOT EXISTS products_price_idx ON products(price)
    `;
    
    await client`
      CREATE INDEX IF NOT EXISTS products_stock_idx ON products(stock_quantity)
    `;
    
    await client`
      CREATE INDEX IF NOT EXISTS products_active_idx ON products(is_active)
    `;
    
    await client`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        reviewer_name VARCHAR(255) NOT NULL,
        reviewer_image_url VARCHAR(255),
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        image_url VARCHAR(255),
        video_url VARCHAR(255),
        is_verified BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    
    await client`
      CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews(product_id)
    `;
    
    await client`
      CREATE INDEX IF NOT EXISTS reviews_rating_idx ON reviews(rating)
    `;
    
    await client`
      CREATE INDEX IF NOT EXISTS reviews_verified_idx ON reviews(is_verified)
    `;
    
    await client`
      CREATE TABLE IF NOT EXISTS product_categories (
        product_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL
      )
    `;
    
    await client`
      CREATE UNIQUE INDEX IF NOT EXISTS product_categories_pk ON product_categories(product_id, category_id)
    `;
    
    console.log('Tables created successfully!');
    
    await client.end();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

pushSchema()
  .then(() => {
    console.log('Schema push completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Schema push failed:', error);
    process.exit(1);
  });
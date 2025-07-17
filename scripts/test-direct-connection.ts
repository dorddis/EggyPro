import { config } from 'dotenv';
import { resolve } from 'path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { products } from '../src/lib/db/schema';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function testDirectConnection() {
  try {
    console.log('🔍 Testing Direct Postgres Connection...\n');
    
    const connectionString = process.env.DATABASE_URL;
    console.log('DATABASE_URL loaded:', connectionString ? 'Yes' : 'No');
    console.log('Connection type:', connectionString?.includes('supabase.com') ? 'Supabase' : 'Other');
    
    if (!connectionString) {
      throw new Error('DATABASE_URL not found in environment');
    }
    
    // Create direct postgres connection
    const client = postgres(connectionString);
    const db = drizzle(client);
    
    console.log('✅ Postgres client created successfully');
    
    // Test basic query
    console.log('🔍 Testing products query...');
    const result = await db.select().from(products).limit(3);
    
    console.log('✅ Query successful!');
    console.log(`📦 Found ${result.length} products`);
    
    if (result.length > 0) {
      console.log('\n📋 Sample products:');
      result.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.price} (Stock: ${product.stock_quantity})`);
      });
    }
    
    // Close connection
    await client.end();
    console.log('\n✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Direct connection failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  }
}

testDirectConnection();
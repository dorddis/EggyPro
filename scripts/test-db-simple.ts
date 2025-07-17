import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing Database Connection...\n');
    
    // Test the database connection directly
    const { db } = await import('../src/lib/db');
    const { products } = await import('../src/lib/db/schema');
    
    console.log('✅ Database modules imported successfully');
    
    // Test a simple query
    console.log('🔍 Testing database query...');
    const result = await db.select().from(products).limit(1);
    
    console.log('✅ Database query successful!');
    console.log(`📦 Found ${result.length} product(s)`);
    
    if (result.length > 0) {
      console.log(`📋 Sample product: ${result[0].name}`);
    }
    
    // Test count query
    const countResult = await db.select().from(products);
    console.log(`📊 Total products in database: ${countResult.length}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
  }
}

testDatabaseConnection();
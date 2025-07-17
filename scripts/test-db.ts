import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

console.log('Environment variables loaded:');
console.log('DATABASE_URL from .env.local:', process.env.DATABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

// Test the connection
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

async function testConnection() {
  // Force use the Supabase URL from .env.local
  const connectionString = 'postgresql://postgres:mYl93dLOiZCVVWX7@db.namtebydwqsyyiwkzwpb.supabase.co:5432/postgres';
  console.log('Using connection string:', connectionString?.substring(0, 50) + '...');

  try {
    const client = postgres(connectionString!);
    const db = drizzle(client);
    
    console.log('Testing database connection...');
    const result = await client`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    
    await client.end();
    console.log('Connection closed successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();
import { createClient } from '@supabase/supabase-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Supabase client for auth and realtime
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Clear any system environment variable override
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost')) {
  console.log('Warning: DATABASE_URL points to localhost, this might be a system override')
}

// Database connection for Drizzle ORM
// Force use the Supabase URL since system env var is overriding .env.local
let connectionString = process.env.DATABASE_URL
if (!connectionString || connectionString.includes('localhost')) {
  connectionString = 'postgresql://postgres:mYl93dLOiZCVVWX7@db.namtebydwqsyyiwkzwpb.supabase.co:5432/postgres'
  console.log('Using hardcoded Supabase URL due to system override')
}

console.log('Using DATABASE_URL:', connectionString.includes('supabase.com') ? 'Supabase' : 'Other')

const client = postgres(connectionString)
export const db = drizzle(client, { schema })

// Export schema
export { schema }

// Database connection pool configuration
export const dbConfig = {
  maxConnections: 20,
  idleTimeout: 30000,
  connectionTimeout: 10000,
}

// Health check function
export async function checkDatabaseHealth() {
  try {
    await client`SELECT 1 as health_check`
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      connection: 'active',
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
} 
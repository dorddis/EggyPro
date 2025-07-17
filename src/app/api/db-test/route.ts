import { NextResponse } from 'next/server'
import { db, checkDatabaseHealth } from '@/lib/db'
import { products, reviews } from '@/lib/db/schema'

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    // Show the actual DATABASE_URL (masked for security)
    const dbUrl = process.env.DATABASE_URL || 'Not set'
    const maskedUrl = dbUrl.startsWith('postgresql://') 
      ? `postgresql://***@${dbUrl.split('@')[1]?.split('/')[0] || 'unknown'}`
      : dbUrl
    console.log('Actual DATABASE_URL:', maskedUrl)
    
    // Test database health
    const health = await checkDatabaseHealth()
    console.log('Database health:', health)
    
    if (health.status === 'unhealthy') {
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: health,
          debug: {
            dbUrl: maskedUrl,
            isLocalhost: dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1'),
            isSupabase: dbUrl.includes('supabase.com')
          }
        },
        { status: 500 }
      )
    }

    // Test basic query
    console.log('Testing basic query...')
    const testQuery = await db.select().from(products).limit(1)
    console.log('Query result:', testQuery.length, 'rows')
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      health,
      testQuery: testQuery.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json(
      { 
        error: 'Database test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 
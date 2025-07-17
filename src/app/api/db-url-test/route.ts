import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'Not set'
  
  // Only show the first part of the URL for security
  const displayUrl = dbUrl.startsWith('postgresql://') 
    ? `postgresql://***@${dbUrl.split('@')[1]?.split('/')[0] || 'unknown'}`
    : 'Not a valid postgresql URL'
    
  return NextResponse.json({
    DATABASE_URL: displayUrl,
    isLocalhost: dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1'),
    isSupabase: dbUrl.includes('supabase.com'),
  })
} 
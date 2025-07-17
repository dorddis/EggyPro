import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET() {
  try {
    console.log('Testing Supabase connection with public URL and anon key...')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    // Test basic Supabase query
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          error: 'Supabase connection failed',
          details: error,
          message: error.message
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      data: data,
      count: data?.length || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Supabase test failed:', error)
    return NextResponse.json(
      { 
        error: 'Supabase test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { getPriceHealthStatus, priceMonitor } from '@/lib/price-monitoring';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';
    
    const healthStatus = getPriceHealthStatus();
    
    if (detailed) {
      // Return detailed monitoring information
      const report = priceMonitor.generateReport();
      const recentErrors = priceMonitor.getRecentErrors(10);
      
      return NextResponse.json({
        ...healthStatus,
        report,
        recentErrors,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Return basic health status
    return NextResponse.json({
      ...healthStatus,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Price health check error:', error);
    
    return NextResponse.json({
      status: 'critical',
      message: 'Health check system failure',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Allow external systems to report price errors
    if (body.action === 'report-error') {
      const { context, originalValue, error } = body;
      
      if (!context || !error) {
        return NextResponse.json({
          error: 'Missing required fields: context, error'
        }, { status: 400 });
      }
      
      priceMonitor.logValidationError(context, originalValue, error);
      
      return NextResponse.json({
        message: 'Error reported successfully',
        timestamp: new Date().toISOString(),
      });
    }
    
    // Reset metrics (for testing/debugging)
    if (body.action === 'reset-metrics') {
      // Only allow in development
      if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({
          error: 'Reset only allowed in development'
        }, { status: 403 });
      }
      
      priceMonitor.resetMetrics();
      
      return NextResponse.json({
        message: 'Metrics reset successfully',
        timestamp: new Date().toISOString(),
      });
    }
    
    return NextResponse.json({
      error: 'Invalid action'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Price health check POST error:', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
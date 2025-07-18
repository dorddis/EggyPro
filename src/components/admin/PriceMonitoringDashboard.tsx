'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { type PriceMetrics, type PriceErrorLog } from '@/lib/price-monitoring';

interface HealthStatus {
  status: 'healthy' | 'warning' | 'critical';
  metrics: PriceMetrics;
  errorRate: number;
  message: string;
  recentErrors?: PriceErrorLog[];
  report?: string;
  timestamp: string;
}

export default function PriceMonitoringDashboard() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchHealthStatus = async (detailed: boolean = true) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/health/price?detailed=${detailed}`);
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      console.error('Failed to fetch price health status:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetMetrics = async () => {
    try {
      const response = await fetch('/api/health/price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reset-metrics' }),
      });
      
      if (response.ok) {
        await fetchHealthStatus();
      }
    } catch (error) {
      console.error('Failed to reset metrics:', error);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchHealthStatus();
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5" />;
      case 'warning':
      case 'critical':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (!healthStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading price monitoring data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Price Monitoring Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchHealthStatus()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            Auto Refresh
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={resetMetrics}
            >
              Reset Metrics
            </Button>
          )}
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(healthStatus.status)}
            System Status
          </CardTitle>
          <CardDescription>
            Last updated: {new Date(healthStatus.timestamp).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg border ${getStatusColor(healthStatus.status)}`}>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={getStatusColor(healthStatus.status)}>
                {healthStatus.status.toUpperCase()}
              </Badge>
              <span className="text-sm font-medium">
                Error Rate: {healthStatus.errorRate.toFixed(2)}%
              </span>
            </div>
            <p className="mt-2 text-sm">{healthStatus.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Validations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthStatus.metrics.totalValidations}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              All time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Validation Failures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {healthStatus.metrics.validationFailures}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1" />
              {healthStatus.errorRate.toFixed(1)}% rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {healthStatus.metrics.conversionErrors}
            </div>
            <div className="text-xs text-muted-foreground">Type conversion issues</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Formatting Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {healthStatus.metrics.formattingErrors}
            </div>
            <div className="text-xs text-muted-foreground">Display formatting issues</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Errors */}
      {healthStatus.recentErrors && healthStatus.recentErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
            <CardDescription>
              Last {healthStatus.recentErrors.length} price-related errors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthStatus.recentErrors.map((error, index) => (
                <div key={index} className="border rounded-lg p-3 bg-red-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive" className="text-xs">
                          {error.context}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(error.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-red-800">{error.error}</p>
                      <p className="text-xs text-red-600 mt-1">
                        Original value: {JSON.stringify(error.originalValue)}
                      </p>
                      {error.url && (
                        <p className="text-xs text-muted-foreground mt-1">
                          URL: {error.url}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Report */}
      {healthStatus.report && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Report</CardTitle>
            <CardDescription>
              Comprehensive monitoring report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
              {healthStatus.report}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
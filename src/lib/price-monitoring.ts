interface PriceErrorLog {
  timestamp: string;
  context: string;
  originalValue: unknown;
  error: string;
  stackTrace?: string;
  userAgent?: string;
  url?: string;
}

interface PriceMetrics {
  totalValidations: number;
  validationFailures: number;
  conversionErrors: number;
  formattingErrors: number;
  lastError?: PriceErrorLog;
}

class PriceMonitor {
  private static instance: PriceMonitor;
  private metrics: PriceMetrics = {
    totalValidations: 0,
    validationFailures: 0,
    conversionErrors: 0,
    formattingErrors: 0,
  };
  private errorLogs: PriceErrorLog[] = [];
  private readonly MAX_LOGS = 100; // Keep last 100 errors

  static getInstance(): PriceMonitor {
    if (!PriceMonitor.instance) {
      PriceMonitor.instance = new PriceMonitor();
    }
    return PriceMonitor.instance;
  }

  /**
   * Log a price validation error
   */
  logValidationError(context: string, originalValue: unknown, error: string): void {
    this.metrics.totalValidations++;
    this.metrics.validationFailures++;
    
    const errorLog: PriceErrorLog = {
      timestamp: new Date().toISOString(),
      context,
      originalValue,
      error,
      stackTrace: new Error().stack,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.addErrorLog(errorLog);
    this.metrics.lastError = errorLog;

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔢 Price Validation Error:', {
        context,
        originalValue,
        error,
        timestamp: errorLog.timestamp,
      });
    }

    // In production, you might want to send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorLog);
    }
  }

  /**
   * Log a price conversion error
   */
  logConversionError(context: string, originalValue: unknown, error: string): void {
    this.metrics.conversionErrors++;
    
    const errorLog: PriceErrorLog = {
      timestamp: new Date().toISOString(),
      context,
      originalValue,
      error,
      stackTrace: new Error().stack,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.addErrorLog(errorLog);

    if (process.env.NODE_ENV === 'development') {
      console.warn('💱 Price Conversion Error:', {
        context,
        originalValue,
        error,
        timestamp: errorLog.timestamp,
      });
    }

    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorLog);
    }
  }

  /**
   * Log a price formatting error
   */
  logFormattingError(context: string, originalValue: unknown, error: string): void {
    this.metrics.formattingErrors++;
    
    const errorLog: PriceErrorLog = {
      timestamp: new Date().toISOString(),
      context,
      originalValue,
      error,
      stackTrace: new Error().stack,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.addErrorLog(errorLog);

    if (process.env.NODE_ENV === 'development') {
      console.warn('💰 Price Formatting Error:', {
        context,
        originalValue,
        error,
        timestamp: errorLog.timestamp,
      });
    }

    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorLog);
    }
  }

  /**
   * Log successful price validation (for metrics)
   */
  logSuccessfulValidation(): void {
    this.metrics.totalValidations++;
  }

  /**
   * Get current metrics
   */
  getMetrics(): PriceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get recent error logs
   */
  getRecentErrors(limit: number = 10): PriceErrorLog[] {
    return this.errorLogs.slice(-limit);
  }

  /**
   * Get error rate (percentage of validations that failed)
   */
  getErrorRate(): number {
    if (this.metrics.totalValidations === 0) return 0;
    return (this.metrics.validationFailures / this.metrics.totalValidations) * 100;
  }

  /**
   * Check if error rate is above threshold
   */
  isErrorRateHigh(threshold: number = 5): boolean {
    return this.getErrorRate() > threshold;
  }

  /**
   * Reset metrics (useful for testing)
   */
  resetMetrics(): void {
    this.metrics = {
      totalValidations: 0,
      validationFailures: 0,
      conversionErrors: 0,
      formattingErrors: 0,
    };
    this.errorLogs = [];
  }

  /**
   * Generate monitoring report
   */
  generateReport(): string {
    const metrics = this.getMetrics();
    const errorRate = this.getErrorRate();
    const recentErrors = this.getRecentErrors(5);

    return `
Price Monitoring Report
======================
Total Validations: ${metrics.totalValidations}
Validation Failures: ${metrics.validationFailures}
Conversion Errors: ${metrics.conversionErrors}
Formatting Errors: ${metrics.formattingErrors}
Error Rate: ${errorRate.toFixed(2)}%

Recent Errors:
${recentErrors.map(error => 
  `- ${error.timestamp}: ${error.context} - ${error.error}`
).join('\n')}
    `.trim();
  }

  private addErrorLog(errorLog: PriceErrorLog): void {
    this.errorLogs.push(errorLog);
    
    // Keep only the most recent errors
    if (this.errorLogs.length > this.MAX_LOGS) {
      this.errorLogs = this.errorLogs.slice(-this.MAX_LOGS);
    }
  }

  private async sendToMonitoringService(errorLog: PriceErrorLog): Promise<void> {
    try {
      // In a real application, you would send to your monitoring service
      // Examples: Sentry, LogRocket, DataDog, etc.
      
      // For now, we'll just log to console in production
      console.error('Price Error:', errorLog);
      
      // Example of how you might send to a monitoring service:
      /*
      await fetch('/api/monitoring/price-errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      });
      */
    } catch (error) {
      // Don't let monitoring errors break the application
      console.error('Failed to send price error to monitoring service:', error);
    }
  }
}

// Export singleton instance
export const priceMonitor = PriceMonitor.getInstance();

// Export types
export type { PriceErrorLog, PriceMetrics };

// Utility function to create monitoring-aware price operations
export function withPriceMonitoring<T extends unknown[], R>(
  operation: (...args: T) => R,
  context: string
) {
  return (...args: T): R => {
    try {
      const result = operation(...args);
      priceMonitor.logSuccessfulValidation();
      return result;
    } catch (error) {
      priceMonitor.logValidationError(
        context,
        args,
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  };
}

// Health check function for monitoring systems
export function getPriceHealthStatus(): {
  status: 'healthy' | 'warning' | 'critical';
  metrics: PriceMetrics;
  errorRate: number;
  message: string;
} {
  const metrics = priceMonitor.getMetrics();
  const errorRate = priceMonitor.getErrorRate();

  if (errorRate === 0) {
    return {
      status: 'healthy',
      metrics,
      errorRate,
      message: 'All price operations are functioning normally',
    };
  } else if (errorRate < 5) {
    return {
      status: 'warning',
      metrics,
      errorRate,
      message: `Price error rate is ${errorRate.toFixed(2)}% - monitoring closely`,
    };
  } else {
    return {
      status: 'critical',
      metrics,
      errorRate,
      message: `High price error rate: ${errorRate.toFixed(2)}% - immediate attention required`,
    };
  }
}
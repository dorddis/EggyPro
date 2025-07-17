// Logging service for tracking application events and errors

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private createLogEntry(
    level: LogLevel,
    context: string,
    message: string,
    data?: Record<string, unknown>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      data,
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output for development
    const logMessage = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.context}] ${entry.message}`;
    
    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(logMessage, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, entry.data);
        break;
      case LogLevel.INFO:
        console.info(logMessage, entry.data);
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage, entry.data);
        break;
    }
  }

  error(context: string, message: string, data?: Record<string, unknown>): void {
    this.addLog(this.createLogEntry(LogLevel.ERROR, context, message, data));
  }

  warn(context: string, message: string, data?: Record<string, unknown>): void {
    this.addLog(this.createLogEntry(LogLevel.WARN, context, message, data));
  }

  info(context: string, message: string, data?: Record<string, unknown>): void {
    this.addLog(this.createLogEntry(LogLevel.INFO, context, message, data));
  }

  debug(context: string, message: string, data?: Record<string, unknown>): void {
    this.addLog(this.createLogEntry(LogLevel.DEBUG, context, message, data));
  }

  // API-specific logging methods
  apiRequest(endpoint: string, method: string, params?: Record<string, unknown>): void {
    this.info('API_REQUEST', `${method} ${endpoint}`, { params });
  }

  apiResponse(endpoint: string, status: number, duration?: number): void {
    this.info('API_RESPONSE', `${endpoint} - ${status}`, { status, duration });
  }

  apiError(endpoint: string, error: Error | unknown, params?: Record<string, unknown>): void {
    this.error('API_ERROR', `${endpoint} failed`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      params
    });
  }

  databaseQuery(query: string, duration?: number): void {
    this.debug('DATABASE', `Query executed`, { query, duration });
  }

  databaseError(query: string, error: Error | unknown): void {
    this.error('DATABASE', `Query failed: ${query}`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      code: error && typeof error === 'object' && 'code' in error ? (error as { code: unknown }).code : undefined
    });
  }

  // Get recent logs for debugging
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Get logs by level
  getLogsByLevel(level: LogLevel, count: number = 50): LogEntry[] {
    return this.logs
      .filter(log => log.level === level)
      .slice(-count);
  }

  // Clear logs (useful for testing)
  clearLogs(): void {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
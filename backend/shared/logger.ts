/**
 * Professional Logger for XamSaDine AI
 * Handles structured logging with levels, timestamps, and context
 * Suitable for production environments with monitoring integration
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

export interface LogContext {
  service?: string;
  module?: string;
  requestId?: string;
  userId?: string;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

class Logger {
  private minLevel: LogLevel = LogLevel.DEBUG;
  private context: LogContext = {};

  constructor(context?: LogContext) {
    if (context) {
      this.context = context;
    }
    this.setMinLevel();
  }

  /**
   * Set minimum log level based on environment
   */
  private setMinLevel(): void {
    const env = process.env.NODE_ENV || 'development';
    const logLevel = process.env.LOG_LEVEL || 'INFO';

    const levelMap: { [key: string]: LogLevel } = {
      debug: LogLevel.DEBUG,
      info: LogLevel.INFO,
      warn: LogLevel.WARN,
      error: LogLevel.ERROR,
      fatal: LogLevel.FATAL
    };

    this.minLevel = levelMap[logLevel.toLowerCase()] || LogLevel.INFO;

    // In development, default to DEBUG
    if (env === 'development' && logLevel === 'INFO') {
      this.minLevel = LogLevel.DEBUG;
    }
  }

  /**
   * Check if log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL];
    const minIndex = levels.indexOf(this.minLevel);
    const levelIndex = levels.indexOf(level);
    return levelIndex >= minIndex;
  }

  /**
   * Format log entry for output
   */
  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, error } = entry;

    let log = `[${timestamp}] [${level}] ${message}`;

    // Add context if present
    if (Object.keys(context).length > 0) {
      log += ` | ${JSON.stringify(context)}`;
    }

    // Add error details if present
    if (error) {
      log += `\n  Error: ${error.message}`;
      if (error.code) {
        log += ` (Code: ${error.code})`;
      }
      if (error.stack && process.env.NODE_ENV === 'development') {
        log += `\n  Stack: ${error.stack}`;
      }
    }

    return log;
  }

  /**
   * Log message at specified level
   */
  private log(level: LogLevel, message: string, contextData?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...this.context, ...contextData }
    };

    if (error) {
      entry.error = {
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      };
    }

    const formattedLog = this.formatLog(entry);

    // Send to appropriate output based on level
    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      console.error(formattedLog);
    } else if (level === LogLevel.WARN) {
      console.warn(formattedLog);
    } else {
      console.log(formattedLog);
    }

    // In production, could send to external logging service here
    // e.g., Sentry, Datadog, CloudWatch, etc.
    if (process.env.NODE_ENV === 'production' && level === LogLevel.FATAL) {
      this.sendToMonitoring(entry);
    }
  }

  /**
   * Send critical logs to monitoring service in production
   * Replace with your actual monitoring service integration
   */
  private sendToMonitoring(entry: LogEntry): void {
    // TODO: Integrate with your monitoring service
    // Example: Sentry.captureException(), CloudWatch.putMetricData(), etc.
  }

  /**
   * Create child logger with additional context
   */
  createChild(context: LogContext): Logger {
    const logger = new Logger({ ...this.context, ...context });
    logger.minLevel = this.minLevel;
    return logger;
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Warn level logging
   */
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Error level logging with error object
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Fatal level logging - indicates app should shut down
   */
  fatal(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  /**
   * Log with custom prefix (e.g., for API routes)
   */
  prefixed(prefix: string): PrefixedLogger {
    return new PrefixedLogger(this, prefix);
  }
}

/**
 * Helper class for consistent prefixed logging
 */
class PrefixedLogger {
  constructor(private logger: Logger, private prefix: string) { }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(`[${this.prefix}] ${message}`, context);
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(`[${this.prefix}] ${message}`, context);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(`[${this.prefix}] ${message}`, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logger.error(`[${this.prefix}] ${message}`, error, context);
  }

  fatal(message: string, error?: Error, context?: LogContext): void {
    this.logger.fatal(`[${this.prefix}] ${message}`, error, context);
  }
}

// Export singleton instance
export const logger = new Logger({ service: 'deenakdiamano' });

export default logger;

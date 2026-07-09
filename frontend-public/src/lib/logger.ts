/**
 * Structured logging for Monastery360.
 *
 * - In development: logs to console with coloured prefixes.
 * - In production: logs to console and optionally to Sentry (if available).
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('Monasteries loaded', { count: data.length });
 *   logger.error('Failed to fetch monasteries', error, { monasteryId });
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerContext {
  [key: string]: unknown;
}

class Logger {
  private level: LogLevel;

  constructor() {
    this.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
  }

  private shouldLog(level: LogLevel): boolean {
    const order: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return order.indexOf(level) >= order.indexOf(this.level);
  }

  private format(level: LogLevel, message: string, context?: LoggerContext): string {
    const prefix = `[Monastery360:${level.toUpperCase()}]`;
    const ctx = context ? ` ${JSON.stringify(context)}` : '';
    return `${prefix} ${message}${ctx}`;
  }

  debug(message: string, context?: LoggerContext) {
    if (!this.shouldLog('debug')) return;
    // eslint-disable-next-line no-console
    console.debug(this.format('debug', message, context));
  }

  info(message: string, context?: LoggerContext) {
    if (!this.shouldLog('info')) return;
    // eslint-disable-next-line no-console
    console.info(this.format('info', message, context));
  }

  warn(message: string, context?: LoggerContext) {
    if (!this.shouldLog('warn')) return;
    console.warn(this.format('warn', message, context));
  }

  error(message: string, error?: Error, context?: LoggerContext) {
    if (!this.shouldLog('error')) return;

    console.error(this.format('error', message, context));

    // Send to Sentry if available (client-side)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error || new Error(message), {
        extra: context,
      });
    }
  }
}

export const logger = new Logger();

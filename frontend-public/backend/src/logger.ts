import pino from 'pino';

// ─── Logger Configuration (B-105a) ──────────────────────────────────────────
// In development: pretty-printed, colorized logs for readability
// In production: structured JSON logs for machine parsing and log aggregation

const isDev = process.env.NODE_ENV !== 'production';
const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

export const logger = pino({
  level: process.env.LOG_LEVEL || (isTest ? 'silent' : isDev ? 'debug' : 'info'),
  // pino-pretty only in development for readability (not in tests)
  transport: isDev && !isTest
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
    : undefined,
  // Base context attached to every log line
  base: {
    service: 'monastery360-backend',
  },
  // Redact sensitive fields from logs
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token', 'secret'],
    remove: true,
  },
});

export type Logger = typeof logger;

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Express } from 'express';

// ─── Helmet Configuration ────────────────────────────────────────────────────

/**
 * Configure helmet security headers
 * Adds various HTTP headers to secure the app
 */
export function configureHelmet(app: Express): void {
  app.use(helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    // Cross-Origin Embedder Policy
    crossOriginEmbedderPolicy: false,
    // Cross-Origin Resource Policy
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    // DNS Prefetch Control
    dnsPrefetchControl: { allow: true },
    // Frame Options
    frameguard: { action: 'deny' },
    // HSTS
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    // IE No Open
    ieNoOpen: true,
    // No Sniff
    noSniff: true,
    // Referrer Policy
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    // XSS Filter
    xssFilter: true,
  }));
}

// ─── Rate Limiting Configuration ─────────────────────────────────────────────

/**
 * General rate limiter for all API routes
 * Limits each IP to 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    data: null,
    message: 'Too many requests from this IP, please try again later',
    statusCode: 429,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Stricter rate limiter for write operations (POST, PUT, DELETE)
 * Limits each IP to 30 requests per 15 minutes
 */
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 write requests per windowMs
  message: {
    data: null,
    message: 'Too many write requests from this IP, please try again later',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for authentication endpoints
 * Limits each IP to 10 requests per 15 minutes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    data: null,
    message: 'Too many authentication attempts, please try again later',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Upload rate limiter for file uploads
 * Limits each IP to 20 uploads per hour
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 uploads per hour
  message: {
    data: null,
    message: 'Too many file uploads, please try again later',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Security Middleware Setup ───────────────────────────────────────────────

/**
 * Apply all security middleware to the Express app
 */
export function configureSecurity(app: Express): void {
  // Apply helmet
  configureHelmet(app);
  
  // Apply general rate limiting to all routes
  app.use(generalLimiter);
}

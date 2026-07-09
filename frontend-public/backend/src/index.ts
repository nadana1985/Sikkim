import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import pinoHttp from 'pino-http';
import { configureSecurity, writeLimiter, uploadLimiter } from './middleware/security';
import { logger } from './logger';
import db from './database';
import monasteriesRouter from './routes/monasteries';
import festivalsRouter from './routes/festivals';
import toursRouter from './routes/tours';
import mediaRouter from './routes/media';
import healthRouter from './routes/health';
import statsRouter from './routes/stats';
import docsRouter from './routes/docs';
import { metricsMiddleware } from './middleware/metricsMiddleware';
import { register as metricsRegister } from './metrics';

// ─── CORS Configuration (B-104d) ────────────────────────────────────────────
// In production, set CORS_ORIGINS=https://monastery360.com,https://www.monastery360.com
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

// ─── Security Middleware (B-104) ─────────────────────────────────────────────
configureSecurity(app);

// ─── Request Logging (B-104e, B-105b) ──────────────────────────────────────
// pino-http provides structured request logging with request IDs
const httpLogger = pinoHttp({
  logger,
  // Accept request IDs from clients or generate new ones
  genReqId: (req) => (req.headers['x-request-id'] as string) || crypto.randomUUID(),
  // Don't log health checks to reduce noise
  autoLogging: {
    ignore: (req) => req.url === '/health',
  },
});
app.use(httpLogger);

// Middleware
// ─── Prometheus Metrics (B-109) ────────────────────────────────────────────
app.use(metricsMiddleware);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, SSR)
    if (!origin) return callback(null, true);

    // Allow any localhost port in development
    if (process.env.NODE_ENV !== 'production' && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Check explicit origins from CORS_ORIGINS env var
    if (corsOrigins.includes(origin)) return callback(null, true);

    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
}));
app.use(express.json());

// ─── Static File Serving (B-103a, B-103d) ────────────────────────────────────
// Serve uploaded images and thumbnails
const IMAGES_DIR = path.join(__dirname, '..', 'data', 'images');
app.use('/images', express.static(IMAGES_DIR, {
  maxAge: '7d',
  etag: true,
}));

// ─── Rate Limiters (B-104: must be applied BEFORE routes) ────────────────────
app.use('/monasteries', writeLimiter);
app.use('/festivals', writeLimiter);
app.use('/tours', writeLimiter);
app.use('/media/upload', uploadLimiter);

// ─── Routes ─────────────────────────────────────────────────────────────────
// ─── Metrics Endpoint (B-109) ──────────────────────────────────────────────
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', metricsRegister.contentType);
  res.end(await metricsRegister.metrics());
});

app.use('/health', healthRouter);
app.use('/stats', statsRouter);
app.use('/docs', docsRouter);
app.use('/monasteries', monasteriesRouter);
app.use('/festivals', festivalsRouter);
app.use('/tours', toursRouter);
app.use('/media', mediaRouter);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    data: null,
    message: 'Endpoint not found',
    statusCode: 404,
  });
});

// ─── Global Error Handler (B-107e: no stack traces in production) ─────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err }, 'Unhandled server error');
  // Don't leak stack traces in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : `Internal server error: ${err.message}`;
  res.status(500).json({
    data: null,
    message,
    statusCode: 500,
  });
});

// ─── Graceful Shutdown (B-105c) ─────────────────────────────────────────────
const server = http.createServer(app);

function shutdown(signal: string): void {
  logger.info({ signal }, 'Received shutdown signal. Closing server...');

  server.close((err) => {
    if (err) {
      logger.error({ err }, 'Error during server close');
      process.exit(1);
    }

    // Close database connection
    try {
      db.close();
      logger.info('Database connection closed');
    } catch {
      // Database may already be closed
    }

    logger.info('Server closed gracefully');
    process.exit(0);
  });

  // Force shutdown after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

server.on('error', (err: NodeJS.ErrnoException) => {
  logger.fatal({ err }, 'Server failed to start');
  process.exit(1);
});

server.listen(PORT, () => {
  logger.info({ port: PORT }, '🏯 Monastery360 Backend API started');
  logger.info({ url: `http://localhost:${PORT}/health` }, 'Health check endpoint');
  logger.info({ url: `http://localhost:${PORT}/images/` }, 'Static images endpoint');

  // Auto-seed database if empty
  try {
    const checkEmpty = db.prepare("SELECT count(*) as count FROM monasteries").get() as { count: number };
    if (checkEmpty && checkEmpty.count === 0) {
      logger.info('Database is empty. Seeding in the background...');
      const { exec } = require('child_process');
      const seedPath = path.join(__dirname, 'seed.js');
      exec(`node "${seedPath}"`, (error: any, stdout: string, stderr: string) => {
        if (error) {
          logger.error({ err: error, stderr }, 'Failed to auto-seed database');
        } else {
          logger.info('Database auto-seeded successfully');
        }
      });
    }
  } catch (err) {
    logger.error({ err }, 'Error checking database count for auto-seeding');
  }
});

export default app;

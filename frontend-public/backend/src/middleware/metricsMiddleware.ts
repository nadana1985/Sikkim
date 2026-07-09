/**
 * Metrics Middleware (B-109)
 *
 * Express middleware that records HTTP request metrics for Prometheus:
 * - Request duration (histogram)
 * - Request count (counter)
 * - Request/response size (histograms)
 * - Active connections (gauge)
 */

import { Request, Response, NextFunction } from 'express';
import {
  httpRequestCounter,
  httpRequestDuration,
  httpRequestSize,
  httpResponseSize,
  activeConnections,
  normalizeRoute,
} from '../metrics';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Track active connections
  activeConnections.inc();

  const start = process.hrtime.bigint();

  // Capture response size from Content-Length header
  const contentLengthHeader = req.headers['content-length'];
  if (contentLengthHeader) {
    const size = parseInt(contentLengthHeader, 10);
    if (!isNaN(size)) {
      httpRequestSize.observe({ method: req.method, route: normalizeRoute(req.path) }, size);
    }
  }

  // Use 'close' instead of 'finish' — 'close' always fires even on client disconnect,
  // preventing activeConnections gauge leaks.
  res.on('close', () => {
    const durationNs = Number(process.hrtime.bigint() - start);
    const durationSeconds = durationNs / 1e9;

    const route = normalizeRoute(req.path);
    const method = req.method;
    const status = String(res.statusCode);

    // Record metrics
    httpRequestCounter.inc({ method, route, status });
    httpRequestDuration.observe({ method, route, status }, durationSeconds);

    // Record response size
    const respContentLength = res.getHeader('content-length');
    if (respContentLength) {
      const size = parseInt(String(respContentLength), 10);
      if (!isNaN(size)) {
        httpResponseSize.observe({ method, route, status }, size);
      }
    }

    // Decrement active connections
    activeConnections.dec();
  });

  next();
}

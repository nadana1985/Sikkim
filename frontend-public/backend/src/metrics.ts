/**
 * Prometheus Metrics (B-109)
 *
 * Centralized metrics module using prom-client.
 * - Default metrics: CPU, memory, event loop, GC
 * - Custom metrics: HTTP request counter, duration histogram
 * - Exposes a /metrics endpoint for Prometheus scraping
 */

import client from 'prom-client';

// ─── Registry ────────────────────────────────────────────────────────────────
export const register = new client.Registry();

// ─── Default Metrics (CPU, memory, event loop, GC) ───────────────────────────
client.collectDefaultMetrics({
  register,
  prefix: 'node_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
});

// ─── HTTP Request Counter ────────────────────────────────────────────────────
export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

// ─── HTTP Request Duration Histogram ─────────────────────────────────────────
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// ─── Active Connections Gauge ────────────────────────────────────────────────
export const activeConnections = new client.Gauge({
  name: 'http_active_connections',
  help: 'Number of active HTTP connections',
  registers: [register],
});

// ─── Request Size Histogram ──────────────────────────────────────────────────
export const httpRequestSize = new client.Histogram({
  name: 'http_request_size_bytes',
  help: 'Size of incoming HTTP requests in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 10000, 100000, 1000000],
  registers: [register],
});

// ─── Response Size Histogram ─────────────────────────────────────────────────
export const httpResponseSize = new client.Histogram({
  name: 'http_response_size_bytes',
  help: 'Size of outgoing HTTP responses in bytes',
  labelNames: ['method', 'route', 'status'],
  buckets: [100, 1000, 10000, 100000, 1000000],
  registers: [register],
});



// ─── Database Query Counter ──────────────────────────────────────────────────
export const dbQueryCounter = new client.Counter({
  name: 'db_queries_total',
  help: 'Total number of database queries executed',
  labelNames: ['operation', 'table'],
  registers: [register],
});

// ─── Database Query Duration Histogram ───────────────────────────────────────
export const dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
  registers: [register],
});

// ─── Cache Operations Counter ────────────────────────────────────────────────
export const cacheOperationCounter = new client.Counter({
  name: 'cache_operations_total',
  help: 'Total number of cache operations',
  labelNames: ['operation', 'cache_name'],
  registers: [register],
});

// ─── Cache Hits/Misses Counters ──────────────────────────────────────────────
export const cacheHitCounter = new client.Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_name'],
  registers: [register],
});

export const cacheMissCounter = new client.Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_name'],
  registers: [register],
});

// ─── Cache Size Gauge ────────────────────────────────────────────────────────
export const cacheSizeGauge = new client.Gauge({
  name: 'cache_entries_total',
  help: 'Number of entries in cache',
  labelNames: ['cache_name'],
  registers: [register],
});

// ─── Helper: Normalize route for metrics (avoid high-cardinality labels) ─────
export function normalizeRoute(path: string): string {
  // Replace IDs and numeric segments with placeholders to keep label cardinality low
  return path
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
    .replace(/\/\d+/g, '/:id')
    .replace(/\/m_\d+_[a-z0-9]+/g, '/:id')
    .replace(/\/f_\d+_[a-z0-9]+/g, '/:id')
    .replace(/\/tour_\d+_[a-z0-9]+/g, '/:id')
    .replace(/\/media_\d+_[a-z0-9]+/g, '/:id')
    .replace(/\/[a-z]+-\d+$/gi, '/:id');
}

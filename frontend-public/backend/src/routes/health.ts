import { Router } from 'express';
import db from '../database';

const router = Router();

/**
 * GET /health — Health check with database connectivity
 *
 * Returns:
 * - status: 'ok' | 'degraded' | 'error'
 * - timestamp: ISO string
 * - uptime: process uptime in seconds
 * - database: 'connected' | 'disconnected'
 * - version: from package.json
 */

interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  database: 'connected' | 'disconnected';
  version: string;
}

router.get('/', (_req, res) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'disconnected',
    version: '1.0.0',
  };

  // Check database connectivity
  try {
    const result = db.prepare('SELECT 1 as ok').get() as { ok: number };
    if (result.ok === 1) {
      response.database = 'connected';
    }
  } catch {
    response.database = 'disconnected';
    response.status = 'degraded';
  }

  // Check if database tables exist (optional deeper check)
  try {
    db.prepare('SELECT COUNT(*) FROM monasteries').get();
    db.prepare('SELECT COUNT(*) FROM festivals').get();
    db.prepare('SELECT COUNT(*) FROM tours').get();
    db.prepare('SELECT COUNT(*) FROM media').get();
  } catch {
    response.database = 'disconnected';
    response.status = 'error';
  }

  const statusCode = response.status === 'ok' ? 200 :
                     response.status === 'degraded' ? 200 : 503;

  res.status(statusCode).json({
    data: response,
    message: response.status === 'ok' ? 'Service is healthy' :
             response.status === 'degraded' ? 'Service is degraded' :
             'Service is unhealthy',
    statusCode,
  });
});

export default router;

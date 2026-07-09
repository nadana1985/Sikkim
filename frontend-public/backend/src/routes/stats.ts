import { Router } from 'express';
import db from '../database';

const router = Router();

interface StatsResponse {
  monasteries: number;
  festivals: number;
  tours: number;
}

/**
 * GET /stats — Lightweight counts endpoint.
 * Returns only aggregate counts (no full records) for fast dashboard/hero rendering.
 * No pagination loops, no record hydration — just SQL COUNT queries.
 */
router.get('/', (_req, res) => {
  try {
    const monasteryCount = (
      db.prepare('SELECT COUNT(*) as count FROM monasteries').get() as { count: number }
    ).count;

    const festivalCount = (
      db.prepare('SELECT COUNT(*) as count FROM festivals').get() as { count: number }
    ).count;

    const tourCount = (
      db.prepare('SELECT COUNT(*) as count FROM tours').get() as { count: number }
    ).count;

    const response: { data: StatsResponse; message: string; statusCode: number } = {
      data: { monasteries: monasteryCount, festivals: festivalCount, tours: tourCount },
      message: 'Stats retrieved successfully',
      statusCode: 200,
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({
      data: null,
      message: 'Failed to retrieve stats',
      statusCode: 500,
    });
  }
});

export default router;

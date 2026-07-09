import { Router } from 'express';
import db from '../database';
import { transformMonastery, transformTour } from '../utils/transform';
import { tourCache } from '../utils/cache';
import type { TourRow, Tour, MonasteryRow, Monastery, ApiResponse, PaginatedResponse } from '../types';

const router = Router();

// GET /tours/monastery/:monasteryId — tours by monastery
router.get('/monastery/:monasteryId', (req, res) => {
  const { monasteryId } = req.params;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;

  const cacheKey = `byMonastery:${monasteryId}:${page}:${limit}`;
  const cached = tourCache.get<PaginatedResponse<Tour>>(cacheKey, 'tours');
  if (cached) {
    res.json(cached);
    return;
  }

  const totalRow = db.prepare('SELECT COUNT(*) as count FROM tours WHERE monasteryId = ?').get(monasteryId) as { count: number };
  const total = totalRow.count;
  const totalPages = Math.ceil(total / limit);

  const rows = db.prepare(
    'SELECT * FROM tours WHERE monasteryId = ? ORDER BY name ASC LIMIT ? OFFSET ?'
  ).all(monasteryId, limit, offset) as TourRow[];

  const response: PaginatedResponse<Tour> = {
    data: rows.map((row) => transformTour(row)),
    pagination: { page, limit, total, totalPages },
    message: 'Tours retrieved successfully',
    statusCode: 200,
  };

  tourCache.set(cacheKey, response, undefined, 'tours');
  res.json(response);
});

// GET /tours — paginated list
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;
  const includeMonastery = req.query.include === 'monastery';

  const cacheKey = `list:${page}:${limit}:${includeMonastery ? 'm' : ''}`;
  const cached = tourCache.get<PaginatedResponse<Tour>>(cacheKey, 'tours');
  if (cached) {
    res.json(cached);
    return;
  }

  const totalRow = db.prepare('SELECT COUNT(*) as count FROM tours').get() as { count: number };
  const total = totalRow.count;
  const totalPages = Math.ceil(total / limit);

  const rows = db.prepare('SELECT * FROM tours ORDER BY name ASC LIMIT ? OFFSET ?').all(limit, offset) as TourRow[];

  // B-108c: Batch monastery lookups to avoid N+1 queries
  let data: Tour[];
  if (includeMonastery && rows.length > 0) {
    const monasteryIds = [...new Set(rows.map((r) => r.monasteryId))];
    const placeholders = monasteryIds.map(() => '?').join(',');
    const monasteryRows = db.prepare(
      `SELECT * FROM monasteries WHERE id IN (${placeholders})`
    ).all(...monasteryIds) as MonasteryRow[];

    const monasteryMap = new Map<string, Monastery>();
    for (const mRow of monasteryRows) {
      monasteryMap.set(mRow.id, transformMonastery(mRow));
    }

    data = rows.map((row) => transformTour(row, monasteryMap.get(row.monasteryId)));
  } else {
    data = rows.map((row) => transformTour(row));
  }

  const response: PaginatedResponse<Tour> = {
    data,
    pagination: { page, limit, total, totalPages },
    message: 'Tours retrieved successfully',
    statusCode: 200,
  };

  tourCache.set(cacheKey, response, undefined, 'tours');
  res.json(response);
});

// GET /tours/:id — single tour
router.get('/:id', (req, res) => {
  const cacheKey = `detail:${req.params.id}`;
  const cached = tourCache.get<ApiResponse<Tour>>(cacheKey, 'tours');
  if (cached) {
    res.json(cached);
    return;
  }

  const row = db.prepare('SELECT * FROM tours WHERE id = ?').get(req.params.id) as TourRow | undefined;

  if (!row) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Tour not found',
      statusCode: 404,
    };
    res.status(404).json(response);
    return;
  }

  const mRow = db.prepare('SELECT * FROM monasteries WHERE id = ?').get(row.monasteryId) as MonasteryRow | undefined;
  const monastery = mRow ? transformMonastery(mRow) : undefined;

  const response: ApiResponse<Tour> = {
    data: transformTour(row, monastery),
    message: 'Tour retrieved successfully',
    statusCode: 200,
  };

  tourCache.set(cacheKey, response, undefined, 'tours');
  res.json(response);
});

// POST /tours — create a new tour
router.post('/', (req, res) => {
  const { id, name, description, panoramaUrl, monasteryId, images } = req.body;

  if (!name || !description || !monasteryId) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Missing required fields: name, description, monasteryId',
      statusCode: 400,
    };
    res.status(400).json(response);
    return;
  }

  const monastery = db.prepare('SELECT id FROM monasteries WHERE id = ?').get(monasteryId);
  if (!monastery) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Referenced monastery not found',
      statusCode: 400,
    };
    res.status(400).json(response);
    return;
  }

  const now = new Date().toISOString();
  const tourId = id || `tour_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const existing = db.prepare('SELECT id FROM tours WHERE id = ?').get(tourId);
  if (existing) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Tour with this ID already exists',
      statusCode: 409,
    };
    res.status(409).json(response);
    return;
  }

  db.prepare(`
    INSERT INTO tours (id, name, description, panoramaUrl, monasteryId, images, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(tourId, name, description, panoramaUrl || null, monasteryId, JSON.stringify(images || []), now, now);

  const row = db.prepare('SELECT * FROM tours WHERE id = ?').get(tourId) as TourRow;

  // Invalidate caches
  tourCache.invalidatePrefix('list:', 'tours');
  tourCache.invalidatePrefix('byMonastery:', 'tours');

  const response: ApiResponse<Tour> = {
    data: transformTour(row),
    message: 'Tour created successfully',
    statusCode: 201,
  };

  res.status(201).json(response);
});

// PUT /tours/:id — update an existing tour
router.put('/:id', (req, res) => {
  const existingRow = db.prepare('SELECT * FROM tours WHERE id = ?').get(req.params.id) as TourRow | undefined;

  if (!existingRow) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Tour not found',
      statusCode: 404,
    };
    res.status(404).json(response);
    return;
  }

  const { name, description, panoramaUrl, monasteryId, images } = req.body;

  if (monasteryId) {
    const monastery = db.prepare('SELECT id FROM monasteries WHERE id = ?').get(monasteryId);
    if (!monastery) {
      const response: ApiResponse<null> = {
        data: null,
        message: 'Referenced monastery not found',
        statusCode: 400,
      };
      res.status(400).json(response);
      return;
    }
  }

  const now = new Date().toISOString();

  db.prepare(`
    UPDATE tours
    SET name = ?, description = ?, panoramaUrl = ?, monasteryId = ?, images = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    name ?? existingRow.name, description ?? existingRow.description,
    panoramaUrl !== undefined ? (panoramaUrl || null) : existingRow.panoramaUrl,
    monasteryId ?? existingRow.monasteryId,
    images !== undefined ? JSON.stringify(images) : existingRow.images,
    now, req.params.id,
  );

  const row = db.prepare('SELECT * FROM tours WHERE id = ?').get(req.params.id) as TourRow;

  // Invalidate caches
  tourCache.invalidatePrefix('list:', 'tours');
  tourCache.invalidatePrefix('byMonastery:', 'tours');
  tourCache.delete(`detail:${req.params.id}`, 'tours');

  const response: ApiResponse<Tour> = {
    data: transformTour(row),
    message: 'Tour updated successfully',
    statusCode: 200,
  };

  res.json(response);
});

// DELETE /tours/:id — delete a tour
router.delete('/:id', (req, res) => {
  const existingRow = db.prepare('SELECT id FROM tours WHERE id = ?').get(req.params.id);

  if (!existingRow) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Tour not found',
      statusCode: 404,
    };
    res.status(404).json(response);
    return;
  }

  db.prepare('DELETE FROM tours WHERE id = ?').run(req.params.id);

  // Invalidate caches
  tourCache.invalidatePrefix('list:', 'tours');
  tourCache.invalidatePrefix('byMonastery:', 'tours');
  tourCache.delete(`detail:${req.params.id}`, 'tours');

  const response: ApiResponse<null> = {
    data: null,
    message: 'Tour deleted successfully',
    statusCode: 200,
  };

  res.json(response);
});

export default router;

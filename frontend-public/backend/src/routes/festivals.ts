import { Router } from 'express';
import db from '../database';
import { transformMonastery, transformFestival, parseNumber } from '../utils/transform';
import { validateDateFormat, validateRequiredFields, sanitizeBody, sendValidationError } from '../middleware/validation';
import { festivalCache } from '../utils/cache';
import type { FestivalRow, Festival, MonasteryRow, Monastery, ApiResponse, PaginatedResponse } from '../types';

const router = Router();

// GET /festivals/upcoming — festivals with date >= today
router.get('/upcoming', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;
  const today = new Date().toISOString().split('T')[0];
  const includeMonastery = req.query.include === 'monastery';

  const cacheKey = `upcoming:${page}:${limit}:${includeMonastery ? 'm' : ''}`;
  const cached = festivalCache.get<PaginatedResponse<Festival>>(cacheKey, 'festivals');
  if (cached) {
    res.json(cached);
    return;
  }

  const totalRow = db.prepare(
    'SELECT COUNT(*) as count FROM festivals WHERE date >= ?'
  ).get(today) as { count: number };

  const total = totalRow.count;
  const totalPages = Math.ceil(total / limit);

  const rows = db.prepare(
    'SELECT * FROM festivals WHERE date >= ? ORDER BY date ASC LIMIT ? OFFSET ?'
  ).all(today, limit, offset) as FestivalRow[];

  // B-108c: Batch monastery lookups to avoid N+1 queries
  const data = batchTransformFestivals(rows, includeMonastery);

  const response: PaginatedResponse<Festival> = {
    data,
    pagination: { page, limit, total, totalPages },
    message: 'Upcoming festivals retrieved successfully',
    statusCode: 200,
  };

  festivalCache.set(cacheKey, response, undefined, 'festivals');
  res.json(response);
});

// GET /festivals/past — festivals with date < today
router.get('/past', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;
  const today = new Date().toISOString().split('T')[0];
  const includeMonastery = req.query.include === 'monastery';

  const cacheKey = `past:${page}:${limit}:${includeMonastery ? 'm' : ''}`;
  const cached = festivalCache.get<PaginatedResponse<Festival>>(cacheKey, 'festivals');
  if (cached) {
    res.json(cached);
    return;
  }

  const totalRow = db.prepare(
    'SELECT COUNT(*) as count FROM festivals WHERE date < ?'
  ).get(today) as { count: number };

  const total = totalRow.count;
  const totalPages = Math.ceil(total / limit);

  const rows = db.prepare(
    'SELECT * FROM festivals WHERE date < ? ORDER BY date DESC LIMIT ? OFFSET ?'
  ).all(today, limit, offset) as FestivalRow[];

  const data = batchTransformFestivals(rows, includeMonastery);

  const response: PaginatedResponse<Festival> = {
    data,
    pagination: { page, limit, total, totalPages },
    message: 'Past festivals retrieved successfully',
    statusCode: 200,
  };

  festivalCache.set(cacheKey, response, undefined, 'festivals');
  res.json(response);
});

// GET /festivals — paginated list with optional filtering/sorting
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;
  const includeMonastery = req.query.include === 'monastery';

  // Filtering params
  const q = (req.query.q as string || '').trim();
  const sort = (req.query.sort as string) || 'date';
  const dir = (req.query.dir as string || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const time = (req.query.time as string) || 'all';

  // Build cache key including all filter params
  const cacheKey = `list:${page}:${limit}:${q}:${sort}:${dir}:${time}:${includeMonastery ? 'm' : ''}`;
  const cached = festivalCache.get<PaginatedResponse<Festival>>(cacheKey, 'festivals');
  if (cached) {
    res.json(cached);
    return;
  }

  // Build WHERE clauses dynamically
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (q) {
    const searchTerm = `%${q}%`;
    // Also search by monastery name when include=monastery
    if (includeMonastery) {
      conditions.push('(f.name LIKE ? OR f.description LIKE ? OR EXISTS (SELECT 1 FROM monasteries m WHERE m.id = f.monasteryId AND m.name LIKE ?))');
      params.push(searchTerm, searchTerm, searchTerm);
    } else {
      conditions.push('(f.name LIKE ? OR f.description LIKE ?)');
      params.push(searchTerm, searchTerm);
    }
  }

  if (time === 'upcoming') {
    const today = new Date().toISOString().split('T')[0];
    conditions.push('f.date >= ?');
    params.push(today);
  } else if (time === 'past') {
    const today = new Date().toISOString().split('T')[0];
    conditions.push('f.date < ?');
    params.push(today);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate sort column (allowlist to prevent SQL injection)
  const allowedSortColumns: Record<string, string> = {
    date: 'f.date',
    name: 'f.name',
  };
  const sortColumn = allowedSortColumns[sort] || 'f.date';

  const countSql = `SELECT COUNT(*) as count FROM festivals f ${whereClause}`;
  const totalRow = db.prepare(countSql).get(...params) as { count: number };
  const total = totalRow.count;
  const totalPages = Math.ceil(total / limit);

  const dataSql = `SELECT f.* FROM festivals f ${whereClause} ORDER BY ${sortColumn} ${dir} LIMIT ? OFFSET ?`;
  const rows = db.prepare(dataSql).all(...params, limit, offset) as FestivalRow[];

  const data = batchTransformFestivals(rows, includeMonastery);

  const response: PaginatedResponse<Festival> = {
    data,
    pagination: { page, limit, total, totalPages },
    message: 'Festivals retrieved successfully',
    statusCode: 200,
  };

  festivalCache.set(cacheKey, response, undefined, 'festivals');
  res.json(response);
});

// GET /festivals/:id — single festival
router.get('/:id', (req, res) => {
  const cacheKey = `detail:${req.params.id}`;
  const cached = festivalCache.get<ApiResponse<Festival>>(cacheKey, 'festivals');
  if (cached) {
    res.json(cached);
    return;
  }

  const row = db.prepare('SELECT * FROM festivals WHERE id = ?').get(req.params.id) as FestivalRow | undefined;

  if (!row) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Festival not found',
      statusCode: 404,
    };
    res.status(404).json(response);
    return;
  }

  const mRow = db.prepare('SELECT * FROM monasteries WHERE id = ?').get(row.monasteryId) as MonasteryRow | undefined;
  const monastery = mRow ? transformMonastery(mRow) : undefined;

  const response: ApiResponse<Festival> = {
    data: transformFestival(row, monastery),
    message: 'Festival retrieved successfully',
    statusCode: 200,
  };

  festivalCache.set(cacheKey, response, undefined, 'festivals');
  res.json(response);
});

// POST /festivals — create a new festival
router.post('/', (req, res) => {
  const body = sanitizeBody(req.body);
  const { id, name, description, date, significance, monasteryId, images } = body;
  const duration = parseNumber(body.duration);

  const reqError = validateRequiredFields(body, ['name', 'description', 'date', 'significance', 'monasteryId']);
  if (reqError) { sendValidationError(res, reqError); return; }
  if (duration == null) { sendValidationError(res, 'duration must be a valid number'); return; }
  const dateError = validateDateFormat(date);
  if (dateError) { sendValidationError(res, dateError); return; }

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
  const festivalId = id || `f_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const existing = db.prepare('SELECT id FROM festivals WHERE id = ?').get(festivalId);
  if (existing) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Festival with this ID already exists',
      statusCode: 409,
    };
    res.status(409).json(response);
    return;
  }

  db.prepare(`
    INSERT INTO festivals (id, name, description, date, duration, significance, monasteryId, images, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(festivalId, name, description, date, duration, significance, monasteryId, JSON.stringify(images || []), now, now);

  const row = db.prepare('SELECT * FROM festivals WHERE id = ?').get(festivalId) as FestivalRow;

  // Invalidate list caches
  festivalCache.invalidatePrefix('list:', 'festivals');
  festivalCache.invalidatePrefix('upcoming:', 'festivals');
  festivalCache.invalidatePrefix('past:', 'festivals');

  const response: ApiResponse<Festival> = {
    data: transformFestival(row),
    message: 'Festival created successfully',
    statusCode: 201,
  };

  res.status(201).json(response);
});

// PUT /festivals/:id — update an existing festival
router.put('/:id', (req, res) => {
  const existingRow = db.prepare('SELECT * FROM festivals WHERE id = ?').get(req.params.id) as FestivalRow | undefined;

  if (!existingRow) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Festival not found',
      statusCode: 404,
    };
    res.status(404).json(response);
    return;
  }

  const body = sanitizeBody(req.body);
  const { name, description, date, significance, monasteryId, images } = body;
  const duration = body.duration !== undefined ? parseNumber(body.duration) : existingRow.duration;

  if (req.body.duration !== undefined && duration == null) {
    sendValidationError(res, 'Invalid numeric value for duration');
    return;
  }
  if (date !== undefined) {
    const dateErr = validateDateFormat(date);
    if (dateErr) { sendValidationError(res, dateErr); return; }
  }

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
    UPDATE festivals
    SET name = ?, description = ?, date = ?, duration = ?, significance = ?, monasteryId = ?, images = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    name ?? existingRow.name, description ?? existingRow.description,
    date ?? existingRow.date, duration,
    significance ?? existingRow.significance, monasteryId ?? existingRow.monasteryId,
    images !== undefined ? JSON.stringify(images) : existingRow.images,
    now, req.params.id,
  );

  const row = db.prepare('SELECT * FROM festivals WHERE id = ?').get(req.params.id) as FestivalRow;

  // Invalidate caches
  festivalCache.invalidatePrefix('list:', 'festivals');
  festivalCache.invalidatePrefix('upcoming:', 'festivals');
  festivalCache.invalidatePrefix('past:', 'festivals');
  festivalCache.delete(`detail:${req.params.id}`, 'festivals');

  const response: ApiResponse<Festival> = {
    data: transformFestival(row),
    message: 'Festival updated successfully',
    statusCode: 200,
  };

  res.json(response);
});

// DELETE /festivals/:id — delete a festival
router.delete('/:id', (req, res) => {
  const existingRow = db.prepare('SELECT id FROM festivals WHERE id = ?').get(req.params.id);

  if (!existingRow) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Festival not found',
      statusCode: 404,
    };
    res.status(404).json(response);
    return;
  }

  db.prepare('DELETE FROM festivals WHERE id = ?').run(req.params.id);

  // Invalidate caches
  festivalCache.invalidatePrefix('list:', 'festivals');
  festivalCache.invalidatePrefix('upcoming:', 'festivals');
  festivalCache.invalidatePrefix('past:', 'festivals');
  festivalCache.delete(`detail:${req.params.id}`, 'festivals');

  const response: ApiResponse<null> = {
    data: null,
    message: 'Festival deleted successfully',
    statusCode: 200,
  };

  res.json(response);
});

// ─── Helper: Batch monastery lookup to avoid N+1 queries ─────────────────────

function batchTransformFestivals(rows: FestivalRow[], includeMonastery: boolean): Festival[] {
  if (!includeMonastery) {
    return rows.map((row) => transformFestival(row));
  }

  // Collect unique monastery IDs from all festival rows
  const monasteryIds = [...new Set(rows.map((r) => r.monasteryId))];

  // Single query to fetch all needed monasteries
  if (monasteryIds.length === 0) {
    return rows.map((row) => transformFestival(row));
  }

  const placeholders = monasteryIds.map(() => '?').join(',');
  const monasteryRows = db.prepare(
    `SELECT * FROM monasteries WHERE id IN (${placeholders})`
  ).all(...monasteryIds) as MonasteryRow[];

  // Build a lookup map
  const monasteryMap = new Map<string, Monastery>();
  for (const mRow of monasteryRows) {
    monasteryMap.set(mRow.id, transformMonastery(mRow));
  }

  return rows.map((row) => transformFestival(row, monasteryMap.get(row.monasteryId)));
}

export default router;

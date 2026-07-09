import { Router } from 'express';
import db from '../database';
import { transformMonastery, parseNumber } from '../utils/transform';
import { validateCoordinates, validateRequiredFields, sanitizeBody, sendValidationError } from '../middleware/validation';
import { monasteryCache } from '../utils/cache';
import type { MonasteryRow, Monastery, ApiResponse, PaginatedResponse } from '../types';

const router = Router();

// GET /monasteries/search?q= — full-text search on name/description/address
router.get('/search', (req, res) => {
  const query = (req.query.q as string || '').trim();

  if (!query) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Missing required query parameter: q',
      statusCode: 400,
    };
    res.status(400).json(response);
    return;
  }

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;

  // Case-insensitive LIKE search across name, description, and address
  const searchTerm = `%${query}%`;

  const totalRow = db.prepare(
    `SELECT COUNT(*) as count FROM monasteries
     WHERE name LIKE ? OR description LIKE ? OR address LIKE ?`
  ).get(searchTerm, searchTerm, searchTerm) as { count: number };

  const total = totalRow.count;
  const totalPages = Math.ceil(total / limit);

  const rows = db.prepare(
    `SELECT * FROM monasteries
     WHERE name LIKE ? OR description LIKE ? OR address LIKE ?
     ORDER BY name ASC LIMIT ? OFFSET ?`
  ).all(searchTerm, searchTerm, searchTerm, limit, offset) as MonasteryRow[];

  const response: PaginatedResponse<Monastery> = {
    data: rows.map(transformMonastery),
    pagination: { page, limit, total, totalPages },
    message: `Found ${total} monasteries matching "${query}"`,
    statusCode: 200,
  };

  res.json(response);
});

// GET /monasteries — paginated list with optional filtering/sorting
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;

  // Filtering params
  const q = (req.query.q as string || '').trim();
  const sort = (req.query.sort as string) || 'name';
  const dir = (req.query.dir as string || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const tourFilter = req.query.tour as string || 'all';
  const yearFrom = parseInt(req.query.yearFrom as string) || null;
  const yearTo = parseInt(req.query.yearTo as string) || null;
  // Build cache key including all filter params
  const cacheKey = `list:${page}:${limit}:${q}:${sort}:${dir}:${tourFilter}:${yearFrom}:${yearTo}`;
  const cached = monasteryCache.get<PaginatedResponse<Monastery>>(cacheKey, 'monasteries');
  if (cached) {
    res.json(cached);
    return;
  }

  // Build WHERE clauses dynamically
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (q) {
    const searchTerm = `%${q}%`;
    conditions.push('(name LIKE ? OR description LIKE ? OR address LIKE ?)');
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (tourFilter === 'with-tour') {
    conditions.push('virtualTourId IS NOT NULL');
  } else if (tourFilter === 'without-tour') {
    conditions.push('virtualTourId IS NULL');
  }

  if (yearFrom != null) {
    conditions.push('foundedYear >= ?');
    params.push(yearFrom);
  }
  if (yearTo != null) {
    conditions.push('foundedYear <= ?');
    params.push(yearTo);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate sort column (allowlist to prevent SQL injection)
  const allowedSortColumns: Record<string, string> = {
    name: 'name',
    foundedYear: 'foundedYear',
    date: 'createdAt',
  };
  const sortColumn = allowedSortColumns[sort] || 'name';

  const countSql = `SELECT COUNT(*) as count FROM monasteries ${whereClause}`;
  const totalRow = db.prepare(countSql).get(...params) as { count: number };
  const total = totalRow.count;
  const totalPages = Math.ceil(total / limit);

  const dataSql = `SELECT * FROM monasteries ${whereClause} ORDER BY ${sortColumn} ${dir} LIMIT ? OFFSET ?`;
  const rows = db.prepare(dataSql).all(...params, limit, offset) as MonasteryRow[];

  const data = rows.map(transformMonastery);

  const response: PaginatedResponse<Monastery> = {
    data,
    pagination: { page, limit, total, totalPages },
    message: 'Monasteries retrieved successfully',
    statusCode: 200,
  };

  monasteryCache.set(cacheKey, response, undefined, 'monasteries');
  res.json(response);
});

// GET /monasteries/:id — single monastery
router.get('/:id', (req, res) => {
  const cacheKey = `detail:${req.params.id}`;
  const cached = monasteryCache.get<ApiResponse<Monastery>>(cacheKey, 'monasteries');
  if (cached) {
    res.json(cached);
    return;
  }

  const row = db.prepare('SELECT * FROM monasteries WHERE id = ?').get(req.params.id) as MonasteryRow | undefined;

  if (!row) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Monastery not found',
      statusCode: 404,
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<Monastery> = {
    data: transformMonastery(row),
    message: 'Monastery retrieved successfully',
    statusCode: 200,
  };

  monasteryCache.set(cacheKey, response, undefined, 'monasteries');
  res.json(response);
});

// POST /monasteries — create a new monastery
router.post('/', (req, res) => {
  const body = sanitizeBody(req.body);
  const { id, name, description, history, architecture, rituals, images, virtualTourId } = body;
  const foundedYear = parseNumber(body.foundedYear);
  const latitude = parseNumber(body.latitude);
  const longitude = parseNumber(body.longitude);

  const reqError = validateRequiredFields(body, ['name', 'description', 'history', 'architecture', 'rituals', 'foundedYear', 'latitude', 'longitude', 'address']);
  if (reqError) { sendValidationError(res, reqError); return; }
  if (foundedYear == null || latitude == null || longitude == null) {
    sendValidationError(res, 'foundedYear, latitude, longitude must be valid numbers');
    return;
  }
  const coordError = validateCoordinates(latitude, longitude);
  if (coordError) { sendValidationError(res, coordError); return; }

  const now = new Date().toISOString();
  const monasteryId = id || `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const existing = db.prepare('SELECT id FROM monasteries WHERE id = ?').get(monasteryId);
  if (existing) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Monastery with this ID already exists',
      statusCode: 409,
    };
    res.status(409).json(response);
    return;
  }

  db.prepare(`
    INSERT INTO monasteries (id, name, description, history, architecture, rituals, foundedYear, latitude, longitude, address, images, virtualTourId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    monasteryId, name, description, history, architecture, rituals,
    foundedYear, latitude, longitude, req.body.address,
    JSON.stringify(images || []), virtualTourId || null, now, now,
  );

  const row = db.prepare('SELECT * FROM monasteries WHERE id = ?').get(monasteryId) as MonasteryRow;

  // Invalidate list caches
  monasteryCache.invalidatePrefix('list:', 'monasteries');

  const response: ApiResponse<Monastery> = {
    data: transformMonastery(row),
    message: 'Monastery created successfully',
    statusCode: 201,
  };

  res.status(201).json(response);
});

// PUT /monasteries/:id — update an existing monastery
router.put('/:id', (req, res) => {
  const existingRow = db.prepare('SELECT * FROM monasteries WHERE id = ?').get(req.params.id) as MonasteryRow | undefined;

  if (!existingRow) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Monastery not found',
      statusCode: 404,
    };
    res.status(404).json(response);
    return;
  }

  const body = sanitizeBody(req.body);
  const { name, description, history, architecture, rituals, images, virtualTourId } = body;
  const foundedYear = req.body.foundedYear !== undefined ? parseNumber(req.body.foundedYear) : existingRow.foundedYear;
  const latitude = req.body.latitude !== undefined ? parseNumber(req.body.latitude) : existingRow.latitude;
  const longitude = req.body.longitude !== undefined ? parseNumber(req.body.longitude) : existingRow.longitude;

  if (
    (req.body.foundedYear !== undefined && foundedYear == null) ||
    (req.body.latitude !== undefined && latitude == null) ||
    (req.body.longitude !== undefined && longitude == null)
  ) {
    sendValidationError(res, 'Invalid numeric value for foundedYear, latitude, or longitude');
    return;
  }
  if (body.latitude !== undefined || body.longitude !== undefined) {
    const coordErr = validateCoordinates(latitude, longitude);
    if (coordErr) { sendValidationError(res, coordErr); return; }
  }

  const now = new Date().toISOString();

  db.prepare(`
    UPDATE monasteries
    SET name = ?, description = ?, history = ?, architecture = ?, rituals = ?, foundedYear = ?,
        latitude = ?, longitude = ?, address = ?, images = ?, virtualTourId = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    name ?? existingRow.name, description ?? existingRow.description,
    history ?? existingRow.history, architecture ?? existingRow.architecture,
    rituals ?? existingRow.rituals, foundedYear, latitude, longitude,
    body.address ?? existingRow.address,
    images !== undefined ? JSON.stringify(images) : existingRow.images,
    virtualTourId !== undefined ? (virtualTourId || null) : existingRow.virtualTourId,
    now, req.params.id,
  );

  const row = db.prepare('SELECT * FROM monasteries WHERE id = ?').get(req.params.id) as MonasteryRow;

  // Invalidate caches for this monastery
  monasteryCache.invalidatePrefix('list:', 'monasteries');
  monasteryCache.delete(`detail:${req.params.id}`, 'monasteries');

  const response: ApiResponse<Monastery> = {
    data: transformMonastery(row),
    message: 'Monastery updated successfully',
    statusCode: 200,
  };

  res.json(response);
});

// DELETE /monasteries/:id — delete a monastery
router.delete('/:id', (req, res) => {
  const existingRow = db.prepare('SELECT id FROM monasteries WHERE id = ?').get(req.params.id);

  if (!existingRow) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Monastery not found',
      statusCode: 404,
    };
    res.status(404).json(response);
    return;
  }

  db.prepare('DELETE FROM monasteries WHERE id = ?').run(req.params.id);

  // Invalidate caches
  monasteryCache.invalidatePrefix('list:', 'monasteries');
  monasteryCache.delete(`detail:${req.params.id}`, 'monasteries');

  const response: ApiResponse<null> = {
    data: null,
    message: 'Monastery deleted successfully',
    statusCode: 200,
  };

  res.json(response);
});

export default router;

import { Router, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import db from '../database';
import { transformMedia } from '../utils/transform';
import { generateThumbnail, canGenerateThumbnail } from '../utils/thumbnail';
import { logger } from '../logger';
import {
  parsePagination,
  validateRequiredFields,
  sanitizeBody,
  sendValidationError,
} from '../middleware/validation';
import type { MediaRow, Media, ApiResponse, PaginatedResponse } from '../types';

const router = Router();

// ─── Multer Error Handler ────────────────────────────────────────────────────
// ─── Multer Error Handler (mounted before upload route) ──────────────────────
function handleMulterError(err: Error, _req: import('express').Request, res: import('express').Response, next: import('express').NextFunction): void {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ data: null, message: 'File too large. Maximum size is 50MB.', statusCode: 400 });
      return;
    }
    res.status(400).json({ data: null, message: `Upload error: ${err.message}`, statusCode: 400 });
    return;
  }
  next(err);
}

const VALID_FILE_TYPES = ['image', 'panoramic', 'video', 'audio'] as const;

// ─── Multer Configuration (B-103b) ───────────────────────────────────────────

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'data', 'images');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm',
      'audio/mpeg', 'audio/wav',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: images, videos, audio.`));
    }
  },
});

// ─── POST /media/upload — Upload a file (B-103b) ─────────────────────────────
// Multer error handler is mounted before the upload route
router.use('/upload', handleMulterError);

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    sendValidationError(res, 'No file uploaded. Use multipart/form-data with field "file".');
    return;
  }

  const { description, monasteryId, festivalId, fileType } = req.body;

  // Determine file type from MIME or explicit param
  const determinedType = fileType && VALID_FILE_TYPES.includes(fileType)
    ? fileType
    : req.file.mimetype.startsWith('image/') ? 'image'
    : req.file.mimetype.startsWith('video/') ? 'video'
    : req.file.mimetype.startsWith('audio/') ? 'audio'
    : 'image';

  // Validate referenced entities
  if (monasteryId) {
    const m = db.prepare('SELECT id FROM monasteries WHERE id = ?').get(monasteryId);
    if (!m) {
      sendValidationError(res, 'Referenced monastery not found');
      return;
    }
  }
  if (festivalId) {
    const f = db.prepare('SELECT id FROM festivals WHERE id = ?').get(festivalId);
    if (!f) {
      sendValidationError(res, 'Referenced festival not found');
      return;
    }
  }

  const now = new Date().toISOString();
  const mediaId = `media_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const filePath = `/images/${req.file.filename}`;

  // Generate thumbnail for image files (B-103c)
  let thumbnailPath: string | null = null;
  if (canGenerateThumbnail(req.file.mimetype)) {
    const fullPath = path.join(UPLOAD_DIR, req.file.filename);
    thumbnailPath = await generateThumbnail(fullPath, req.file.filename);
  }

  db.prepare(`
    INSERT INTO media (id, fileName, filePath, thumbnailPath, fileType, description, monasteryId, festivalId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(mediaId, req.file.originalname, filePath, thumbnailPath, determinedType, description || null, monasteryId || null, festivalId || null, now, now);

  const row = db.prepare('SELECT * FROM media WHERE id = ?').get(mediaId) as MediaRow;

  const response: ApiResponse<Media> = {
    data: transformMedia(row),
    message: 'File uploaded successfully',
    statusCode: 201,
  };

  res.status(201).json(response);
});

// ─── GET /media/monastery/:monasteryId — paginated media for a monastery ─────

router.get('/monastery/:monasteryId', (req, res) => {
  const { monasteryId } = req.params;
  const { page, limit, offset } = parsePagination(req.query);

  const totalRow = db.prepare('SELECT COUNT(*) as count FROM media WHERE monasteryId = ?').get(monasteryId) as { count: number };
  const total = totalRow.count;
  const totalPages = Math.ceil(total / limit);

  const rows = db.prepare('SELECT * FROM media WHERE monasteryId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?').all(monasteryId, limit, offset) as MediaRow[];

  const response: PaginatedResponse<Media> = {
    data: rows.map(transformMedia),
    pagination: { page, limit, total, totalPages },
    message: 'Media retrieved successfully',
    statusCode: 200,
  };

  res.json(response);
});

// ─── GET /media/festival/:festivalId — paginated media for a festival ────────

router.get('/festival/:festivalId', (req, res) => {
  const { festivalId } = req.params;
  const { page, limit, offset } = parsePagination(req.query);

  const totalRow = db.prepare('SELECT COUNT(*) as count FROM media WHERE festivalId = ?').get(festivalId) as { count: number };
  const total = totalRow.count;
  const totalPages = Math.ceil(total / limit);

  const rows = db.prepare(
    'SELECT * FROM media WHERE festivalId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?'
  ).all(festivalId, limit, offset) as MediaRow[];

  const response: PaginatedResponse<Media> = {
    data: rows.map(transformMedia),
    pagination: { page, limit, total, totalPages },
    message: 'Media retrieved successfully',
    statusCode: 200,
  };

  res.json(response);
});

// ─── GET /media/:id/thumbnail — serve thumbnail for a media item ────────────
// NOTE: Must be defined BEFORE /:id to avoid Express matching /:id first

router.get('/:id/thumbnail', (req, res) => {
  const row = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id) as MediaRow | undefined;

  if (!row) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Media not found',
      statusCode: 404,
    };
    res.status(404).json(response);
    return;
  }

  // If thumbnail exists, redirect to it
  if (row.thumbnailPath) {
    res.redirect(row.thumbnailPath);
    return;
  }

  // If no thumbnail, redirect to original image
  if (row.filePath) {
    res.redirect(row.filePath);
    return;
  }

  // No image available
  const response: ApiResponse<null> = {
    data: null,
    message: 'No thumbnail available',
    statusCode: 404,
  };
  res.status(404).json(response);
});

// ─── GET /media/:id — single media ───────────────────────────────────────────

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id) as MediaRow | undefined;

  if (!row) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Media not found',
      statusCode: 404,
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<Media> = {
    data: transformMedia(row),
    message: 'Media retrieved successfully',
    statusCode: 200,
  };

  res.json(response);
});

// ─── GET /media — paginated list with optional ?type= filter ─────────────────

router.get('/', (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const fileType = req.query.type as string | undefined;

  if (fileType && !VALID_FILE_TYPES.includes(fileType as typeof VALID_FILE_TYPES[number])) {
    sendValidationError(res, `Invalid type. Must be one of: ${VALID_FILE_TYPES.join(', ')}`);
    return;
  }

  let totalRow: { count: number };
  let rows: MediaRow[];

  if (fileType) {
    totalRow = db.prepare('SELECT COUNT(*) as count FROM media WHERE fileType = ?').get(fileType) as { count: number };
    rows = db.prepare('SELECT * FROM media WHERE fileType = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?').all(fileType, limit, offset) as MediaRow[];
  } else {
    totalRow = db.prepare('SELECT COUNT(*) as count FROM media').get() as { count: number };
    rows = db.prepare('SELECT * FROM media ORDER BY createdAt DESC LIMIT ? OFFSET ?').all(limit, offset) as MediaRow[];
  }

  const total = totalRow.count;
  const totalPages = Math.ceil(total / limit);

  const response: PaginatedResponse<Media> = {
    data: rows.map(transformMedia),
    pagination: { page, limit, total, totalPages },
    message: 'Media retrieved successfully',
    statusCode: 200,
  };

  res.json(response);
});

// ─── POST /media — create a media entry (metadata only, no file upload) ──────

router.post('/', (req, res) => {
  const body = sanitizeBody(req.body);
  const { id, fileName, filePath, fileType, description, monasteryId, festivalId } = body;

  const validationError = validateRequiredFields(body, ['fileName', 'filePath', 'fileType']);
  if (validationError) {
    sendValidationError(res, validationError);
    return;
  }

  if (!VALID_FILE_TYPES.includes(fileType)) {
    sendValidationError(res, `Invalid fileType. Must be one of: ${VALID_FILE_TYPES.join(', ')}`);
    return;
  }

  if (monasteryId) {
    const monastery = db.prepare('SELECT id FROM monasteries WHERE id = ?').get(monasteryId);
    if (!monastery) {
      sendValidationError(res, 'Referenced monastery not found');
      return;
    }
  }

  if (festivalId) {
    const festival = db.prepare('SELECT id FROM festivals WHERE id = ?').get(festivalId);
    if (!festival) {
      sendValidationError(res, 'Referenced festival not found');
      return;
    }
  }

  const now = new Date().toISOString();
  const mediaId = id || `media_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const existing = db.prepare('SELECT id FROM media WHERE id = ?').get(mediaId);
  if (existing) {
    sendValidationError(res, 'Media with this ID already exists');
    return;
  }

  db.prepare(`
    INSERT INTO media (id, fileName, filePath, fileType, description, monasteryId, festivalId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(mediaId, fileName, filePath, fileType, description || null, monasteryId || null, festivalId || null, now, now);

  const row = db.prepare('SELECT * FROM media WHERE id = ?').get(mediaId) as MediaRow;

  const response: ApiResponse<Media> = {
    data: transformMedia(row),
    message: 'Media created successfully',
    statusCode: 201,
  };

  res.status(201).json(response);
});

// ─── POST /media/thumbnails/regenerate — batch thumbnail regeneration ───────
// Regenerates thumbnails for all image media that don't have one yet

router.post('/thumbnails/regenerate', async (_req, res) => {
  try {
    // Find all image media without thumbnails
    const rows = db.prepare(
      "SELECT * FROM media WHERE fileType = 'image' AND (thumbnailPath IS NULL OR thumbnailPath = '')"
    ).all() as MediaRow[];

    if (rows.length === 0) {
      const response: ApiResponse<{ processed: number; succeeded: number; failed: number }> = {
        data: { processed: 0, succeeded: 0, failed: 0 },
        message: 'No images need thumbnail regeneration',
        statusCode: 200,
      };
      res.json(response);
      return;
    }

    let succeeded = 0;
    let failed = 0;

    // Process each image
    for (const row of rows) {
      try {
        // Extract filename from filePath (e.g., /images/123456.jpg -> 123456.jpg)
        const filename = path.basename(row.filePath);
        const fullPath = path.join(UPLOAD_DIR, filename);

        const thumbnailPath = await generateThumbnail(fullPath, filename);

        if (thumbnailPath) {
          db.prepare('UPDATE media SET thumbnailPath = ?, updatedAt = ? WHERE id = ?')
            .run(thumbnailPath, new Date().toISOString(), row.id);
          succeeded++;
        } else {
          failed++;
        }
      } catch (error) {
        logger.error({ err: error, mediaId: row.id }, 'Failed to generate thumbnail');
        failed++;
      }
    }

    const response: ApiResponse<{ processed: number; succeeded: number; failed: number }> = {
      data: {
        processed: rows.length,
        succeeded,
        failed,
      },
      message: `Thumbnail regeneration complete: ${succeeded} succeeded, ${failed} failed`,
      statusCode: 200,
    };

    res.json(response);
  } catch (error) {
    logger.error({ err: error }, 'Batch thumbnail regeneration error');
    res.status(500).json({
      data: null,
      message: 'Failed to regenerate thumbnails',
      statusCode: 500,
    });
  }
});

// ─── DELETE /media/:id — delete a media entry ────────────────────────────────

router.delete('/:id', (req, res) => {
  const existingRow = db.prepare('SELECT id FROM media WHERE id = ?').get(req.params.id);

  if (!existingRow) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Media not found',
      statusCode: 404,
    };
    res.status(404).json(response);
    return;
  }

  db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id);

  const response: ApiResponse<null> = {
    data: null,
    message: 'Media deleted successfully',
    statusCode: 200,
  };

  res.json(response);
});

export default router;

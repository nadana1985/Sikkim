import type { Response } from 'express';

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/** Parse and clamp pagination query params. Safe defaults: page=1, limit=20. */
export function parsePagination(query: Record<string, unknown>): PaginationParams {
  const page = Math.max(1, parseInt(String(query.page ?? 1), 10) || 1);
  const limit = Math.max(1, Math.min(1000, parseInt(String(query.limit ?? 20), 10) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

// ─── Required Fields ─────────────────────────────────────────────────────────

/**
 * Check that all required fields exist and are non-empty strings (or non-null for numbers).
 * Returns an error message string if validation fails, or null if OK.
 */
export function validateRequiredFields(
  body: Record<string, unknown>,
  required: string[],
): string | null {
  const missing = required.filter((field) => {
    const val = body[field];
    return val === undefined || val === null || val === '';
  });
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }
  return null;
}

// ─── Numeric Validation ──────────────────────────────────────────────────────

import { parseNumber } from '../utils/transform';

// ─── Coordinate Validation (Sikkim bounds) ───────────────────────────────────

// Sikkim approximate bounding box
const SIKKIM_BOUNDS = {
  latMin: 26.5,
  latMax: 28.5,
  lngMin: 87.5,
  lngMax: 89.5,
};

/**
 * Validate that lat/lng fall within Sikkim's approximate bounds.
 * Returns an error message or null.
 */
export function validateCoordinates(
  latitude: unknown,
  longitude: unknown,
): string | null {
  const lat = parseNumber(latitude) ?? null;
  const lng = parseNumber(longitude) ?? null;

  if (lat == null || lng == null) {
    return 'latitude and longitude must be valid numbers';
  }
  if (lat < SIKKIM_BOUNDS.latMin || lat > SIKKIM_BOUNDS.latMax) {
    return `latitude must be between ${SIKKIM_BOUNDS.latMin} and ${SIKKIM_BOUNDS.latMax} (Sikkim region)`;
  }
  if (lng < SIKKIM_BOUNDS.lngMin || lng > SIKKIM_BOUNDS.lngMax) {
    return `longitude must be between ${SIKKIM_BOUNDS.lngMin} and ${SIKKIM_BOUNDS.lngMax} (Sikkim region)`;
  }
  return null;
}

// ─── Date Validation ─────────────────────────────────────────────────────────

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Validate that a string is ISO date format (YYYY-MM-DD). Returns error or null. */
export function validateDateFormat(value: unknown): string | null {
  if (value == null || value === '') return 'date is required';
  const str = String(value);
  if (!ISO_DATE_RE.test(str)) {
    return `date must be in YYYY-MM-DD format, got "${str}"`;
  }
  const parsed = new Date(str + 'T00:00:00.000Z');
  if (isNaN(parsed.getTime())) {
    return `date "${str}" is not a valid date`;
  }
  return null;
}

// ─── String Sanitization ─────────────────────────────────────────────────────

/** Strip HTML tags and script content from a string. */
export function sanitizeString(value: unknown): string {
  if (value == null) return '';
  let str = String(value);
  // Remove script/style tags and their content
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  str = str.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  // Remove remaining HTML tags
  str = str.replace(/<[^>]+>/g, '');
  // Collapse whitespace
  str = str.replace(/\s+/g, ' ').trim();
  return str;
}

/** Sanitize all string values in an object (shallow). */
export function sanitizeBody<T extends Record<string, unknown>>(body: T): T {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(body)) {
    out[key] = typeof val === 'string' ? sanitizeString(val) : val;
  }
  return out as T;
}

// ─── Validation Response Helper ──────────────────────────────────────────────

/** Send a 400 validation error response and return true if sent. */
export function sendValidationError(res: Response, message: string): true {
  res.status(400).json({
    data: null,
    message,
    statusCode: 400,
  });
  return true;
}

/**
 * Shared image utilities for Monastery360
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Resolves an image path from the API into a full URL.
 * Handles both relative paths (e.g. "/images/foo.jpg") and absolute URLs.
 */
export function getImageUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE_URL}${path}`;
}

// Tiny orange gradient placeholder for blur effect (8x8 base64)
export const ORANGE_BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I2ZkNzAxMCIvPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmYTViZCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=';

// Purple gradient placeholder for festival images
export const PURPLE_BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I2M3ODVmYSIvPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I2Y5YTBmZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=';

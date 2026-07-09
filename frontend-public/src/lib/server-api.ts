import { cache } from 'react';
import { Monastery, Festival, Tour, ApiResponse, PaginatedResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/** ISR revalidation interval in seconds (1 hour). */
export const ISR_REVALIDATION = 3600;

/** Maximum pages to fetch in pagination loops (safety cap). */
const MAX_PAGES = 10;

/**
 * Server-side fetch helper with ISR caching.
 * Uses Next.js `fetch` with `next.revalidate` for incremental static regeneration.
 */
async function serverFetch<T>(endpoint: string, revalidate = ISR_REVALIDATION): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/** Fetch monasteries. If `limit` is provided, fetch only that many (single page). */
export async function getMonasteries(revalidate = ISR_REVALIDATION, limit?: number): Promise<Monastery[]> {
  // Fast path: fetch a single page with a small limit
  if (limit && limit <= 1000) {
    const data = await serverFetch<PaginatedResponse<Monastery>>(
      `/monasteries?page=1&limit=${limit}`,
      revalidate,
    );
    return data.data;
  }

  const PAGE_SIZE = 1000;
  let page = 1;
  let allMonasteries: Monastery[] = [];
  let hasMore = true;

  while (hasMore && page <= MAX_PAGES) {
    const data = await serverFetch<PaginatedResponse<Monastery>>(
      `/monasteries?page=${page}&limit=${PAGE_SIZE}`,
      revalidate,
    );
    allMonasteries = allMonasteries.concat(data.data);
    hasMore = data.data.length === PAGE_SIZE;
    page++;
  }

  return allMonasteries;
}

/** Fetch a single monastery by ID. */
export async function getMonastery(id: string, revalidate = ISR_REVALIDATION): Promise<Monastery | null> {
  try {
    const data = await serverFetch<ApiResponse<Monastery>>(`/monasteries/${id}`, revalidate);
    return data.data;
  } catch {
    return null;
  }
}

/** Fetch festivals. If `limit` is provided, fetch only that many (single page). */
export async function getFestivals(revalidate = ISR_REVALIDATION, limit?: number): Promise<Festival[]> {
  // Fast path: fetch a single page with a small limit
  if (limit && limit <= 1000) {
    const data = await serverFetch<PaginatedResponse<Festival>>(
      `/festivals?page=1&limit=${limit}&include=monastery`,
      revalidate,
    );
    return data.data;
  }

  const PAGE_SIZE = 1000;
  let page = 1;
  let allFestivals: Festival[] = [];
  let hasMore = true;

  while (hasMore && page <= MAX_PAGES) {
    const data = await serverFetch<PaginatedResponse<Festival>>(
      `/festivals?page=${page}&limit=${PAGE_SIZE}&include=monastery`,
      revalidate,
    );
    allFestivals = allFestivals.concat(data.data);
    hasMore = data.data.length === PAGE_SIZE;
    page++;
  }

  return allFestivals;
}

/** Stats returned by the lightweight /stats endpoint. */
export interface SiteStats {
  monasteries: number;
  festivals: number;
  tours: number;
}

/**
 * Lightweight stats helper: returns { monasteries, festivals, tours } counts.
 * Hits the dedicated /stats endpoint (3 SQL COUNT queries, no record hydration).
 * Wrapped in React.cache() so multiple server components share one fetch.
 */
export const getStats = cache(async (revalidate = ISR_REVALIDATION): Promise<SiteStats> => {
  const data = await serverFetch<{ data: SiteStats }>(
    '/stats',
    revalidate,
  );
  return data.data;
});

/**
 * Fetch festivals for a specific monastery (server-side filtering).
 * Falls back to client-side filtering if the API doesn't support monasteryId param.
 */
export async function getMonasteryFestivals(
  monasteryId: string,
  revalidate = ISR_REVALIDATION,
): Promise<Festival[]> {
  // Try server-side filter first (if API supports it)
  try {
    const data = await serverFetch<PaginatedResponse<Festival>>(
      `/festivals?page=1&limit=10&monasteryId=${monasteryId}&include=monastery`,
      revalidate,
    );
    return data.data;
  } catch {
    // Fallback: fetch all festivals and filter client-side
    const all = await getFestivals(revalidate, 1000);
    return all.filter(f => f.monasteryId === monasteryId);
  }
}

/**
 * Fetch upcoming festivals (server-side date filter).
 * Falls back to client-side filtering if the API doesn't support status param.
 */
export async function getUpcomingFestivals(
  revalidate = ISR_REVALIDATION,
  limit = 10,
): Promise<Festival[]> {
  try {
    const data = await serverFetch<PaginatedResponse<Festival>>(
      `/festivals?page=1&limit=${limit}&status=upcoming&include=monastery`,
      revalidate,
    );
    return data.data;
  } catch {
    // Fallback: fetch a batch and filter client-side
    const all = await getFestivals(revalidate, limit * 2);
    const now = new Date();
    return all
      .filter(f => new Date(f.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  }
}

/** Fetch a single festival by ID. */
export async function getFestival(id: string, revalidate = ISR_REVALIDATION): Promise<Festival | null> {
  try {
    const data = await serverFetch<ApiResponse<Festival>>(`/festivals/${id}`, revalidate);
    return data.data;
  } catch {
    return null;
  }
}

/** Fetch all tours (paginated, all pages). */
export async function getTours(revalidate = ISR_REVALIDATION): Promise<Tour[]> {
  const PAGE_SIZE = 1000;
  let page = 1;
  let allTours: Tour[] = [];
  let hasMore = true;

  while (hasMore && page <= MAX_PAGES) {
    const data = await serverFetch<PaginatedResponse<Tour>>(
      `/tours?page=${page}&limit=${PAGE_SIZE}`,
      revalidate,
    );
    allTours = allTours.concat(data.data);
    hasMore = data.data.length === PAGE_SIZE;
    page++;
  }

  return allTours;
}

/** Fetch a single tour by ID. */
export async function getTour(id: string, revalidate = ISR_REVALIDATION): Promise<Tour | null> {
  try {
    const data = await serverFetch<ApiResponse<Tour>>(`/tours/${id}`, revalidate);
    return data.data;
  } catch {
    return null;
  }
}

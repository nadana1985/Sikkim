import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useMemo } from 'react';
import { fetcher } from '@/lib/api';
import { Monastery, Festival, Tour, Media, ApiResponse, PaginatedResponse } from '@/types';

// Page size for multi-page fetching. The backend cap is 1000.
const PAGE_SIZE = 1000;

// ─── Filter types ────────────────────────────────────────────────────────────

export interface MonasteryFilters {
  q?: string;
  sort?: 'name' | 'foundedYear';
  dir?: 'asc' | 'desc';
  tour?: 'all' | 'with-tour' | 'without-tour';
  yearFrom?: number;
  yearTo?: number;
}

export interface FestivalFilters {
  q?: string;
  sort?: 'date' | 'name';
  dir?: 'asc' | 'desc';
  time?: 'all' | 'upcoming' | 'past';
  includeMonastery?: boolean;
}

// ─── Shared helper ───────────────────────────────────────────────────────────

/**
 * Fetch ALL items from a paginated endpoint across all pages.
 * Uses useSWRInfinite to automatically iterate pages until exhausted.
 * Accepts optional query params that are appended to the base endpoint.
 */
function useAllPages<T>(
  baseEndpoint: string,
  queryParams?: Record<string, string | number | boolean | undefined>,
  enabled = true,
) {
  // Build the query string once to avoid key instability
  const queryString = useMemo(() => {
    if (!queryParams) return '';
    const parts: string[] = [];
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== '' && value !== 'all') {
        parts.push(`${key}=${encodeURIComponent(String(value))}`);
      }
    }
    return parts.length > 0 ? `?${parts.join('&')}` : '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(queryParams)]);

  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedResponse<T> | null,
  ): string | null => {
    if (!enabled) return null;
    if (previousPageData && previousPageData.data.length === 0) return null;
    const filterPart = queryString ? queryString.substring(1) + '&' : '';
    return `${baseEndpoint}?${filterPart}page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
  };

  const { data, error, isLoading, size } = useSWRInfinite<PaginatedResponse<T>>(
    getKey,
    fetcher,
  );

  const items = data ? data.flatMap(page => page.data) : [];
  const pagination =
    data && data.length > 0 ? data[data.length - 1].pagination : undefined;

  return { items, pagination, isLoading, error, fetchedPages: size };
}

// ─── Monasteries ─────────────────────────────────────────────────────────────

export function useMonasteries(filters?: MonasteryFilters) {
  const { items, pagination, isLoading, error, fetchedPages } =
    useAllPages<Monastery>('/monasteries', filters ? {
      q: filters.q,
      sort: filters.sort,
      dir: filters.dir,
      tour: filters.tour,
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,
    } : undefined);
  return { monasteries: items, pagination, isLoading, error, fetchedPages };
}

export function useMonastery(id: string) {
  const { data, error, isLoading } = useSWR<ApiResponse<Monastery>>(
    id ? `/monasteries/${id}` : null,
    fetcher,
  );
  return { monastery: data?.data, isLoading, error };
}

// ─── Festivals ───────────────────────────────────────────────────────────────

export function useFestivals(filters?: FestivalFilters) {
  const { items, pagination, isLoading, error, fetchedPages } =
    useAllPages<Festival>('/festivals', filters ? {
      q: filters.q,
      sort: filters.sort,
      dir: filters.dir,
      time: filters.time,
      include: filters.includeMonastery ? 'monastery' : undefined,
    } : { include: 'monastery' });
  return { festivals: items, pagination, isLoading, error, fetchedPages };
}

export function useFestival(id: string) {
  const { data, error, isLoading } = useSWR<ApiResponse<Festival>>(
    id ? `/festivals/${id}` : null,
    fetcher,
  );
  return { festival: data?.data, isLoading, error };
}

// ─── Tours ───────────────────────────────────────────────────────────────────

export function useTours() {
  const { items, pagination, isLoading, error, fetchedPages } =
    useAllPages<Tour>('/tours');
  return { tours: items, pagination, isLoading, error, fetchedPages };
}

export function useTour(id: string) {
  const { data, error, isLoading } = useSWR<ApiResponse<Tour>>(
    id ? `/tours/${id}` : null,
    fetcher,
  );
  return { tour: data?.data, isLoading, error };
}

// ─── Media ───────────────────────────────────────────────────────────────────

export function useMonasteryMedia(monasteryId: string) {
  const { items, isLoading, error } = useAllPages<Media>(
    `/media/monastery/${monasteryId}`,
    undefined,
    !!monasteryId,
  );
  return { media: items, isLoading, error };
}

// ─── Utility hooks ───────────────────────────────────────────────────────────

/** Upcoming festivals — uses the backend /festivals/upcoming endpoint. */
export function useUpcomingFestivals(limit = 3) {
  const { items, isLoading, error } = useAllPages<Festival>('/festivals/upcoming');
  const upcomingFestivals = items.slice(0, limit);
  return { upcomingFestivals, isLoading, error };
}

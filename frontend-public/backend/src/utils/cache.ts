import { cacheOperationCounter, cacheHitCounter, cacheMissCounter, cacheSizeGauge } from '../metrics';

/**
 * Simple in-memory cache with TTL support.
 * In production, this can be swapped for Redis without changing consumers.
 * Cache operations are instrumented with Prometheus counters.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private defaultTtlMs: number;
  private hits = 0;
  private misses = 0;

  constructor(defaultTtlMs: number = 60_000) {
    this.defaultTtlMs = defaultTtlMs;
  }

  /**
   * Get a value from cache. Returns undefined if missing or expired.
   */
  get<T>(key: string, cacheName?: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      if (cacheName) cacheMissCounter.inc({ cache_name: cacheName });
      return undefined;
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      if (cacheName) cacheMissCounter.inc({ cache_name: cacheName });
      return undefined;
    }
    this.hits++;
    if (cacheName) cacheHitCounter.inc({ cache_name: cacheName });
    return entry.value as T;
  }

  /**
   * Set a value in cache with optional TTL override.
   */
  set<T>(key: string, value: T, ttlMs?: number, cacheName?: string): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs),
    });
    if (cacheName) {
      cacheOperationCounter.inc({ operation: 'set', cache_name: cacheName });
      cacheSizeGauge.set({ cache_name: cacheName }, this.store.size);
    }
  }

  /**
   * Delete a specific key.
   */
  delete(key: string, cacheName?: string): void {
    this.store.delete(key);
    if (cacheName) {
      cacheOperationCounter.inc({ operation: 'delete', cache_name: cacheName });
      cacheSizeGauge.set({ cache_name: cacheName }, this.store.size);
    }
  }

  /**
   * Delete all keys matching a prefix.
   * Useful for invalidating all entries for a resource type.
   */
  invalidatePrefix(prefix: string, cacheName?: string): void {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        count++;
      }
    }
    if (cacheName && count > 0) {
      cacheOperationCounter.inc({ operation: 'invalidate', cache_name: cacheName }, count);
      cacheSizeGauge.set({ cache_name: cacheName }, this.store.size);
    }
  }

  /**
   * Clear all entries.
   */
  clear(cacheName?: string): void {
    this.store.clear();
    if (cacheName) {
      cacheOperationCounter.inc({ operation: 'clear', cache_name: cacheName });
      cacheSizeGauge.set({ cache_name: cacheName }, 0);
    }
  }

  /**
   * Get cache statistics.
   */
  stats(): { size: number; hits: number; misses: number; hitRate: string } {
    const total = this.misses + this.hits;
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? `${((this.hits / total) * 100).toFixed(1)}%` : 'N/A',
    };
  }
}

// ─── Singleton cache instances ───────────────────────────────────────────────

/** Cache for monasteries (5 min TTL — rarely changes) */
export const monasteryCache = new MemoryCache(5 * 60_000);

/** Cache for festivals (2 min TTL — date-sensitive) */
export const festivalCache = new MemoryCache(2 * 60_000);

/** Cache for tours (5 min TTL) */
export const tourCache = new MemoryCache(5 * 60_000);

/** Cache for media lists (1 min TTL — changes more often) */
export const mediaCache = new MemoryCache(60_000);

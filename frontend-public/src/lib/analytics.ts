/**
 * Analytics event tracking for Monastery360.
 *
 * Sends custom events to Google Analytics (gtag) when available.
 * All tracking is no-ops when GA is not configured.
 */

type EventCategory = 'engagement' | 'discovery' | 'feature' | 'error';

interface TrackEventOptions {
  category: EventCategory;
  label?: string;
  value?: number;
}

/**
 * Track a custom analytics event.
 *
 * @param action - The event name (e.g. "view_monastery")
 * @param options - Category, label, and optional numeric value
 */
export function trackEvent(action: string, options: TrackEventOptions): void {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: options.category,
    event_label: options.label,
    value: options.value,
  });
}

// ─── Convenience wrappers ──────────────────────────────────────────────────

export function trackMonasteryView(monasteryId: string, monasteryName: string) {
  trackEvent('view_monastery', {
    category: 'engagement',
    label: `${monasteryId}:${monasteryName}`,
  });
}

export function trackFestivalView(festivalId: string, festivalName: string) {
  trackEvent('view_festival', {
    category: 'engagement',
    label: `${festivalId}:${festivalName}`,
  });
}

export function trackVirtualTourStart(tourId: string) {
  trackEvent('start_virtual_tour', {
    category: 'feature',
    label: tourId,
  });
}

export function trackSearch(query: string, resultCount: number) {
  trackEvent('search', {
    category: 'discovery',
    label: query,
    value: resultCount,
  });
}

export function trackFilter(filterType: string, filterValue: string) {
  trackEvent('filter', {
    category: 'discovery',
    label: `${filterType}:${filterValue}`,
  });
}

export function trackMapInteraction(action: 'marker_click' | 'zoom' | 'pan') {
  trackEvent('map_interaction', {
    category: 'engagement',
    label: action,
  });
}

export function trackImageGallery(action: 'open_lightbox' | 'navigate' | 'close') {
  trackEvent('gallery_interaction', {
    category: 'feature',
    label: action,
  });
}

export function trackShare(platform: 'facebook' | 'twitter' | 'copy_link', itemId: string) {
  trackEvent('share', {
    category: 'engagement',
    label: `${platform}:${itemId}`,
  });
}

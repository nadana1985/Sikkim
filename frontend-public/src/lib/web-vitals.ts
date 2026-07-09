import type { Metric } from 'web-vitals';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function sendToAnalytics(metric: Metric) {
  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      id: metric.id,
      rating: metric.rating,
      delta: metric.delta,
    });
  }
}

export async function reportWebVitals() {
  if (typeof window === 'undefined') return;

  const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');

  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onINP(sendToAnalytics);
}

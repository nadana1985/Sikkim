/**
 * Global type augmentations for Monastery360.
 *
 * Extends the Window interface with globals injected at runtime
 * (Google Analytics, Sentry).
 */

export {};

declare global {
  interface Window {
    /** Google Analytics gtag function. */
    gtag?: (...args: unknown[]) => void;

    /** Sentry SDK (client-side only). */
    Sentry?: {
      captureException: (err: Error, ctx?: Record<string, unknown>) => void;
    };
  }
}

import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

// Sentry hook for capturing errors during Next.js request handling
export const onRequestError = (err: Error) => {
  Sentry.captureException(err);
};

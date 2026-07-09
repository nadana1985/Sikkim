'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an external reporting service in production
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Something went wrong
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-2">
          An unexpected error occurred while loading this page.
        </p>

        {error.digest && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        {!error.digest && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
            Our team has been notified. Please try again.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

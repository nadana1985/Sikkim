'use client';

import Link from 'next/link';
import { Home, WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-200/30 dark:bg-orange-900/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-200/30 dark:bg-amber-900/10 blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-200 to-amber-200 dark:from-orange-800/50 dark:to-amber-800/50 rounded-full flex items-center justify-center shadow-lg">
            <WifiOff className="h-16 w-16 text-orange-600 dark:text-orange-400" />
          </div>
          {/* Decorative dots */}
          <div className="absolute top-0 right-1/3 w-3 h-3 bg-orange-400 dark:bg-orange-600 rounded-full opacity-60" />
          <div className="absolute bottom-2 left-1/4 w-2 h-2 bg-amber-400 dark:bg-amber-600 rounded-full opacity-60" />
          <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-orange-300 dark:bg-orange-700 rounded-full opacity-40" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          You&apos;re Offline
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          It seems you&apos;ve lost your connection to the internet. 
          Don&apos;t worry — your previously visited pages are cached and available offline.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 font-semibold rounded-lg border-2 border-orange-600 dark:border-orange-600 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            Return Home
          </Link>
        </div>

        {/* Cached pages hint */}
        <div className="mt-12 pt-8 border-t border-orange-200/50 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Previously visited pages may still be available:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/monasteries"
              className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              🏯 Monasteries
            </Link>
            <Link
              href="/festivals"
              className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              🎉 Festivals
            </Link>
            <Link
              href="/map"
              className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              🗺️ Map
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              ℹ️ About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

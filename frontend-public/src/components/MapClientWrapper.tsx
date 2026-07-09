'use client';

import dynamic from 'next/dynamic';

const MapInteractive = dynamic(() => import('@/components/MapInteractive'), {
  ssr: false,
  loading: () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8 animate-pulse">
        <div className="flex gap-4">
          <div className="flex-grow h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-96 animate-pulse" />
    </div>
  ),
});

export default MapInteractive;

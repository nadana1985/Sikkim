import { Metadata } from 'next';
import { Suspense } from 'react';
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

export const metadata: Metadata = {
  title: 'Interactive Monastery Map',
  description: 'Explore the geographical distribution of Sikkim\'s sacred monasteries. Click on markers to learn more about each location.',
  openGraph: {
    title: 'Interactive Monastery Map | Monastery360',
    description: 'Explore the geographical distribution of Sikkim\'s sacred monasteries.',
  },
};

// ISR: revalidate every hour
export const revalidate = 3600;

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Static header — rendered on the server */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Monastery Map
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Explore the geographical distribution of Sikkim&apos;s sacred monasteries. 
              Click on markers to learn more about each location.
            </p>
          </div>
        </div>
      </div>

      {/* Client-side interactive map + controls */}
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8 animate-pulse">
            <div className="flex gap-4">
              <div className="flex-grow h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-96 animate-pulse" />
        </div>
      }>
        <MapInteractive />
      </Suspense>
    </div>
  );
}

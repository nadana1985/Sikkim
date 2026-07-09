import { MapPin } from 'lucide-react';

export default function MapLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header skeleton */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto mb-4 animate-pulse" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-[500px] mx-auto animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8 animate-pulse">
          <div className="flex gap-4">
            <div className="flex-grow max-w-md h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>

        {/* Map skeleton */}
        <div className="bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center h-[600px]">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

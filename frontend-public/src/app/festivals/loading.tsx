export default function FestivalsLoading() {
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
        {/* Search/filter skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8 animate-pulse">
          <div className="flex gap-4">
            <div className="flex-grow h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="w-40 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="w-40 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
          <div className="mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-gray-800" />
              <div className="p-5">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

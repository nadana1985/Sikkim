export default function MonasteryDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Back nav skeleton */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden mb-8 animate-pulse">
              <div className="h-96 bg-gray-200 dark:bg-gray-800" />
              <div className="p-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded mr-3" />
                    <div className="flex-grow">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

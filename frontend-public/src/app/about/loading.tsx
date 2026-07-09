export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-72 mx-auto mb-6 animate-pulse" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-[500px] mx-auto animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Mission card skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg h-64" />
          </div>
        </div>

        {/* Features grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

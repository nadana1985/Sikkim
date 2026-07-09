'use client';

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, Calendar, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { useFestivals } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import FestivalCard from '@/components/FestivalCard';

interface Filters {
  q: string;
  time: 'all' | 'upcoming' | 'past';
  sort: 'date' | 'name';
  dir: 'asc' | 'desc';
}

const INITIAL_FILTERS: Filters = { q: '', time: 'all', sort: 'date', dir: 'asc' };



function parseFilters(searchParams: URLSearchParams): Filters {
  const time = searchParams.get('time') as Filters['time'];
  const sort = searchParams.get('sort') as Filters['sort'];
  const dir = searchParams.get('dir') as Filters['dir'];
  return {
    q: searchParams.get('q') || '',
    time: time && ['all', 'upcoming', 'past'].includes(time) ? time : 'all',
    sort: sort && ['date', 'name'].includes(sort) ? sort : 'date',
    dir: dir && ['asc', 'desc'].includes(dir) ? dir : 'asc',
  };
}

function filtersToParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.time !== 'all') params.set('time', filters.time);
  if (filters.sort !== 'date') params.set('sort', filters.sort);
  if (filters.dir !== 'asc') params.set('dir', filters.dir);
  return params;
}

function FestivalsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialFilters = useMemo(() => parseFilters(searchParams), []);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [localSearch, setLocalSearch] = useState(initialFilters.q);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setFilters(prev => (prev.q === debouncedSearch ? prev : { ...prev, q: debouncedSearch }));
  }, [debouncedSearch]);

  useEffect(() => {
    const params = filtersToParams(filters);
    const qs = params.toString();
    router.replace(qs ? `/festivals?${qs}` : '/festivals', { scroll: false });
  }, [filters, router]);

  const setTimeFilter = useCallback((time: Filters['time']) => {
    setFilters(prev => ({ ...prev, time }));
  }, []);

  const setSort = useCallback((sort: Filters['sort']) => {
    setFilters(prev => {
      if (prev.sort === sort) {
        return { ...prev, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
      }
      return { ...prev, sort, dir: sort === 'date' ? 'asc' : 'asc' };
    });
  }, []);

  const toggleSortDirection = useCallback(() => {
    setFilters(prev => ({ ...prev, dir: prev.dir === 'asc' ? 'desc' : 'asc' }));
  }, []);

  const removeFilter = useCallback((key: keyof Filters) => {
    if (key === 'q') {
      setLocalSearch('');
      setFilters(prev => ({ ...prev, q: '' }));
    } else {
      setFilters(prev => ({ ...prev, [key]: INITIAL_FILTERS[key] }));
    }
  }, []);

  const clearAllFilters = useCallback(() => {
    setLocalSearch('');
    setFilters(INITIAL_FILTERS);
  }, []);

  const hasActiveFilters = filters.q || filters.time !== 'all' || filters.sort !== 'date' || filters.dir !== 'asc';

  const filterChips: { key: keyof Filters; label: string }[] = [];
  if (filters.q) filterChips.push({ key: 'q', label: `Search: "${filters.q}"` });
  if (filters.time !== 'all') filterChips.push({ key: 'time', label: filters.time === 'upcoming' ? 'Upcoming' : 'Past Events' });
  if (filters.sort !== 'date' || filters.dir !== 'asc') {
    const sortLabel = filters.sort === 'name' ? 'Name' : 'Date';
    const dirLabel = filters.dir === 'asc' ? '↑' : '↓';
    filterChips.push({ key: 'sort', label: `Sort: ${sortLabel} ${dirLabel}` });
  }

  const { festivals, pagination, isLoading, error } = useFestivals({
    q: debouncedSearch || undefined,
    sort: filters.sort,
    dir: filters.dir,
    time: filters.time,
    includeMonastery: true,
  });

  const upcomingFestivals = useMemo(() => {
    return festivals
      .filter(festival => new Date(festival.date) >= new Date())
      .slice(0, 3);
  }, [festivals]);

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unable to Load Festivals</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We&apos;re having trouble connecting to our servers. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Upcoming Festivals Highlight */}
      {upcomingFestivals.length > 0 && filters.time !== 'upcoming' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Coming Up Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingFestivals.map((festival) => (
              <FestivalCard key={festival.id} festival={festival} />
            ))}
          </div>
          <hr className="mt-12 border-gray-200 dark:border-gray-800" />
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search festivals by name, description, or monastery..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
            {localSearch && (
              <button
                onClick={() => { setLocalSearch(''); setFilters(prev => ({ ...prev, q: '' })); }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Time filter pills */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {([['all', 'All'], ['upcoming', 'Upcoming'], ['past', 'Past']] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTimeFilter(value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filters.time === value
                    ? 'bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSort('date')}
              className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                filters.sort === 'date'
                  ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400'
                  : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </button>
            <button
              onClick={() => setSort('name')}
              className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                filters.sort === 'name'
                  ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400'
                  : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span>Name</span>
            </button>
            <button
              onClick={toggleSortDirection}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={filters.dir === 'asc' ? 'Ascending' : 'Descending'}
            >
              {filters.dir === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {filterChips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
            {filterChips.map(chip => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-sm font-medium rounded-full"
              >
                {chip.label}
                <button
                  onClick={() => removeFilter(chip.key)}
                  className="ml-0.5 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Clear all
            </button>
          </div>
        )}

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              Loading festivals...
            </div>
          ) : (
            <>Showing <span className="font-medium text-gray-900 dark:text-gray-300">{festivals.length}</span> of {pagination?.total ?? festivals.length} festivals</>
          )}
        </div>
      </div>

      {/* Festivals Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-300 dark:bg-gray-700"></div>
              <div className="p-5">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : festivals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {festivals.map((festival) => (
            <FestivalCard key={festival.id} festival={festival} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Festivals Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filters.q
              ? `No festivals match your search for "${filters.q}". Try a different search term.`
              : filters.time === 'upcoming'
                ? 'No upcoming festivals at the moment. Check back later for new announcements.'
                : filters.time === 'past'
                  ? 'No past festivals to display.'
                  : 'No festivals are currently available. Please check back later.'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <RotateCcw className="h-4 w-4" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function FestivalFilters() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    }>
      <FestivalsContent />
    </Suspense>
  );
}

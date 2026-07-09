'use client';

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  ArrowUp,
  ArrowDown,
  SortAsc,
} from 'lucide-react';
import { useMonasteries } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import MonasteryCard from '@/components/MonasteryCard';

type SortField = 'name' | 'foundedYear';
type SortDirection = 'asc' | 'desc';
type TourFilter = 'all' | 'with-tour' | 'without-tour';

interface FilterState {
  search: string;
  sortBy: SortField;
  sortDir: SortDirection;
  tourFilter: TourFilter;
  yearFrom: string;
  yearTo: string;
}

const INITIAL_FILTERS: FilterState = {
  search: '',
  sortBy: 'name',
  sortDir: 'asc',
  tourFilter: 'all',
  yearFrom: '',
  yearTo: '',
};

function parseFilters(searchParams: URLSearchParams): FilterState {
  return {
    search: searchParams.get('q') || '',
    sortBy: (searchParams.get('sort') as SortField) || 'name',
    sortDir: (searchParams.get('dir') as SortDirection) || 'asc',
    tourFilter: (searchParams.get('tour') as TourFilter) || 'all',
    yearFrom: searchParams.get('yearFrom') || '',
    yearTo: searchParams.get('yearTo') || '',
  };
}

function filtersToParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set('q', filters.search);
  if (filters.sortBy !== 'name') params.set('sort', filters.sortBy);
  if (filters.sortDir !== 'asc') params.set('dir', filters.sortDir);
  if (filters.tourFilter !== 'all') params.set('tour', filters.tourFilter);
  if (filters.yearFrom) params.set('yearFrom', filters.yearFrom);
  if (filters.yearTo) params.set('yearTo', filters.yearTo);
  return params;
}



function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full border border-orange-200 dark:border-orange-800">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5 transition-colors"
        aria-label={`Remove filter: ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function MonasteriesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>(() => parseFilters(searchParams));
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  useEffect(() => {
    const params = filtersToParams(filters);
    const qs = params.toString();
    const url = qs ? `/monasteries?${qs}` : '/monasteries';
    router.replace(url, { scroll: false });
  }, [filters, router]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.sortBy !== 'name' ||
      filters.sortDir !== 'asc' ||
      filters.tourFilter !== 'all' ||
      filters.yearFrom !== '' ||
      filters.yearTo !== ''
    );
  }, [filters]);

  const { monasteries, pagination, isLoading, error } = useMonasteries({
    q: debouncedSearch || undefined,
    sort: filters.sortBy,
    dir: filters.sortDir,
    tour: filters.tourFilter,
    yearFrom: filters.yearFrom ? Number(filters.yearFrom) : undefined,
    yearTo: filters.yearTo ? Number(filters.yearTo) : undefined,
  });

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setLocalSearch('');
  }, []);

  const toggleSortDirection = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      sortDir: prev.sortDir === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const removeFilterChip = useCallback((key: keyof FilterState) => {
    if (key === 'search') {
      setLocalSearch('');
      setFilters(prev => ({ ...prev, search: '' }));
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: INITIAL_FILTERS[key],
      }));
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unable to Load Monasteries</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We&apos;re having trouble connecting to our servers. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
          {/* Search + Sort Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, description, or location..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
              {localSearch && (
                <button
                  onClick={() => { setLocalSearch(''); setFilters(prev => ({ ...prev, search: '' })); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <SortAsc className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">Sort:</span>
              </div>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as SortField)}
                className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="name">Name</option>
                <option value="foundedYear">Founded Year</option>
              </select>
              <button
                onClick={toggleSortDirection}
                className="p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-orange-500 transition-colors"
                aria-label={`Sort ${filters.sortDir === 'asc' ? 'descending' : 'ascending'}`}
              >
                {filters.sortDir === 'asc' ? (
                  <ArrowUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filters Row */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="tourFilter" className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  Virtual Tour:
                </label>
                <select
                  id="tourFilter"
                  value={filters.tourFilter}
                  onChange={(e) => updateFilter('tourFilter', e.target.value as TourFilter)}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All</option>
                  <option value="with-tour">With Tour</option>
                  <option value="without-tour">Without Tour</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="yearFrom" className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  Founded:
                </label>
                <input
                  id="yearFrom"
                  type="number"
                  placeholder="From"
                  value={filters.yearFrom}
                  onChange={(e) => updateFilter('yearFrom', e.target.value)}
                  className="w-24 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  min="0"
                  max="2100"
                />
                <span className="text-gray-400 dark:text-gray-500">—</span>
                <input
                  id="yearTo"
                  type="number"
                  placeholder="To"
                  value={filters.yearTo}
                  onChange={(e) => updateFilter('yearTo', e.target.value)}
                  className="w-24 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  min="0"
                  max="2100"
                />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="ml-auto text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear all
                </button>
              )}
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap gap-2">
                {filters.search && (
                  <Chip
                    label={`Search: "${filters.search}"`}
                    onRemove={() => removeFilterChip('search')}
                  />
                )}
                {(filters.sortBy !== 'name' || filters.sortDir !== 'asc') && (
                  <Chip
                    label={`Sort: ${filters.sortBy === 'name' ? 'Name' : 'Year'} (${filters.sortDir === 'asc' ? 'A→Z' : 'Z→A'})`}
                    onRemove={() => {
                      updateFilter('sortBy', 'name');
                      updateFilter('sortDir', 'asc');
                    }}
                  />
                )}
                {filters.tourFilter !== 'all' && (
                  <Chip
                    label={filters.tourFilter === 'with-tour' ? 'With Virtual Tour' : 'Without Tour'}
                    onRemove={() => removeFilterChip('tourFilter')}
                  />
                )}
                {filters.yearFrom && (
                  <Chip
                    label={`From year ${filters.yearFrom}`}
                    onRemove={() => removeFilterChip('yearFrom')}
                  />
                )}
                {filters.yearTo && (
                  <Chip
                    label={`To year ${filters.yearTo}`}
                    onRemove={() => removeFilterChip('yearTo')}
                  />
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                Loading monasteries...
              </span>
            ) : (
              <>Showing{' '}<span className="font-medium text-gray-700 dark:text-gray-300">{monasteries.length}</span>{' '}of{' '}<span className="font-medium text-gray-700 dark:text-gray-300">{pagination?.total ?? monasteries.length}</span>{' '}monasteries</>
            )}
          </div>
        </div>

        {/* Monasteries Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-800" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : monasteries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {monasteries.map((monastery) => (
              <MonasteryCard key={monastery.id} monastery={monastery} showDetails />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MapPin className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Monasteries Found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {monasteries.length === 0
                ? 'No monasteries are currently available. Please check back later.'
                : filters.search
                  ? `No monasteries match "${filters.search}". Try a different search term.`
                  : 'No monasteries match the current filters. Try adjusting or clearing them.'}
            </p>
            {monasteries.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-4 inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                <X className="h-4 w-4" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MonasteryFilters() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 mb-8 animate-pulse">
            <div className="flex gap-4">
              <div className="flex-grow h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="w-40 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-800" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <MonasteriesContent />
    </Suspense>
  );
}

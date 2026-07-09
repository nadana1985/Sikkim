'use client';

import { useState } from 'react';
import { Search, MapPin, Layers } from 'lucide-react';
import { useMonasteries } from '@/hooks/useApi';
import MonasteryMap from '@/components/MonasteryMap';

export default function MapInteractive() {
  const { monasteries, isLoading, error } = useMonasteries();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonastery, setSelectedMonastery] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);

  const filteredMonasteries = monasteries.filter(monastery =>
    monastery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monastery.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monastery.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unable to Load Map</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We&apos;re having trouble loading the monastery locations. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search monasteries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {isLoading ? 'Loading...' : `${filteredMonasteries.length} locations`}
              </span>
            </div>
            
            <button
              onClick={() => setShowList(!showList)}
              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showList 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Layers className="h-4 w-4 mr-2" />
              {showList ? 'Hide List' : 'Show List'}
            </button>
          </div>
        </div>
      </div>

      <div className={`grid gap-8 ${showList ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Map */}
        <div className={showList ? 'lg:col-span-2' : 'col-span-1'}>
          {isLoading ? (
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading monasteries...</p>
              </div>
            </div>
          ) : (
            <MonasteryMap 
              monasteries={filteredMonasteries}
              height="600px"
            />
          )}
        </div>

        {/* Sidebar List */}
        {showList && (
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm">
              <div className="p-4 border-b dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Monastery Locations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Click on a monastery to highlight it on the map
                </p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredMonasteries.length > 0 ? (
                  <div className="p-2">
                    {filteredMonasteries.map((monastery) => (
                      <button
                        key={monastery.id}
                        onClick={() => setSelectedMonastery(
                          selectedMonastery === monastery.id ? null : monastery.id
                        )}
                        className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                          selectedMonastery === monastery.id
                            ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white mb-1">
                          {monastery.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Founded in {monastery.foundedYear}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{monastery.location.address}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                    <p>No monasteries found</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Map Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Monastery Location</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Click for details</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded-full mr-3 flex items-center justify-center">
              <span className="text-white text-xs">360°</span>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Virtual Tour Available</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Immersive experience</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 bg-purple-500 rounded-full mr-3 flex items-center justify-center">
              <span className="text-white text-xs">🎉</span>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Has Festivals</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Cultural events</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

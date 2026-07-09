'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Info, MapPin, ExternalLink, Home, ChevronRight, Maximize, Minimize, Image as ImageIcon, Mountain } from 'lucide-react';
import PanoramaViewer from '@/components/PanoramaViewer';
import { trackVirtualTourStart } from '@/lib/analytics';
import type { Tour } from '@/types';

interface TourViewerProps {
  tour: Tour;
}

export default function TourViewer({ tour }: TourViewerProps) {
  const router = useRouter();
  const [showInfo, setShowInfo] = useState(false);
  const [panoramaLoaded, setPanoramaLoaded] = useState(false);
  const [panoramaError, setPanoramaError] = useState<string | null>(null);
  const [isSplitView, setIsSplitView] = useState(false);
  const [activePanoramaIndex, setActivePanoramaIndex] = useState(0);

  // Resolve the best panorama URL: panoramaUrl > first image > none
  const primaryPanoramaUrl = useMemo(
    () => tour.panoramaUrl ?? tour.images[0] ?? null,
    [tour.panoramaUrl, tour.images],
  );

  // Available panoramas for this tour (only populated if we have at least one valid URL)
  const panoramas = useMemo(() => {
    if (!primaryPanoramaUrl) return [];
    return tour.images.length
      ? [{ url: primaryPanoramaUrl, name: tour.name }, ...tour.images.slice(1).map((img, i) => ({ url: img, name: `View ${i + 2}` }))]
      : [{ url: primaryPanoramaUrl, name: tour.name }];
  }, [primaryPanoramaUrl, tour.images, tour.name]);

  // Track tour start on mount
  useEffect(() => {
    trackVirtualTourStart(tour.id);
  }, [tour.id]);

  // Handle keyboard shortcuts for split view
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      
      switch (event.key) {
        case 's':
        case 'S':
          setIsSplitView(prev => !prev);
          break;
        case 'i':
        case 'I':
          setShowInfo(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm">
            <Link
              href="/"
              className="inline-flex items-center text-white/70 hover:text-orange-400 transition-colors"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link
              href="/monasteries"
              className="text-white/70 hover:text-orange-400 transition-colors"
            >
              Monasteries
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="text-white font-medium truncate max-w-[200px]">
              {tour.name}
            </span>
          </nav>
          
          <div className="flex items-center space-x-2">
            {/* Split view toggle */}
            <button
              onClick={() => setIsSplitView(!isSplitView)}
              className={`p-2 rounded-lg transition-colors ${
                isSplitView 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isSplitView ? 'Full View (S)' : 'Split View (S)'}
              aria-label={isSplitView ? 'Exit split view' : 'Enter split view'}
            >
              {isSplitView ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </button>
            
            {/* Info toggle */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-lg transition-colors ${
                showInfo 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title="Tour Information (I)"
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-20 right-4 z-50 bg-white rounded-lg shadow-xl p-6 max-w-sm pointer-events-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Tour Information</h3>
            <button
              onClick={() => setShowInfo(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900">{tour.name}</h4>
              <p className="text-sm text-gray-600">{tour.description}</p>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{tour.monastery?.location.address || 'Sikkim, India'}</span>
            </div>
            
            {/* Panorama gallery */}
            {panoramas.length > 1 && (
              <div className="pt-3 border-t">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Available Views</h5>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {panoramas.map((p, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePanoramaIndex(index)}
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-xs transition-colors ${
                        activePanoramaIndex === index
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-3 border-t">
              <Link
                href={`/monasteries/${tour.monasteryId}`}
                className="inline-flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Learn More
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tour Status */}
      {panoramas.length > 0 && !panoramaLoaded && !panoramaError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 text-center pointer-events-none">
          <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Virtual Tour
          </h1>
          <p className="text-gray-300">
            {tour.name}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex ${isSplitView ? 'flex-col md:flex-row' : ''}`}>
        {/* Panorama Viewer / No Content Placeholder */}
        <div className={`${isSplitView ? 'w-full md:w-2/3 h-screen' : 'h-screen w-full'}`}>
          {panoramas.length > 0 ? (
            <PanoramaViewer
              imageUrl={panoramas[activePanoramaIndex]!.url}
              hotspots={tour.hotspots}
              onHotspotClick={(hotspot) => {
                if (hotspot.targetTourId) {
                  router.push(`/tours/${hotspot.targetTourId}`);
                } else if (hotspot.targetMonasteryId) {
                  router.push(`/monasteries/${hotspot.targetMonasteryId}`);
                }
              }}
              onLoad={() => setPanoramaLoaded(true)}
              onError={(error) => setPanoramaError(error)}
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mountain className="h-10 w-10 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  {tour.name}
                </h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  A 360° panoramic tour is not yet available for this monastery.
                  We&apos;re working on bringing you immersive virtual experiences for all our sacred spaces.
                </p>
                <Link
                  href={`/monasteries/${tour.monasteryId}`}
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
                >
                  View Monastery Details
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Split View Info Panel */}
        {isSplitView && panoramaLoaded && (
          <div className="w-full md:w-1/3 h-screen bg-white overflow-y-auto p-6 pointer-events-auto">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{tour.name}</h2>
              
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Tour</h3>
                  <p className="text-gray-600 leading-relaxed">{tour.description}</p>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                    <span>{tour.monastery?.location.address || 'Sikkim, India'}</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">360°</div>
                    <div className="text-sm text-gray-600">Panoramic View</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">HD</div>
                    <div className="text-sm text-gray-600">High Quality</div>
                  </div>
                </div>

                {/* Panorama Gallery */}
                {panoramas.length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Views</h3>
                    <div className="space-y-2">
                      {panoramas.map((p, index) => (
                        <button
                          key={index}
                          onClick={() => setActivePanoramaIndex(index)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            activePanoramaIndex === index
                              ? 'bg-orange-100 border-2 border-orange-600'
                              : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{p.name}</div>
                          <div className="text-sm text-gray-500">
                            {activePanoramaIndex === index ? 'Currently viewing' : 'Click to view'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t">
                  <Link
                    href={`/monasteries/${tour.monasteryId}`}
                    className="block w-full bg-orange-600 text-white text-center py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    View Monastery Details
                  </Link>
                  <Link
                    href="/monasteries"
                    className="block w-full bg-gray-100 text-gray-700 text-center py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Explore More Monasteries
                  </Link>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Navigation Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Drag to look around the monastery</li>
                    <li>• Scroll or pinch to zoom in/out</li>
                    <li>• Press <kbd className="bg-blue-200 px-1 rounded">H</kbd> for keyboard shortcuts</li>
                    <li>• Press <kbd className="bg-blue-200 px-1 rounded">F</kbd> for fullscreen mode</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tour Navigation (bottom left) */}
      {panoramaLoaded && !isSplitView && (
        <div className="absolute bottom-4 left-4 z-50 pointer-events-auto">
          <div className="bg-black/70 rounded-lg p-4 text-white">
            <h4 className="font-semibold mb-2">
              {tour.name}
            </h4>
            <p className="text-sm text-gray-300 mb-3">
              Immersive 360° Experience
            </p>
            
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => setIsSplitView(true)}
                className="px-3 py-1 bg-orange-600 rounded text-sm hover:bg-orange-700 transition-colors"
              >
                Split View
              </button>
              <button
                onClick={() => setShowInfo(true)}
                className="px-3 py-1 bg-white/20 rounded text-sm hover:bg-white/30 transition-colors"
              >
                Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {panoramaError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-40">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Tour Unavailable</h2>
            <p className="text-gray-300 mb-6">
              We&apos;re unable to load this virtual tour at the moment. This could be due to 
              network issues or the tour content being temporarily unavailable.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Retry Tour
              </button>
              
              <Link
                href={`/monasteries/${tour.monasteryId}`}
                className="block w-full bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors text-center"
              >
                View Monastery Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {panoramas.length > 0 && !panoramaError && (
        <div className="absolute top-4 right-4 z-40 text-white/50 text-xs pointer-events-none">
          <span className="bg-black/50 px-2 py-1 rounded">
            Press <kbd className="bg-white/20 px-1 rounded">S</kbd> for split view • <kbd className="bg-white/20 px-1 rounded">I</kbd> for info
          </span>
        </div>
      )}
    </div>
  );
}

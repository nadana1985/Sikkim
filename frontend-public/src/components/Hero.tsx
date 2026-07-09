'use client';

import Link from 'next/link';
import { ArrowRight, Play, Map } from 'lucide-react';
import type { SiteStats } from '@/lib/server-api';

interface HeroProps {
  /** Pre-fetched stats from server component. When provided, skips client-side fetch. */
  stats?: SiteStats;
}

// Fallback values when API is unavailable
const FALLBACK_STATS: SiteStats = { monasteries: 15, festivals: 25, tours: 10 };

export default function Hero({ stats: serverStats }: HeroProps) {
  // Use server-provided stats directly — no redundant client-side SWR fetch
  const effectiveStats = serverStats ?? FALLBACK_STATS;
  const monasteryCount = effectiveStats.monasteries;
  const festivalCount = effectiveStats.festivals;
  const tourCount = effectiveStats.tours;
  const isLoading = false;

  return (
    <section className="relative bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden transition-colors">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-orange-300 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-300 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Discover Sikkim&apos;s
              <span className="block text-orange-600">Sacred Monasteries</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Embark on a virtual journey through the mystical monasteries of Sikkim. 
              Experience ancient wisdom, breathtaking architecture, and spiritual serenity 
              through immersive 360° tours.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/monasteries"
                className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Explore Monasteries
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg border-2 border-orange-600 hover:bg-orange-50 transition-colors"
              >
                <Map className="mr-2 h-5 w-5" />
                View Map
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {isLoading ? (
                    <span className="inline-block w-12 h-9 bg-orange-100 rounded animate-pulse"></span>
                  ) : (
                    `${monasteryCount}+`
                  )}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Monasteries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {isLoading ? (
                    <span className="inline-block w-12 h-9 bg-orange-100 rounded animate-pulse"></span>
                  ) : (
                    `${festivalCount}+`
                  )}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Festivals</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {isLoading ? (
                    <span className="inline-block w-12 h-9 bg-orange-100 rounded animate-pulse"></span>
                  ) : (
                    `${tourCount}+`
                  )}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Virtual Tours</div>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Placeholder for monastery image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 bg-orange-200 rounded-full flex items-center justify-center">
                    <Play className="h-12 w-12 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Virtual Tour Preview
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Experience monasteries in immersive 360° tours
                  </p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Interactive
              </div>                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">360° Experience</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Click to explore</div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-amber-300 rounded-full opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-orange-300 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

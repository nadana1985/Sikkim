import Hero from '@/components/Hero';
import HighlightCard from '@/components/HighlightCard';
import MonasteryCard from '@/components/MonasteryCard';
import FestivalCard from '@/components/FestivalCard';
import { Suspense } from 'react';
import { getMonasteries, getUpcomingFestivals, getStats } from '@/lib/server-api';
import type { Monastery } from '@/types';
import { Monitor, Calendar, Map, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600; // ISR: revalidate every hour

const highlights = [
  {
    title: 'Virtual Tours',
    description: 'Experience immersive 360° tours of sacred monasteries from the comfort of your home.',
    icon: Monitor,
    href: '/monasteries',
    color: 'orange' as const,
  },
  {
    title: 'Festival Calendar',
    description: 'Discover upcoming religious festivals and cultural celebrations at monasteries.',
    icon: Calendar,
    href: '/festivals',
    color: 'purple' as const,
  },
  {
    title: 'Interactive Map',
    description: 'Explore monastery locations across Sikkim with our detailed interactive map.',
    icon: Map,
    href: '/map',
    color: 'blue' as const,
  },
  {
    title: 'Cultural Insights',
    description: 'Learn about the rich history, architecture, and spiritual practices of each monastery.',
    icon: BookOpen,
    href: '/about',
    color: 'green' as const,
  },
];

export default async function Home() {
  // Fetch data server-side for SSR/ISR — use small limits to avoid fetching all records
  let monasteries: Monastery[] = [];
  let upcomingFestivals: Awaited<ReturnType<typeof getUpcomingFestivals>> = [];
  let heroStats: Awaited<ReturnType<typeof getStats>> | undefined;
  const [monasteryList, festivals, stats] = await Promise.allSettled([
    getMonasteries(undefined, 10),
    getUpcomingFestivals(undefined, 2),
    getStats(),
  ]);
  if (monasteryList.status === 'fulfilled') monasteries = monasteryList.value;
  if (festivals.status === 'fulfilled') upcomingFestivals = festivals.value;
  if (stats.status === 'fulfilled') heroStats = stats.value;

  // Get featured monasteries (first 3)
  const featuredMonasteries = monasteries.slice(0, 3);

  return (
    <div>
      {/* Hero Section — Suspense for streaming shell while stats load */}
      <Suspense fallback={<div className="h-96 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800" />}>
        <Hero stats={heroStats} />
      </Suspense>

      {/* Highlights Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Sacred Heritage
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover the spiritual and cultural richness of Sikkim&apos;s monasteries 
              through our comprehensive digital platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight) => (
              <HighlightCard
                key={highlight.title}
                title={highlight.title}
                description={highlight.description}
                icon={highlight.icon}
                href={highlight.href}
                color={highlight.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Monasteries Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Monasteries
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Discover some of Sikkim&apos;s most revered spiritual centers.
              </p>
            </div>
            <Link
              href="/monasteries"
              className="hidden md:inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              View All Monasteries
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {featuredMonasteries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMonasteries.map((monastery) => (
                <MonasteryCard key={monastery.id} monastery={monastery} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/monasteries"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              View All Monasteries
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Festivals Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Upcoming Festivals
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Join upcoming celebrations and cultural events.
              </p>
            </div>
            <Link
              href="/festivals"
              className="hidden md:inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
            >
              View All Festivals
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {upcomingFestivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingFestivals.map((festival) => (
                <FestivalCard key={festival.id} festival={festival} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Upcoming Festivals</h3>
              <p className="text-gray-600 dark:text-gray-400">Check back later for upcoming festival announcements.</p>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/festivals"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
            >
              View All Festivals
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

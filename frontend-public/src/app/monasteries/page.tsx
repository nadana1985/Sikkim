import { Metadata } from 'next';
import MonasteryFilters from '@/components/MonasteryFilters';

export const metadata: Metadata = {
  title: 'Sacred Monasteries of Sikkim',
  description: 'Explore the spiritual heritage and architectural marvels of Sikkim\'s most revered monasteries, each with its unique history and cultural significance.',
  openGraph: {
    title: 'Sacred Monasteries of Sikkim | Monastery360',
    description: 'Explore the spiritual heritage and architectural marvels of Sikkim\'s most revered monasteries.',
  },
};

// ISR: revalidate every hour
export const revalidate = 3600;

export default function MonasteriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Static header — rendered on the server */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sacred Monasteries of Sikkim
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Explore the spiritual heritage and architectural marvels of Sikkim&apos;s most
              revered monasteries, each with its unique history and cultural significance.
            </p>
          </div>
        </div>
      </div>

      {/* Client-side interactive filters + grid */}
      <MonasteryFilters />
    </div>
  );
}

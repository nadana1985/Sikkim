import { Metadata } from 'next';
import FestivalFilters from '@/components/FestivalFilters';

export const metadata: Metadata = {
  title: 'Festivals & Cultural Events',
  description: 'Immerse yourself in the rich cultural tapestry of Sikkim through its vibrant festivals and sacred celebrations held at monasteries throughout the year.',
  openGraph: {
    title: 'Festivals & Cultural Events | Monastery360',
    description: 'Immerse yourself in the rich cultural tapestry of Sikkim through its vibrant festivals and sacred celebrations.',
  },
};

// ISR: revalidate every hour
export const revalidate = 3600;

export default function FestivalsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Static header — rendered on the server */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Festivals & Cultural Events
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Immerse yourself in the rich cultural tapestry of Sikkim through its vibrant
              festivals and sacred celebrations held at monasteries throughout the year.
            </p>
          </div>
        </div>
      </div>

      {/* Client-side interactive filters + grid */}
      <FestivalFilters />
    </div>
  );
}

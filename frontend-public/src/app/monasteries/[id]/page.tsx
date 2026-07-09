import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Calendar, 
  Camera, 
  Monitor, 
  ExternalLink 
} from 'lucide-react';
import { getMonastery, getMonasteryFestivals } from '@/lib/server-api';
import FestivalCard from '@/components/FestivalCard';
import Breadcrumb from '@/components/Breadcrumb';
import ImageGallery from '@/components/ImageGallery';
import { MonasterySchema, BreadcrumbSchema } from '@/components/JsonLd';
import ViewTracker from '@/components/ViewTracker';
import { ORANGE_BLUR_PLACEHOLDER } from '@/lib/images';

// ISR: revalidate every hour
export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://monastery360.com';

interface MonasteryDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MonasteryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const monastery = await getMonastery(id, 3600);
  
  if (!monastery) {
    return {
      title: 'Monastery Not Found',
      description: 'The monastery you are looking for could not be found.',
    };
  }

  const description = monastery.description.slice(0, 160);
  const url = `${baseUrl}/monasteries/${monastery.id}`;

  const ogImages = monastery.images?.[0]
    ? [
        {
          url: monastery.images[0],
          width: 1200,
          height: 630,
          alt: monastery.name,
        },
      ]
    : [];

  return {
    title: monastery.name,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${monastery.name} | Monastery360`,
      description,
      url,
      siteName: 'Monastery360',
      images: ogImages,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${monastery.name} | Monastery360`,
      description,
      ...(ogImages.length > 0 ? { images: [monastery.images![0]] } : {}),
    },
  };
}

export default async function MonasteryDetailPage({ params }: MonasteryDetailPageProps) {
  const { id } = await params;
  
  // Fetch monastery and its festivals server-side
  const [monastery, monasteryFestivals] = await Promise.all([
    getMonastery(id, 3600),
    getMonasteryFestivals(id, 3600),
  ]);

  if (!monastery) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Monastery Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The monastery you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
          </p>
          <Link
            href="/monasteries"
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Monasteries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Analytics Tracker */}
      <ViewTracker eventName="view_monastery" label={`${monastery.id}:${monastery.name}`} />

      {/* JSON-LD Structured Data */}
      <MonasterySchema monastery={monastery} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Monasteries', url: '/monasteries' },
          { name: monastery.name, url: `/monasteries/${monastery.id}` },
        ]}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb
            items={[
              { label: 'Monasteries', href: '/monasteries' },
              { label: monastery.name },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8 transition-colors">
              {/* Image Gallery - Client Component */}
              <div className="relative h-96">
                <ImageGallery 
                  images={monastery.images || []} 
                  alt={monastery.name}
                  blurPlaceholder={ORANGE_BLUR_PLACEHOLDER}
                />
                
                {/* Founded year badge */}
                <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full font-medium z-20">
                  Est. {monastery.foundedYear}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {monastery.name}
                </h1>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{monastery.location.address}</span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  {monastery.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {monastery.virtualTourId && (
                    <Link
                      href={`/tours/${monastery.virtualTourId}`}
                      className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Monitor className="mr-2 h-5 w-5" />
                      Start 360° Tour
                    </Link>
                  )}
                  
                  <a
                    href={`https://maps.google.com/maps?q=${monastery.location.latitude},${monastery.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    View on Map
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="space-y-8">
              {/* History */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">History</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {monastery.history}
                </p>
              </div>

              {/* Architecture */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Architecture</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {monastery.architecture}
                </p>
              </div>

              {/* Rituals & Practices */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rituals & Practices</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {monastery.rituals}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Founded</div>
                    <div className="text-gray-600 dark:text-gray-400">{monastery.foundedYear}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Location</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">{monastery.location.address}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Camera className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Gallery</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {monastery.images ? monastery.images.length : 0} images
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Festivals */}
            {monasteryFestivals.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Festivals & Events
                </h3>
                <div className="space-y-4">
                  {monasteryFestivals.slice(0, 3).map((festival) => (
                    <FestivalCard 
                      key={festival.id} 
                      festival={festival} 
                      showMonastery={false}
                    />
                  ))}
                  
                  {monasteryFestivals.length > 3 && (
                    <Link
                      href="/festivals"
                      className="block text-center text-orange-600 hover:text-orange-700 font-medium pt-2"
                    >
                      View all festivals
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Camera,
  ExternalLink,
  Info,
} from 'lucide-react';
import { getFestival } from '@/lib/server-api';
import Breadcrumb from '@/components/Breadcrumb';
import ImageGallery from '@/components/ImageGallery';
import { FestivalSchema, BreadcrumbSchema } from '@/components/JsonLd';
import ViewTracker from '@/components/ViewTracker';
import { PURPLE_BLUR_PLACEHOLDER } from '@/lib/images';

// ISR: revalidate every hour
export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://monastery360.com';

interface FestivalDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: FestivalDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const festival = await getFestival(id, 3600);
  
  if (!festival) {
    return {
      title: 'Festival Not Found',
      description: 'The festival you are looking for could not be found.',
    };
  }

  const description = festival.description.slice(0, 160);
  const url = `${baseUrl}/festivals/${festival.id}`;

  const ogImages = festival.images?.[0]
    ? [
        {
          url: festival.images[0],
          width: 1200,
          height: 630,
          alt: festival.name,
        },
      ]
    : [];

  return {
    title: festival.name,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${festival.name} | Monastery360`,
      description,
      url,
      siteName: 'Monastery360',
      images: ogImages,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${festival.name} | Monastery360`,
      description,
      ...(ogImages.length > 0 ? { images: [festival.images![0]] } : {}),
    },
  };
}

export default async function FestivalDetailPage({ params }: FestivalDetailPageProps) {
  const { id } = await params;
  const festival = await getFestival(id, 3600);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!festival) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Festival Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The festival you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
          </p>
          <Link
            href="/festivals"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Festivals
          </Link>
        </div>
      </div>
    );
  }

  const isUpcoming = new Date(festival.date) >= new Date();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Analytics Tracker */}
      <ViewTracker eventName="view_festival" label={`${festival.id}:${festival.name}`} />

      {/* JSON-LD Structured Data */}
      <FestivalSchema festival={festival} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Festivals', url: '/festivals' },
          { name: festival.name, url: `/festivals/${festival.id}` },
        ]}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb
            items={[
              { label: 'Festivals', href: '/festivals' },
              { label: festival.name },
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
                  images={festival.images || []} 
                  alt={festival.name}
                  blurPlaceholder={PURPLE_BLUR_PLACEHOLDER}
                />

                {/* Status badge */}
                {isUpcoming && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full font-medium z-20">
                    Upcoming
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {festival.name}
                </h1>

                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  {festival.description}
                </p>

                {/* Quick info */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{formatDate(festival.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{festival.duration} days</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {festival.monastery && (
                    <Link
                      href={`/monasteries/${festival.monasteryId}`}
                      className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <MapPin className="mr-2 h-5 w-5" />
                      View Monastery
                    </Link>
                  )}

                  {festival.monastery && (
                    <a
                      href={`https://maps.google.com/maps?q=${festival.monastery.location.latitude},${festival.monastery.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <MapPin className="mr-2 h-5 w-5" />
                      View on Map
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="space-y-8">
              {/* Significance */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Significance</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {festival.significance}
                </p>
              </div>

              {/* Festival Details */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Festival Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 text-purple-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Date</h3>
                      <p className="text-gray-600 dark:text-gray-400">{formatDate(festival.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-purple-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Duration</h3>
                      <p className="text-gray-600 dark:text-gray-400">{festival.duration} days</p>
                    </div>
                  </div>
                  {festival.monastery && (
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-purple-500 mr-3 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
                        <p className="text-gray-600 dark:text-gray-400">{festival.monastery.name}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <Info className="h-6 w-6 text-purple-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Status</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {isUpcoming ? 'Upcoming' : 'Past Event'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Monastery Info */}
            {festival.monastery && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Associated Monastery
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {festival.monastery.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {festival.monastery.description}
                    </p>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{festival.monastery.location.address}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Founded: {festival.monastery.foundedYear}</span>
                  </div>

                  <div className="pt-3 border-t dark:border-gray-700">
                    <Link
                      href={`/monasteries/${festival.monasteryId}`}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      View Monastery Details
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Date</div>
                    <div className="text-gray-600 dark:text-gray-400">{formatDate(festival.date)}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Duration</div>
                    <div className="text-gray-600 dark:text-gray-400">{festival.duration} days</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Info className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Status</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {isUpcoming ? 'Upcoming Event' : 'Past Event'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Camera className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Gallery</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {festival.images ? festival.images.length : 0} images
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

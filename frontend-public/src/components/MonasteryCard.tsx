import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, ExternalLink, Camera, Compass } from 'lucide-react';
import { Monastery } from '@/types';
import { ORANGE_BLUR_PLACEHOLDER, getImageUrl } from '@/lib/images';

interface MonasteryCardProps {
  monastery: Monastery;
  showDetails?: boolean;
}

export default function MonasteryCard({ monastery, showDetails = false }: MonasteryCardProps) {
  const hasImages = monastery.images && monastery.images.length > 0;
  const hasVirtualTour = !!monastery.virtualTourId;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-600 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {hasImages ? (
          <>
            <Image
              src={getImageUrl(monastery.images[0])}
              alt={monastery.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={ORANGE_BLUR_PLACEHOLDER}
            />
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-orange-100">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-orange-200/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Compass className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No image available</p>
            </div>
          </div>
        )}

        {/* Year badge */}
        <div className="absolute top-3 right-3 bg-orange-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg">
          Est. {monastery.foundedYear}
        </div>

        {/* Virtual Tour badge */}
        {hasVirtualTour && (
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-orange-700 dark:text-orange-400 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-1">
            <Camera className="h-3 w-3" />
            360°
          </div>
        )}

        {/* Image count indicator */}
        {hasImages && monastery.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-xs">
            1/{monastery.images.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-orange-600 transition-colors duration-200">
          {monastery.name}
        </h3>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
          {monastery.description}
        </p>

        {/* Location */}
        <div className="flex items-center text-gray-400 dark:text-gray-500 mb-4">
          <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
          <span className="text-xs truncate">{monastery.location.address}</span>
        </div>

        {showDetails && (
          <div className="space-y-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Architecture:</span>{' '}
              {monastery.architecture.slice(0, 100)}...
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 mr-1.5" />
              <span>Founded in {monastery.foundedYear}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <Link
            href={`/monasteries/${monastery.id}`}
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-sm group/link"
          >
            Learn More
            <ExternalLink className="ml-1 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </Link>

          {hasVirtualTour && (
            <Link
              href={`/tours/${monastery.virtualTourId}`}
              className="inline-flex items-center px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg text-xs font-semibold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors duration-200"
            >
              360° Tour
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

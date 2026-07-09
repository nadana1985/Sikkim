import Link from 'next/link';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Festival } from '@/types';

interface FestivalContentSectionProps {
  festival: Festival;
  showMonastery?: boolean;
}

export default function FestivalContentSection({ festival, showMonastery = true }: FestivalContentSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {festival.name}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm line-clamp-2">
        {festival.description}
      </p>

      {/* Date and Duration */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDate(festival.date)}</span>
        </div>
        
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <Clock className="h-4 w-4 mr-2" />
          <span>{festival.duration} days</span>
        </div>

        {/* Monastery info */}
        {showMonastery && festival.monastery && (
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{festival.monastery.name}</span>
          </div>
        )}
      </div>

      {/* Significance */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
          <span className="font-medium">Significance:</span> {festival.significance.slice(0, 80)}...
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={`/festivals/${festival.id}`}
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
        >
          Learn More
          <ExternalLink className="ml-1 h-3 w-3" />
        </Link>
        
        {festival.monastery && (
          <Link
            href={`/monasteries/${festival.monasteryId}`}
            className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
          >
            Visit Monastery
          </Link>
        )}
      </div>
    </div>
  );
}

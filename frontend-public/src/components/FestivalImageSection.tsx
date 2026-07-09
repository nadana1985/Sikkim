import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { PURPLE_BLUR_PLACEHOLDER, getImageUrl } from '@/lib/images';
import FestivalBadge from './FestivalBadge';
import { Festival } from '@/types';

interface FestivalImageSectionProps {
  festival: Festival;
  isUpcoming: boolean;
}

export default function FestivalImageSection({ festival, isUpcoming }: FestivalImageSectionProps) {
  return (
    <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
      {festival.images && festival.images.length > 0 ? (
        <Image
          src={getImageUrl(festival.images[0])}
          alt={festival.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={PURPLE_BLUR_PLACEHOLDER}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-200 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Festival Image</p>
          </div>
        </div>
      )}
      
      <FestivalBadge isUpcoming={isUpcoming} />
    </div>
  );
}

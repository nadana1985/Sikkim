import { Festival } from '@/types';
import FestivalImageSection from './FestivalImageSection';
import FestivalContentSection from './FestivalContentSection';

interface FestivalCardProps {
  festival: Festival;
  showMonastery?: boolean;
}

export default function FestivalCard({ festival, showMonastery = true }: FestivalCardProps) {
  const isUpcoming = new Date(festival.date) >= new Date();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 ${isUpcoming ? 'hover:shadow-lg' : 'opacity-60 hover:opacity-80 hover:shadow-md'}`}>
      <FestivalImageSection festival={festival} isUpcoming={isUpcoming} />
      <FestivalContentSection festival={festival} showMonastery={showMonastery} />
    </div>
  );
}

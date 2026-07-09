import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TourViewer from '@/components/TourViewer';
import { getTour } from '@/lib/server-api';

// ISR: revalidate every hour
export const revalidate = 3600;

interface TourPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const { id } = await params;
  const tour = await getTour(id);

  if (!tour) {
    return {
      title: 'Tour Not Found',
      description: 'The virtual tour you are looking for could not be found.',
    };
  }

  const description = tour.description?.slice(0, 160) || `Explore ${tour.name} in immersive 360°.`;

  return {
    title: `${tour.name} — Virtual Tour`,
    description,
    openGraph: {
      title: `${tour.name} — Virtual Tour | Monastery360`,
      description,
      images: tour.panoramaUrl ? [tour.panoramaUrl] : [],
    },
  };
}

export default async function VirtualTourPage({ params }: TourPageProps) {
  const { id } = await params;
  const tour = await getTour(id);

  if (!tour) {
    notFound();
  }

  return <TourViewer tour={tour} />;
}

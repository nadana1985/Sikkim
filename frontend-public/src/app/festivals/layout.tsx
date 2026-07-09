import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Festivals & Cultural Events',
  description: 'Discover the vibrant festivals and sacred celebrations of Sikkim. Explore cultural events held at monasteries throughout the year.',
  openGraph: {
    title: 'Festivals & Cultural Events - Monastery360',
    description: 'Discover the vibrant festivals and sacred celebrations of Sikkim. Explore cultural events held at monasteries throughout the year.',
    type: 'website',
    siteName: 'Monastery360',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Festivals & Cultural Events - Monastery360',
    description: 'Discover the vibrant festivals and sacred celebrations of Sikkim.',
  },
};

export default function FestivalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Virtual Tours',
  description: 'Experience immersive 360° virtual tours of Sikkim\'s sacred monasteries. Explore ancient Buddhist temples and spiritual spaces from anywhere in the world.',
  openGraph: {
    title: 'Virtual Tours - Monastery360',
    description: 'Experience immersive 360° virtual tours of Sikkim\'s sacred monasteries.',
    type: 'website',
    siteName: 'Monastery360',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virtual Tours - Monastery360',
    description: 'Experience immersive 360° virtual tours of Sikkim\'s sacred monasteries.',
  },
};

export default function ToursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

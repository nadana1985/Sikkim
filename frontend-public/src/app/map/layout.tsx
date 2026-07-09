import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Monastery Map',
  description: 'Explore the geographical distribution of Sikkim\'s sacred monasteries on our interactive map. Find monastery locations and plan your spiritual journey.',
  openGraph: {
    title: 'Interactive Monastery Map - Monastery360',
    description: 'Explore the geographical distribution of Sikkim\'s sacred monasteries on our interactive map.',
    type: 'website',
    siteName: 'Monastery360',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Monastery Map - Monastery360',
    description: 'Explore the geographical distribution of Sikkim\'s sacred monasteries.',
  },
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

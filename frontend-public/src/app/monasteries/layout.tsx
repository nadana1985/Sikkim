import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monasteries of Sikkim',
  description: 'Explore the sacred monasteries of Sikkim. Discover ancient Buddhist heritage, architectural marvels, and spiritual traditions through immersive virtual tours.',
  openGraph: {
    title: 'Monasteries of Sikkim - Monastery360',
    description: 'Explore the sacred monasteries of Sikkim. Discover ancient Buddhist heritage, architectural marvels, and spiritual traditions through immersive virtual tours.',
    type: 'website',
    siteName: 'Monastery360',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monasteries of Sikkim - Monastery360',
    description: 'Explore the sacred monasteries of Sikkim. Discover ancient Buddhist heritage and spiritual traditions.',
  },
};

export default function MonasteriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

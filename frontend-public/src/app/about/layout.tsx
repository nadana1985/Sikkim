import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Monastery360',
  description: 'Learn about Monastery360\'s mission to preserve and share Sikkim\'s sacred monasteries through immersive digital experiences and virtual tours.',
  openGraph: {
    title: 'About Monastery360 - Preserving Sacred Heritage',
    description: 'Learn about our mission to preserve and share Sikkim\'s sacred monasteries through immersive digital experiences.',
    type: 'website',
    siteName: 'Monastery360',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Monastery360',
    description: 'Learn about our mission to preserve and share Sikkim\'s sacred monasteries.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

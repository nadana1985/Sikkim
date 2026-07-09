import { ImageResponse } from 'next/og';
import { getFestival } from '@/lib/server-api';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600;

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const festival = await getFestival(id, 3600);

  const name = festival?.name || 'Festival';
  const monasteryName = festival?.monastery?.name || 'Sikkim';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #2d1b69 0%, #6b21a8 50%, #9333ea 100%)',
          color: 'white',
          padding: 60,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: 0.6,
            marginBottom: 12,
          }}
        >
          Monastery360
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            marginBottom: 12,
            lineHeight: 1.2,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.8,
          }}
        >
          {monasteryName}
          {festival?.date ? ` · ${formatDate(festival.date)}` : ''}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

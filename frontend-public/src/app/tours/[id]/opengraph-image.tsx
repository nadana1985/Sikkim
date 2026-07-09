import { ImageResponse } from 'next/og';
import { getTour } from '@/lib/server-api';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600;

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tour = await getTour(id, 3600);

  const name = tour?.name || 'Virtual Tour';
  const monasteryName = tour?.monastery?.name || 'Sikkim';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)',
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
          {monasteryName} · 360° Virtual Tour
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

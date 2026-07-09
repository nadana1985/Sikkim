import { ImageResponse } from 'next/og';
import { getMonastery } from '@/lib/server-api';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600;

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const monastery = await getMonastery(id, 3600);

  const name = monastery?.name || 'Monastery';
  const district = monastery?.location?.address || 'Sikkim';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
          {district} · Sikkim
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

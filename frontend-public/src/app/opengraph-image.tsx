import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 86400;

export default function OpengraphImage() {
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
            fontSize: 64,
            fontWeight: 'bold',
            marginBottom: 12,
            lineHeight: 1.1,
          }}
        >
          Explore Sikkim's Sacred Monasteries
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.8,
          }}
        >
          Immersive 360° Virtual Tours · Himalayan Heritage
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

import { Monastery, Festival } from '@/types';
import { getImageUrl } from '@/lib/images';

const BASE_URL = 'https://monastery360.com';

interface MonasterySchemaProps {
  monastery: Monastery;
}

export function MonasterySchema({ monastery }: MonasterySchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: monastery.name,
    description: monastery.description,
    image: monastery.images?.[0] ? getImageUrl(monastery.images[0]) : undefined,
    url: `${BASE_URL}/monasteries/${monastery.id}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: monastery.location.address,
      addressRegion: 'Sikkim',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: monastery.location.latitude,
      longitude: monastery.location.longitude,
    },
    foundingDate: monastery.foundedYear?.toString(),
    touristType: 'Cultural Heritage',
    availableLanguage: {
      '@type': 'Language',
      name: 'English',
    },
    ...(monastery.virtualTourId && {
      virtualLocation: {
        '@type': 'VirtualLocation',
        url: `${BASE_URL}/tours/${monastery.virtualTourId}`,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FestivalSchemaProps {
  festival: Festival;
}

export function FestivalSchema({ festival }: FestivalSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: festival.name,
    description: festival.description,
    image: festival.images?.[0] ? getImageUrl(festival.images[0]) : undefined,
    url: `${BASE_URL}/festivals/${festival.id}`,
    startDate: festival.date,
    duration: festival.duration ? `P${festival.duration}D` : undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: festival.monastery
      ? {
          '@type': 'Place',
          name: festival.monastery.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: festival.monastery.location.address,
            addressRegion: 'Sikkim',
            addressCountry: 'IN',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: festival.monastery.location.latitude,
            longitude: festival.monastery.location.longitude,
          },
        }
      : undefined,
    organizer: {
      '@type': 'Organization',
      name: festival.monastery?.name || 'Monastery360',
      url: BASE_URL,
    },
    ...(festival.significance && {
      about: {
        '@type': 'Thing',
        name: festival.significance,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

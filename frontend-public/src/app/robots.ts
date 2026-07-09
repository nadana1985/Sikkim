import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://monastery360.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/opengraph-image'],
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

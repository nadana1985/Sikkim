import type { MetadataRoute } from 'next';
import { Monastery, Festival } from '@/types';
import { api } from '@/lib/api';

const BASE_URL = 'https://monastery360.com';

async function getMonasteries(): Promise<Monastery[]> {
  try {
    const response = await api.getMonasteries() as { data: Monastery[] };
    return response.data ?? [];
  } catch {
    return [];
  }
}

async function getFestivals(): Promise<Festival[]> {
  try {
    const response = await api.getFestivals() as { data: Festival[] };
    return response.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [monasteries, festivals] = await Promise.all([
    getMonasteries(),
    getFestivals(),
  ]);

  const monasteryUrls: MetadataRoute.Sitemap = monasteries.map(
    (monastery) => ({
      url: `${BASE_URL}/monasteries/${monastery.id}`,
      lastModified: new Date(monastery.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })
  );

  const festivalUrls: MetadataRoute.Sitemap = festivals.map((festival) => ({
    url: `${BASE_URL}/festivals/${festival.id}`,
    lastModified: new Date(festival.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/monasteries`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/festivals`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...monasteryUrls,
    ...festivalUrls,
  ];
}

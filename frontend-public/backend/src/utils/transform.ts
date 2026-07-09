import type { MonasteryRow, Monastery, FestivalRow, Festival, TourRow, Tour, MediaRow, Media } from '../types';

export function transformMonastery(row: MonasteryRow): Monastery {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    history: row.history,
    architecture: row.architecture,
    rituals: row.rituals,
    foundedYear: row.foundedYear,
    location: {
      latitude: row.latitude,
      longitude: row.longitude,
      address: row.address,
    },
    images: JSON.parse(row.images),
    ...(row.virtualTourId ? { virtualTourId: row.virtualTourId } : {}),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function transformFestival(row: FestivalRow, monastery?: Monastery): Festival {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    date: row.date,
    duration: row.duration,
    significance: row.significance,
    monasteryId: row.monasteryId,
    ...(monastery ? { monastery } : {}),
    images: JSON.parse(row.images),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function transformTour(row: TourRow, monastery?: Monastery): Tour {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    ...(row.panoramaUrl ? { panoramaUrl: row.panoramaUrl } : {}),
    monasteryId: row.monasteryId,
    ...(monastery ? { monastery } : {}),
    images: JSON.parse(row.images),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function transformMedia(row: MediaRow): Media {
  return {
    id: row.id,
    fileName: row.fileName,
    filePath: row.filePath,
    ...(row.thumbnailPath ? { thumbnailPath: row.thumbnailPath } : {}),
    fileType: row.fileType as Media['fileType'],
    ...(row.description ? { description: row.description } : {}),
    ...(row.monasteryId ? { monasteryId: row.monasteryId } : {}),
    ...(row.festivalId ? { festivalId: row.festivalId } : {}),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/**
 * Parse a value as a number, returning undefined if it's not a valid finite number.
 * Useful for validating request body numeric fields.
 */
export function parseNumber(value: unknown): number | undefined {
  if (value == null) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

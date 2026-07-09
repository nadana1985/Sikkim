export interface MonasteryRow {
  id: string;
  name: string;
  description: string;
  history: string;
  architecture: string;
  rituals: string;
  foundedYear: number;
  latitude: number;
  longitude: number;
  address: string;
  images: string; // JSON string
  virtualTourId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FestivalRow {
  id: string;
  name: string;
  description: string;
  date: string;
  duration: number;
  significance: string;
  monasteryId: string;
  images: string; // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface TourRow {
  id: string;
  name: string;
  description: string;
  panoramaUrl: string | null;
  monasteryId: string;
  images: string; // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface MediaRow {
  id: string;
  fileName: string;
  filePath: string;
  thumbnailPath: string | null;
  fileType: 'image' | 'panoramic' | 'video' | 'audio';
  description: string | null;
  monasteryId: string | null;
  festivalId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Transformed types (what the frontend expects)
export interface Monastery {
  id: string;
  name: string;
  description: string;
  history: string;
  architecture: string;
  rituals: string;
  foundedYear: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  images: string[];
  virtualTourId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Festival {
  id: string;
  name: string;
  description: string;
  date: string;
  duration: number;
  significance: string;
  monasteryId: string;
  monastery?: Monastery;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  panoramaUrl?: string;
  monasteryId: string;
  monastery?: Monastery;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  fileName: string;
  filePath: string;
  thumbnailPath?: string;
  fileType: 'image' | 'panoramic' | 'video' | 'audio';
  description?: string;
  monasteryId?: string;
  festivalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
  statusCode: number;
}

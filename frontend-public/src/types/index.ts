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

export interface TourHotspot {
  id: string;
  label: string;
  position: { lon: number; lat: number };
  targetTourId?: string;
  targetMonasteryId?: string;
  description?: string;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  panoramaUrl?: string;
  monasteryId: string;
  monastery?: Monastery;
  images: string[];
  hotspots?: TourHotspot[];
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

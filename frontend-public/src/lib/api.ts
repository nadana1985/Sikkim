const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    );
  }
}

// API endpoint functions
export const api = {
  // Monasteries
  getMonasteries: () => fetchApi('/monasteries'),
  getMonastery: (id: string) => fetchApi(`/monasteries/${id}`),
  
  // Festivals
  getFestivals: () => fetchApi('/festivals'),
  getFestival: (id: string) => fetchApi(`/festivals/${id}`),
  
  // Tours
  getTours: () => fetchApi('/tours'),
  getTour: (id: string) => fetchApi(`/tours/${id}`),
  
  // Media
  getMedia: (id: string) => fetchApi(`/media/${id}`),
  getMonasteryMedia: (monasteryId: string) => fetchApi(`/media/monastery/${monasteryId}`),
  
  // Health check
  healthCheck: () => fetchApi('/health'),
};

// SWR fetcher function — uses the same ApiError class as fetchApi
// for consistent error handling across direct API calls and SWR hooks
export const fetcher = async (url: string) => {
  const endpoint = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  try {
    const response = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    );
  }
};

export default api;

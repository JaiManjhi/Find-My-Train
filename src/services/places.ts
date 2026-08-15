import { Attraction } from '@/types';
import { MOCK_NEARBY_ATTRACTIONS } from '@/data/mockData';
import { backendFetch } from '@/lib/backendClient';

const CATEGORY_TAGS: Record<string, string[]> = {
  River:    ['waterway=river', 'natural=water'],
  Mountain: ['natural=peak', 'natural=mountain_range'],
  Bridge:   ['man_made=bridge', 'bridge=yes'],
  Tunnel:   ['tunnel=yes', 'man_made=tunnel'],
  Monument: ['historic=monument', 'historic=memorial', 'tourism=attraction'],
  Ghat:     ['amenity=ghats', 'natural=beach'],
  City:     ['place=city', 'place=town'],
};

export type AttractionCategory = keyof typeof CATEGORY_TAGS;

/**
 * Fetch nearby places from Python backend (Overpass API proxy).
 * Returns deduplicated attractions grouped by category.
 * Falls back to mock data on any failure.
 */
export async function getNearbyPlaces(
  lat: number,
  lon: number,
  radiusKm = 20
): Promise<Attraction[]> {
  try {
    const data = await backendFetch<Attraction[]>('/api/places/nearby', {
      params: {
        lat,
        lon,
        radius: radiusKm * 1000,
      },
    });

    if (Array.isArray(data) && data.length > 0) return data;
    return MOCK_NEARBY_ATTRACTIONS;
  } catch (error) {
    console.warn('[Places] API unavailable, using mock attractions:', error);
    return MOCK_NEARBY_ATTRACTIONS;
  }
}

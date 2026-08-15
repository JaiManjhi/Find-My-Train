import { ElevationPoint } from '@/types';
import { MOCK_ELEVATION_PROFILE } from '@/data/mockData';
import { backendFetch } from '@/lib/backendClient';

/**
 * Fetch elevation data for a list of [lon, lat] coordinate pairs from Python backend.
 * Returns an array of ElevationPoint objects ordered by distance.
 * Falls back to the mock elevation profile if the API is unavailable.
 */
export async function getElevationProfile(
  stationCoords: Array<{ lat: number; lon: number; distanceKm: number; stationName?: string }>
): Promise<ElevationPoint[]> {
  if (!stationCoords || stationCoords.length === 0) return MOCK_ELEVATION_PROFILE;

  try {
    // Build location string: "lat,lon|lat,lon|..."
    const locations = stationCoords.map((c) => `${c.lat},${c.lon}`).join('|');
    const data = await backendFetch<ElevationPoint[]>('/api/elevation', {
      params: { locations },
    });

    if (Array.isArray(data)) {
      return data.map((item: any, idx: number) => ({
        distanceKm: stationCoords[idx]?.distanceKm ?? item.distanceKm ?? idx * 100,
        elevationM: item.elevationM ?? item.elevation ?? 50,
        stationName: stationCoords[idx]?.stationName,
      }));
    }

    // Fallback: if format is unexpected, use mock
    return MOCK_ELEVATION_PROFILE;
  } catch (error) {
    console.warn('[Elevation] API unavailable, using mock profile:', error);
    return MOCK_ELEVATION_PROFILE;
  }
}

import { ElevationPoint } from '@/types';
import { MOCK_ELEVATION_PROFILE } from '@/data/mockData';
import { apiUrl } from '@/lib/apiClient';

/**
 * Fetch elevation data for a list of [lon, lat] coordinate pairs.
 * Returns an array of ElevationPoint objects ordered by distance.
 * Falls back to the mock elevation profile if the API is unavailable.
 */
export async function getElevationProfile(
  stationCoords: Array<{ lat: number; lon: number; distanceKm: number; stationName?: string }>
): Promise<ElevationPoint[]> {
  if (!stationCoords || stationCoords.length === 0) return MOCK_ELEVATION_PROFILE;

  try {
    // Build OpenTopography "point" style location string: "lat,lon|lat,lon|..."
    const locations = stationCoords.map((c) => `${c.lat},${c.lon}`).join('|');
    const res = await fetch(apiUrl(`/api/elevation?locations=${encodeURIComponent(locations)}`));

    if (!res.ok) throw new Error(`Elevation API ${res.status}`);

    const data = await res.json();

    // The API may return an array with elevationM, or OpenTopography's point response
    if (Array.isArray(data)) {
      return data.map((item: any, idx: number) => ({
        distanceKm: stationCoords[idx]?.distanceKm ?? item.distanceKm ?? idx * 100,
        elevationM: item.elevationM ?? item.elevation ?? 50,
        stationName: stationCoords[idx]?.stationName,
      }));
    }

    // Fallback: if format is unexpected, use mock
    return MOCK_ELEVATION_PROFILE;
  } catch {
    console.warn('[Elevation] API unavailable, using mock profile');
    return MOCK_ELEVATION_PROFILE;
  }
}

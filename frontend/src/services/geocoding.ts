/**
 * Geocoding service using MapTiler Geocoding API.
 * Used to resolve station names to lat/lon when coordinates are unknown.
 */

export interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  countryCode: string;
  type: string;
}

const MAPTILER_KEY =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_MAPTILER_API_KEY || '' : '';

/**
 * Geocode a station name or city to coordinates using MapTiler.
 * Returns the best match or null if not found.
 */
export async function geocodeStation(name: string): Promise<GeocodingResult | null> {
  try {
    const query = encodeURIComponent(`${name} station India`);
    const res = await fetch(
      `https://api.maptiler.com/geocoding/${query}.json?key=${MAPTILER_KEY}&country=in&limit=1&types=station,place`
    );
    if (!res.ok) throw new Error(`Geocoding API ${res.status}`);
    const data = await res.json();

    const feature = data.features?.[0];
    if (!feature) return null;

    return {
      name: feature.place_name || name,
      lon: feature.center[0],
      lat: feature.center[1],
      countryCode: 'IN',
      type: feature.place_type?.[0] || 'station',
    };
  } catch {
    console.warn(`[Geocoding] Failed to geocode "${name}"`);
    return null;
  }
}

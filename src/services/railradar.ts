import { Train, SearchResult } from '@/types';
import { MUMBAI_RAJDHANI_TRAIN } from '@/data/mockData';
import { INDIAN_TRAINS_DATABASE } from '@/data/trainIndex';
import { getStaticTrainRoute } from '@/data/trainDatabase';
import { backendFetch } from '@/lib/backendClient';

/**
 * Search trains by name or number via Python backend.
 * Falls back to local INDIAN_TRAINS_DATABASE on network failure.
 */
export async function searchTrainsApi(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return INDIAN_TRAINS_DATABASE.slice(0, 10);
  
  try {
    const results = await backendFetch<SearchResult[]>('/api/trains/search', {
      params: { q: query },
    });
    return results.slice(0, 20);
  } catch (error) {
    console.warn(`[RailRadar] Failed to search trains: ${error} — using local database`);
    const q = query.toLowerCase();
    return INDIAN_TRAINS_DATABASE.filter(
      (t) =>
        t.trainNumber.toLowerCase().includes(q) ||
        t.trainName.toLowerCase().includes(q) ||
        t.origin.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q)
    ).slice(0, 20);
  }
}

/**
 * Fetch live train status from Python backend (RailRadar proxy).
 * Falls back to mock on failure.
 */
export async function getLiveTrainStatusApi(trainId: string): Promise<Train & { isStale?: boolean }> {
  try {
    const data = await backendFetch<any>(`/api/trains/${trainId}/status`);
    return { ...data, isStale: false };
  } catch (error) {
    console.warn(`[RailRadar] Failed to fetch live status for ${trainId} — using fallback`);
    const staticRoute = getStaticTrainRoute(trainId);
    if (staticRoute) {
      return { ...staticRoute, isStale: true };
    }
    return { ...MUMBAI_RAJDHANI_TRAIN, id: trainId, trainNumber: trainId, isStale: true };
  }
}

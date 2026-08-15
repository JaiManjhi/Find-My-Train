import { Train, SearchResult } from '@/types';
import { POPULAR_TRAINS, MUMBAI_RAJDHANI_TRAIN } from '@/data/mockData';
import { INDIAN_TRAINS_DATABASE } from '@/data/trainIndex';
import { getStaticTrainRoute } from '@/data/trainDatabase';

/** Exponential backoff retry helper */
async function fetchWithRetry(url: string, opts: RequestInit = {}, retries = 3): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, opts);
      if (res.ok) return res;
      throw new Error(`HTTP ${res.status}`);
    } catch (e: any) {
      lastError = e;
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, 300 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError!;
}

/**
 * Search trains by name or number.
 * Falls back to local INDIAN_TRAINS_DATABASE on network failure.
 */
export async function searchTrainsApi(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return INDIAN_TRAINS_DATABASE.slice(0, 10);
  const q = query.toLowerCase();
  // Always use local index — fast and doesn't depend on network
  return INDIAN_TRAINS_DATABASE.filter(
    (t) =>
      t.trainNumber.toLowerCase().includes(q) ||
      t.trainName.toLowerCase().includes(q) ||
      t.origin.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q)
  ).slice(0, 20);
}

/**
 * Fetch live train status from RailRadar (via our /api proxy).
 * Retries 3 times with exponential backoff. Falls back to mock on failure.
 */
export async function getLiveTrainStatusApi(trainId: string): Promise<Train & { isStale?: boolean }> {
  try {
    const res = await fetchWithRetry(`/api/trains/${trainId}/status`);
    const data = await res.json();
    return { ...data, isStale: false };
  } catch {
    console.warn(`[RailRadar] Failed to fetch live status for ${trainId} — using fallback`);
    const staticRoute = getStaticTrainRoute(trainId);
    if (staticRoute) {
      return { ...staticRoute, isStale: true };
    }
    return { ...MUMBAI_RAJDHANI_TRAIN, id: trainId, trainNumber: trainId, isStale: true };
  }
}

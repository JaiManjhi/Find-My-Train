import { NextResponse } from 'next/server';
import { MUMBAI_RAJDHANI_TRAIN } from '@/data/mockData';
import { Station } from '@/types';

// In-memory cache to respect RailRadar rate limit (10 req/min)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 30_000; // 30 seconds cache

// Station coordinates dictionary for Indian Railway stations
const STATION_COORDINATES: Record<string, { lat: number; lon: number; state: string; elev: number }> = {
  MMCT: { lat: 18.9696, lon: 72.8193, state: 'Maharashtra', elev: 12 },
  BVI: { lat: 19.2294, lon: 72.8569, state: 'Maharashtra', elev: 14 },
  SAH: { lat: 19.58, lon: 72.82, state: 'Maharashtra', elev: 18 },
  PLG: { lat: 19.696, lon: 72.765, state: 'Maharashtra', elev: 15 },
  DRD: { lat: 19.972, lon: 72.736, state: 'Maharashtra', elev: 10 },
  VAPI: { lat: 20.372, lon: 72.904, state: 'Gujarat', elev: 27 },
  BL: { lat: 20.61, lon: 72.93, state: 'Gujarat', elev: 28 },
  ST: { lat: 21.2049, lon: 72.8406, state: 'Gujarat', elev: 13 },
  BH: { lat: 21.705, lon: 72.993, state: 'Gujarat', elev: 20 },
  BRC: { lat: 22.3107, lon: 73.1812, state: 'Gujarat', elev: 36 },
  RTM: { lat: 23.332, lon: 75.038, state: 'Madhya Pradesh', elev: 480 },
  KOTA: { lat: 25.213, lon: 75.864, state: 'Rajasthan', elev: 256 },
  SWM: { lat: 25.996, lon: 76.368, state: 'Rajasthan', elev: 275 },
  MTJ: { lat: 27.4924, lon: 77.6737, state: 'Uttar Pradesh', elev: 177 },
  NZM: { lat: 28.5898, lon: 77.2536, state: 'Delhi', elev: 207 },
  NDLS: { lat: 28.643, lon: 77.2194, state: 'Delhi', elev: 214 },
  CSMT: { lat: 18.94, lon: 72.835, state: 'Maharashtra', elev: 8 },
  RKMP: { lat: 23.2, lon: 77.43, state: 'Madhya Pradesh', elev: 500 },
  BSB: { lat: 25.32, lon: 82.98, state: 'Uttar Pradesh', elev: 80 },
  HWH: { lat: 22.58, lon: 88.34, state: 'West Bengal', elev: 9 },
  TVC: { lat: 8.49, lon: 76.95, state: 'Kerala', elev: 10 },
  LKO: { lat: 26.83, lon: 80.92, state: 'Uttar Pradesh', elev: 123 },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const trainNumber = id || '12951';
  const apiKey = process.env.RAILRADAR_API_KEY || 'rg_59c29ed23e2049cf8a9be3ab7ea7f375';

  const cached = cache.get(trainNumber);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(`https://api.railradar.in/v1/trains/${trainNumber}/live`, {
      headers: {
        'x-api-key': apiKey,
      },
      next: { revalidate: 30 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const liveData = json.data;
        const trainMeta = liveData.train || {};
        const rawRoute: any[] = liveData.route || [];

        const totalDistance = trainMeta.distance || 1380;
        const delayMinutes = liveData.delayMinutes || 0;

        // Parse station list from RailRadar live route
        const stations: Station[] = rawRoute.map((st: any, index: number) => {
          const coords = STATION_COORDINATES[st.stationCode] || {
            lat: 18.9696 + (index / Math.max(1, rawRoute.length - 1)) * (28.643 - 18.9696),
            lon: 72.8193 + (index / Math.max(1, rawRoute.length - 1)) * (77.2194 - 72.8193),
            state: 'India',
            elev: 50 + index * 5,
          };

          const isPassed = st.status === 'departed';
          const isNext = !isPassed && index > 0 && rawRoute[index - 1]?.status === 'departed';
          const isCurrent = isPassed && (index === rawRoute.length - 1 || rawRoute[index + 1]?.status !== 'departed');

          const scheduledArr = st.scheduledArrival ? new Date(st.scheduledArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--';
          const scheduledDep = st.scheduledDeparture ? new Date(st.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--';
          const actualArr = st.actualArrival ? new Date(st.actualArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : undefined;
          const actualDep = st.actualDeparture ? new Date(st.actualDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : undefined;

          return {
            code: st.stationCode,
            name: st.stationName,
            state: coords.state,
            latitude: coords.lat,
            longitude: coords.lon,
            arrivalTime: scheduledArr,
            departureTime: scheduledDep,
            actualArrival: actualArr,
            actualDeparture: actualDep,
            delayMinutes: st.delayDeparture || st.delayArrival || delayMinutes,
            distanceFromOrigin: Math.round(st.distance || 0),
            elevation: coords.elev,
            platform: st.platform || '1',
            // isHalt: true means the train has a scheduled stop (halts) at this station;
            // false means it passes through without a stop (intermediate/passing station)
            isHalt: !!(st.scheduledDeparture && st.haltMinutes !== 0),
            isPassed,
            isCurrent,
            isNext,
          };
        });

        // Find current station and next station
        const currentStationObj = stations.find((s) => s.isCurrent) || stations[0];
        const nextStationObj = stations.find((s) => s.isNext) || stations[1] || stations[0];

        const distanceCovered = Math.round(currentStationObj.distanceFromOrigin);
        const distanceRemaining = Math.max(0, totalDistance - distanceCovered);
        const completionPercent = Math.min(100, Math.round((distanceCovered / totalDistance) * 100));

        // Format updated train object
        const formattedTrain = {
          id: trainNumber,
          trainNumber: trainNumber,
          trainName: trainMeta.name || liveData.trainName || 'Indian Express',
          origin: trainMeta.source?.name || 'Origin Station',
          destination: trainMeta.destination?.name || 'Destination Station',
          totalDistance: totalDistance,
          speed: Math.round(liveData.speed || trainMeta.avgSpeed || 95),
          delayMinutes: delayMinutes,
          status: delayMinutes > 15 ? 'DELAYED' : 'ON_TIME',
          lastUpdated: liveData.lastUpdatedAt ? new Date(liveData.lastUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now',
          completionPercent: completionPercent,
          distanceCovered: distanceCovered,
          distanceRemaining: distanceRemaining,
          totalDuration: `${Math.floor((trainMeta.duration || 932) / 60)}h ${(trainMeta.duration || 932) % 60}m`,
          currentLatitude: currentStationObj.latitude,
          currentLongitude: currentStationObj.longitude,
          currentStation: currentStationObj,
          nextStation: nextStationObj,
          stations: stations,
        };

        cache.set(trainNumber, { data: formattedTrain, timestamp: Date.now() });
        return NextResponse.json(formattedTrain);
      }
    }
  } catch (err: any) {
    console.error('RailRadar API status parse error:', err.message);
  }

  // Local realistic fallback if API fails
  const fallback = {
    ...MUMBAI_RAJDHANI_TRAIN,
    id: trainNumber,
    trainNumber: trainNumber,
  };

  cache.set(trainNumber, { data: fallback, timestamp: Date.now() });
  return NextResponse.json(fallback);
}

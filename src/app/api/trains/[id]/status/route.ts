import { NextResponse } from 'next/server';
import { MUMBAI_RAJDHANI_TRAIN } from '@/data/mockData';
import { getStaticTrainRoute, STATION_COORDS } from '@/data/trainDatabase';
import { Station } from '@/types';

// In-memory cache to respect RailRadar rate limit (10 req/min)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 30_000; // 30 seconds cache

/**
 * Resolves accurate coordinates for a list of route stations.
 * Priority:
 * 1. High-precision STATION_COORDS dictionary
 * 2. API returned lat / lng for the station
 * 3. Interpolation between nearest previous and next known station coordinates
 */
function resolveStationCoordinates(rawStations: any[]): { lat: number; lon: number; state: string; elev: number }[] {
  const resolved = rawStations.map((st) => {
    const code = st.stationCode || st.code;
    const known = STATION_COORDS[code];
    if (known) return { lat: known.lat, lon: known.lon, state: known.state, elev: known.elev };

    const apiLat = parseFloat(st.lat ?? st.latitude);
    const apiLon = parseFloat(st.lng ?? st.lon ?? st.longitude);
    if (!isNaN(apiLat) && !isNaN(apiLon) && apiLat !== 0 && apiLon !== 0) {
      return { lat: apiLat, lon: apiLon, state: st.state || 'India', elev: st.elevation || 100 };
    }
    return null;
  });

  return rawStations.map((st, i) => {
    if (resolved[i]) return resolved[i]!;

    let prevIdx = -1;
    for (let p = i - 1; p >= 0; p--) {
      if (resolved[p]) { prevIdx = p; break; }
    }
    let nextIdx = -1;
    for (let n = i + 1; n < rawStations.length; n++) {
      if (resolved[n]) { nextIdx = n; break; }
    }

    const prevC = prevIdx !== -1 ? resolved[prevIdx]! : { lat: 28.643, lon: 77.2194, state: 'India', elev: 100 };
    const nextC = nextIdx !== -1 ? resolved[nextIdx]! : prevC;
    const range = Math.max(1, nextIdx - (prevIdx !== -1 ? prevIdx : 0));
    const frac = (i - (prevIdx !== -1 ? prevIdx : 0)) / range;

    return {
      lat: prevC.lat + frac * (nextC.lat - prevC.lat),
      lon: prevC.lon + frac * (nextC.lon - prevC.lon),
      state: 'India',
      elev: 100,
    };
  });
}

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

  // Get the static route to use for fallback
  const staticRoute = getStaticTrainRoute(trainNumber);

  try {
    const res = await fetch(`https://api.railradar.in/v1/trains/${trainNumber}/live`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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

        const totalDistance = trainMeta.distance || staticRoute?.totalDistance || 1380;
        const delayMinutes = liveData.delayMinutes || 0;

        // Resolve accurate station coordinates
        const stationCoords = resolveStationCoordinates(rawRoute);

        // Find last departed station
        let lastDepartedIdx = -1;
        for (let i = 0; i < rawRoute.length; i++) {
          if (rawRoute[i]?.status === 'departed') {
            lastDepartedIdx = i;
          }
        }

        // Determine current active station index and next stop index
        let currStationIdx = lastDepartedIdx >= 0 ? lastDepartedIdx : 0;
        let nextStationIdx = Math.min(rawRoute.length - 1, currStationIdx + 1);

        // Check if train is currently halted at a station
        const isHaltedAtStation = rawRoute[currStationIdx]?.status === 'arrived';
        if (isHaltedAtStation) {
          nextStationIdx = Math.min(rawRoute.length - 1, currStationIdx + 1);
        }

        const stations: Station[] = rawRoute.map((st: any, index: number) => {
          const coords = stationCoords[index];

          const isPassed = index < currStationIdx || (index === currStationIdx && !isHaltedAtStation);
          const isCurrent = index === currStationIdx;
          const isNext = index === nextStationIdx && nextStationIdx !== currStationIdx;

          const fmt = (iso: string | undefined) =>
            iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--';

          return {
            code: st.stationCode || st.code,
            name: st.stationName || st.name || st.stationCode || st.code,
            state: coords.state,
            latitude:  coords.lat,
            longitude: coords.lon,
            arrivalTime:    fmt(st.scheduledArrival),
            departureTime:  fmt(st.scheduledDeparture),
            actualArrival:  st.actualArrival   ? fmt(st.actualArrival)   : undefined,
            actualDeparture:st.actualDeparture ? fmt(st.actualDeparture) : undefined,
            delayMinutes: st.delayDeparture || st.delayArrival || delayMinutes,
            distanceFromOrigin: Math.round(st.distance || (index / Math.max(1, rawRoute.length - 1)) * totalDistance),
            elevation: coords.elev,
            platform: st.platform || '1',
            isHalt:     !!(st.scheduledDeparture && st.haltMinutes !== 0),
            isPassed,
            isCurrent,
            isNext,
          };
        });

        const currentStationObj = stations[currStationIdx] || stations[0];
        const nextStationObj    = stations[nextStationIdx] || stations[1] || stations[0];

        // ── Determine exact real-time GPS coordinates ─────────────────────────────
        const directLat = parseFloat(
          liveData.currentLocation?.lat ??
          liveData.currentLocation?.latitude ??
          liveData.currentPosition?.lat ??
          liveData.lat
        );
        const directLon = parseFloat(
          liveData.currentLocation?.lng ??
          liveData.currentLocation?.lon ??
          liveData.currentLocation?.longitude ??
          liveData.currentPosition?.lng ??
          liveData.lng
        );

        let currentLatitude = currentStationObj.latitude;
        let currentLongitude = currentStationObj.longitude;

        if (!isNaN(directLat) && !isNaN(directLon) && directLat !== 0 && directLon !== 0) {
          currentLatitude = directLat;
          currentLongitude = directLon;
        } else if (typeof liveData.currentLocation?.segmentProgress === 'number') {
          const p = Math.max(0, Math.min(1, liveData.currentLocation.segmentProgress));
          currentLatitude  = currentStationObj.latitude  + p * (nextStationObj.latitude  - currentStationObj.latitude);
          currentLongitude = currentStationObj.longitude + p * (nextStationObj.longitude - currentStationObj.longitude);
        } else if (nextStationObj && nextStationObj !== currentStationObj) {
          // Progress calculation along current leg
          let progress = 0.5;

          const totalLegDist = nextStationObj.distanceFromOrigin - currentStationObj.distanceFromOrigin;
          const coveredDist = liveData.distanceCovered ?? liveData.currentLocation?.distance;

          if (typeof coveredDist === 'number' && totalLegDist > 0) {
            progress = Math.max(0.05, Math.min(0.95, (coveredDist - currentStationObj.distanceFromOrigin) / totalLegDist));
          } else {
            // Time-based interpolation along active segment
            try {
              const parseTime = (st: Station, preferDep: boolean) => {
                const timeStr = preferDep ? (st.actualDeparture || st.departureTime) : (st.actualArrival || st.arrivalTime);
                if (!timeStr || timeStr === '--') return null;
                const parts = timeStr.split(':').map(Number);
                if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
                const now = new Date();
                return new Date(now.getFullYear(), now.getMonth(), now.getDate(), parts[0], parts[1]).getTime();
              };

              const depMs = parseTime(currentStationObj, true);
              const arrMs = parseTime(nextStationObj, false);
              const nowMs = Date.now();

              if (depMs && arrMs && arrMs > depMs) {
                progress = Math.max(0.05, Math.min(0.95, (nowMs - depMs) / (arrMs - depMs)));
              }
            } catch {
              progress = 0.5;
            }
          }

          currentLatitude  = currentStationObj.latitude  + progress * (nextStationObj.latitude  - currentStationObj.latitude);
          currentLongitude = currentStationObj.longitude + progress * (nextStationObj.longitude - currentStationObj.longitude);
        }

        // Distance covered and remaining
        const distanceCovered = Math.round(
          liveData.distanceCovered ??
          liveData.currentLocation?.distance ??
          (currentStationObj.distanceFromOrigin +
            Math.hypot(currentLatitude - currentStationObj.latitude, currentLongitude - currentStationObj.longitude) * 111)
        );
        const distanceRemaining = Math.max(0, totalDistance - distanceCovered);
        const completionPercent = Math.min(100, Math.round((distanceCovered / totalDistance) * 100));

        const formattedTrain = {
          id:             trainNumber,
          trainNumber:    trainNumber,
          trainName:      trainMeta.name || liveData.trainName || staticRoute?.trainName || 'Indian Express',
          origin:         trainMeta.source?.name      || staticRoute?.origin      || stations[0]?.name || 'Origin',
          destination:    trainMeta.destination?.name || staticRoute?.destination || stations[stations.length - 1]?.name || 'Destination',
          totalDistance,
          speed:          Math.round(liveData.speed || trainMeta.avgSpeed || 95),
          delayMinutes,
          status:         delayMinutes > 15 ? 'DELAYED' : 'ON_TIME',
          lastUpdated:    liveData.lastUpdatedAt
            ? new Date(liveData.lastUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            : 'Just now',
          completionPercent,
          distanceCovered,
          distanceRemaining,
          totalDuration:  staticRoute?.totalDuration ?? `${Math.floor((trainMeta.duration || 932) / 60)}h ${(trainMeta.duration || 932) % 60}m`,
          currentLatitude,
          currentLongitude,
          currentStation:   currentStationObj,
          nextStation:      nextStationObj,
          stations,
        };

        cache.set(trainNumber, { data: formattedTrain, timestamp: Date.now() });
        return NextResponse.json(formattedTrain);
      }
    }
  } catch (err: any) {
    console.error('RailRadar API error:', err.message);
  }

  // ── Fallback: serve static route with time-based active position ─────────
  let fallback = staticRoute
    ? { ...staticRoute, isStale: true }
    : { ...MUMBAI_RAJDHANI_TRAIN, id: trainNumber, trainNumber, isStale: true };

  // Calculate dynamic fallback train position based on current time
  if (fallback.stations && fallback.stations.length >= 2) {
    const stations = fallback.stations;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    let activeSegmentIdx = 0;
    for (let i = 0; i < stations.length - 1; i++) {
      const depStr = stations[i].departureTime;
      if (depStr && depStr !== '--') {
        const [h, m] = depStr.split(':').map(Number);
        if (!isNaN(h) && !isNaN(m)) {
          const depMins = h * 60 + m;
          if (currentMins >= depMins) {
            activeSegmentIdx = i;
          }
        }
      }
    }

    const nextIdx = Math.min(stations.length - 1, activeSegmentIdx + 1);

    stations.forEach((s, idx) => {
      s.isPassed = idx < activeSegmentIdx;
      s.isCurrent = idx === activeSegmentIdx;
      s.isNext = idx === nextIdx && nextIdx !== activeSegmentIdx;
    });

    const currSt = stations[activeSegmentIdx];
    const nextSt = stations[nextIdx];

    // Compute progress between currSt and nextSt
    let p = 0.5;
    if (nextSt && nextSt !== currSt) {
      const depStr = currSt.departureTime;
      const arrStr = nextSt.arrivalTime;
      if (depStr && arrStr && depStr !== '--' && arrStr !== '--') {
        const [dh, dm] = depStr.split(':').map(Number);
        const [ah, am] = arrStr.split(':').map(Number);
        const depM = dh * 60 + dm;
        let arrM = ah * 60 + am;
        if (arrM < depM) arrM += 24 * 60; // next day
        const span = arrM - depM;
        if (span > 0) {
          let elapsed = currentMins - depM;
          if (elapsed < 0) elapsed += 24 * 60;
          p = Math.max(0.05, Math.min(0.95, elapsed / span));
        }
      }
    }

    const curLat = currSt.latitude + p * (nextSt.latitude - currSt.latitude);
    const curLon = currSt.longitude + p * (nextSt.longitude - currSt.longitude);

    fallback = {
      ...fallback,
      currentLatitude: curLat,
      currentLongitude: curLon,
      currentStation: currSt,
      nextStation: nextSt,
      distanceCovered: Math.round(currSt.distanceFromOrigin + p * (nextSt.distanceFromOrigin - currSt.distanceFromOrigin)),
      distanceRemaining: Math.max(0, fallback.totalDistance - Math.round(currSt.distanceFromOrigin + p * (nextSt.distanceFromOrigin - currSt.distanceFromOrigin))),
      completionPercent: Math.min(100, Math.round(((currSt.distanceFromOrigin + p * (nextSt.distanceFromOrigin - currSt.distanceFromOrigin)) / fallback.totalDistance) * 100)),
    };
  }

  cache.set(trainNumber, { data: fallback, timestamp: Date.now() });
  return NextResponse.json(fallback);
}

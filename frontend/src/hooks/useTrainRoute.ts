'use client';

import { useMemo } from 'react';
import { Train, Station, ElevationPoint } from '@/types';
import { MOCK_ELEVATION_PROFILE } from '@/data/mockData';

interface TrainRouteStats {
  completedStations: Station[];
  remainingStations: Station[];
  currentStationIndex: number;
  haltStations: Station[];
  passStations: Station[];
  completedCoords: [number, number][];
  remainingCoords: [number, number][];
  elevationProfile: ElevationPoint[];
  avgDelay: number;
  onTimePercent: number;
  maxSpeed: number;
  stationsVisited: number;
  stationsRemaining: number;
}

/**
 * Hook that derives all route-level statistics from the current Train object.
 * Uses useMemo to avoid recomputing on every render.
 */
export function useTrainRoute(train: Train): TrainRouteStats {
  return useMemo(() => {
    const stations = train.stations || [];
    const currentStationIndex = Math.max(0, stations.findIndex((s) => s.isCurrent));

    const completedStations = stations.filter((s) => s.isPassed);
    const remainingStations = stations.filter((s) => !s.isPassed && !s.isCurrent);
    const haltStations = stations.filter((s) => s.isHalt !== false);
    const passStations = stations.filter((s) => s.isHalt === false);

    // GeoJSON coordinate arrays for map layers
    const completedCoords: [number, number][] = [
      ...stations
        .slice(0, currentStationIndex + 1)
        .map((s): [number, number] => [s.longitude, s.latitude]),
      [train.currentLongitude, train.currentLatitude],
    ];

    const remainingCoords: [number, number][] = [
      [train.currentLongitude, train.currentLatitude],
      ...stations
        .slice(currentStationIndex + 1)
        .map((s): [number, number] => [s.longitude, s.latitude]),
    ];

    // Elevation profile from station data
    const elevationProfile: ElevationPoint[] = stations.length > 0
      ? stations.map((s) => ({
          distanceKm: s.distanceFromOrigin,
          elevationM: s.elevation,
          stationName: s.isHalt !== false ? s.name : undefined,
        }))
      : MOCK_ELEVATION_PROFILE;

    // Delay analytics
    const passedStationsWithDelay = completedStations.filter((s) => s.delayMinutes !== undefined);
    const avgDelay =
      passedStationsWithDelay.length > 0
        ? Math.round(
            passedStationsWithDelay.reduce((sum, s) => sum + (s.delayMinutes || 0), 0) /
              passedStationsWithDelay.length
          )
        : 0;

    const onTimeCount = passedStationsWithDelay.filter((s) => (s.delayMinutes || 0) <= 5).length;
    const onTimePercent =
      passedStationsWithDelay.length > 0
        ? Math.round((onTimeCount / passedStationsWithDelay.length) * 100)
        : 100;

    const maxSpeed = train.speed; // can be extended to track historical max

    return {
      completedStations,
      remainingStations,
      currentStationIndex,
      haltStations,
      passStations,
      completedCoords,
      remainingCoords,
      elevationProfile,
      avgDelay,
      onTimePercent,
      maxSpeed,
      stationsVisited: completedStations.length,
      stationsRemaining: remainingStations.length,
    };
  }, [train]);
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Train } from '@/types';
import { getLiveTrainStatusApi } from '@/services/railradar';
import { useTrainStore } from '@/store/useTrainStore';

const POLL_INTERVAL_MS = 30_000;
const STALE_THRESHOLD_MS = 120_000; // 2 minutes

interface UseLiveTrackingReturn {
  trainStatus: Train | null;
  isLoading: boolean;
  isStale: boolean;
  lastUpdated: Date | null;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook that polls RailRadar for live train status every 30 seconds.
 * Provides staleness detection and manual refresh capability.
 */
export function useLiveTracking(trainId: string): UseLiveTrackingReturn {
  const { isAutoRefreshEnabled, setSelectedTrain, updateTrainLocation } = useTrainStore();

  const [trainStatus, setTrainStatus] = useState<Train | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const staleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getLiveTrainStatusApi(trainId);
      setTrainStatus(data);
      setSelectedTrain(data);
      updateTrainLocation(data.currentLatitude, data.currentLongitude, data.speed, data.delayMinutes);
      setError(null);
      setIsStale(false);

      const now = new Date();
      setLastUpdated(now);

      // Staleness timer: mark stale if no refresh in 2 minutes
      if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
      staleTimerRef.current = setTimeout(() => setIsStale(true), STALE_THRESHOLD_MS);
    } catch (e: any) {
      setError('Unable to fetch live data. Showing cached information.');
      setIsStale(true);
    } finally {
      setIsLoading(false);
    }
  }, [trainId, setSelectedTrain, updateTrainLocation]);

  // Initial fetch
  useEffect(() => {
    setIsLoading(true);
    fetchStatus();
  }, [trainId, fetchStatus]);

  // Polling interval
  useEffect(() => {
    if (!isAutoRefreshEnabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoRefreshEnabled, fetchStatus]);

  // Cleanup stale timer on unmount
  useEffect(() => {
    return () => {
      if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    trainStatus,
    isLoading,
    isStale,
    lastUpdated,
    error,
    refresh: fetchStatus,
  };
}

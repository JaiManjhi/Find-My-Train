'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';
import ProgressRing from '@/components/ui/ProgressRing';
import StatusBadge from '@/components/ui/StatusBadge';
import Timeline from '@/components/ui/Timeline';
import AnalyticsCard from '@/components/cards/AnalyticsCard';
import WeatherCard from '@/components/cards/WeatherCard';
import AttractionCard from '@/components/cards/AttractionCard';
import Toast from '@/components/ui/Toast';
import { DashboardSkeleton } from '@/components/ui/SkeletonLoader';
import { useLiveTracking } from '@/hooks/useLiveTracking';
import { useTrainRoute } from '@/hooks/useTrainRoute';
import { MUMBAI_RAJDHANI_TRAIN, MOCK_NEARBY_ATTRACTIONS } from '@/data/mockData';
import { getStaticTrainRoute } from '@/data/trainDatabase';
import { getNearbyPlaces } from '@/services/places';
import { Attraction } from '@/types';
import {
  Share2, Gauge, Activity, CloudSun, Compass, ListOrdered,
  Check, MapPin, Radio, ChevronLeft, RefreshCw, AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

// Dynamic import of map (heavy MapLibre bundle — only load client-side)
const TrainMap = dynamic(() => import('@/components/map/TrainMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full min-h-[450px] rounded-xl flex items-center justify-center"
      style={{ background: '#0A0E1A', border: '1px solid #1F2937' }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          className="animate-pulse"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(0,122,255,0.2)', margin: '0 auto 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#007AFF' }} />
        </div>
        <p style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#4B5563' }}>
          Loading map…
        </p>
      </div>
    </div>
  ),
});

export default function LiveDashboardPage() {
  const params = useParams();
  const trainId = (params?.trainId as string) || '12951';

  // Live tracking hook — handles polling, staleness, retry
  const { trainStatus, isLoading, isStale, lastUpdated, error, refresh } = useLiveTracking(trainId);
  // Use correct per-train static data as placeholder while live data loads
  const staticFallback = getStaticTrainRoute(trainId) ?? MUMBAI_RAJDHANI_TRAIN;
  const train = trainStatus ?? staticFallback;

  // Route stats
  const routeStats = useTrainRoute(train);

  const [activeTab, setActiveTab] = useState<'map' | 'timeline' | 'analytics' | 'weather' | 'places'>('map');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [nearbyAttractions, setNearbyAttractions] = useState<Attraction[]>(MOCK_NEARBY_ATTRACTIONS);

  // Fetch nearby attractions when coordinates change
  useEffect(() => {
    getNearbyPlaces(train.currentLatitude, train.currentLongitude).then((places) => {
      if (places?.length > 0) setNearbyAttractions(places);
    });
  }, [train.currentLatitude, train.currentLongitude]);

  // Toast on refresh / stale
  useEffect(() => {
    if (isStale) setToastMessage('Live data is stale. Tap ↻ to refresh.');
  }, [isStale]);

  useEffect(() => {
    if (lastUpdated && !isLoading) {
      setToastMessage(
        `Live data updated at ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
      );
    }
  }, [lastUpdated]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setToastMessage('Journey link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const TABS = [
    { id: 'map',       label: 'Live Map',   icon: MapPin },
    { id: 'timeline',  label: 'Stops',      icon: ListOrdered },
    { id: 'analytics', label: 'Analytics',  icon: Activity },
    { id: 'weather',   label: 'Weather',    icon: CloudSun },
    { id: 'places',    label: 'Places',     icon: Compass },
  ] as const;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0A0E1A' }}>
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0E1A' }}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-4">

        {/* ── Staleness Warning Banner ── */}
        {isStale && (
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm"
            style={{ background: 'rgba(255,176,0,0.06)', borderColor: '#FFB000', color: '#FFB000' }}
          >
            <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0 }} />
            <span className="flex-1">Live data is stale — last synced {lastUpdated?.toLocaleTimeString() || 'unknown'}</span>
            <button
              onClick={() => { refresh(); setToastMessage('Refreshing live data…'); }}
              className="flex items-center gap-1 text-xs font-mono font-semibold hover:opacity-70 transition-opacity"
            >
              <RefreshCw style={{ width: 12, height: 12 }} /> Refresh
            </button>
          </div>
        )}

        {/* ── Error Banner ── */}
        {error && !isStale && (
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm"
            style={{ background: 'rgba(239,68,68,0.06)', borderColor: '#EF4444', color: '#EF4444' }}
          >
            <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Train Header ── */}
        <div
          className="rounded-xl border p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ background: '#161B22', borderColor: '#1F2937' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Link
                href="/"
                className="p-1 rounded border transition-colors hover:border-[#007AFF]"
                style={{ borderColor: '#1F2937' }}
                aria-label="Back to home"
              >
                <ChevronLeft style={{ width: 16, height: 16, color: '#94A3B8' }} />
              </Link>
              <span
                className="px-2 py-0.5 rounded text-[11px] font-mono font-bold"
                style={{ background: 'rgba(0,122,255,0.1)', color: '#007AFF', border: '1px solid rgba(0,122,255,0.3)' }}
              >
                #{train.trainNumber}
              </span>
              <StatusBadge delayMinutes={train.delayMinutes} />
              <span className="hidden sm:flex items-center gap-1 text-xs font-mono" style={{ color: '#4B5563' }}>
                <Radio style={{ width: 11, height: 11, color: '#10B981' }} />
                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Syncing…'}
              </span>
            </div>
            <h1
              className="font-bold text-xl text-white"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {train.trainName}
            </h1>
            <p className="text-xs mt-0.5 font-mono" style={{ color: '#94A3B8' }}>
              {train.origin} → {train.destination} · {train.totalDistance} km · {train.totalDuration}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono"
              style={{ background: 'transparent', borderColor: '#1F2937', color: '#F8FAFC' }}
            >
              <Gauge style={{ width: 14, height: 14, color: '#007AFF' }} />
              <span className="font-semibold">{train.speed} km/h</span>
            </div>
            <button
              onClick={() => { refresh(); setToastMessage('Refreshing live data…'); }}
              className="p-2 rounded-lg border transition-colors hover:border-[#007AFF]"
              style={{ borderColor: '#1F2937', background: 'transparent' }}
              title="Refresh"
              aria-label="Refresh live train data"
            >
              <RefreshCw style={{ width: 14, height: 14, color: '#94A3B8' }} />
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80"
              style={{ background: '#007AFF' }}
              aria-label="Copy share link"
            >
              {isCopied ? <Check style={{ width: 14, height: 14 }} /> : <Share2 style={{ width: 14, height: 14 }} />}
              {isCopied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div
          className="flex items-center gap-0.5 p-1 rounded-xl border overflow-x-auto"
          style={{ background: '#161B22', borderColor: '#1F2937' }}
          role="tablist"
          aria-label="Dashboard sections"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${id}`}
                onClick={() => setActiveTab(id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                style={{
                  background: isActive ? '#007AFF' : 'transparent',
                  color: isActive ? '#fff' : '#94A3B8',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  outline: 'none',
                }}
              >
                <Icon style={{ width: 14, height: 14 }} />
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Map Tab ── */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" role="tabpanel" id="panel-map">
            <div className="lg:col-span-2 h-[480px]">
              <TrainMap train={train} onRefresh={refresh} />
            </div>

            <div className="space-y-3">
              {/* Journey Progress */}
              <div
                className="p-4 rounded-xl border flex items-center justify-around"
                style={{ background: '#161B22', borderColor: '#1F2937' }}
              >
                <ProgressRing
                  percentage={train.completionPercent}
                  label="DONE"
                  sublabel={`${train.distanceRemaining} km`}
                  color="#007AFF"
                />
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#4B5563]">Covered</div>
                    <div className="font-bold text-white text-lg" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {train.distanceCovered} km
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#4B5563]">Duration</div>
                    <div className="font-bold text-white text-base" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {train.totalDuration}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#4B5563]">On-Time</div>
                    <div
                      className="font-bold text-base"
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        color: routeStats.onTimePercent >= 80 ? '#10B981' : '#FFB000',
                      }}
                    >
                      {routeStats.onTimePercent}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Station */}
              <div
                className="p-4 rounded-xl border"
                style={{ background: '#161B22', borderColor: '#007AFF' }}
                aria-label="Current station"
              >
                <div className="text-[10px] font-mono uppercase text-[#007AFF] mb-2 tracking-wider">Current Station</div>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="font-bold text-base text-white">{train.currentStation.name}</div>
                    <div className="text-xs text-[#94A3B8] font-mono mt-0.5">
                      Pf {train.currentStation.platform} · {train.currentStation.code}
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs font-semibold" style={{ color: '#10B981' }}>
                    Dep: {train.currentStation.departureTime}
                  </div>
                </div>
              </div>

              {/* Next Station */}
              <div
                className="p-4 rounded-xl border"
                style={{ background: '#161B22', borderColor: '#1F2937' }}
                aria-label="Next station"
              >
                <div className="text-[10px] font-mono uppercase text-[#FFB000] mb-2 tracking-wider">Next Stop</div>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="font-bold text-base text-white">{train.nextStation.name}</div>
                    <div className="text-xs text-[#94A3B8] font-mono mt-0.5">
                      {Math.max(0, train.nextStation.distanceFromOrigin - train.currentStation.distanceFromOrigin)} km away
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs font-semibold" style={{ color: '#FFB000' }}>
                    ETA: {train.nextStation.arrivalTime}
                  </div>
                </div>
              </div>

              {/* Speed bar */}
              <div
                className="p-4 rounded-xl border"
                style={{ background: '#161B22', borderColor: '#1F2937' }}
              >
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[10px] font-mono uppercase text-[#4B5563]">Speed</span>
                  <span className="font-mono font-bold text-white">{train.speed} km/h</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#1F2937' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (train.speed / 160) * 100)}%`, background: '#007AFF' }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#4B5563] font-mono mt-1">
                  <span>0</span>
                  <span>160 km/h</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Stops / Timeline Tab ── */}
        {activeTab === 'timeline' && (
          <div
            className="p-5 rounded-xl border max-w-3xl mx-auto"
            style={{ background: '#161B22', borderColor: '#1F2937' }}
            role="tabpanel" id="panel-timeline"
          >
            <div className="flex items-center gap-2 mb-5">
              <ListOrdered style={{ width: 18, height: 18, color: '#007AFF' }} />
              <h3 className="font-bold text-base text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Route & Arrival Timeline
              </h3>
              <span className="ml-auto text-[10px] font-mono text-[#4B5563]">
                {routeStats.haltStations.length} halt stations · {routeStats.stationsVisited} passed
              </span>
            </div>
            <Timeline stations={train.stations} />
          </div>
        )}

        {/* ── Analytics Tab ── */}
        {activeTab === 'analytics' && (
          <div role="tabpanel" id="panel-analytics">
            <AnalyticsCard train={train} />
          </div>
        )}

        {/* ── Weather Tab ── */}
        {activeTab === 'weather' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="tabpanel" id="panel-weather">
            <WeatherCard
              stationCode={train.currentStation.code}
              stationName={`${train.currentStation.name} (Current)`}
              lat={train.currentStation.latitude}
              lon={train.currentStation.longitude}
            />
            <WeatherCard
              stationCode={train.nextStation.code}
              stationName={`${train.nextStation.name} (Next)`}
              lat={train.nextStation.latitude}
              lon={train.nextStation.longitude}
            />
            <WeatherCard
              stationCode="NDLS"
              stationName="New Delhi (Destination)"
              lat={28.643}
              lon={77.2194}
            />
          </div>
        )}

        {/* ── Places Tab ── */}
        {activeTab === 'places' && (
          <div className="space-y-4" role="tabpanel" id="panel-places">
            <div>
              <h3
                className="font-bold text-base text-white flex items-center gap-2"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                <Compass style={{ width: 18, height: 18, color: '#FFB000' }} />
                Nearby Geographical Landmarks
              </h3>
              <p className="text-xs font-mono mt-0.5" style={{ color: '#4B5563' }}>
                Overpass API · rivers, bridges, tunnels, mountains · {train.currentStation.name} area
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearbyAttractions.map((attraction) => (
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </div>
          </div>
        )}

      </main>

      <Toast
        message={toastMessage || ''}
        isVisible={!!toastMessage}
        type={isStale ? 'warning' : 'info'}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

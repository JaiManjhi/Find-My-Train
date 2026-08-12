'use client';

import { useState, useEffect, useRef } from 'react';
import { Train, ElevationPoint } from '@/types';
import { useTrainRoute } from '@/hooks/useTrainRoute';
import { getElevationProfile } from '@/services/elevation';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { Gauge, Clock, Mountain, Activity, CheckCircle2, TrendingUp, MapPin } from 'lucide-react';

interface AnalyticsCardProps {
  train: Train;
}

/** Animated counter that counts up from 0 to target */
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setDisplay(Math.round(from + (value - from) * ease));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return <span>{display}{suffix}</span>;
}

/** Custom tooltip for recharts with Precision Rail theme */
function PrTooltip({ active, payload, label, unit = '' }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#161B22', border: '1px solid #1F2937', borderRadius: 8,
      padding: '8px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#F8FAFC',
    }}>
      <div style={{ color: '#94A3B8', marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#007AFF', fontWeight: 700 }}>{payload[0]?.value}{unit}</div>
    </div>
  );
}

export default function AnalyticsCard({ train }: AnalyticsCardProps) {
  const { elevationProfile: routeElevation, avgDelay, onTimePercent, stationsVisited } = useTrainRoute(train);
  const [elevationData, setElevationData] = useState<ElevationPoint[]>(routeElevation);

  // Fetch live elevation profile from OpenTopography
  useEffect(() => {
    async function fetchElevation() {
      const coords = train.stations.map((s) => ({
        lat: s.latitude, lon: s.longitude,
        distanceKm: s.distanceFromOrigin,
        stationName: s.isHalt !== false ? s.name : undefined,
      }));
      const data = await getElevationProfile(coords);
      if (data?.length > 0) setElevationData(data);
    }
    fetchElevation();
  }, [train.stations]);

  // Delay chart data (per halt station)
  const delayChartData = train.stations
    .filter((s) => s.isHalt !== false && s.isPassed)
    .map((s) => ({
      name: s.code,
      delay: s.delayMinutes || 0,
      onTime: (s.delayMinutes || 0) <= 5,
    }));

  const highestElevation = Math.max(...elevationData.map((p) => p.elevationM));
  const peakStation = elevationData.find((p) => p.elevationM === highestElevation)?.stationName || 'En Route';

  const METRIC_CARDS = [
    {
      label: 'Completion',
      value: train.completionPercent,
      suffix: '%',
      sublabel: `${train.distanceCovered} / ${train.totalDistance} km`,
      icon: Activity,
      color: '#007AFF',
    },
    {
      label: 'Current Delay',
      value: train.delayMinutes,
      suffix: 'm',
      sublabel: `Avg ${avgDelay}m on this route`,
      icon: Clock,
      color: train.delayMinutes > 10 ? '#EF4444' : train.delayMinutes > 0 ? '#FFB000' : '#10B981',
    },
    {
      label: 'Speed',
      value: train.speed,
      suffix: ' km/h',
      sublabel: 'Current cruising speed',
      icon: Gauge,
      color: '#10B981',
    },
    {
      label: 'On Time',
      value: onTimePercent,
      suffix: '%',
      sublabel: `${stationsVisited} stations passed`,
      icon: CheckCircle2,
      color: onTimePercent >= 80 ? '#10B981' : '#FFB000',
    },
    {
      label: 'Max Elevation',
      value: highestElevation,
      suffix: 'm',
      sublabel: peakStation,
      icon: Mountain,
      color: '#A855F7',
    },
    {
      label: 'Distance Left',
      value: train.distanceRemaining,
      suffix: ' km',
      sublabel: `Total ${train.totalDistance} km`,
      icon: MapPin,
      color: '#94A3B8',
    },
  ];

  return (
    <div className="space-y-4">
      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {METRIC_CARDS.map(({ label, value, suffix, sublabel, icon: Icon, color }) => (
          <div
            key={label}
            className="p-4 rounded-xl border flex flex-col gap-2"
            style={{ background: '#161B22', borderColor: '#1F2937' }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-mono font-semibold uppercase tracking-wider"
                style={{ color: '#4B5563' }}
              >
                {label}
              </span>
              <Icon style={{ width: 14, height: 14, color }} />
            </div>
            <div
              className="text-xl font-bold"
              style={{ color: '#F8FAFC', fontFamily: 'JetBrains Mono, monospace' }}
            >
              <AnimatedCounter value={value} suffix={suffix} />
            </div>
            <div className="text-[11px]" style={{ color: '#4B5563' }}>
              {sublabel}
            </div>
          </div>
        ))}
      </div>

      {/* ── Elevation Profile Chart ── */}
      <div
        className="p-5 rounded-xl border space-y-3"
        style={{ background: '#161B22', borderColor: '#1F2937' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4
              className="font-semibold text-base text-white flex items-center gap-2"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              <Mountain className="w-4 h-4" style={{ color: '#A855F7' }} />
              Route Elevation Profile
            </h4>
            <p className="text-xs mt-0.5" style={{ color: '#4B5563', fontFamily: 'JetBrains Mono, monospace' }}>
              Topographical elevation · Mumbai → Delhi · OpenTopography
            </p>
          </div>
          <span
            className="text-[11px] px-2.5 py-1 rounded border font-mono"
            style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', color: '#A855F7' }}
          >
            {highestElevation}m peak
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={elevationData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis
                dataKey="distanceKm"
                stroke="#4B5563"
                fontSize={10}
                tickFormatter={(v) => `${v}km`}
                fontFamily="JetBrains Mono, monospace"
              />
              <YAxis
                stroke="#4B5563"
                fontSize={10}
                tickFormatter={(v) => `${v}m`}
                fontFamily="JetBrains Mono, monospace"
              />
              <Tooltip content={<PrTooltip unit="m" />} />
              <Area
                type="monotone"
                dataKey="elevationM"
                stroke="#A855F7"
                strokeWidth={2}
                fill="url(#elevGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#A855F7', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Delay Chart ── */}
      {delayChartData.length > 0 && (
        <div
          className="p-5 rounded-xl border space-y-3"
          style={{ background: '#161B22', borderColor: '#1F2937' }}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#FFB000' }} />
            <h4
              className="font-semibold text-base text-white"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Station Delay History
            </h4>
            <span className="ml-auto text-[10px] font-mono" style={{ color: '#4B5563' }}>
              {onTimePercent}% on-time
            </span>
          </div>

          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayChartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" stroke="#4B5563" fontSize={10} fontFamily="JetBrains Mono, monospace" />
                <YAxis stroke="#4B5563" fontSize={10} tickFormatter={(v) => `${v}m`} fontFamily="JetBrains Mono, monospace" />
                <Tooltip content={<PrTooltip unit="m delay" />} />
                <ReferenceLine y={5} stroke="#1F2937" strokeDasharray="4 2" label={{ value: 'On-Time', fill: '#4B5563', fontSize: 10 }} />
                <Bar
                  dataKey="delay"
                  radius={[4, 4, 0, 0]}
                  fill="#FFB000"
                  fillOpacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Journey Summary ── */}
      <div
        className="p-5 rounded-xl border"
        style={{ background: '#161B22', borderColor: '#1F2937' }}
      >
        <h4
          className="font-semibold text-sm text-white mb-4"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Journey Summary
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Train', value: `#${train.trainNumber}` },
            { label: 'Duration', value: train.totalDuration },
            { label: 'Stations', value: `${train.stations.filter(s => s.isHalt !== false).length} halts` },
            { label: 'Status', value: train.delayMinutes > 0 ? `${train.delayMinutes}m late` : 'On Time' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div
                className="text-[10px] font-mono uppercase tracking-wider mb-1"
                style={{ color: '#4B5563' }}
              >
                {label}
              </div>
              <div
                className="text-sm font-bold"
                style={{ color: '#F8FAFC', fontFamily: 'JetBrains Mono, monospace' }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

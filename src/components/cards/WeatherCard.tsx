'use client';

import { useEffect, useState } from 'react';
import { getWeatherByCoords, LiveWeather } from '@/services/weather';
import { Sun, Cloud, CloudRain, Wind, Droplets, Eye, Thermometer, CloudFog } from 'lucide-react';

interface WeatherCardProps {
  stationCode: string;
  stationName?: string;
  lat?: number;
  lon?: number;
}

function WeatherIcon({ icon, size = 24 }: { icon: string; size?: number }) {
  const s = { width: size, height: size };
  if (icon?.includes('01') || icon === 'sun') return <Sun style={{ ...s, color: '#FFB000' }} />;
  if (icon?.includes('02') || icon?.includes('03') || icon?.includes('04') || icon === 'cloud-fog')
    return <Cloud style={{ ...s, color: '#94A3B8' }} />;
  if (icon?.includes('09') || icon?.includes('10') || icon === 'cloud-rain')
    return <CloudRain style={{ ...s, color: '#007AFF' }} />;
  if (icon?.includes('50')) return <CloudFog style={{ ...s, color: '#94A3B8' }} />;
  return <Sun style={{ ...s, color: '#FFB000' }} />;
}

function ConditionBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div style={{ background: '#1F2937', borderRadius: 999, height: 4, width: '100%', overflow: 'hidden' }}>
      <div
        style={{
          width: `${Math.min(100, (value / max) * 100)}%`,
          height: '100%',
          background: color,
          borderRadius: 999,
          transition: 'width 0.8s ease',
        }}
      />
    </div>
  );
}

export default function WeatherCard({ stationCode, stationName, lat = 23.332, lon = 75.038 }: WeatherCardProps) {
  const [weather, setWeather] = useState<LiveWeather | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getWeatherByCoords(lat, lon).then((data) => {
      setWeather({ ...data, stationCode, stationName: stationName || data.stationName });
      setIsLive(true);
      setIsLoading(false);
    });
  }, [stationCode, lat, lon, stationName]);

  if (isLoading) {
    return (
      <div
        className="p-5 rounded-xl border space-y-3"
        style={{ background: '#161B22', borderColor: '#1F2937', minHeight: 200 }}
      >
        <div style={{ height: 12, background: '#1F2937', borderRadius: 4, width: '60%', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: 36, background: '#1F2937', borderRadius: 4, width: '40%', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: 12, background: '#1F2937', borderRadius: 4, width: '80%', animation: 'pulse 1.5s infinite' }} />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div
      className="p-5 rounded-xl border space-y-4 transition-all hover:border-[#007AFF]"
      style={{ background: '#161B22', borderColor: '#1F2937' }}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="text-[10px] font-mono uppercase tracking-wider"
              style={{ color: '#007AFF' }}
            >
              Live OpenWeather
            </span>
            {isLive && (
              <span
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}
                className="animate-pulse"
              />
            )}
          </div>
          <h4
            className="font-bold text-base text-white"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {weather.stationName}
          </h4>
          <div className="text-xs mt-0.5" style={{ color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>
            {stationCode} · {lat.toFixed(2)}°N
          </div>
        </div>
        <div
          style={{
            width: 48, height: 48, borderRadius: 10,
            background: '#1F2937', border: '1px solid #1F2937',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <WeatherIcon icon={weather.icon} size={24} />
        </div>
      </div>

      {/* ── Temperature ── */}
      <div className="flex items-baseline gap-2">
        <span
          className="font-bold text-3xl text-white"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {weather.tempC}°C
        </span>
        <span className="text-sm" style={{ color: '#94A3B8' }}>
          {weather.condition}
        </span>
      </div>
      <div className="text-xs" style={{ color: '#4B5563', fontFamily: 'JetBrains Mono, monospace' }}>
        Feels like {weather.feelsLike}°C
      </div>

      {/* ── Condition Bars ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="flex items-center gap-1.5" style={{ color: '#94A3B8' }}>
            <Droplets style={{ width: 12, height: 12, color: '#007AFF' }} />
            Humidity
          </span>
          <span style={{ color: '#F8FAFC', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            {weather.humidity}%
          </span>
        </div>
        <ConditionBar value={weather.humidity} color="#007AFF" />

        <div className="flex items-center justify-between text-xs mt-2">
          <span className="flex items-center gap-1.5" style={{ color: '#94A3B8' }}>
            <Wind style={{ width: 12, height: 12, color: '#10B981' }} />
            Wind
          </span>
          <span style={{ color: '#F8FAFC', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            {weather.windSpeedKm} km/h
          </span>
        </div>
        <ConditionBar value={weather.windSpeedKm} max={80} color="#10B981" />

        <div className="flex items-center justify-between text-xs mt-2">
          <span className="flex items-center gap-1.5" style={{ color: '#94A3B8' }}>
            <CloudRain style={{ width: 12, height: 12, color: '#60A5FA' }} />
            Rain chance
          </span>
          <span style={{ color: '#F8FAFC', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            {weather.rainProbability}%
          </span>
        </div>
        <ConditionBar value={weather.rainProbability} color="#60A5FA" />
      </div>

      {/* ── Visibility ── */}
      <div
        className="flex items-center justify-between pt-3 border-t text-xs"
        style={{ borderColor: '#1F2937', color: '#94A3B8' }}
      >
        <span className="flex items-center gap-1.5">
          <Eye style={{ width: 12, height: 12 }} />
          Visibility
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#F8FAFC', fontWeight: 600 }}>
          {weather.visibility} km
        </span>
      </div>

      {/* ── 3-Day Forecast ── */}
      {weather.forecast?.length > 0 && (
        <div className="pt-3 border-t" style={{ borderColor: '#1F2937' }}>
          <div className="text-[10px] font-mono uppercase text-[#4B5563] mb-2 tracking-wider">3-Day Forecast</div>
          <div className="grid grid-cols-3 gap-2">
            {weather.forecast.map((day) => (
              <div
                key={day.date}
                className="text-center p-2 rounded-lg border"
                style={{ background: '#1F2937', borderColor: '#1F2937' }}
              >
                <div className="text-[10px] font-mono" style={{ color: '#4B5563' }}>{day.date}</div>
                <div className="my-1.5 flex justify-center">
                  <WeatherIcon icon={day.icon} size={16} />
                </div>
                <div className="text-xs font-mono font-bold" style={{ color: '#F8FAFC' }}>
                  {day.tempMax}°
                </div>
                <div className="text-[10px] font-mono" style={{ color: '#4B5563' }}>
                  {day.tempMin}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

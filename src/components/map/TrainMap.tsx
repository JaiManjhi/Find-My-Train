'use client';

import { useRef, useEffect, useState, memo } from 'react';
import Map, { Marker, Source, Layer, MapRef, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Train, Station } from '@/types';
import { useTrainStore } from '@/store/useTrainStore';
import { useTrainRoute } from '@/hooks/useTrainRoute';
import { Navigation, ZoomIn, ZoomOut, Train as TrainIcon, Layers, RefreshCw, Compass, MapPin } from 'lucide-react';

interface TrainMapProps {
  train: Train;
  onRefresh?: () => void;
}

// ─── Map style options ───────────────────────────────────────────────────────
const getTileSources = (key: string) => [
  {
    label: 'Dark Night',
    icon: '🌙',
    url: `https://api.maptiler.com/maps/dataviz-dark/256/{z}/{x}/{y}.png?key=${key}`,
  },
  {
    label: 'Satellite',
    icon: '🛰',
    url: `https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=${key}`,
  },
  {
    label: 'Terrain',
    icon: '🏔',
    url: `https://api.maptiler.com/maps/topo-v2/256/{z}/{x}/{y}.png?key=${key}`,
  },
  {
    label: 'Carto Dark',
    icon: '🗺',
    url: 'https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
  },
];

// ─── Station dot styles ───────────────────────────────────────────────────────
function stationDotStyle(station: Station): React.CSSProperties {
  if (station.isCurrent) {
    return {
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #00D2FF, #007AFF)',
      border: '2.5px solid #ffffff',
      boxShadow: '0 0 16px rgba(0,210,255,0.85), 0 0 32px rgba(0,122,255,0.4)',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      zIndex: 10,
    };
  }
  if (station.isPassed) {
    return {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: '#007AFF',
      border: '2px solid rgba(0,122,255,0.6)',
      boxShadow: '0 0 6px rgba(0,122,255,0.5)',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    };
  }
  if (station.isNext) {
    return {
      width: 13,
      height: 13,
      borderRadius: '50%',
      background: '#1E293B',
      border: '2.5px solid #38BDF8',
      boxShadow: '0 0 8px rgba(56,189,248,0.5)',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    };
  }
  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#1E293B',
    border: '1.5px solid #334155',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  };
}

const TrainMap = memo(function TrainMap({ train, onRefresh }: TrainMapProps) {
  const mapRef = useRef<MapRef>(null);
  const { cameraFollow, setCameraFollow } = useTrainStore();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [tileStyleIndex, setTileStyleIndex] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showStylePicker, setShowStylePicker] = useState(false);

  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'Z839isQhb7eA3KbytO8x';
  const tileSources = getTileSources(maptilerKey);

  const { completedCoords, remainingCoords } = useTrainRoute(train);

  // Compute map center: midpoint of the full route
  const allStations = train.stations ?? [];
  const midIdx = Math.floor(allStations.length / 2);
  const centerLat = allStations[midIdx]?.latitude ?? train.currentLatitude;
  const centerLon = allStations[midIdx]?.longitude ?? train.currentLongitude;

  // Stable key representing the full set of stations — changes when a different
  // train's station list arrives so fitBounds re-triggers automatically.
  const stationKey = allStations.map((s) => s.code).join(',');

  // Camera follow: smooth flyTo on train position change
  useEffect(() => {
    if (cameraFollow && mapRef.current && isMapLoaded) {
      mapRef.current.flyTo({
        center: [train.currentLongitude, train.currentLatitude],
        zoom: 7.5,
        pitch: 45,
        bearing: 0,
        duration: 1800,
        essential: true,
      });
    }
  }, [train.currentLatitude, train.currentLongitude, cameraFollow, isMapLoaded]);

  // Resize fix on mount
  useEffect(() => {
    const t = setTimeout(() => mapRef.current?.getMap()?.resize(), 250);
    return () => clearTimeout(t);
  }, []);

  // Fit route bounds after map loads, and whenever the station set changes
  // (e.g. when live API data arrives and replaces the static placeholder)
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || allStations.length < 2) return;
    const lons = allStations.map((s) => s.longitude);
    const lats = allStations.map((s) => s.latitude);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const padLon = Math.max((maxLon - minLon) * 0.08, 0.5);
    const padLat = Math.max((maxLat - minLat) * 0.12, 0.5);
    mapRef.current.fitBounds(
      [[minLon - padLon, minLat - padLat], [maxLon + padLon, maxLat + padLat]],
      { duration: 1000, padding: { top: 60, bottom: 60, left: 60, right: 60 } }
    );
  }, [isMapLoaded, stationKey]); // stationKey changes when train or station data changes

  // Build GeoJSON for route lines
  const originFallback: [number, number] = [
    allStations[0]?.longitude ?? 72.82,
    allStations[0]?.latitude  ?? 19.0,
  ];
  const destFallback: [number, number] = [
    allStations[allStations.length - 1]?.longitude ?? 77.22,
    allStations[allStations.length - 1]?.latitude  ?? 28.64,
  ];

  const completedGeoJson: GeoJSON.Feature<GeoJSON.LineString> = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates:
        completedCoords.length >= 2
          ? completedCoords
          : [originFallback, [train.currentLongitude, train.currentLatitude]],
    },
    properties: {},
  };

  const remainingGeoJson: GeoJSON.Feature<GeoJSON.LineString> = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates:
        remainingCoords.length >= 2
          ? remainingCoords
          : [[train.currentLongitude, train.currentLatitude], destFallback],
    },
    properties: {},
  };

  // Only show halt stations
  const haltStations = allStations.filter((s) => s.isHalt !== false);

  // Status color
  const statusColor = train.status === 'ON_TIME' ? '#10B981' : train.status === 'DELAYED' ? '#F59E0B' : '#EF4444';

  return (
    <div
      className="relative w-full h-full min-h-[500px] overflow-hidden"
      style={{ background: '#060C18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}
    >
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: centerLon,
          latitude: centerLat,
          zoom: 5,   // fitBounds corrects this as soon as the map loads
          pitch: 30,
        }}
        mapStyle={{ version: 8, sources: {}, layers: [] }}
        style={{ width: '100%', height: '100%' }}
        onLoad={() => setIsMapLoaded(true)}
        attributionControl={false}
      >
        {/* ── Base tile layer ── */}
        <Source
          id="basemap"
          type="raster"
          tiles={[tileSources[tileStyleIndex].url]}
          tileSize={256}
          attribution="© MapTiler © OpenStreetMap contributors"
        >
          <Layer id="basemap-layer" type="raster" minzoom={0} maxzoom={22} />
        </Source>

        {/* ── Remaining route: subtle dashed ── */}
        <Source id="remaining-route" type="geojson" data={remainingGeoJson}>
          <Layer
            id="remaining-route-bg"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#1E3A5F',
              'line-width': 5,
              'line-opacity': 0.6,
            }}
          />
          <Layer
            id="remaining-route-line"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#38BDF8',
              'line-width': 2,
              'line-dasharray': [3, 4],
              'line-opacity': 0.7,
            }}
          />
        </Source>

        {/* ── Completed route: bright glowing blue ── */}
        <Source id="completed-route" type="geojson" data={completedGeoJson}>
          {/* Wide outer glow */}
          <Layer
            id="completed-route-glow2"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#00D2FF',
              'line-width': 22,
              'line-opacity': 0.08,
            }}
          />
          {/* Inner glow */}
          <Layer
            id="completed-route-glow"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#007AFF',
              'line-width': 12,
              'line-opacity': 0.2,
            }}
          />
          {/* Main solid line */}
          <Layer
            id="completed-route-line"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#00D2FF',
              'line-width': 4,
              'line-opacity': 1,
            }}
          />
        </Source>

        {/* ── Station Markers ── */}
        {haltStations.map((station) => (
          <Marker
            key={station.code}
            longitude={station.longitude}
            latitude={station.latitude}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedStation(station === selectedStation ? null : station);
            }}
          >
            <div style={stationDotStyle(station)} title={station.name} />
          </Marker>
        ))}

        {/* ── Live Train Marker ── */}
        <Marker
          longitude={train.currentLongitude}
          latitude={train.currentLatitude}
          anchor="center"
        >
          <div style={{ position: 'relative', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Outer pulse ring */}
            <div
              className="train-pulse"
              style={{
                position: 'absolute',
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,210,255,0.25) 0%, transparent 70%)',
              }}
            />
            {/* Middle ring */}
            <div
              style={{
                position: 'absolute',
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1.5px solid rgba(0,210,255,0.4)',
              }}
            />
            {/* Marker body */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00D2FF 0%, #007AFF 100%)',
                border: '2.5px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 0 24px rgba(0,210,255,0.8), 0 4px 12px rgba(0,0,0,0.5)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <TrainIcon style={{ width: 15, height: 15 }} />
            </div>
          </div>
        </Marker>

        {/* ── Station Info Popup ── */}
        {selectedStation && (
          <Popup
            longitude={selectedStation.longitude}
            latitude={selectedStation.latitude}
            onClose={() => setSelectedStation(null)}
            closeOnClick={false}
            offset={[0, -16] as [number, number]}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                border: '1px solid rgba(56,189,248,0.3)',
                borderRadius: 12,
                padding: '12px 16px',
                minWidth: 200,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: selectedStation.isCurrent
                      ? '#00D2FF'
                      : selectedStation.isPassed
                      ? '#007AFF'
                      : selectedStation.isNext
                      ? '#38BDF8'
                      : '#334155',
                    boxShadow: selectedStation.isCurrent ? '0 0 8px rgba(0,210,255,0.9)' : 'none',
                    flexShrink: 0,
                  }}
                />
                <div style={{ fontWeight: 700, fontSize: 14, color: '#F8FAFC', letterSpacing: '0.01em' }}>
                  {selectedStation.name}
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
                {selectedStation.code} · {selectedStation.distanceFromOrigin} km from origin
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '4px 8px',
                  fontSize: 11,
                  color: '#94A3B8',
                }}
              >
                <span style={{ color: '#64748B' }}>Arr</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{selectedStation.arrivalTime}</span>
                <span style={{ color: '#64748B' }}>Dep</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{selectedStation.departureTime}</span>
                {selectedStation.elevation && (
                  <>
                    <span style={{ color: '#64748B' }}>Elev</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{selectedStation.elevation}m</span>
                  </>
                )}
              </div>
              {selectedStation.delayMinutes > 0 && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#F59E0B',
                    background: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 6,
                    padding: '3px 8px',
                    display: 'inline-block',
                  }}
                >
                  +{selectedStation.delayMinutes}m delay
                </div>
              )}
              {(selectedStation.isCurrent || selectedStation.isNext) && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: selectedStation.isCurrent ? '#00D2FF' : '#38BDF8',
                    background: selectedStation.isCurrent ? 'rgba(0,210,255,0.1)' : 'rgba(56,189,248,0.1)',
                    border: `1px solid ${selectedStation.isCurrent ? 'rgba(0,210,255,0.3)' : 'rgba(56,189,248,0.3)'}`,
                    borderRadius: 6,
                    padding: '3px 8px',
                    display: 'inline-block',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {selectedStation.isCurrent ? '● Current Station' : '◎ Next Stop'}
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* ── Gradient overlay: top fade ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          background: 'linear-gradient(to bottom, rgba(6,12,24,0.6) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* ── Train label header ── */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            background: 'rgba(6,12,24,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '6px 12px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: statusColor,
              boxShadow: `0 0 6px ${statusColor}`,
              flexShrink: 0,
            }}
            className="animate-pulse"
          />
          <span
            style={{
              fontSize: 11,
              fontFamily: 'JetBrains Mono, monospace',
              color: '#CBD5E1',
              letterSpacing: '0.04em',
            }}
          >
            #{train.trainNumber} · {train.speed} km/h
          </span>
        </div>
      </div>

      {/* ── Right-side controls ── */}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 10 }}>

        {/* Camera Follow */}
        <button
          onClick={() => setCameraFollow(!cameraFollow)}
          title="Toggle Camera Follow"
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: cameraFollow
              ? 'linear-gradient(135deg, #007AFF, #00D2FF)'
              : 'rgba(15,23,42,0.9)',
            border: `1px solid ${cameraFollow ? 'rgba(0,210,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
            color: cameraFollow ? '#fff' : '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            boxShadow: cameraFollow ? '0 0 12px rgba(0,122,255,0.5)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          <Navigation style={{ width: 15, height: 15 }} />
        </button>

        {/* Fit Route */}
        <button
          onClick={() => {
            if (!mapRef.current || allStations.length < 2) return;
            const lons = allStations.map((s) => s.longitude);
            const lats = allStations.map((s) => s.latitude);
            const padLon = (Math.max(...lons) - Math.min(...lons)) * 0.08;
            const padLat = (Math.max(...lats) - Math.min(...lats)) * 0.12;
            mapRef.current.fitBounds(
              [[Math.min(...lons) - padLon, Math.min(...lats) - padLat],
               [Math.max(...lons) + padLon, Math.max(...lats) + padLat]],
              { duration: 1000, padding: { top: 60, bottom: 60, left: 60, right: 60 } }
            );
          }}
          title="Fit Full Route"
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.2s',
          }}
        >
          <Compass style={{ width: 15, height: 15 }} />
        </button>

        {/* Map Style */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowStylePicker(!showStylePicker)}
            title="Switch Map Style"
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(15,23,42,0.9)',
              border: `1px solid ${showStylePicker ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}
          >
            <Layers style={{ width: 15, height: 15 }} />
          </button>

          {/* Style Picker Dropdown */}
          {showStylePicker && (
            <div
              style={{
                position: 'absolute',
                right: 44,
                top: 0,
                background: 'rgba(10,16,30,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: 6,
                width: 140,
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {tileSources.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => { setTileStyleIndex(idx); setShowStylePicker(false); }}
                  style={{
                    background: tileStyleIndex === idx ? 'rgba(0,122,255,0.2)' : 'transparent',
                    border: `1px solid ${tileStyleIndex === idx ? 'rgba(0,122,255,0.4)' : 'transparent'}`,
                    borderRadius: 8,
                    padding: '7px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    color: tileStyleIndex === idx ? '#38BDF8' : '#94A3B8',
                    fontSize: 12,
                    transition: 'all 0.15s',
                  }}
                >
                  <span>{src.icon}</span>
                  <span>{src.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zoom In */}
        <button
          onClick={() => mapRef.current?.zoomIn({ duration: 300 })}
          title="Zoom In"
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            fontSize: 18,
            fontWeight: 700,
            transition: 'all 0.2s',
          }}
        >
          <ZoomIn style={{ width: 15, height: 15 }} />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => mapRef.current?.zoomOut({ duration: 300 })}
          title="Zoom Out"
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.2s',
          }}
        >
          <ZoomOut style={{ width: 15, height: 15 }} />
        </button>

        {/* Refresh */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh Train Data"
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(15,23,42,0.9)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}
          >
            <RefreshCw style={{ width: 13, height: 13 }} />
          </button>
        )}
      </div>

      {/* ── Bottom info bar ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        {/* Route info */}
        <div
          style={{
            background: 'rgba(6,12,24,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '6px 12px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <MapPin style={{ width: 12, height: 12, color: '#38BDF8', flexShrink: 0 }} />
          <span
            style={{
              fontSize: 11,
              fontFamily: 'JetBrains Mono, monospace',
              color: '#94A3B8',
            }}
          >
            {train.origin.split('(')[0].trim()} → {train.destination.split('(')[0].trim()}
          </span>
        </div>

        {/* Live indicator */}
        <div
          style={{
            background: 'rgba(6,12,24,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '6px 12px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }}
            className="animate-pulse"
          />
          <span
            style={{
              fontSize: 10,
              fontFamily: 'JetBrains Mono, monospace',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {tileSources[tileStyleIndex].label}
          </span>
        </div>
      </div>

      {/* ── Map style override: hide default MapLibre popup styles ── */}
      <style>{`
        .maplibregl-popup-content {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .maplibregl-popup-tip { display: none !important; }
        .maplibregl-popup-close-button {
          color: #64748B !important;
          font-size: 16px !important;
          top: 8px !important;
          right: 10px !important;
          background: transparent !important;
          border: none !important;
          line-height: 1 !important;
        }
        .maplibregl-popup-close-button:hover { color: #F8FAFC !important; }
        .train-pulse {
          animation: trainPulse 2s ease-in-out infinite;
        }
        @keyframes trainPulse {
          0%, 100% { transform: scale(0.85); opacity: 0.6; }
          50%       { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
});

export default TrainMap;

'use client';

import { useRef, useEffect, useState, memo } from 'react';
import Map, { Marker, Source, Layer, MapRef, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Train, Station } from '@/types';
import { useTrainStore } from '@/store/useTrainStore';
import { useTrainRoute } from '@/hooks/useTrainRoute';
import { Navigation, ZoomIn, ZoomOut, Train as TrainIcon, Layers, RefreshCw } from 'lucide-react';

interface TrainMapProps {
  train: Train;
  onRefresh?: () => void;
}

const TrainMap = memo(function TrainMap({ train, onRefresh }: TrainMapProps) {
  const mapRef = useRef<MapRef>(null);
  const { cameraFollow, setCameraFollow } = useTrainStore();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [tileStyleIndex, setTileStyleIndex] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'Z839isQhb7eA3KbytO8x';

  // Tile sources: MapTiler (primary) → CartoDB Dark (fallback)
  const tileSources = [
    {
      label: 'Dataviz Dark',
      url: `https://api.maptiler.com/maps/dataviz-dark/256/{z}/{x}/{y}.png?key=${maptilerKey}`,
    },
    {
      label: 'Basic Dark',
      url: `https://api.maptiler.com/maps/basic-v2-dark/256/{z}/{x}/{y}.png?key=${maptilerKey}`,
    },
    {
      label: 'Carto Dark',
      url: `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png`,
    },
  ];

  const { completedCoords, remainingCoords } = useTrainRoute(train);

  // Camera follow: smooth flyTo on train position change
  useEffect(() => {
    if (cameraFollow && mapRef.current && isMapLoaded) {
      mapRef.current.flyTo({
        center: [train.currentLongitude, train.currentLatitude],
        zoom: 7.5,
        pitch: 40,
        bearing: 0,
        duration: 1800,
        essential: true,
      });
    }
  }, [train.currentLatitude, train.currentLongitude, cameraFollow, isMapLoaded]);

  // Ensure map resizes on mount (fixes the black canvas bug)
  useEffect(() => {
    const t = setTimeout(() => mapRef.current?.getMap()?.resize(), 250);
    return () => clearTimeout(t);
  }, []);

  const completedGeoJson: GeoJSON.Feature<GeoJSON.LineString> = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates:
        completedCoords.length >= 2
          ? completedCoords
          : [[72.8193, 18.9696], [train.currentLongitude, train.currentLatitude]],
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
          : [[train.currentLongitude, train.currentLatitude], [77.2194, 28.643]],
    },
    properties: {},
  };

  // Only show halt stations on the map to reduce clutter
  const haltStations = train.stations.filter((s) => s.isHalt !== false);

  return (
    <div
      className="relative w-full h-full min-h-[450px] overflow-hidden rounded-xl"
      style={{ background: '#0A0E1A', border: '1px solid #1F2937' }}
    >
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: train.currentLongitude || 75.12,
          latitude: train.currentLatitude || 23.525,
          zoom: 7,
          pitch: 35,
        }}
        mapStyle={{
          version: 8,
          sources: {},
          layers: [],
        }}
        style={{ width: '100%', height: '100%' }}
        onLoad={() => setIsMapLoaded(true)}
        attributionControl={false}
      >
        {/* ── Dark Base Map ── */}
        <Source
          id="dark-basemap"
          type="raster"
          tiles={[tileSources[tileStyleIndex].url]}
          tileSize={256}
          attribution="© MapTiler © OpenStreetMap contributors"
        >
          <Layer id="dark-basemap-layer" type="raster" minzoom={0} maxzoom={22} />
        </Source>

        {/* ── Remaining Route (dashed slate) ── */}
        <Source id="remaining-route" type="geojson" data={remainingGeoJson}>
          <Layer
            id="remaining-route-line"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#334155',
              'line-width': 3,
              'line-dasharray': [2, 3],
            }}
          />
        </Source>

        {/* ── Completed Route (glowing blue) ── */}
        <Source id="completed-route" type="geojson" data={completedGeoJson}>
          {/* Outer glow */}
          <Layer
            id="completed-route-glow"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#007AFF',
              'line-width': 14,
              'line-opacity': 0.25,
            }}
          />
          {/* Main line */}
          <Layer
            id="completed-route-line"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#007AFF',
              'line-width': 4,
              'line-opacity': 0.9,
            }}
          />
        </Source>

        {/* ── Halt Station Markers ── */}
        {haltStations.map((station) => (
          <Marker
            key={station.code}
            longitude={station.longitude}
            latitude={station.latitude}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedStation(station);
            }}
          >
            <div
              style={{
                width: station.isCurrent ? 16 : 10,
                height: station.isCurrent ? 16 : 10,
                borderRadius: '50%',
                background: station.isPassed ? '#007AFF' : station.isCurrent ? '#007AFF' : '#1F2937',
                border: station.isCurrent
                  ? '2.5px solid #fff'
                  : station.isPassed
                  ? '2px solid #007AFF'
                  : '2px solid #334155',
                boxShadow: station.isCurrent ? '0 0 10px rgba(0,122,255,0.8)' : 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
            />
          </Marker>
        ))}

        {/* ── Live Train Marker ── */}
        <Marker
          longitude={train.currentLongitude}
          latitude={train.currentLatitude}
          anchor="center"
        >
          <div style={{ position: 'relative', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Pulse ring */}
            <div
              className="train-pulse"
              style={{
                position: 'absolute',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(0,122,255,0.2)',
              }}
            />
            {/* Marker body */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#007AFF',
                border: '2.5px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 0 20px rgba(0,122,255,0.7)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <TrainIcon style={{ width: 16, height: 16 }} />
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
            offset={[0, -10] as [number, number]}
          >
            <div
              style={{
                background: '#161B22',
                border: '1px solid #1F2937',
                borderRadius: 8,
                padding: '10px 14px',
                minWidth: 180,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, color: '#F8FAFC', marginBottom: 4 }}>
                {selectedStation.name}
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>
                {selectedStation.code} · {selectedStation.distanceFromOrigin} km
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                Arr: {selectedStation.arrivalTime} · Dep: {selectedStation.departureTime}
              </div>
              {selectedStation.delayMinutes > 0 && (
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#FFB000',
                    background: 'rgba(255,176,0,0.1)',
                    border: '1px solid #FFB000',
                    borderRadius: 4,
                    padding: '2px 6px',
                    display: 'inline-block',
                  }}
                >
                  +{selectedStation.delayMinutes}m delay
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* ── Floating Map Controls ── */}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 10 }}>
        {/* Camera Follow Toggle */}
        <button
          onClick={() => setCameraFollow(!cameraFollow)}
          title="Toggle Camera Follow"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: cameraFollow ? '#007AFF' : '#161B22',
            border: `1px solid ${cameraFollow ? '#007AFF' : '#1F2937'}`,
            color: cameraFollow ? '#fff' : '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <Navigation style={{ width: 16, height: 16 }} />
        </button>

        {/* Tile Switch */}
        <button
          onClick={() => setTileStyleIndex((i) => (i + 1) % tileSources.length)}
          title="Switch Map Theme"
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: '#161B22', border: '1px solid #1F2937',
            color: '#94A3B8', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <Layers style={{ width: 16, height: 16 }} />
        </button>

        {/* Zoom In */}
        <button
          onClick={() => mapRef.current?.zoomIn({ duration: 300 })}
          title="Zoom In"
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: '#161B22', border: '1px solid #1F2937',
            color: '#94A3B8', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', fontSize: 18, fontWeight: 700,
          }}
        >
          <ZoomIn style={{ width: 16, height: 16 }} />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => mapRef.current?.zoomOut({ duration: 300 })}
          title="Zoom Out"
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: '#161B22', border: '1px solid #1F2937',
            color: '#94A3B8', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <ZoomOut style={{ width: 16, height: 16 }} />
        </button>

        {/* Manual Refresh */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh Train Data"
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: '#161B22', border: '1px solid #1F2937',
              color: '#94A3B8', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <RefreshCw style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>

      {/* ── Bottom status badge ── */}
      <div
        style={{
          position: 'absolute', bottom: 12, left: 12, zIndex: 10,
          background: '#161B22', border: '1px solid #1F2937',
          borderRadius: 8, padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#94A3B8',
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} className="animate-pulse" />
        {tileSources[tileStyleIndex].label} · MapTiler
      </div>
    </div>
  );
});

export default TrainMap;

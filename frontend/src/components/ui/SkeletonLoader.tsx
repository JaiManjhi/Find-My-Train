'use client';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
  style?: React.CSSProperties;
}

function Skeleton({ className = '', width, height, rounded = '6px', style }: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        background: 'linear-gradient(90deg, #1F2937 25%, #262F3E 50%, #1F2937 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.6s ease-in-out infinite',
        borderRadius: rounded,
        width,
        height,
        ...style,
      }}
    />
  );
}

export function TrainCardSkeleton() {
  return (
    <div
      className="p-4 rounded-xl border"
      style={{ background: '#161B22', borderColor: '#1F2937' }}
    >
      <Skeleton height={12} width="60%" rounded="4px" style={{ marginBottom: 12 }} />
      <Skeleton height={20} width="80%" rounded="4px" style={{ marginBottom: 8 }} />
      <Skeleton height={12} width="100%" rounded="4px" style={{ marginBottom: 6 }} />
      <Skeleton height={6} width="100%" rounded="999px" style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton height={12} width={60} rounded="4px" />
        <Skeleton height={12} width={80} rounded="4px" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="p-4 rounded-xl border" style={{ background: '#161B22', borderColor: '#1F2937' }}>
        <Skeleton height={12} width={120} rounded="4px" style={{ marginBottom: 10 }} />
        <Skeleton height={24} width="60%" rounded="4px" style={{ marginBottom: 6 }} />
        <Skeleton height={12} width="40%" rounded="4px" />
      </div>

      {/* Map skeleton */}
      <div
        className="rounded-xl border flex items-center justify-center"
        style={{
          background: '#0A0E1A',
          borderColor: '#1F2937',
          height: 480,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(90deg, #0D1117 25%, #141A24 50%, #0D1117 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeletonShimmer 1.6s ease-in-out infinite',
            position: 'absolute',
            inset: 0,
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(0,122,255,0.2)',
              margin: '0 auto 8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            className="animate-pulse"
          >
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#007AFF' }} />
          </div>
          <div
            style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#4B5563' }}
          >
            Loading live map…
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skeleton;

// Inject the shimmer keyframe once
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-shimmer-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes skeletonShimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

'use client';

interface StatusBadgeProps {
  delayMinutes: number;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ delayMinutes, size = 'sm' }: StatusBadgeProps) {
  const fs = size === 'md' ? 13 : 11;
  const px = size === 'md' ? 10 : 7;
  const py = size === 'md' ? 4 : 2;

  if (delayMinutes <= 0) {
    return (
      <span
        style={{
          display: 'inline-block',
          padding: `${py}px ${px}px`,
          borderRadius: 4,
          fontSize: fs,
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid #10B981',
          color: '#10B981',
        }}
      >
        On Time
      </span>
    );
  }

  if (delayMinutes <= 15) {
    return (
      <span
        style={{
          display: 'inline-block',
          padding: `${py}px ${px}px`,
          borderRadius: 4,
          fontSize: fs,
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          background: 'rgba(255,176,0,0.12)',
          border: '1px solid #FFB000',
          color: '#FFB000',
        }}
      >
        +{delayMinutes}m Late
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${py}px ${px}px`,
        borderRadius: 4,
        fontSize: fs,
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        background: 'rgba(239,68,68,0.12)',
        border: '1px solid #EF4444',
        color: '#EF4444',
      }}
    >
      Delayed {delayMinutes}m
    </span>
  );
}

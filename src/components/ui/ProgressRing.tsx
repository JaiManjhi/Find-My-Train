'use client';

import { useEffect, useRef, useState } from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export default function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 9,
  label,
  sublabel,
  color = '#007AFF',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animatedOffset, setAnimatedOffset] = useState(circumference);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const targetOffset = circumference - (percentage / 100) * circumference;
    const startOffset = circumference;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setAnimatedOffset(startOffset + (targetOffset - startOffset) * ease);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [percentage, circumference]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
        aria-label={`${Math.round(percentage)}% complete`}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1F2937"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Center text */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', gap: 2,
        }}
      >
        <span
          style={{
            fontSize: size / 4.5,
            fontWeight: 700,
            color: '#F8FAFC',
            fontFamily: 'JetBrains Mono, monospace',
            lineHeight: 1,
          }}
        >
          {Math.round(percentage)}%
        </span>
        {label && (
          <span
            style={{
              fontSize: 9,
              fontFamily: 'JetBrains Mono, monospace',
              color: '#4B5563',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              lineHeight: 1.2,
            }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            style={{
              fontSize: 9,
              fontFamily: 'JetBrains Mono, monospace',
              color: color,
              lineHeight: 1.2,
            }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

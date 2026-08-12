'use client';

import { RefreshCw, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  isVisible: boolean;
  onClose?: () => void;
  autoDismissMs?: number;
}

const TOAST_CONFIG = {
  info:    { icon: Info,          color: '#007AFF', bg: 'rgba(0,122,255,0.08)',   border: 'rgba(0,122,255,0.4)' },
  success: { icon: CheckCircle2,  color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.4)' },
  warning: { icon: AlertTriangle, color: '#FFB000', bg: 'rgba(255,176,0,0.08)',  border: 'rgba(255,176,0,0.4)' },
  error:   { icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.4)' },
};

export default function Toast({
  message,
  type = 'info',
  isVisible,
  onClose,
  autoDismissMs = 4000,
}: ToastProps) {
  const cfg = TOAST_CONFIG[type];
  const Icon = cfg.icon;

  useEffect(() => {
    if (isVisible && onClose && autoDismissMs > 0) {
      const timer = setTimeout(onClose, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoDismissMs]);

  if (!isVisible || !message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderRadius: 10,
        background: '#161B22',
        border: `1px solid ${cfg.border}`,
        color: '#F8FAFC',
        fontSize: 13,
        fontFamily: 'Inter, system-ui, sans-serif',
        maxWidth: 360,
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        animation: 'toastSlideIn 0.25s ease-out',
      }}
    >
      <Icon style={{ width: 16, height: 16, color: cfg.color, flexShrink: 0 }} />
      <span style={{ flex: 1, lineHeight: 1.4 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          style={{
            background: 'transparent', border: 'none',
            cursor: 'pointer', padding: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 4, color: '#4B5563',
          }}
        >
          <X style={{ width: 14, height: 14 }} />
        </button>
      )}
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
      `}</style>
    </div>
  );
}

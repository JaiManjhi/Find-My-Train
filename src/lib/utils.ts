import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDelay(minutes: number): { text: string; colorClass: string; bgClass: string } {
  if (minutes <= 0) {
    return {
      text: 'Right Time',
      colorClass: 'text-emerald-400',
      bgClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    };
  }
  if (minutes < 15) {
    return {
      text: `${minutes}m Late`,
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    };
  }
  return {
    text: `${minutes}m Late`,
    colorClass: 'text-rose-400',
    bgClass: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  };
}

export function formatDistance(km: number): string {
  return `${Math.round(km)} km`;
}

export function formatSpeed(speedKmH: number): string {
  return `${Math.round(speedKmH)} km/h`;
}

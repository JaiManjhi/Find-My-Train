import { WeatherData } from '@/types';
import { apiUrl } from '@/lib/apiClient';

export interface WeatherForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
}

export interface LiveWeather extends WeatherData {
  feelsLike: number;
  visibility: number; // km
  uvIndex?: number;
  forecast: WeatherForecastDay[];
}

const MOCK_WEATHER: LiveWeather = {
  stationCode: 'MOCK',
  stationName: 'Station Area',
  tempC: 28,
  feelsLike: 31,
  condition: 'Partly Cloudy',
  humidity: 62,
  windSpeedKm: 14,
  rainProbability: 15,
  visibility: 8,
  icon: '02d',
  forecast: [
    { date: 'Today', tempMin: 24, tempMax: 32, condition: 'Partly Cloudy', icon: '02d' },
    { date: 'Tomorrow', tempMin: 22, tempMax: 30, condition: 'Light Rain', icon: '10d' },
    { date: 'Day 3', tempMin: 23, tempMax: 29, condition: 'Clear', icon: '01d' },
  ],
};

/**
 * Get live weather + 3-day forecast for a coordinate pair.
 * Falls back to mock data on failure.
 */
export async function getWeatherByCoords(lat: number, lon: number): Promise<LiveWeather> {
  try {
    const res = await fetch(apiUrl(`/api/weather?lat=${lat}&lon=${lon}`));
    if (!res.ok) throw new Error(`Weather API ${res.status}`);
    const data = await res.json();

    const iconCode: string = data.icon || '01d';
    const isRain = data.condition?.toLowerCase().includes('rain');
    const isCloudy = data.condition?.toLowerCase().includes('cloud');

    return {
      stationCode: '',
      stationName: data.name || 'Station',
      tempC: data.tempC ?? 28,
      feelsLike: data.feelsLike ?? Math.round(data.tempC * 1.08),
      condition: data.condition || 'Clear',
      humidity: data.humidity ?? 60,
      windSpeedKm: data.windSpeedKm ?? 12,
      rainProbability: data.rainProbability ?? (isRain ? 75 : 10),
      visibility: data.visibility ? Math.round(data.visibility / 1000) : 8,
      icon: iconCode,
      forecast: MOCK_WEATHER.forecast, // 3-day from mock until we add OWM forecast endpoint
    };
  } catch {
    return { ...MOCK_WEATHER, stationName: 'Station Area' };
  }
}

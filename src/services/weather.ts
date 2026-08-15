import { WeatherData } from '@/types';
import { backendFetch } from '@/lib/backendClient';

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
 * Get live weather + 3-day forecast from Python backend for a coordinate pair.
 * Falls back to mock data on failure.
 */
export async function getWeatherByCoords(lat: number, lon: number): Promise<LiveWeather> {
  try {
    const data = await backendFetch<LiveWeather>('/api/weather', {
      params: { lat, lon },
    });

    const iconCode: string = data.icon || '01d';
    const isRain = data.condition?.toLowerCase().includes('rain');

    return {
      stationCode: data.stationCode || '',
      stationName: data.stationName || 'Station',
      tempC: data.tempC ?? 28,
      feelsLike: data.feelsLike ?? Math.round(data.tempC * 1.08),
      condition: data.condition || 'Clear',
      humidity: data.humidity ?? 60,
      windSpeedKm: data.windSpeedKm ?? 12,
      rainProbability: data.rainProbability ?? (isRain ? 75 : 10),
      visibility: data.visibility ?? 8,
      icon: iconCode,
      forecast: data.forecast || MOCK_WEATHER.forecast,
    };
  } catch (error) {
    console.warn('[Weather] API unavailable, using mock data:', error);
    return { ...MOCK_WEATHER, stationName: 'Station Area' };
  }
}

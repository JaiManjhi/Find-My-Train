export interface Station {
  code: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  arrivalTime: string;
  departureTime: string;
  actualArrival?: string;
  actualDeparture?: string;
  delayMinutes: number;
  distanceFromOrigin: number; // in km
  elevation: number; // in meters
  platform?: string;
  isHalt?: boolean; // true = scheduled halt stop; false/undefined = pass-through/intermediate
  isPassed: boolean;
  isCurrent: boolean;
  isNext: boolean;
}

export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  totalDistance: number; // in km
  currentStation: Station;
  nextStation: Station;
  currentLatitude: number;
  currentLongitude: number;
  speed: number; // km/h
  delayMinutes: number;
  status: 'ON_TIME' | 'DELAYED' | 'EARLY' | 'CANCELLED';
  lastUpdated: string;
  completionPercent: number;
  distanceCovered: number;
  distanceRemaining: number;
  totalDuration: string;
  stations: Station[];
}

export interface WeatherData {
  stationCode: string;
  stationName: string;
  tempC: number;
  condition: string;
  humidity: number;
  windSpeedKm: number;
  rainProbability: number;
  icon: string;
}

export interface Attraction {
  id: string;
  name: string;
  category: 'River' | 'Mountain' | 'Bridge' | 'Tunnel' | 'Monument' | 'Ghat' | 'City';
  latitude: number;
  longitude: number;
  distanceFromTrackKm: number;
  description: string;
  image?: string;
}

export interface ElevationPoint {
  distanceKm: number;
  elevationM: number;
  stationName?: string;
}

export interface SearchResult {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  runsOnDays: string[];
  departureTime: string;
  arrivalTime: string;
}

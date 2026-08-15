/**
 * Static train route database with real coordinates for major Indian Railway trains.
 * Used as an intelligent fallback when the live RailRadar API is unavailable.
 *
 * Each entry contains the correct stations list with real lat/lon coordinates
 * so the map always shows the actual geographic route.
 */

import { Train, Station } from '@/types';

// ─── Station Coordinates Master Dictionary ────────────────────────────────────
export const STATION_COORDS: Record<
  string,
  { name: string; lat: number; lon: number; state: string; elev: number }
> = {
  // Maharashtra
  MMCT: { name: 'Mumbai Central',      lat: 18.9696, lon: 72.8193, state: 'Maharashtra', elev: 12 },
  CSMT: { name: 'Mumbai CSMT',         lat: 18.9398, lon: 72.8354, state: 'Maharashtra', elev: 8  },
  LTT:  { name: 'Lokmanya Tilak Terminus', lat: 19.0728, lon: 72.9192, state: 'Maharashtra', elev: 11 },
  BDTS: { name: 'Bandra Terminus',     lat: 19.0540, lon: 72.8400, state: 'Maharashtra', elev: 10 },
  DDR:  { name: 'Dadar',               lat: 19.0178, lon: 72.8478, state: 'Maharashtra', elev: 10 },
  BVI:  { name: 'Borivali',            lat: 19.2294, lon: 72.8569, state: 'Maharashtra', elev: 14 },
  PUNE: { name: 'Pune Junction',       lat: 18.5285, lon: 73.8742, state: 'Maharashtra', elev: 560 },
  SUR:  { name: 'Solapur',             lat: 17.6805, lon: 75.9064, state: 'Maharashtra', elev: 470 },
  NGP:  { name: 'Nagpur Junction',     lat: 21.1456, lon: 79.0770, state: 'Maharashtra', elev: 310 },
  JBP:  { name: 'Jabalpur',            lat: 23.1669, lon: 79.9370, state: 'Madhya Pradesh', elev: 411 },

  // Gujarat
  ST:   { name: 'Surat',               lat: 21.2049, lon: 72.8406, state: 'Gujarat', elev: 13 },
  BRC:  { name: 'Vadodara Junction',   lat: 22.3107, lon: 73.1812, state: 'Gujarat', elev: 36 },
  ADI:  { name: 'Ahmedabad Junction',  lat: 23.0258, lon: 72.6011, state: 'Gujarat', elev: 54 },
  GNC:  { name: 'Gandhinagar Capital', lat: 23.2250, lon: 72.6519, state: 'Gujarat', elev: 81 },
  VG:   { name: 'Vasad',               lat: 22.4733, lon: 73.0840, state: 'Gujarat', elev: 28 },

  // Rajasthan
  RTM:  { name: 'Ratlam Junction',     lat: 23.3320, lon: 75.0380, state: 'Madhya Pradesh', elev: 480 },
  KOTA: { name: 'Kota Junction',       lat: 25.2130, lon: 75.8640, state: 'Rajasthan', elev: 256 },
  SWM:  { name: 'Sawai Madhopur',      lat: 25.9960, lon: 76.3680, state: 'Rajasthan', elev: 275 },
  BKN:  { name: 'Bikaner Junction',    lat: 28.0249, lon: 73.3069, state: 'Rajasthan', elev: 234 },
  JP:   { name: 'Jaipur Junction',     lat: 26.9213, lon: 75.7881, state: 'Rajasthan', elev: 431 },
  JU:   { name: 'Jodhpur Junction',    lat: 26.2812, lon: 73.0244, state: 'Rajasthan', elev: 232 },

  // Delhi NCR
  NDLS: { name: 'New Delhi',           lat: 28.6430, lon: 77.2194, state: 'Delhi', elev: 214 },
  NZM:  { name: 'Hazrat Nizamuddin',   lat: 28.5898, lon: 77.2536, state: 'Delhi', elev: 207 },
  ANVT: { name: 'Anand Vihar Terminus',lat: 28.6468, lon: 77.3156, state: 'Delhi', elev: 212 },
  DLI:  { name: 'Old Delhi Junction',  lat: 28.6569, lon: 77.2137, state: 'Delhi', elev: 207 },

  // Uttar Pradesh
  MTJ:  { name: 'Mathura Junction',    lat: 27.4924, lon: 77.6737, state: 'Uttar Pradesh', elev: 177 },
  AGC:  { name: 'Agra Cantt',          lat: 27.1501, lon: 78.0483, state: 'Uttar Pradesh', elev: 169 },
  CNB:  { name: 'Kanpur Central',      lat: 26.4468, lon: 80.3492, state: 'Uttar Pradesh', elev: 126 },
  LKO:  { name: 'Lucknow Charbagh',    lat: 26.8367, lon: 80.9231, state: 'Uttar Pradesh', elev: 123 },
  BSB:  { name: 'Varanasi Junction',   lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh', elev: 80 },
  ALD:  { name: 'Prayagraj Junction',  lat: 25.4358, lon: 81.8463, state: 'Uttar Pradesh', elev: 98 },
  GKP:  { name: 'Gorakhpur Junction',  lat: 26.7606, lon: 83.3732, state: 'Uttar Pradesh', elev: 84 },

  // Bihar
  PNBE: { name: 'Patna Junction',      lat: 25.6102, lon: 85.1399, state: 'Bihar', elev: 54 },
  RJPB: { name: 'Rajendra Nagar',      lat: 25.5941, lon: 85.1195, state: 'Bihar', elev: 52 },
  GAYA: { name: 'Gaya Junction',       lat: 24.7957, lon: 85.0041, state: 'Bihar', elev: 113 },

  // Madhya Pradesh
  RKMP: { name: 'Rani Kamalapati',     lat: 23.2000, lon: 77.4300, state: 'Madhya Pradesh', elev: 500 },
  BPL:  { name: 'Bhopal Junction',     lat: 23.2675, lon: 77.4091, state: 'Madhya Pradesh', elev: 497 },
  ETW:  { name: 'Itarsi Junction',     lat: 22.6100, lon: 77.7630, state: 'Madhya Pradesh', elev: 323 },

  // Haryana / Punjab
  AMB:  { name: 'Ambala Cantt',        lat: 30.3754, lon: 76.8200, state: 'Haryana', elev: 272 },
  LDH:  { name: 'Ludhiana Junction',   lat: 30.8900, lon: 75.8659, state: 'Punjab', elev: 244 },
  ASR:  { name: 'Amritsar Junction',   lat: 31.6354, lon: 74.8756, state: 'Punjab', elev: 234 },
  CDG:  { name: 'Chandigarh',          lat: 30.7333, lon: 76.7794, state: 'Punjab', elev: 321 },
  KLK:  { name: 'Kalka',               lat: 30.8480, lon: 76.9534, state: 'Haryana', elev: 656 },
  FZR:  { name: 'Firozpur Cantt',      lat: 30.9167, lon: 74.6062, state: 'Punjab', elev: 185 },

  // Himachal / Uttarakhand
  DDN:  { name: 'Dehradun',            lat: 30.3165, lon: 78.0322, state: 'Uttarakhand', elev: 636 },

  // West Bengal
  HWH:  { name: 'Howrah Junction',     lat: 22.5852, lon: 88.3420, state: 'West Bengal', elev: 9 },
  SDAH: { name: 'Sealdah',             lat: 22.5674, lon: 88.3703, state: 'West Bengal', elev: 7 },

  // Odisha
  PURI: { name: 'Puri',                lat: 19.8080, lon: 85.8315, state: 'Odisha', elev: 6 },
  BBS:  { name: 'Bhubaneswar',         lat: 20.2640, lon: 85.8408, state: 'Odisha', elev: 45 },

  // Jharkhand
  RNC:  { name: 'Ranchi Junction',     lat: 23.3441, lon: 85.3096, state: 'Jharkhand', elev: 651 },

  // Andhra Pradesh / Telangana
  SC:   { name: 'Secunderabad Jn',     lat: 17.4399, lon: 78.4983, state: 'Telangana', elev: 530 },
  HYB:  { name: 'Hyderabad Deccan',    lat: 17.3850, lon: 78.4867, state: 'Telangana', elev: 531 },
  GTL:  { name: 'Guntakal Jn',         lat: 15.1670, lon: 77.3680, state: 'Andhra Pradesh', elev: 456 },

  // Karnataka
  SBC:  { name: 'KSR Bengaluru',       lat: 12.9769, lon: 77.5704, state: 'Karnataka', elev: 906 },
  MYS:  { name: 'Mysuru Junction',     lat: 12.3051, lon: 76.6551, state: 'Karnataka', elev: 770 },

  // Tamil Nadu
  MAS:  { name: 'Chennai Central',     lat: 13.0837, lon: 80.2755, state: 'Tamil Nadu', elev: 6 },
  MS:   { name: 'Chennai Egmore',      lat: 13.0810, lon: 80.2628, state: 'Tamil Nadu', elev: 6 },
  MDU:  { name: 'Madurai Junction',    lat: 9.9195,  lon: 78.1196, state: 'Tamil Nadu', elev: 101 },

  // Kerala
  TVC:  { name: 'Trivandrum Central',  lat: 8.4875,  lon: 76.9525, state: 'Kerala', elev: 10 },
  ERS:  { name: 'Ernakulam Junction',  lat: 9.9816,  lon: 76.2998, state: 'Kerala', elev: 7 },
  CLT:  { name: 'Kozhikode',           lat: 11.2588,  lon: 75.7804, state: 'Kerala', elev: 14 },
  MAQ:  { name: 'Mangaluru Junction',  lat: 12.8698, lon: 74.8425, state: 'Karnataka', elev: 22 },

  // Assam / North East
  GHY:  { name: 'Guwahati',            lat: 26.1833, lon: 91.7458, state: 'Assam', elev: 49 },
  DBRG: { name: 'Dibrugarh Town',      lat: 27.4728, lon: 94.9022, state: 'Assam', elev: 108 },
  SCL:  { name: 'Silchar',             lat: 24.8333, lon: 92.7789, state: 'Assam', elev: 14 },
  NHL:  { name: 'Naharlagun',          lat: 27.1017, lon: 93.6889, state: 'Arunachal Pradesh', elev: 180 },
  LGH:  { name: 'Lalgarh Junction',    lat: 26.8673, lon: 73.3820, state: 'Rajasthan', elev: 223 },
  SHC:  { name: 'Saharsa Junction',    lat: 25.8750, lon: 86.5960, state: 'Bihar', elev: 42 },

  // Additional Maharashtra & Western India Stations
  VAPI: { name: 'Vapi',                lat: 20.3713, lon: 72.9042, state: 'Gujarat', elev: 27 },
  BL:   { name: 'Valsad',              lat: 20.6102, lon: 72.9264, state: 'Gujarat', elev: 14 },
  BH:   { name: 'Bharuch Junction',    lat: 21.7051, lon: 72.9959, state: 'Gujarat', elev: 20 },
  ANND: { name: 'Anand Junction',      lat: 22.5645, lon: 72.9289, state: 'Gujarat', elev: 40 },
  ND:   { name: 'Nadiad Junction',     lat: 22.6916, lon: 72.8634, state: 'Gujarat', elev: 37 },
  PLG:  { name: 'Palghar',             lat: 19.6967, lon: 72.7667, state: 'Maharashtra', elev: 15 },
  GDA:  { name: 'Godhra Junction',     lat: 22.7758, lon: 73.6148, state: 'Gujarat', elev: 119 },
  DHD:  { name: 'Dahod',               lat: 22.8360, lon: 74.2560, state: 'Gujarat', elev: 312 },
  NAD:  { name: 'Nagda Junction',      lat: 23.4560, lon: 75.4160, state: 'Madhya Pradesh', elev: 469 },
  SGZ:  { name: 'Shamgarh',            lat: 24.1833, lon: 75.6333, state: 'Madhya Pradesh', elev: 455 },
  BWM:  { name: 'Bhawani Mandi',       lat: 24.5167, lon: 75.8333, state: 'Rajasthan', elev: 381 },
  RMA:  { name: 'Ramganj Mandi',       lat: 24.6500, lon: 75.9500, state: 'Rajasthan', elev: 357 },
  GGC:  { name: 'Gangapur City',       lat: 26.4715, lon: 76.7214, state: 'Rajasthan', elev: 269 },
  BTE:  { name: 'Bharatpur Junction',  lat: 27.2170, lon: 77.4900, state: 'Rajasthan', elev: 174 },
  GWL:  { name: 'Gwalior Junction',    lat: 26.2183, lon: 78.1828, state: 'Madhya Pradesh', elev: 212 },
  VGLJ: { name: 'VGL Jhansi Junction', lat: 25.4484, lon: 78.5685, state: 'Madhya Pradesh', elev: 258 },
  BPQ:  { name: 'Balharshah Junction', lat: 19.8500, lon: 79.3500, state: 'Maharashtra', elev: 185 },
  WL:   { name: 'Warangal',            lat: 17.9800, lon: 79.6000, state: 'Telangana', elev: 271 },
  BZA:  { name: 'Vijayawada Junction', lat: 16.5062, lon: 80.6480, state: 'Andhra Pradesh', elev: 19 },
  GDR:  { name: 'Gudur Junction',      lat: 14.1500, lon: 79.8500, state: 'Andhra Pradesh', elev: 28 },
};

// ─── Helper: build a minimal Train from a route spec ─────────────────────────

function buildTrain(
  trainNumber: string,
  trainName: string,
  stationCodes: string[],
  scheduledTimes: string[], // arrival|departure for each station
  totalDistanceKm: number,
  totalDurationStr: string,
  speed: number = 95,
): Train {
  // First pass: resolve coordinates for known stations
  const resolvedCoords = stationCodes.map((code) => STATION_COORDS[code] ?? null);

  // Second pass: interpolate missing station coordinates from nearest known neighbors
  const finalCoords = stationCodes.map((code, i) => {
    if (resolvedCoords[i]) return resolvedCoords[i]!;

    let prevIdx = -1;
    for (let p = i - 1; p >= 0; p--) {
      if (resolvedCoords[p]) { prevIdx = p; break; }
    }
    let nextIdx = -1;
    for (let n = i + 1; n < stationCodes.length; n++) {
      if (resolvedCoords[n]) { nextIdx = n; break; }
    }

    const prevC = prevIdx !== -1 ? resolvedCoords[prevIdx]! : { lat: 18.9696, lon: 72.8193, state: 'India', elev: 100 };
    const nextC = nextIdx !== -1 ? resolvedCoords[nextIdx]! : prevC;
    const range = Math.max(1, nextIdx - (prevIdx !== -1 ? prevIdx : 0));
    const frac = (i - (prevIdx !== -1 ? prevIdx : 0)) / range;

    return {
      name: code,
      lat: prevC.lat + frac * (nextC.lat - prevC.lat),
      lon: prevC.lon + frac * (nextC.lon - prevC.lon),
      state: 'India',
      elev: 100,
    };
  });

  const stations: Station[] = stationCodes.map((code, i) => {
    const coords = finalCoords[i];
    return {
      code,
      name: coords.name,
      state: coords.state,
      latitude: coords.lat,
      longitude: coords.lon,
      arrivalTime:   scheduledTimes[i]?.split('|')[0] ?? '--',
      departureTime: scheduledTimes[i]?.split('|')[1] ?? '--',
      delayMinutes:  0,
      distanceFromOrigin: Math.round((i / Math.max(1, stationCodes.length - 1)) * totalDistanceKm),
      elevation: coords.elev,
      isHalt: true,
      isPassed: false,
      isCurrent: i === 0,
      isNext: i === 1,
    };
  });

  // Determine current active station and train position dynamically if possible
  if (stations.length > 0) {
    stations[0].isPassed  = false;
    stations[0].isCurrent = true;
    stations[0].isNext    = false;
  }
  if (stations.length > 1) {
    stations[1].isCurrent = false;
    stations[1].isNext    = true;
  }

  const originCoords = finalCoords[0];

  return {
    id: trainNumber,
    trainNumber,
    trainName,
    origin: stations[0]?.name ?? stationCodes[0],
    destination: stations[stations.length - 1]?.name ?? stationCodes[stationCodes.length - 1],
    totalDistance: totalDistanceKm,
    speed,
    delayMinutes: 0,
    status: 'ON_TIME',
    lastUpdated: 'Static data',
    completionPercent: 0,
    distanceCovered: 0,
    distanceRemaining: totalDistanceKm,
    totalDuration: totalDurationStr,
    currentLatitude:  originCoords?.lat ?? 20,
    currentLongitude: originCoords?.lon ?? 78,
    currentStation:   stations[0],
    nextStation:      stations[1] ?? stations[0],
    stations,
  };
}

// ─── Train Route Definitions ──────────────────────────────────────────────────
// Format for scheduledTimes: "arrivalTime|departureTime"

const TRAIN_ROUTES: Record<string, Train> = {
  // ─ Rajdhani Express routes ────────────────────────────────────────────────
  '12951': buildTrain(
    '12951', 'Mumbai Rajdhani Express',
    ['MMCT','BVI','ST','BRC','RTM','KOTA','SWM','MTJ','NZM','NDLS'],
    ['17:00|17:00','17:33|17:35','19:43|19:48','21:16|21:26','22:30|22:35','01:05|01:15','02:28|02:30','05:38|05:40','08:10|08:12','08:32|08:32'],
    1384, '15h 32m', 112
  ),
  '12952': buildTrain(
    '12952', 'New Delhi Rajdhani Express',
    ['NDLS','NZM','MTJ','SWM','KOTA','RTM','BRC','ST','BVI','MMCT'],
    ['16:55|16:55','17:15|17:17','20:25|20:27','23:00|23:02','00:35|00:45','03:10|03:15','06:00|06:10','08:18|08:23','10:15|10:17','10:55|10:55'],
    1384, '18h 0m', 110
  ),
  '12301': buildTrain(
    '12301', 'Howrah Rajdhani Express',
    ['HWH','GAYA','ALD','CNB','MTJ','AGC','NDLS'],
    ['16:50|16:50','19:35|19:45','22:40|22:45','01:15|01:25','05:40|05:42','06:55|06:57','10:05|10:05'],
    1441, '17h 15m', 108
  ),
  '12302': buildTrain(
    '12302', 'New Delhi Howrah Rajdhani',
    ['NDLS','AGC','MTJ','CNB','ALD','GAYA','HWH'],
    ['17:05|17:05','19:58|20:00','21:00|21:02','00:15|00:25','03:05|03:10','05:50|06:00','09:55|09:55'],
    1441, '16h 50m', 108
  ),
  '12309': buildTrain(
    '12309', 'Rajendra Nagar Rajdhani',
    ['RJPB','PNBE','GAYA','CNB','MTJ','NDLS'],
    ['19:50|19:50','20:05|20:15','21:40|21:50','01:00|01:10','04:30|04:32','10:00|10:00'],
    1001, '14h 10m', 100
  ),
  '12431': buildTrain(
    '12431', 'Thiruvananthapuram Rajdhani',
    ['NZM','RKMP','SC','ERS','TVC'],
    ['11:00|11:00','14:40|14:50','02:20|02:30','09:50|10:00','13:40|13:40'],
    3146, '26h 40m', 100
  ),
  '12432': buildTrain(
    '12432', 'Trivandrum Rajdhani Express',
    ['TVC','ERS','SC','RKMP','NZM'],
    ['17:30|17:30','21:20|21:30','07:30|07:40','16:00|16:10','16:00|16:00'],
    3146, '22h 30m', 105
  ),
  '22691': buildTrain(
    '22691', 'KSR Bengaluru Rajdhani',
    ['SBC','SC','GTL','RKMP','NZM'],
    ['20:00|20:00','22:50|23:00','03:00|03:10','13:20|13:30','06:20|06:20'],
    2444, '34h 20m', 95
  ),
  '12423': buildTrain(
    '12423', 'Dibrugarh Rajdhani Express',
    ['DBRG','GHY','PNBE','CNB','NDLS'],
    ['21:20|21:20','01:10|01:20','14:30|14:40','20:30|20:40','07:05|07:05'],
    2424, '33h 45m', 95
  ),
  '12953': buildTrain(
    '12953', 'August Kranti Rajdhani',
    ['MMCT','BVI','ST','BRC','RTM','KOTA','AGC','NZM'],
    ['17:10|17:10','17:43|17:45','19:58|20:03','21:30|21:40','22:50|22:55','01:20|01:30','07:15|07:17','09:43|09:43'],
    1386, '16h 33m', 105
  ),

  // ─ Shatabdi Express routes ────────────────────────────────────────────────
  '12002': buildTrain(
    '12002', 'Bhopal Shatabdi Express',
    ['NDLS','AGC','RKMP'],
    ['06:00|06:00','08:50|08:52','14:40|14:40'],
    706, '8h 40m', 120
  ),
  '12001': buildTrain(
    '12001', 'Rani Kamalapati Shatabdi',
    ['RKMP','AGC','NDLS'],
    ['15:15|15:15','21:05|21:07','23:55|23:55'],
    706, '8h 40m', 120
  ),
  '12004': buildTrain(
    '12004', 'Lucknow Shatabdi Express',
    ['NDLS','CNB','LKO'],
    ['06:10|06:10','10:25|10:30','12:40|12:40'],
    512, '6h 30m', 115
  ),
  '12030': buildTrain(
    '12030', 'Amritsar Shatabdi Express',
    ['NDLS','AMB','LDH','ASR'],
    ['16:25|16:25','18:45|18:50','19:55|20:00','22:40|22:40'],
    449, '6h 15m', 110
  ),
  '12009': buildTrain(
    '12009', 'Shatabdi Express Mumbai-Ahmedabad',
    ['MMCT','ST','BRC','ADI'],
    ['06:25|06:25','08:30|08:35','10:15|10:25','12:55|12:55'],
    491, '6h 30m', 110
  ),
  '12045': buildTrain(
    '12045', 'Chandigarh Shatabdi',
    ['NDLS','AMB','CDG'],
    ['07:20|07:20','09:25|09:30','10:45|10:45'],
    250, '3h 25m', 120
  ),

  // ─ Vande Bharat routes ────────────────────────────────────────────────────
  '22436': buildTrain(
    '22436', 'Vande Bharat Express (Delhi-Varanasi)',
    ['NDLS','CNB','ALD','BSB'],
    ['06:00|06:00','09:45|09:50','11:10|11:15','14:00|14:00'],
    759, '8h 0m', 130
  ),
  '20901': buildTrain(
    '20901', 'Vande Bharat Express (Mumbai-Gandhinagar)',
    ['MMCT','ST','BRC','ADI','GNC'],
    ['06:00|06:00','07:55|08:00','09:40|09:50','12:00|12:05','12:25|12:25'],
    505, '6h 25m', 130
  ),
  '22221': buildTrain(
    '22221', 'Vande Bharat Express (Mumbai-Solapur)',
    ['CSMT','PUNE','SUR'],
    ['06:00|06:00','08:05|08:10','12:20|12:20'],
    450, '6h 20m', 130
  ),

  // ─ Duronto Express ────────────────────────────────────────────────────────
  '12221': buildTrain(
    '12221', 'Pune Duronto Express',
    ['HWH','BBS','SC','PUNE'],
    ['20:10|20:10','23:45|00:05','11:30|11:40','16:15|16:15'],
    1879, '20h 5m', 110
  ),
  '12285': buildTrain(
    '12285', 'Secunderabad Duronto',
    ['SC','RKMP','NZM'],
    ['06:10|06:10','18:00|18:10','06:45|06:45'],
    1684, '24h 35m', 100
  ),
  '12263': buildTrain(
    '12263', 'Pune Duronto Express (NZM)',
    ['NZM','RKMP','SC','PUNE'],
    ['11:00|11:00','22:00|22:10','08:30|08:40','08:00|08:00'],
    1857, '21h 0m', 105
  ),

  // ─ Tejas Express ────────────────────────────────────────────────────────
  '82501': buildTrain(
    '82501', 'Mumbai Tejas Express',
    ['CSMT','ST','BRC','ADI'],
    ['06:25|06:25','08:30|08:35','10:15|10:25','12:45|12:45'],
    491, '6h 20m', 110
  ),
  '82901': buildTrain(
    '82901', 'Lucknow Tejas Express',
    ['NDLS','CNB','LKO'],
    ['06:10|06:10','10:30|10:35','12:25|12:25'],
    512, '6h 15m', 115
  ),

  // ─ Superfast Expresses ────────────────────────────────────────────────────
  '12626': buildTrain(
    '12626', 'Kerala Superfast Express',
    ['NDLS','RKMP','SC','ERS','TVC'],
    ['20:10|20:10','00:10|00:20','13:05|13:15','22:00|22:10','14:15|14:15'],
    3136, '42h 5m', 90
  ),
  '12625': buildTrain(
    '12625', 'Kerala Express',
    ['TVC','ERS','SC','RKMP','NDLS'],
    ['11:00|11:00','16:00|16:10','06:00|06:10','15:30|15:40','05:15|05:15'],
    3136, '42h 15m', 90
  ),
  '12622': buildTrain(
    '12622', 'Tamil Nadu Express',
    ['NDLS','CNB','SC','MAS'],
    ['22:30|22:30','04:00|04:10','18:00|18:10','06:15|06:15'],
    2180, '31h 45m', 95
  ),
  '12628': buildTrain(
    '12628', 'Karnataka Express',
    ['NDLS','RKMP','SC','SBC'],
    ['20:20|20:20','01:30|01:40','13:00|13:10','12:00|12:00'],
    3135, '39h 40m', 90
  ),
  '12627': buildTrain(
    '12627', 'Karnataka Express (Return)',
    ['SBC','SC','RKMP','NDLS'],
    ['20:00|20:00','22:40|22:50','08:40|08:50','12:15|12:15'],
    3135, '40h 15m', 90
  ),
  '12801': buildTrain(
    '12801', 'Purushottam Express',
    ['PURI','BBS','GAYA','PNBE','CNB','NDLS'],
    ['21:55|21:55','23:35|23:45','07:20|07:30','09:00|09:10','14:40|14:50','04:00|04:00'],
    1777, '30h 5m', 85
  ),
  '12925': buildTrain(
    '12925', 'Paschim Express',
    ['MMCT','ST','BRC','RTM','NDLS','AMB','LDH','ASR'],
    ['11:25|11:25','13:40|13:45','15:30|15:40','17:20|17:25','05:10|05:10','07:30|07:35','08:40|08:45','20:10|20:10'],
    1920, '32h 45m', 88
  ),
  '11041': buildTrain(
    '11041', 'Chennai Express',
    ['CSMT','PUNE','SC','MAS'],
    ['14:35|14:35','17:15|17:25','05:00|05:10','15:15|15:15'],
    1279, '24h 40m', 80
  ),
  '12137': buildTrain(
    '12137', 'Punjab Mail',
    ['CSMT','RKMP','NDLS','AMB','LDH','FZR'],
    ['19:35|19:35','07:00|07:10','17:00|17:00','19:45|19:50','21:00|21:05','05:10|05:10'],
    2496, '33h 35m', 85
  ),
  '12123': buildTrain(
    '12123', 'Deccan Queen Express',
    ['CSMT','PUNE'],
    ['17:10|17:10','20:25|20:25'],
    192, '3h 15m', 90
  ),
  '12021': buildTrain(
    '12021', 'Howrah Shatabdi Express',
    ['HWH','PNBE','GAYA','NDLS'],
    ['05:55|05:55','07:40|07:50','09:15|09:25','19:55|19:55'],
    1445, '14h 0m', 110
  ),
  '12505': buildTrain(
    '12505', 'Northeast Express',
    ['GHY','PNBE','CNB','NDLS'],
    ['19:30|19:30','08:00|08:10','14:05|14:15','10:00|10:00'],
    1900, '38h 30m', 80
  ),
  '20503': buildTrain(
    '20503', 'Arunachal Express Rajdhani',
    ['NHL','GHY','PNBE','CNB','ANVT'],
    ['12:15|12:15','15:00|15:10','05:00|05:10','11:00|11:10','17:00|17:00'],
    2085, '28h 45m', 95
  ),
  '12059': buildTrain(
    '12059', 'Kota Jan Shatabdi Express',
    ['KOTA','SWM','MTJ','NZM'],
    ['06:15|06:15','07:25|07:27','10:30|10:32','12:25|12:25'],
    460, '6h 10m', 100
  ),
  '12311': buildTrain(
    '12311', 'Netaji Express (Kalka Mail)',
    ['HWH','GAYA','PNBE','NDLS','AMB','KLK'],
    ['21:55|21:55','01:35|01:45','03:10|03:20','17:00|17:00','20:40|20:45','03:00|03:00'],
    1937, '29h 5m', 88
  ),

  // ─ South India routes ──────────────────────────────────────────────────
  '16022': buildTrain(
    '16022', 'Kaveri Express',
    ['SBC','MAS'],
    ['07:00|07:00','11:45|11:45'],
    360, '4h 45m', 90
  ),
  '12027': buildTrain(
    '12027', 'Chennai Shatabdi Express',
    ['MAS','MYS'],
    ['06:00|06:00','10:40|10:40'],
    498, '4h 40m', 120
  ),
  '12685': buildTrain(
    '12685', 'Mangalore Express',
    ['MAS','ERS','MAQ'],
    ['21:45|21:45','06:00|06:10','13:00|13:00'],
    771, '15h 15m', 80
  ),
  '12601': buildTrain(
    '12601', 'Mangalore Mail',
    ['MAS','ERS','MAQ'],
    ['21:00|21:00','05:20|05:30','11:10|11:10'],
    771, '14h 10m', 82
  ),
  '12167': buildTrain(
    '12167', 'Varanasi Express',
    ['LTT','RKMP','ALD','BSB'],
    ['11:00|11:00','22:00|22:10','03:00|03:10','05:30|05:30'],
    1497, '18h 30m', 90
  ),
  '11201': buildTrain(
    '11201', 'Narmada Express',
    ['CSMT','RKMP','JBP'],
    ['22:25|22:25','08:00|08:10','17:00|17:00'],
    979, '18h 35m', 80
  ),

  // ─ Gujarat ────────────────────────────────────────────────────────────
  '12921': buildTrain(
    '12921', 'Flying Ranee Express',
    ['MMCT','ST'],
    ['09:25|09:25','13:05|13:05'],
    263, '3h 40m', 100
  ),
  '19019': buildTrain(
    '19019', 'Dehradun Express',
    ['MMCT','BRC','RTM','NDLS','DDN'],
    ['19:00|19:00','21:40|21:50','23:40|23:45','11:40|11:40','07:30|07:30'],
    1510, '36h 30m', 75
  ),

  // ─ Kamayani / Patna ──────────────────────────────────────────────────
  '11071': buildTrain(
    '11071', 'Kamayani Express',
    ['CSMT','RKMP','ALD','BSB','PNBE'],
    ['23:15|23:15','11:10|11:20','18:00|18:10','20:00|20:10','05:30|05:30'],
    1536, '30h 15m', 78
  ),
  '12909': buildTrain(
    '12909', 'Garib Rath Express (Mumbai-Patna)',
    ['BDTS','RKMP','ALD','PNBE'],
    ['12:05|12:05','23:00|23:10','04:00|04:10','10:50|10:50'],
    1463, '22h 45m', 90
  ),
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get a static train route for the given train number.
 * Returns null if no route is available for that train.
 */
export function getStaticTrainRoute(trainNumber: string): Train | null {
  return TRAIN_ROUTES[trainNumber] ?? null;
}

/**
 * Get the list of all train numbers in the static database.
 */
export function getStaticTrainNumbers(): string[] {
  return Object.keys(TRAIN_ROUTES);
}

import { SearchResult } from '@/types';

export const INDIAN_TRAINS_DATABASE: SearchResult[] = [
  // ── RAJDHANI EXPRESS ──────────────────────────────────────────────────────
  { trainNumber: '12951', trainName: 'Mumbai Rajdhani Express', origin: 'Mumbai Central (MMCT)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '17:00', arrivalTime: '08:32' },
  { trainNumber: '12952', trainName: 'New Delhi Rajdhani Express', origin: 'New Delhi (NDLS)', destination: 'Mumbai Central (MMCT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '16:55', arrivalTime: '08:35' },
  { trainNumber: '12301', trainName: 'Howrah Rajdhani Express', origin: 'Howrah Jn (HWH)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '16:50', arrivalTime: '10:05' },
  { trainNumber: '12302', trainName: 'New Delhi Howrah Rajdhani', origin: 'New Delhi (NDLS)', destination: 'Howrah Jn (HWH)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '17:05', arrivalTime: '09:55' },
  { trainNumber: '12309', trainName: 'Rajendra Nagar Rajdhani', origin: 'Rajendra Nagar (RJPB)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '19:50', arrivalTime: '10:00' },
  { trainNumber: '12431', trainName: 'Thiruvananthapuram Rajdhani', origin: 'Hazrat Nizamuddin (NZM)', destination: 'Thiruvananthapuram (TVC)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '11:00', arrivalTime: '13:40' },
  { trainNumber: '12432', trainName: 'Trivandrum Rajdhani Express', origin: 'Thiruvananthapuram (TVC)', destination: 'Hazrat Nizamuddin (NZM)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '17:30', arrivalTime: '16:00' },
  { trainNumber: '22691', trainName: 'KSR Bengaluru Rajdhani', origin: 'KSR Bengaluru (SBC)', destination: 'Hazrat Nizamuddin (NZM)', runsOnDays: ['Mon','Wed','Thu','Sat'], departureTime: '20:00', arrivalTime: '06:20' },
  { trainNumber: '12423', trainName: 'Dibrugarh Rajdhani Express', origin: 'Dibrugarh Town (DBRG)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Thu','Fri'], departureTime: '21:20', arrivalTime: '07:05' },
  { trainNumber: '12953', trainName: 'August Kranti Rajdhani', origin: 'Mumbai Central (MMCT)', destination: 'Hazrat Nizamuddin (NZM)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '17:10', arrivalTime: '09:43' },
  { trainNumber: '20503', trainName: 'Arunachal Express Rajdhani', origin: 'Naharlagun (NHL)', destination: 'Anand Vihar Terminus (ANVT)', runsOnDays: ['Mon','Thu'], departureTime: '12:15', arrivalTime: '17:00' },

  // ── SHATABDI EXPRESS ──────────────────────────────────────────────────────
  { trainNumber: '12002', trainName: 'Bhopal Shatabdi Express', origin: 'New Delhi (NDLS)', destination: 'Rani Kamalapati (RKMP)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:00', arrivalTime: '14:40' },
  { trainNumber: '12001', trainName: 'Rani Kamalapati Shatabdi', origin: 'Rani Kamalapati (RKMP)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '15:15', arrivalTime: '23:55' },
  { trainNumber: '12004', trainName: 'Lucknow Shatabdi Express', origin: 'New Delhi (NDLS)', destination: 'Lucknow Charbagh (LKO)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:10', arrivalTime: '12:40' },
  { trainNumber: '12006', trainName: 'Kalka Shatabdi Express', origin: 'New Delhi (NDLS)', destination: 'Kalka (KLK)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '07:40', arrivalTime: '11:40' },
  { trainNumber: '12030', trainName: 'Amritsar Shatabdi Express', origin: 'New Delhi (NDLS)', destination: 'Amritsar Jn (ASR)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '16:25', arrivalTime: '22:40' },
  { trainNumber: '12020', trainName: 'Ranchi Shatabdi Express', origin: 'Ranchi Jn (RNC)', destination: 'Howrah Jn (HWH)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat'], departureTime: '13:45', arrivalTime: '21:30' },
  { trainNumber: '12045', trainName: 'Chandigarh Shatabdi', origin: 'New Delhi (NDLS)', destination: 'Chandigarh (CDG)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '07:20', arrivalTime: '10:45' },
  { trainNumber: '12046', trainName: 'Chandigarh Shatabdi (Return)', origin: 'Chandigarh (CDG)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '17:35', arrivalTime: '21:00' },
  { trainNumber: '12009', trainName: 'Shatabdi Express Mumbai-Ahmedabad', origin: 'Mumbai Central (MMCT)', destination: 'Ahmedabad Jn (ADI)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:25', arrivalTime: '12:55' },
  { trainNumber: '12010', trainName: 'Shatabdi Express Ahmedabad-Mumbai', origin: 'Ahmedabad Jn (ADI)', destination: 'Mumbai Central (MMCT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '14:25', arrivalTime: '20:55' },

  // ── VANDE BHARAT EXPRESS ──────────────────────────────────────────────────
  { trainNumber: '22436', trainName: 'Vande Bharat Express (Delhi-Varanasi)', origin: 'New Delhi (NDLS)', destination: 'Varanasi Jn (BSB)', runsOnDays: ['Mon','Tue','Wed','Fri','Sat','Sun'], departureTime: '06:00', arrivalTime: '14:00' },
  { trainNumber: '20901', trainName: 'Vande Bharat Express (Mumbai-Gandhinagar)', origin: 'Mumbai Central (MMCT)', destination: 'Gandhinagar Capital (GNC)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat'], departureTime: '06:00', arrivalTime: '12:25' },
  { trainNumber: '22439', trainName: 'Vande Bharat Express (Delhi-Uma)', origin: 'New Delhi (NDLS)', destination: 'Uma Shiv Mahapuran (ASR)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:00', arrivalTime: '14:00' },
  { trainNumber: '20911', trainName: 'Vande Bharat Express (Bhopal)', origin: 'Rani Kamalapati (RKMP)', destination: 'Hazrat Nizamuddin (NZM)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '05:55', arrivalTime: '14:00' },
  { trainNumber: '22221', trainName: 'Vande Bharat Express (Mumbai-Solapur)', origin: 'Mumbai CSMT (CSMT)', destination: 'Solapur (SUR)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:00', arrivalTime: '12:20' },
  { trainNumber: '22415', trainName: 'Vande Bharat Express (Delhi-Katra)', origin: 'Amritsar Jn (ASR)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '05:50', arrivalTime: '12:00' },

  // ── DURONTO EXPRESS ──────────────────────────────────────────────────────
  { trainNumber: '12260', trainName: 'Sealdah Duronto Express', origin: 'Bikaner Jn (BKN)', destination: 'Sealdah (SDAH)', runsOnDays: ['Mon','Thu'], departureTime: '12:15', arrivalTime: '13:15' },
  { trainNumber: '12221', trainName: 'Pune Duronto Express', origin: 'Howrah Jn (HWH)', destination: 'Pune Jn (PUNE)', runsOnDays: ['Mon','Wed','Fri'], departureTime: '20:10', arrivalTime: '16:15' },
  { trainNumber: '12263', trainName: 'Pune Duronto Express (NZM)', origin: 'Hazrat Nizamuddin (NZM)', destination: 'Pune Jn (PUNE)', runsOnDays: ['Mon','Fri'], departureTime: '11:00', arrivalTime: '08:00' },
  { trainNumber: '12285', trainName: 'Secunderabad Duronto', origin: 'Secunderabad (SC)', destination: 'Hazrat Nizamuddin (NZM)', runsOnDays: ['Mon','Wed','Fri'], departureTime: '06:10', arrivalTime: '06:45' },

  // ── TEJAS EXPRESS ──────────────────────────────────────────────────────
  { trainNumber: '82501', trainName: 'Mumbai Tejas Express', origin: 'Mumbai CSMT (CSMT)', destination: 'Ahmedabad Jn (ADI)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:25', arrivalTime: '12:45' },
  { trainNumber: '82901', trainName: 'Lucknow Tejas Express', origin: 'New Delhi (NDLS)', destination: 'Lucknow Charbagh (LKO)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:10', arrivalTime: '12:25' },
  { trainNumber: '82902', trainName: 'Lucknow Tejas Express (Return)', origin: 'Lucknow Charbagh (LKO)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '14:00', arrivalTime: '20:00' },

  // ── GARIB RATH ──────────────────────────────────────────────────────
  { trainNumber: '12909', trainName: 'Garib Rath Express (Mumbai-Patna)', origin: 'Bandra Terminus (BDTS)', destination: 'Patna Jn (PNBE)', runsOnDays: ['Mon','Wed','Fri'], departureTime: '12:05', arrivalTime: '10:50' },
  { trainNumber: '12203', trainName: 'Garib Rath Express (Mumbai-Amritsar)', origin: 'Saharsa Jn (SHC)', destination: 'Amritsar Jn (ASR)', runsOnDays: ['Mon','Thu'], departureTime: '15:20', arrivalTime: '07:45' },

  // ── MAJOR SUPERFAST EXPRESSES ──────────────────────────────────────────────────────
  { trainNumber: '12626', trainName: 'Kerala Superfast Express', origin: 'New Delhi (NDLS)', destination: 'Trivandrum Central (TVC)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '20:10', arrivalTime: '14:15' },
  { trainNumber: '12625', trainName: 'Kerala Express', origin: 'Trivandrum Central (TVC)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '11:00', arrivalTime: '05:15' },
  { trainNumber: '12622', trainName: 'Tamil Nadu Express', origin: 'New Delhi (NDLS)', destination: 'Chennai Central (MAS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '22:30', arrivalTime: '06:15' },
  { trainNumber: '12621', trainName: 'Tamil Nadu Express (Return)', origin: 'Chennai Central (MAS)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '22:00', arrivalTime: '07:55' },
  { trainNumber: '12628', trainName: 'Karnataka Express', origin: 'New Delhi (NDLS)', destination: 'KSR Bengaluru (SBC)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '20:20', arrivalTime: '12:00' },
  { trainNumber: '12627', trainName: 'Karnataka Express (Return)', origin: 'KSR Bengaluru (SBC)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '20:00', arrivalTime: '12:15' },
  { trainNumber: '12137', trainName: 'Punjab Mail', origin: 'Mumbai CSMT (CSMT)', destination: 'Firozpur Cantt (FZR)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '19:35', arrivalTime: '05:10' },
  { trainNumber: '12138', trainName: 'Punjab Mail (Return)', origin: 'Firozpur Cantt (FZR)', destination: 'Mumbai CSMT (CSMT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '07:15', arrivalTime: '17:00' },
  { trainNumber: '12801', trainName: 'Purushottam Express', origin: 'Puri (PURI)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '21:55', arrivalTime: '04:00' },
  { trainNumber: '12802', trainName: 'Purushottam Express (Return)', origin: 'New Delhi (NDLS)', destination: 'Puri (PURI)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '22:10', arrivalTime: '04:00' },
  { trainNumber: '12311', trainName: 'Netaji Express (Kalka Mail)', origin: 'Howrah Jn (HWH)', destination: 'Kalka (KLK)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '21:55', arrivalTime: '03:00' },
  { trainNumber: '12925', trainName: 'Paschim Express', origin: 'Mumbai Central (MMCT)', destination: 'Amritsar Jn (ASR)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '11:25', arrivalTime: '20:10' },
  { trainNumber: '12926', trainName: 'Paschim Express (Return)', origin: 'Amritsar Jn (ASR)', destination: 'Mumbai Central (MMCT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '23:15', arrivalTime: '06:35' },
  { trainNumber: '12123', trainName: 'Deccan Queen Express', origin: 'Mumbai CSMT (CSMT)', destination: 'Pune Jn (PUNE)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '17:10', arrivalTime: '20:25' },
  { trainNumber: '12059', trainName: 'Kota Jan Shatabdi Express', origin: 'Kota Jn (KOTA)', destination: 'Hazrat Nizamuddin (NZM)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:15', arrivalTime: '12:25' },

  // ── NARMADA & CENTRAL INDIA ──────────────────────────────────────────────────────
  { trainNumber: '11201', trainName: 'Narmada Express', origin: 'Mumbai CSMT (CSMT)', destination: 'Jabalpur (JBP)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '22:25', arrivalTime: '17:00' },
  { trainNumber: '11202', trainName: 'Narmada Express (Return)', origin: 'Jabalpur (JBP)', destination: 'Mumbai CSMT (CSMT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '22:15', arrivalTime: '16:55' },
  { trainNumber: '12167', trainName: 'Varanasi Express', origin: 'Mumbai LTT (LTT)', destination: 'Varanasi Jn (BSB)', runsOnDays: ['Mon','Thu'], departureTime: '11:00', arrivalTime: '05:30' },
  { trainNumber: '12168', trainName: 'Varanasi LTT Express', origin: 'Varanasi Jn (BSB)', destination: 'Mumbai LTT (LTT)', runsOnDays: ['Tue','Sat'], departureTime: '11:00', arrivalTime: '05:30' },
  { trainNumber: '11071', trainName: 'Kamayani Express', origin: 'Mumbai CSMT (CSMT)', destination: 'Patna Jn (PNBE)', runsOnDays: ['Mon','Wed','Fri'], departureTime: '23:15', arrivalTime: '05:30' },
  { trainNumber: '11072', trainName: 'Kamayani Express (Return)', origin: 'Patna Jn (PNBE)', destination: 'Mumbai CSMT (CSMT)', runsOnDays: ['Mon','Wed','Fri'], departureTime: '11:20', arrivalTime: '13:30' },

  // ── GUJARAT ROUTES ──────────────────────────────────────────────────────
  { trainNumber: '19019', trainName: 'Dehradun Express', origin: 'Mumbai Central (MMCT)', destination: 'Dehradun (DDN)', runsOnDays: ['Mon','Fri'], departureTime: '19:00', arrivalTime: '07:30' },
  { trainNumber: '12921', trainName: 'Flying Ranee Express', origin: 'Mumbai Central (MMCT)', destination: 'Surat (ST)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '09:25', arrivalTime: '13:05' },
  { trainNumber: '12922', trainName: 'Flying Ranee Express (Return)', origin: 'Surat (ST)', destination: 'Mumbai Central (MMCT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '15:25', arrivalTime: '19:15' },
  { trainNumber: '12009', trainName: 'Shatabdi Express (Mumbai-Ahmedabad)', origin: 'Mumbai Central (MMCT)', destination: 'Ahmedabad Jn (ADI)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:25', arrivalTime: '12:55' },

  // ── NORTH EAST ROUTES ──────────────────────────────────────────────────────
  { trainNumber: '12505', trainName: 'Northeast Express', origin: 'Guwahati (GHY)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '19:30', arrivalTime: '10:00' },
  { trainNumber: '12506', trainName: 'Northeast Express (Return)', origin: 'Anand Vihar Terminus (ANVT)', destination: 'Guwahati (GHY)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '12:05', arrivalTime: '03:30' },
  { trainNumber: '15909', trainName: 'Avadh Assam Express', origin: 'Dibrugarh Town (DBRG)', destination: 'Lalgarh Jn (LGH)', runsOnDays: ['Tue','Fri'], departureTime: '12:45', arrivalTime: '07:00' },
  { trainNumber: '12515', trainName: 'Silchar AC Superfast', origin: 'Silchar (SCL)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Fri'], departureTime: '20:15', arrivalTime: '19:45' },

  // ── SOUTH INDIA ROUTES ──────────────────────────────────────────────────────
  { trainNumber: '12163', trainName: 'Dadar Chennai Express', origin: 'Dadar (DDR)', destination: 'Chennai Egmore (MS)', runsOnDays: ['Mon','Wed','Thu','Sat'], departureTime: '23:50', arrivalTime: '04:00' },
  { trainNumber: '11041', trainName: 'Chennai Express', origin: 'Mumbai CSMT (CSMT)', destination: 'Chennai Central (MAS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '14:35', arrivalTime: '15:15' },
  { trainNumber: '11042', trainName: 'Chennai Express (Return)', origin: 'Chennai Central (MAS)', destination: 'Mumbai CSMT (CSMT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '09:00', arrivalTime: '09:10' },
  { trainNumber: '12163', trainName: 'Dadar Chennai Superfast', origin: 'Dadar (DDR)', destination: 'Chennai Egmore (MS)', runsOnDays: ['Mon','Wed','Thu','Sat'], departureTime: '23:50', arrivalTime: '04:15' },
  { trainNumber: '16022', trainName: 'Kaveri Express', origin: 'KSR Bengaluru (SBC)', destination: 'Chennai Central (MAS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '07:00', arrivalTime: '11:45' },
  { trainNumber: '12027', trainName: 'Chennai Shatabdi Express', origin: 'Chennai Central (MAS)', destination: 'Mysuru (MYS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:00', arrivalTime: '10:40' },
  { trainNumber: '12028', trainName: 'Mysore Shatabdi Express', origin: 'Mysuru (MYS)', destination: 'Chennai Central (MAS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '14:15', arrivalTime: '20:00' },
  { trainNumber: '12685', trainName: 'Mangalore Express', origin: 'Chennai Central (MAS)', destination: 'Mangaluru (MAQ)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '21:45', arrivalTime: '13:00' },
  { trainNumber: '12686', trainName: 'Mangalore Express (Return)', origin: 'Mangaluru (MAQ)', destination: 'Chennai Central (MAS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '14:15', arrivalTime: '05:30' },
  { trainNumber: '12601', trainName: 'Mangalore Mail', origin: 'Chennai Central (MAS)', destination: 'Mangaluru (MAQ)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '21:00', arrivalTime: '11:10' },

  // ── EAST INDIA ROUTES ──────────────────────────────────────────────────────
  { trainNumber: '12303', trainName: 'Poorva Express (Via Gaya)', origin: 'Howrah Jn (HWH)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Wed','Fri','Sun'], departureTime: '08:05', arrivalTime: '05:45' },
  { trainNumber: '12304', trainName: 'Poorva Express (Return)', origin: 'New Delhi (NDLS)', destination: 'Howrah Jn (HWH)', runsOnDays: ['Mon','Tue','Thu','Sat'], departureTime: '22:30', arrivalTime: '20:40' },
  { trainNumber: '12305', trainName: 'Rajendra Nagar Express', origin: 'Howrah Jn (HWH)', destination: 'New Delhi (NDLS)', runsOnDays: ['Tue','Thu','Sat'], departureTime: '05:00', arrivalTime: '23:59' },
  { trainNumber: '12313', trainName: 'Sealdah Rajdhani (Via Sahebganj)', origin: 'Sealdah (SDAH)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Wed','Sat'], departureTime: '14:30', arrivalTime: '10:30' },
  { trainNumber: '13131', trainName: 'Kolkata Patna Express', origin: 'Kolkata (KOAA)', destination: 'Patna Jn (PNBE)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '07:00', arrivalTime: '18:00' },
  { trainNumber: '12307', trainName: 'Jodhpur Express', origin: 'Howrah Jn (HWH)', destination: 'Jodhpur Jn (JU)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '23:55', arrivalTime: '10:40' },

  // ── RAJASTHAN & NORTHWEST ROUTES ──────────────────────────────────────────────────────
  { trainNumber: '12916', trainName: 'Ashram Express', origin: 'Ahmedabad Jn (ADI)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '15:20', arrivalTime: '05:55' },
  { trainNumber: '12915', trainName: 'Ashram Express (Return)', origin: 'New Delhi (NDLS)', destination: 'Ahmedabad Jn (ADI)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '15:20', arrivalTime: '05:00' },
  { trainNumber: '12957', trainName: 'Swarna Jayanti Rajdhani', origin: 'Ahmedabad Jn (ADI)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Wed','Fri','Sat'], departureTime: '06:15', arrivalTime: '13:25' },
  { trainNumber: '12958', trainName: 'Swarna Jayanti Rajdhani (Return)', origin: 'Hazrat Nizamuddin (NZM)', destination: 'Ahmedabad Jn (ADI)', runsOnDays: ['Tue','Thu','Fri','Sun'], departureTime: '14:45', arrivalTime: '21:35' },
  { trainNumber: '12461', trainName: 'Mandor Express', origin: 'Jodhpur Jn (JU)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '17:00', arrivalTime: '06:05' },
  { trainNumber: '12462', trainName: 'Mandor Express (Return)', origin: 'New Delhi (NDLS)', destination: 'Jodhpur Jn (JU)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '19:00', arrivalTime: '08:10' },
  { trainNumber: '14659', trainName: 'Shri Ganga Nagar Express', origin: 'Shri Ganga Nagar (SGNR)', destination: 'Delhi Jn (DLI)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '05:10', arrivalTime: '11:00' },
  { trainNumber: '19031', trainName: 'Haridwar Express', origin: 'Mumbai Central (MMCT)', destination: 'Haridwar Jn (HW)', runsOnDays: ['Mon','Wed','Sat'], departureTime: '15:15', arrivalTime: '10:15' },

  // ── UTTAR PRADESH ROUTES ──────────────────────────────────────────────────────
  { trainNumber: '12589', trainName: 'Gorakhpur Express', origin: 'Gorakhpur Jn (GKP)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:05', arrivalTime: '16:15' },
  { trainNumber: '14005', trainName: 'Lichchhavi Express', origin: 'New Delhi (NDLS)', destination: 'Sitamarhi (SMI)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '17:00', arrivalTime: '14:00' },
  { trainNumber: '12419', trainName: 'Gomti Express', origin: 'New Delhi (NDLS)', destination: 'Lucknow Charbagh (LKO)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '10:05', arrivalTime: '15:55' },
  { trainNumber: '12420', trainName: 'Gomti Express (Return)', origin: 'Lucknow Charbagh (LKO)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '07:30', arrivalTime: '13:25' },
  { trainNumber: '12561', trainName: 'Swatantrata Senani Express', origin: 'New Delhi (NDLS)', destination: 'Jaynagar (JYG)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '18:45', arrivalTime: '19:30' },
  { trainNumber: '14007', trainName: 'Sadbhavana Express', origin: 'Saharsa Jn (SHC)', destination: 'Anand Vihar Terminus (ANVT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '08:20', arrivalTime: '06:30' },
  { trainNumber: '12581', trainName: 'New Farakka Express', origin: 'New Farakka Jn (NFK)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Wed','Fri'], departureTime: '07:15', arrivalTime: '09:55' },
  { trainNumber: '12101', trainName: 'Jnaneshwari Super Deluxe', origin: 'Howrah Jn (HWH)', destination: 'Mumbai CSMT (CSMT)', runsOnDays: ['Mon','Wed','Fri'], departureTime: '23:55', arrivalTime: '04:00' },
  { trainNumber: '12102', trainName: 'Jnaneshwari Super Deluxe (Return)', origin: 'Mumbai CSMT (CSMT)', destination: 'Howrah Jn (HWH)', runsOnDays: ['Tue','Thu','Sat'], departureTime: '23:00', arrivalTime: '03:05' },

  // ── MADHYA PRADESH / CHHATTISGARH ──────────────────────────────────────────────────────
  { trainNumber: '12853', trainName: 'Amarkantak Express', origin: 'Bilaspur Jn (BSP)', destination: 'Hazrat Nizamuddin (NZM)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '13:00', arrivalTime: '12:05' },
  { trainNumber: '12854', trainName: 'Amarkantak Express (Return)', origin: 'Hazrat Nizamuddin (NZM)', destination: 'Bilaspur Jn (BSP)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '13:05', arrivalTime: '12:15' },
  { trainNumber: '18238', trainName: 'Chhattisgarh Express', origin: 'Amritsar Jn (ASR)', destination: 'Bilaspur Jn (BSP)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '17:30', arrivalTime: '07:45' },
  { trainNumber: '12152', trainName: 'Samarsata Express', origin: 'Hazrat Nizamuddin (NZM)', destination: 'Jabalpur (JBP)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '20:20', arrivalTime: '10:15' },
  { trainNumber: '12186', trainName: 'Rewanchal Express', origin: 'New Delhi (NDLS)', destination: 'Bilaspur Jn (BSP)', runsOnDays: ['Mon','Wed','Fri'], departureTime: '23:00', arrivalTime: '22:25' },
  { trainNumber: '11201', trainName: 'Narmada Express', origin: 'Mumbai CSMT (CSMT)', destination: 'Jabalpur (JBP)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '22:25', arrivalTime: '17:00' },
  { trainNumber: '11202', trainName: 'Narmada Express (Return)', origin: 'Jabalpur (JBP)', destination: 'Mumbai CSMT (CSMT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '22:15', arrivalTime: '16:55' },

  // ── BIHAR & JHARKHAND ──────────────────────────────────────────────────────
  { trainNumber: '12391', trainName: 'Shramjeevi Express', origin: 'Rajgir (RGD)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '09:00', arrivalTime: '07:25' },
  { trainNumber: '12392', trainName: 'Shramjeevi Express (Return)', origin: 'Anand Vihar Terminus (ANVT)', destination: 'Rajgir (RGD)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '16:40', arrivalTime: '15:00' },
  { trainNumber: '12333', trainName: 'Vibhuti Express', origin: 'Howrah Jn (HWH)', destination: 'Patna Jn (PNBE)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:00', arrivalTime: '12:30' },
  { trainNumber: '12334', trainName: 'Vibhuti Express (Return)', origin: 'Patna Jn (PNBE)', destination: 'Howrah Jn (HWH)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '14:30', arrivalTime: '21:10' },
  { trainNumber: '12817', trainName: 'Jharkhand Swarna Jayanti', origin: 'Hatia (HTE)', destination: 'Anand Vihar Terminus (ANVT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '18:30', arrivalTime: '11:55' },
  { trainNumber: '12818', trainName: 'Jharkhand Swarna Jayanti (Return)', origin: 'Anand Vihar Terminus (ANVT)', destination: 'Hatia (HTE)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '13:15', arrivalTime: '08:00' },

  // ── ANDHRA PRADESH & TELANGANA ──────────────────────────────────────────────────────
  { trainNumber: '12723', trainName: 'Andhra Pradesh Express', origin: 'Secunderabad (SC)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '18:00', arrivalTime: '07:10' },
  { trainNumber: '12724', trainName: 'Andhra Pradesh Express (Return)', origin: 'New Delhi (NDLS)', destination: 'Secunderabad (SC)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '09:00', arrivalTime: '22:10' },
  { trainNumber: '12703', trainName: 'Falaknuma Express', origin: 'Hyderabad Deccan (HYB)', destination: 'Visakhapatnam (VSKP)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '17:30', arrivalTime: '06:00' },
  { trainNumber: '12704', trainName: 'Falaknuma Express (Return)', origin: 'Visakhapatnam (VSKP)', destination: 'Hyderabad Deccan (HYB)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '18:00', arrivalTime: '06:45' },
  { trainNumber: '12759', trainName: 'Charminar Express', origin: 'Hyderabad Deccan (HYB)', destination: 'Chennai Central (MAS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '18:30', arrivalTime: '06:00' },

  // ── ODISHA ROUTES ──────────────────────────────────────────────────────
  { trainNumber: '12875', trainName: 'Neelachal Express', origin: 'Puri (PURI)', destination: 'Anand Vihar Terminus (ANVT)', runsOnDays: ['Mon','Fri'], departureTime: '22:15', arrivalTime: '14:30' },
  { trainNumber: '12876', trainName: 'Neelachal Express (Return)', origin: 'Anand Vihar Terminus (ANVT)', destination: 'Puri (PURI)', runsOnDays: ['Thu','Mon'], departureTime: '06:30', arrivalTime: '23:00' },
  { trainNumber: '18410', trainName: 'Sri Jagannath Express', origin: 'Puri (PURI)', destination: 'New Delhi (NDLS)', runsOnDays: ['Mon','Wed','Sat'], departureTime: '22:45', arrivalTime: '07:35' },

  // ── KERALA ROUTES ──────────────────────────────────────────────────────
  { trainNumber: '16649', trainName: 'Parasuram Express', origin: 'Thiruvananthapuram (TVC)', destination: 'Mangaluru (MAQ)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:00', arrivalTime: '21:30' },
  { trainNumber: '16381', trainName: 'Mumbai Kanyakumari Express', origin: 'Mumbai CSMT (CSMT)', destination: 'Kanyakumari (CAPE)', runsOnDays: ['Mon','Wed','Fri'], departureTime: '09:20', arrivalTime: '11:30' },
  { trainNumber: '22637', trainName: 'West Coast Express', origin: 'Thiruvananthapuram (TVC)', destination: 'Mangaluru (MAQ)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '07:45', arrivalTime: '20:00' },
  { trainNumber: '16303', trainName: 'Venad Express', origin: 'Thiruvananthapuram (TVC)', destination: 'Shoranur Jn (SRR)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '05:30', arrivalTime: '10:20' },

  // ── MUMBAI SUBURBAN ROUTES ──────────────────────────────────────────────────────
  { trainNumber: '11301', trainName: 'Udyan Express', origin: 'Mumbai CSMT (CSMT)', destination: 'KSR Bengaluru (SBC)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '08:05', arrivalTime: '11:50' },
  { trainNumber: '11302', trainName: 'Udyan Express (Return)', origin: 'KSR Bengaluru (SBC)', destination: 'Mumbai CSMT (CSMT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '20:15', arrivalTime: '22:50' },
  { trainNumber: '12049', trainName: 'Gatimaan Express', origin: 'Hazrat Nizamuddin (NZM)', destination: 'Agra Cantt (AGC)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '08:10', arrivalTime: '09:50' },
  { trainNumber: '12050', trainName: 'Gatimaan Express (Return)', origin: 'Agra Cantt (AGC)', destination: 'Hazrat Nizamuddin (NZM)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '17:30', arrivalTime: '19:10' },

  // ── INTERCITY & JAN SHATABDI ──────────────────────────────────────────────────────
  { trainNumber: '12071', trainName: 'Dadar Jalna Jan Shatabdi', origin: 'Dadar (DDR)', destination: 'Jalna (J)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:55', arrivalTime: '12:45' },
  { trainNumber: '12073', trainName: 'Howrah Bhubaneswar Jan Shatabdi', origin: 'Howrah Jn (HWH)', destination: 'Bhubaneswar (BBS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:05', arrivalTime: '13:00' },
  { trainNumber: '12075', trainName: 'Howrah Patna Jan Shatabdi', origin: 'Howrah Jn (HWH)', destination: 'Patna Jn (PNBE)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '06:15', arrivalTime: '14:15' },
  { trainNumber: '12082', trainName: 'Janasatabdi Express (Kannur)', origin: 'Kannur (CAN)', destination: 'Thiruvananthapuram (TVC)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '05:30', arrivalTime: '13:45' },
  { trainNumber: '12061', trainName: 'Habibganj Jan Shatabdi', origin: 'Rani Kamalapati (RKMP)', destination: 'Jabalpur (JBP)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '05:40', arrivalTime: '11:00' },

  // ── HERITAGE & SPECIAL TRAINS ──────────────────────────────────────────────────────
  { trainNumber: '22119', trainName: 'Mumbai CSMT Karmali Tejas', origin: 'Mumbai CSMT (CSMT)', destination: 'Karmali (KRMI)', runsOnDays: ['Mon','Fri'], departureTime: '05:00', arrivalTime: '14:45' },
  { trainNumber: '22120', trainName: 'Karmali Mumbai Tejas', origin: 'Karmali (KRMI)', destination: 'Mumbai CSMT (CSMT)', runsOnDays: ['Mon','Fri'], departureTime: '15:50', arrivalTime: '01:30' },
  { trainNumber: '12431', trainName: 'Trivandrum Rajdhani Express', origin: 'Hazrat Nizamuddin (NZM)', destination: 'Thiruvananthapuram (TVC)', runsOnDays: ['Mon','Wed','Fri','Sun'], departureTime: '11:00', arrivalTime: '16:20' },
  { trainNumber: '12284', trainName: 'Duronto Express (Ernakulam)', origin: 'Ernakulam Jn (ERS)', destination: 'Hazrat Nizamuddin (NZM)', runsOnDays: ['Mon','Thu'], departureTime: '07:40', arrivalTime: '12:55' },

  // ── GOA ROUTES ──────────────────────────────────────────────────────
  { trainNumber: '10103', trainName: 'Mandovi Express', origin: 'Mumbai CSMT (CSMT)', destination: 'Madgaon (MAO)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '07:10', arrivalTime: '17:00' },
  { trainNumber: '10104', trainName: 'Mandovi Express (Return)', origin: 'Madgaon (MAO)', destination: 'Mumbai CSMT (CSMT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '07:45', arrivalTime: '17:25' },
  { trainNumber: '12779', trainName: 'Goa Express', origin: 'Hazrat Nizamuddin (NZM)', destination: 'Vasco-Da-Gama (VSG)', runsOnDays: ['Mon','Thu'], departureTime: '15:00', arrivalTime: '23:45' },
  { trainNumber: '12780', trainName: 'Goa Express (Return)', origin: 'Vasco-Da-Gama (VSG)', destination: 'Hazrat Nizamuddin (NZM)', runsOnDays: ['Wed','Sat'], departureTime: '07:15', arrivalTime: '17:00' },

  // ── LONG DISTANCE MAIL / EXPRESS ──────────────────────────────────────────────────────
  { trainNumber: '12903', trainName: 'Golden Temple Mail', origin: 'Mumbai Central (MMCT)', destination: 'Amritsar Jn (ASR)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '21:00', arrivalTime: '13:30' },
  { trainNumber: '12904', trainName: 'Golden Temple Mail (Return)', origin: 'Amritsar Jn (ASR)', destination: 'Mumbai Central (MMCT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '11:00', arrivalTime: '04:30' },
  { trainNumber: '12641', trainName: 'Thirukkural Express', origin: 'Chennai Central (MAS)', destination: 'Mumbai CSMT (CSMT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '18:55', arrivalTime: '16:05' },
  { trainNumber: '12642', trainName: 'Thirukkural Express (Return)', origin: 'Mumbai CSMT (CSMT)', destination: 'Chennai Central (MAS)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '18:30', arrivalTime: '14:45' },
  { trainNumber: '11077', trainName: 'Jhelum Express', origin: 'Mumbai CSMT (CSMT)', destination: 'Jammu Tawi (JAT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '23:55', arrivalTime: '07:00' },
  { trainNumber: '11078', trainName: 'Jhelum Express (Return)', origin: 'Jammu Tawi (JAT)', destination: 'Mumbai CSMT (CSMT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '19:30', arrivalTime: '23:00' },
  { trainNumber: '12472', trainName: 'Swaraj Express', origin: 'Hazrat Nizamuddin (NZM)', destination: 'Jammu Tawi (JAT)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '20:40', arrivalTime: '06:00' },
  { trainNumber: '12473', trainName: 'Sarvodaya Express', origin: 'Hazrat Nizamuddin (NZM)', destination: 'Bikaner Jn (BKN)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '23:20', arrivalTime: '09:20' },
  { trainNumber: '12449', trainName: 'Goa Sampark Kranti Express', origin: 'Hazrat Nizamuddin (NZM)', destination: 'Madgaon (MAO)', runsOnDays: ['Mon','Wed','Thu','Fri'], departureTime: '11:00', arrivalTime: '14:05' },
  { trainNumber: '12779', trainName: 'Goa Express', origin: 'Hazrat Nizamuddin (NZM)', destination: 'Vasco-Da-Gama (VSG)', runsOnDays: ['Mon','Thu'], departureTime: '15:00', arrivalTime: '23:50' },

  // ── SAMPARK KRANTI & INTERCITY ──────────────────────────────────────────────────────
  { trainNumber: '12660', trainName: 'Navjeevan Express', origin: 'Ahmedabad Jn (ADI)', destination: 'Chennai Central (MAS)', runsOnDays: ['Mon','Wed','Fri'], departureTime: '16:30', arrivalTime: '16:15' },
  { trainNumber: '12659', trainName: 'Navjeevan Express (Return)', origin: 'Chennai Central (MAS)', destination: 'Ahmedabad Jn (ADI)', runsOnDays: ['Mon','Thu','Sat'], departureTime: '14:15', arrivalTime: '15:30' },
  { trainNumber: '12977', trainName: 'Marusagar Express', origin: 'Jaipur (JP)', destination: 'Ernakulam Jn (ERS)', runsOnDays: ['Mon','Fri'], departureTime: '12:05', arrivalTime: '05:30' },
  { trainNumber: '12978', trainName: 'Marusagar Express (Return)', origin: 'Ernakulam Jn (ERS)', destination: 'Jaipur (JP)', runsOnDays: ['Tue','Sat'], departureTime: '23:45', arrivalTime: '17:45' },
  { trainNumber: '22476', trainName: 'Bikaner Guwahati Express', origin: 'Bikaner Jn (BKN)', destination: 'Guwahati (GHY)', runsOnDays: ['Tue','Fri'], departureTime: '23:25', arrivalTime: '01:30' },

  // ── SPECIAL / TOURIST TRAINS ──────────────────────────────────────────────────────
  { trainNumber: '12915', trainName: 'Ashram Express', origin: 'New Delhi (NDLS)', destination: 'Ahmedabad Jn (ADI)', runsOnDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], departureTime: '15:20', arrivalTime: '05:00' },
  { trainNumber: '12216', trainName: 'Bandra Garib Rath', origin: 'Bandra Terminus (BDTS)', destination: 'Gorakhpur Jn (GKP)', runsOnDays: ['Mon','Wed','Fri'], departureTime: '14:20', arrivalTime: '17:00' },
  { trainNumber: '22210', trainName: 'Mumbai Humsafar Express', origin: 'Dadar (DDR)', destination: 'Patna Jn (PNBE)', runsOnDays: ['Mon','Fri'], departureTime: '23:50', arrivalTime: '04:00' },
  { trainNumber: '22657', trainName: 'Mysore Humsafar Express', origin: 'Mysuru (MYS)', destination: 'Hazrat Nizamuddin (NZM)', runsOnDays: ['Tue','Sat'], departureTime: '23:45', arrivalTime: '22:15' },
  { trainNumber: '19567', trainName: 'Vivek Express', origin: 'Dibrugarh Town (DBRG)', destination: 'Kanyakumari (CAPE)', runsOnDays: ['Mon'], departureTime: '10:55', arrivalTime: '13:15' },
];

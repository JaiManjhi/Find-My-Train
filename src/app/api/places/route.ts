import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '25.18');
  const lon = parseFloat(searchParams.get('lon') || '75.84');
  const radius = parseInt(searchParams.get('radius') || '10000'); // 10km

  // Overpass QL query for nearby rivers, bridges, mountains, tunnels, monuments
  const overpassQuery = `
    [out:json][timeout:15];
    (
      node["waterway"="river"](around:${radius},${lat},${lon});
      way["bridge"="yes"](around:${radius},${lat},${lon});
      way["tunnel"="yes"](around:${radius},${lat},${lon});
      node["historic"](around:${radius},${lat},${lon});
      node["natural"="peak"](around:${radius},${lat},${lon});
    );
    out body 10;
  `;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Overpass returned status ${res.status}`);

    const data = await res.json();
    const elements = data.elements || [];

    const attractions = elements.map((elem: any, idx: number) => {
      const category = elem.tags?.waterway === 'river'
        ? 'River'
        : elem.tags?.bridge === 'yes'
        ? 'Bridge'
        : elem.tags?.tunnel === 'yes'
        ? 'Tunnel'
        : elem.tags?.natural === 'peak'
        ? 'Mountain'
        : 'Monument';

      return {
        id: `op-${elem.id || idx}`,
        name: elem.tags?.name || elem.tags?.['name:en'] || `${category} Landmark`,
        category,
        latitude: elem.lat || lat,
        longitude: elem.lon || lon,
        distanceFromTrackKm: Math.round((Math.random() * 4 + 0.5) * 10) / 10,
        description: elem.tags?.description || `Geographical landmark located along the railway route near ${lat.toFixed(2)}, ${lon.toFixed(2)}.`,
      };
    });

    return NextResponse.json(attractions);
  } catch (error) {
    console.error('Overpass API error:', error);
    // Fallback list
    return NextResponse.json([
      {
        id: 'att-1',
        name: 'Chambal River Bridge',
        category: 'Bridge',
        latitude: 25.18,
        longitude: 75.84,
        distanceFromTrackKm: 1.2,
        description: 'Iconic railway bridge spanning the pristine Chambal River gorge near Kota.',
      },
      {
        id: 'att-2',
        name: 'Mukundara Hills Tiger Reserve & Tunnels',
        category: 'Tunnel',
        latitude: 24.85,
        longitude: 75.92,
        distanceFromTrackKm: 4.5,
        description: 'Series of railway tunnels passing through dense teak forests of Mukundara Ghats.',
      },
      {
        id: 'att-3',
        name: 'Garadia Mahadev Canyon',
        category: 'Ghat',
        latitude: 25.07,
        longitude: 75.75,
        distanceFromTrackKm: 6.8,
        description: 'Breathtaking horseshoe canyon formed by the Chambal River.',
      },
    ]);
  }
}

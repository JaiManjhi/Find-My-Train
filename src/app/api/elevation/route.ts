import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locations = searchParams.get('locations') || '23.332,75.038';
  const apiKey = process.env.OPENTOPOGRAPHY_API_KEY || '1d41ab5c87e7bdaae726bd7df16b8dd1';

  try {
    const res = await fetch(
      `https://portal.opentopography.org/API/globaldem?demtype=SRTMGL1&locations=${locations}&outputFormat=JSON&key=${apiKey}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      throw new Error(`OpenTopography API returned status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    // Fallback mock elevation profile
    return NextResponse.json([
      { distanceKm: 0, elevationM: 12 },
      { distanceKm: 263, elevationM: 13 },
      { distanceKm: 393, elevationM: 36 },
      { distanceKm: 652, elevationM: 480 },
      { distanceKm: 918, elevationM: 256 },
      { distanceKm: 1384, elevationM: 214 },
    ]);
  }
}

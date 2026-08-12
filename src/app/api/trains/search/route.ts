import { NextResponse } from 'next/server';
import { INDIAN_TRAINS_DATABASE } from '@/data/trainIndex';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase().trim() || '';

  if (!q) {
    return NextResponse.json(INDIAN_TRAINS_DATABASE);
  }

  // Flexible search matching by train number, name, origin, or destination
  const results = INDIAN_TRAINS_DATABASE.filter(
    (t) =>
      t.trainNumber.toLowerCase().includes(q) ||
      t.trainName.toLowerCase().includes(q) ||
      t.origin.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q)
  );

  return NextResponse.json(results);
}

import { NextRequest, NextResponse } from 'next/server';
import { getAllSavedTripsFromMemory, getTripFromMemory, saveTripToMemory } from '@/lib/db/trips';
import { TripPlan } from '@/lib/ai/types';

export async function GET() {
  const trips = getAllSavedTripsFromMemory();
  return NextResponse.json({ success: true, trips });
}

export async function POST(req: NextRequest) {
  try {
    const plan: TripPlan = await req.json();
    if (!plan || !plan.id) {
      return NextResponse.json({ error: 'Invalid trip plan payload' }, { status: 400 });
    }
    const saved = saveTripToMemory(plan);
    return NextResponse.json({ success: true, trip: saved });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save trip' }, { status: 500 });
  }
}

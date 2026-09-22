import { NextRequest, NextResponse } from 'next/server';
import { getTripFromMemory } from '@/lib/db/trips';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const trip = getTripFromMemory(id);

  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }

  return NextResponse.json({ success: true, trip }, { headers: { 'Cache-Control': 'no-store' } });
}

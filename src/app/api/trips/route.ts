import { NextResponse } from 'next/server';

// Until ownership checks exist, trips can only be created through /api/plan
// and retrieved with their unguessable link. Never expose a trip directory.
function unavailable() {
  return NextResponse.json(
    { error: 'Trip listing and direct writes are not available.' },
    { status: 405, headers: { 'Cache-Control': 'no-store' } },
  );
}

export const GET = unavailable;
export const POST = unavailable;

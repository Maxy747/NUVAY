import type { TripPlan } from './ai/types';

export function tripPath(id: string): string {
  return `/trip/${encodeURIComponent(id)}`;
}

export async function loadTrip(
  id: string,
  fetchTrip: typeof fetch,
  localTrips: () => TripPlan[],
): Promise<TripPlan | null> {
  try {
    const response = await fetchTrip(`/api/trips/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (data.trip?.id === id) return data.trip;
    }
  } catch {
    // Saved trips should still open when the server or connection is down.
  }
  return localTrips().find(trip => trip.id === id) ?? null;
}

export async function copyTripLink(
  id: string,
  origin: string,
  fetchTrip: typeof fetch,
  writeText: (text: string) => Promise<void>,
): Promise<void> {
  const response = await fetchTrip(`/api/trips/${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (!response.ok || (await response.json()).trip?.id !== id) {
    throw new Error('This trip is only available on this device or its link has expired.');
  }
  await writeText(new URL(tripPath(id), origin).href);
}

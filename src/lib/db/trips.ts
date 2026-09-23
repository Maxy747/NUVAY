import { TripPlan } from '../ai/types';

// In-memory server store for saved trips (ready for Prisma/PostgreSQL migration)
const inMemoryTrips = new Map<string, { plan: TripPlan; expiresAt: number }>();
const TRIP_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_STORED_TRIPS = 500;

function removeExpiredTrips() {
  const now = Date.now();
  for (const [id, entry] of inMemoryTrips) {
    if (entry.expiresAt <= now) inMemoryTrips.delete(id);
  }
}

export function saveTripToMemory(plan: TripPlan): TripPlan {
  removeExpiredTrips();
  if (inMemoryTrips.has(plan.id)) throw new Error('Trip ID already exists');
  while (inMemoryTrips.size >= MAX_STORED_TRIPS) {
    const oldestId = inMemoryTrips.keys().next().value;
    if (oldestId !== undefined) inMemoryTrips.delete(oldestId);
  }
  inMemoryTrips.set(plan.id, { plan, expiresAt: Date.now() + TRIP_TTL_MS });
  return plan;
}

export function getTripFromMemory(id: string): TripPlan | null {
  removeExpiredTrips();
  return inMemoryTrips.get(id)?.plan ?? null;
}

// Client-side LocalStorage Sync Helpers
export const SAVED_TRIPS_STORAGE_KEY = 'nuvay_saved_trips';

export function getSavedTripsFromLocalStorage(): TripPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SAVED_TRIPS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading saved trips:', err);
    return [];
  }
}

export function saveTripToLocalStorage(plan: TripPlan): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedTripsFromLocalStorage();
    const updated = [plan, ...existing.filter(t => t.id !== plan.id)];
    localStorage.setItem(SAVED_TRIPS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving trip to localStorage:', err);
  }
}

export function removeSavedTripFromLocalStorage(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedTripsFromLocalStorage();
    const updated = existing.filter(t => t.id !== id);
    localStorage.setItem(SAVED_TRIPS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error removing trip:', err);
  }
}

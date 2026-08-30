import { TripPlan } from '../ai/types';

// In-memory server store for saved trips (ready for Prisma/PostgreSQL migration)
let inMemoryTrips: Record<string, TripPlan> = {};

export function saveTripToMemory(plan: TripPlan): TripPlan {
  inMemoryTrips[plan.id] = plan;
  return plan;
}

export function getTripFromMemory(id: string): TripPlan | null {
  return inMemoryTrips[id] || null;
}

export function getAllSavedTripsFromMemory(): TripPlan[] {
  return Object.values(inMemoryTrips);
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

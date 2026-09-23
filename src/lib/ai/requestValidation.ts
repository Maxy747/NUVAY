import type { TripRequest } from './types';

// Bound user-controlled work before calling a provider or allocating schedules.
export function isValidTripRequest(value: unknown): value is TripRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const body = value as Record<string, unknown>;
  if (typeof body.prompt !== 'string' || !body.prompt.trim() || body.prompt.length > 4000) return false;
  const limits = { budget: 10_000_000, durationDays: 30, travelersCount: 100 };
  for (const [key, max] of Object.entries(limits)) {
    const number = body[key];
    if (number !== undefined && (typeof number !== 'number' || !Number.isFinite(number) || number <= 0 || number > max || (key !== 'budget' && !Number.isInteger(number)))) return false;
  }
  for (const key of ['origin', 'currency']) {
    const text = body[key];
    if (text !== undefined && (typeof text !== 'string' || !text.trim() || text.length > 200)) return false;
  }
  const enums = {
    travelerType: ['Solo', 'Couple', 'Friends', 'Family'],
    pace: ['Relaxed', 'Balanced', 'Fast-Paced'],
    accommodationType: ['Budget', 'Boutique', 'Homestay', 'Resort', 'Luxury'],
  };
  for (const [key, options] of Object.entries(enums)) {
    if (body[key] !== undefined && !options.includes(body[key] as string)) return false;
  }
  if (body.vibes !== undefined && (!Array.isArray(body.vibes) || body.vibes.length > 20 || body.vibes.some(v => typeof v !== 'string' || !v.trim() || v.length > 100))) return false;
  return true;
}

/**
 * Routing and Geocoding service using OpenStreetMap's Nominatim & OSRM APIs
 * with Haversine fallback for reliability.
 */

export interface GeocodedLocation {
  name: string;
  coords: [number, number]; // [lat, lng]
}

export interface DynamicRouteResult {
  origin: string;
  destination: string;
  originCoords: [number, number];
  destCoords: [number, number];
  distanceKm: number;
  estimatedDriveHours: number;
  suggestedModes: string[];
  waypoints: string[];
}

// Known coordinates cache for common Indian travel hubs to avoid redundant network calls
const KNOWN_COORDINATES: Record<string, [number, number]> = {
  mangalore: [12.9141, 74.8560],
  mangaluru: [12.9141, 74.8560],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  mysore: [12.2958, 76.6394],
  mysuru: [12.2958, 76.6394],
  coorg: [12.4244, 75.7382],
  madikeri: [12.4244, 75.7382],
  gokarna: [14.5479, 74.3188],
  udupi: [13.3409, 74.7421],
  wayanad: [11.6854, 76.1320],
  kochi: [9.9312, 76.2673],
  cochin: [9.9312, 76.2673],
  mumbai: [19.0760, 72.8777],
  goa: [15.2993, 74.1240],
  panaji: [15.4909, 73.8278],
  chikmagalur: [13.3161, 75.7720],
  chikkamagaluru: [13.3161, 75.7720],
  ooty: [11.4102, 76.6950],
  munnar: [10.0889, 77.0595],
  shimoga: [13.9299, 75.5681],
};

/**
 * Calculate straight-line Haversine distance in km between two lat/lng pairs
 */
export function haversineDistance(
  coords1: [number, number],
  coords2: [number, number]
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coords2[0] - coords1[0]) * Math.PI) / 180;
  const dLon = ((coords2[1] - coords1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1[0] * Math.PI) / 180) *
      Math.cos((coords2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Geocode a location string to [lat, lng] using cache or Nominatim API
 */
export async function geocodeLocation(query: string): Promise<[number, number] | null> {
  const cleanKey = query.toLowerCase().trim();

  // Check known coordinates cache first
  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (cleanKey.includes(key)) {
      return coords;
    }
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query + ', India'
      )}&format=json&limit=1`,
      {
        headers: { 'User-Agent': 'NUVAY-TripPlanner/1.0' },
        signal: AbortSignal.timeout(3000), // 3s timeout
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      if (!isNaN(lat) && !isNaN(lon)) {
        return [lat, lon];
      }
    }
  } catch (err) {
    console.warn(`[NUVAY Routing] Nominatim geocode fallback for "${query}":`, err);
  }

  return null;
}

/**
 * Fetch driving route metrics between origin and destination using OSRM API
 */
export async function fetchOsrmRoute(
  origin: string,
  destination: string,
  fallbackOriginCoords: [number, number] = [12.9141, 74.8560], // Mangalore default
  fallbackDestCoords: [number, number] = [12.4244, 75.7382]   // Coorg default
): Promise<DynamicRouteResult> {
  const originCoords = (await geocodeLocation(origin)) || fallbackOriginCoords;
  const destCoords = (await geocodeLocation(destination)) || fallbackDestCoords;

  let distanceKm = 0;
  let estimatedDriveHours = 0;

  try {
    // OSRM format: /route/v1/driving/{lng1},{lat1};{lng2},{lat2}
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originCoords[1]},${originCoords[0]};${destCoords[1]},${destCoords[0]}?overview=false`;
    const res = await fetch(osrmUrl, { signal: AbortSignal.timeout(4000) });

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        distanceKm = Math.round(route.distance / 1000);
        estimatedDriveHours = Math.round((route.duration / 3600) * 10) / 10;
      }
    }
  } catch (err) {
    console.warn('[NUVAY Routing] OSRM API call failed, using Haversine calculation:', err);
  }

  // Haversine fallback if OSRM is unreachable or returned 0
  if (distanceKm <= 0) {
    const directKm = haversineDistance(originCoords, destCoords);
    // Road factor multiplier (~1.3x) & average speed 45 km/h
    distanceKm = Math.round(directKm * 1.3);
    estimatedDriveHours = Math.max(1, Math.round((distanceKm / 45) * 10) / 10);
  }

  const suggestedModes =
    distanceKm < 150
      ? ['Private SUV / Car', 'Express Bus', 'Bike Ride']
      : distanceKm < 400
      ? ['Private SUV / Car', 'State Volvo Express Bus', 'Express Train']
      : ['Overnight Train', 'Intercity Flight + Taxi', 'Rental SUV'];

  return {
    origin,
    destination,
    originCoords,
    destCoords,
    distanceKm,
    estimatedDriveHours,
    suggestedModes,
    waypoints: [origin, destination],
  };
}

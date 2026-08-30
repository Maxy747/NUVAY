export interface TripRequest {
  prompt: string;
  budget?: number;
  currency?: string;
  durationDays?: number;
  travelersCount?: number;
  travelerType?: 'Solo' | 'Couple' | 'Friends' | 'Family';
  origin?: string;
  vibes?: string[];
  pace?: 'Relaxed' | 'Balanced' | 'Fast-Paced';
  accommodationType?: 'Budget' | 'Boutique' | 'Homestay' | 'Resort' | 'Luxury';
}

export interface ActivitySchedule {
  time: string;
  title: string;
  description: string;
  location: string;
  costPerPerson: number;
  category: 'food' | 'activity' | 'travel' | 'stay' | 'relaxation';
  coordinates?: [number, number];
}

export interface DayItinerary {
  day: number;
  title: string;
  theme: string;
  schedule: ActivitySchedule[];
}

export interface AccommodationOption {
  name: string;
  type: string;
  pricePerNight: number;
  rating: number;
  description: string;
  location: string;
}

export interface FoodHighlight {
  dishOrPlace: string;
  description: string;
  estimatedCost: number;
  type: 'must-try-dish' | 'restaurant';
}

export interface ActivityHighlight {
  title: string;
  category: string;
  duration: string;
  description: string;
  costPerPerson: number;
}

export interface SafetyInfo {
  overallSafetyIndex: number; // e.g. 92 out of 100
  emergencyContacts: Array<{ name: string; number: string }>;
  localTips: string[];
  weatherAdvisory: string;
  healthTips: string[];
}

export interface MapMarker {
  id: string;
  title: string;
  type: 'attraction' | 'accommodation' | 'food' | 'transit';
  lat: number;
  lng: number;
  description: string;
  day?: number;
}

export interface RouteInfo {
  origin: string;
  destination: string;
  distanceKm: number;
  estimatedDriveHours: number;
  suggestedModes: string[];
  waypoints: string[];
}

export interface BudgetBreakdown {
  transportation: number;
  accommodation: number;
  food: number;
  activities: number;
  contingency: number;
}

export interface TripPlan {
  id: string;
  title: string;
  tagline: string;
  destination: string;
  origin: string;
  durationDays: number;
  travelersCount: number;
  travelerType: string;
  totalBudgetEstimate: number;
  requestedBudget: number;
  currency: string;
  budgetBreakdown: BudgetBreakdown;
  routeInfo: RouteInfo;
  dayItineraries: DayItinerary[];
  accommodationSuggestions: AccommodationOption[];
  foodHighlights: FoodHighlight[];
  activitiesHighlights: ActivityHighlight[];
  safetyInfo: SafetyInfo;
  mapCenter: [number, number];
  mapZoom: number;
  markers: MapMarker[];
  createdAt: string;
}

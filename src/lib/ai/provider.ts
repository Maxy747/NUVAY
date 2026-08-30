import { TripRequest, TripPlan } from './types';

export interface AIService {
  name: string;
  generateTripPlan(request: TripRequest): Promise<TripPlan>;
  parseNaturalPrompt(prompt: string): Promise<Partial<TripRequest>>;
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIService } from './provider';
import { TripRequest, TripPlan } from './types';
import { MockAIService } from './mockProvider';
import { validateTripPlan, enforcePlanConstraints } from './validator';
import { fetchOsrmRoute } from '../routing/osrm';

export class GeminiAIService implements AIService {
  name = 'Google Gemini 1.5/2.0 Provider';
  private apiKey: string | undefined;
  private genAI: GoogleGenerativeAI | null = null;
  private mockFallback = new MockAIService();

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async parseNaturalPrompt(prompt: string): Promise<Partial<TripRequest>> {
    if (!this.genAI) {
      return this.mockFallback.parseNaturalPrompt(prompt);
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const systemInstruction = `Extract travel parameters from the user's prompt into JSON format with exact keys:
- budget: number (integer in INR/currency)
- currency: string (e.g. "₹")
- durationDays: number (integer, number of days)
- travelersCount: number (integer, total people)
- travelerType: string ("Solo" | "Couple" | "Friends" | "Family")
- origin: string (starting city name)
- vibes: array of strings (interest tags like "Nature", "Adventure", "Good Food", "Beach")

User prompt: "${prompt}"

Return JSON ONLY matching the exact schema above.`;

      const result = await model.generateContent(systemInstruction);
      const text = result.response.text();
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return { ...parsed, prompt };
    } catch (err) {
      console.warn('[NUVAY Gemini] Prompt parsing failed, using rule-based fallback:', err);
      return this.mockFallback.parseNaturalPrompt(prompt);
    }
  }

  async generateTripPlan(request: TripRequest): Promise<TripPlan> {
    // Task 1: Ensure missing params are pre-parsed from prompt text
    let fullRequest: TripRequest = { ...request };
    if (
      !fullRequest.budget ||
      !fullRequest.durationDays ||
      !fullRequest.travelersCount ||
      !fullRequest.origin
    ) {
      const parsed = await this.parseNaturalPrompt(fullRequest.prompt);
      fullRequest = {
        prompt: request.prompt,
        budget: request.budget || parsed.budget || 20000,
        currency: request.currency || parsed.currency || '₹',
        durationDays: request.durationDays || parsed.durationDays || 4,
        travelersCount: request.travelersCount || parsed.travelersCount || 4,
        travelerType: request.travelerType || parsed.travelerType || 'Friends',
        origin: request.origin || parsed.origin || 'Mangalore',
        vibes: request.vibes && request.vibes.length > 0 ? request.vibes : parsed.vibes || ['Nature', 'Adventure', 'Good Food'],
        pace: request.pace || parsed.pace || 'Balanced',
        accommodationType: request.accommodationType || parsed.accommodationType || 'Homestay',
      };
    }

    if (!this.genAI) {
      return this.mockFallback.generateTripPlan(fullRequest);
    }

    let plan: TripPlan | null = null;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        // Task 2: Structured Gemini with JSON response mime type
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
          },
        });

        const reqBudget = fullRequest.budget || 20000;
        const reqDays = fullRequest.durationDays || 4;
        const reqPax = fullRequest.travelersCount || 3;

        const promptText = `Generate a complete detailed travel itinerary JSON strictly enforcing the user constraints below:

EXACT CONSTRAINTS REQUIRED:
- User Prompt: "${fullRequest.prompt}"
- Budget (requestedBudget): ${reqBudget} ${fullRequest.currency || '₹'}
- Total Budget Estimate (totalBudgetEstimate): Must be around ${Math.round(reqBudget * 0.95)} ${fullRequest.currency || '₹'}
- Duration (durationDays): EXACTLY ${reqDays} days
- Travelers (travelersCount): EXACTLY ${reqPax} people (${fullRequest.travelerType || 'Friends'})
- Origin (origin): "${fullRequest.origin || 'Mangalore'}"
- Desired Vibes: ${fullRequest.vibes?.join(', ')}

IMPORTANT ITINERARY RULES:
1. dayItineraries array MUST contain EXACTLY ${reqDays} days (from Day 1 to Day ${reqDays}).
2. Every day MUST have UNIQUE, non-repeating activities and themes appropriate for ${reqDays} days. NO REPEATED DAY SCHEDULES.
3. Keep costPerPerson in schedule items aligned so total cost fits requested budget ${reqBudget}.

Return raw JSON ONLY matching TripPlan interface.`;

        const result = await model.generateContent(promptText);
        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedPlan: TripPlan = JSON.parse(cleanJson);

        // Ensure fields are set safely
        parsedPlan.requestedBudget = fullRequest.budget || 20000;
        parsedPlan.durationDays = fullRequest.durationDays || 4;
        parsedPlan.travelersCount = fullRequest.travelersCount || 3;
        parsedPlan.travelerType = fullRequest.travelerType || 'Friends';
        parsedPlan.origin = fullRequest.origin || 'Mangalore';
        parsedPlan.id = parsedPlan.id || `nuvay-gemini-${Date.now()}`;
        parsedPlan.createdAt = new Date().toISOString();

        // Task 4: Dynamic OSRM Route Calculation
        if (parsedPlan.destination) {
          const route = await fetchOsrmRoute(parsedPlan.origin, parsedPlan.destination);
          parsedPlan.routeInfo = {
            origin: parsedPlan.origin,
            destination: parsedPlan.destination,
            distanceKm: route.distanceKm,
            estimatedDriveHours: route.estimatedDriveHours,
            suggestedModes: route.suggestedModes,
            waypoints: route.waypoints,
          };
        }

        // Task 3: Validation Check
        const validation = validateTripPlan(parsedPlan, fullRequest);
        if (validation.valid) {
          return parsedPlan;
        }

        console.warn(`[NUVAY Gemini] Validation attempt ${attempts} failed:`, validation.errors);
        plan = parsedPlan;
      } catch (err) {
        console.warn(`[NUVAY Gemini] Generation error on attempt ${attempts}:`, err);
      }
    }

    // If Gemini validation failed after max attempts, repair or fallback
    if (plan) {
      return enforcePlanConstraints(plan, fullRequest);
    }

    return this.mockFallback.generateTripPlan(fullRequest);
  }
}

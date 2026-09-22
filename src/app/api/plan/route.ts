import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai';
import { TripRequest } from '@/lib/ai/types';
import { saveTripToMemory } from '@/lib/db/trips';
import { validateTripPlan, enforcePlanConstraints } from '@/lib/ai/validator';
import { isValidTripRequest } from '@/lib/ai/requestValidation';
import { randomUUID } from 'node:crypto';

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json().catch(() => null);
    if (!isValidTripRequest(body)) {
      return NextResponse.json({ error: 'Provide a valid prompt and trip preferences (1–30 days, 1–100 travelers).' }, { status: 400 });
    }

    const aiService = getAIService();

    // Task 1: Always pre-parse prompt to ensure structured parameters exist
    const parsedParams = await aiService.parseNaturalPrompt(body.prompt);

    const mergedRequest: TripRequest = {
      prompt: body.prompt,
      budget: body.budget || parsedParams.budget || 20000,
      currency: body.currency || parsedParams.currency || '₹',
      durationDays: body.durationDays || parsedParams.durationDays || 4,
      travelersCount: body.travelersCount || parsedParams.travelersCount || 3,
      travelerType: body.travelerType || parsedParams.travelerType || 'Friends',
      origin: body.origin || parsedParams.origin || 'Mangalore',
      vibes: body.vibes && body.vibes.length > 0 ? body.vibes : parsedParams.vibes || ['Nature', 'Adventure', 'Good Food'],
      pace: body.pace || parsedParams.pace || 'Balanced',
      accommodationType: body.accommodationType || parsedParams.accommodationType || 'Homestay',
    };

    if (!isValidTripRequest(mergedRequest)) {
      return NextResponse.json({ error: 'The extracted trip preferences are outside supported limits. Please clarify your request.' }, { status: 400 });
    }

    let tripPlan = await aiService.generateTripPlan(mergedRequest);

    // Task 3: Final validation check before sending plan to client
    const validation = validateTripPlan(tripPlan, mergedRequest);
    if (!validation.valid) {
      console.warn('[API /api/plan] Validation warnings detected, enforcing constraints:', validation.errors);
      tripPlan = enforcePlanConstraints(tripPlan, mergedRequest);
    }

    // Store in-memory for server-side link sharing support
    tripPlan = { ...tripPlan, id: randomUUID() };
    saveTripToMemory(tripPlan);

    return NextResponse.json({
      success: true,
      plan: tripPlan,
      provider: aiService.name,
      extractedRequest: mergedRequest,
    });
  } catch (error) {
    console.error('[API /api/plan] Error generating trip:', error);
    return NextResponse.json(
      { error: 'Failed to generate trip plan. Please try again.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai';
import { TripRequest } from '@/lib/ai/types';
import { saveTripToMemory } from '@/lib/db/trips';
import { AIProviderError } from '@/lib/ai/groqProvider';
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
      origin: body.origin || parsedParams.origin || 'Not specified',
      vibes: body.vibes && body.vibes.length > 0 ? body.vibes : parsedParams.vibes || ['Nature', 'Adventure', 'Good Food'],
      pace: body.pace || parsedParams.pace || 'Balanced',
      accommodationType: body.accommodationType || parsedParams.accommodationType || 'Homestay',
    };

    if (!isValidTripRequest(mergedRequest)) {
      return NextResponse.json({ error: 'The extracted trip preferences are outside supported limits. Please clarify your request.' }, { status: 400 });
    }

    let tripPlan = await aiService.generateTripPlan(mergedRequest);

    if (!tripPlan.generation) {
      tripPlan.generation = { mode: 'demo', provider: aiService.name, notice: 'Sample itinerary for demonstration only. Prices and travel details are not verified.' };
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
    if (error instanceof AIProviderError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error('[API /api/plan] Unexpected generation failure');
    return NextResponse.json(
      { error: 'Failed to generate trip plan. Please try again.' },
      { status: 500 }
    );
  }
}

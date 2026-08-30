import { TripPlan, TripRequest } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates that a generated TripPlan strictly satisfies the requested constraints in TripRequest.
 */
export function validateTripPlan(plan: TripPlan, request: TripRequest): ValidationResult {
  const errors: string[] = [];

  // 1. Duration Days Validation
  if (request.durationDays && plan.durationDays !== request.durationDays) {
    errors.push(`Duration mismatch: requested ${request.durationDays} days, generated ${plan.durationDays} days.`);
  }

  if (request.durationDays && plan.dayItineraries.length !== request.durationDays) {
    errors.push(`Day itineraries count mismatch: expected ${request.durationDays} days, got ${plan.dayItineraries.length} days.`);
  }

  // 2. Travelers Count Validation
  if (request.travelersCount && plan.travelersCount !== request.travelersCount) {
    errors.push(`Travelers count mismatch: requested ${request.travelersCount}, generated ${plan.travelersCount}.`);
  }

  // 3. Requested Budget Validation
  if (request.budget) {
    if (plan.requestedBudget !== request.budget) {
      errors.push(`Requested budget mismatch: requested ₹${request.budget}, plan recorded ₹${plan.requestedBudget}.`);
    }

    // Ensure total estimate is realistic relative to budget (between 50% and 125% of budget)
    if (plan.totalBudgetEstimate < request.budget * 0.5 || plan.totalBudgetEstimate > request.budget * 1.3) {
      errors.push(`Total estimate ₹${plan.totalBudgetEstimate} is out of bounds for requested budget ₹${request.budget}.`);
    }
  }

  // 4. Duplicate Activities Check
  const activityTitles = new Set<string>();
  let hasDuplicateActivities = false;

  for (const day of plan.dayItineraries || []) {
    for (const act of day.schedule || []) {
      const normalizedTitle = act.title.trim().toLowerCase();
      if (activityTitles.has(normalizedTitle)) {
        hasDuplicateActivities = true;
        break;
      }
      activityTitles.add(normalizedTitle);
    }
    if (hasDuplicateActivities) break;
  }

  if (hasDuplicateActivities) {
    errors.push(`Plan contains duplicate activity titles across days.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Helper to auto-fix/repair minor plan discrepancies if regeneration limit is reached
 */
export function enforcePlanConstraints(plan: TripPlan, request: TripRequest): TripPlan {
  const fixed = { ...plan };

  if (request.budget) {
    fixed.requestedBudget = request.budget;
    fixed.totalBudgetEstimate = Math.round(request.budget * 0.95);
    fixed.budgetBreakdown = {
      transportation: Math.round(fixed.totalBudgetEstimate * 0.22),
      accommodation: Math.round(fixed.totalBudgetEstimate * 0.38),
      food: Math.round(fixed.totalBudgetEstimate * 0.22),
      activities: Math.round(fixed.totalBudgetEstimate * 0.12),
      contingency: Math.round(fixed.totalBudgetEstimate * 0.06),
    };
  }

  if (request.durationDays) {
    fixed.durationDays = request.durationDays;
    // Slice or slice day itineraries if needed
    if (fixed.dayItineraries.length > request.durationDays) {
      fixed.dayItineraries = fixed.dayItineraries.slice(0, request.durationDays);
    }
  }

  if (request.travelersCount) {
    fixed.travelersCount = request.travelersCount;
  }

  if (request.origin) {
    fixed.origin = request.origin;
    if (fixed.routeInfo) {
      fixed.routeInfo.origin = request.origin;
    }
  }

  return fixed;
}
